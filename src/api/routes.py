"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_cors import CORS
from api.utils import generate_sitemap, APIException
from api.models import db, Users, Posts


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


@api.route('/users', methods=['GET'])
def users():
    response_body = {}
    rows = db.session.execute(db.select(Users)).scalars()
    response_body['message'] = 'Listado de usuarios'
    response_body['results'] = [row.serialize() for row in rows]
    return response_body, 200


@api.route('/posts', methods=['GET', 'POST'])
def posts():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Posts)).scalars()
        response_body['message'] = 'Listado de posts'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        post = Posts(
            title = data.get('title'),
            description = data.get('description'),
            body = data.get('body'),
            date = data.get('date'),
            image_url = data.get('image_url'),
            user_id = data.get('user_id')
        )
        db.session.add(post)
        db.session.commit()
        response_body['message'] = 'Post creado correctamente'
        response_body['results'] = post
        return response_body, 201


@api.route('/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def post(id):
    response_body = {}
    row = db.session.execute(db.select(Posts).where(Posts.id == id)).scalar()
    # Validar si el id exite
    if not row:
        response_body['message'] =  f'El post con id: {id} no existe'
        return response_body, 400
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f'Post con id: {id}'
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.title = data.get('title')
        row.description = data.get('description')
        row.body = data.get('body')
        row.image_url = data.get('image_url')
        row.user_id = data.get('user_id')
        db.session.commit()
        response_body['message'] = f'Actualizado el post con id: {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Eliminado el post con id: {id}'
        return response_body, 200