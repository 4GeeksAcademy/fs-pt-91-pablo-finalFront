"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_cors import CORS
from api.utils import generate_sitemap, APIException
from api.models import db, Users, Posts, Medias, Comments, Followers, Characters, Planets, CharacterFavorites, PlanetFavorites


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


"""TODO: Funciona"""
@api.route('/users', methods=['GET'])
def users():
    response_body = {}
    rows = db.session.execute(db.select(Users)).scalars()
    response_body['message'] = 'Listado de usuarios'
    response_body['results'] = [row.serialize() for row in rows]
    return response_body, 200


"""TODO: Funciona"""
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
        response_body['results'] = post.serialize()
        return response_body, 201


"""TODO: Funciona"""
@api.route('/posts/<int:id>', methods=['GET', 'PUT', 'DELETE'])
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


"""TODO: Funciona"""
@api.route('/medias', methods=['GET', 'POST'])
def medias():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Medias)).scalars()
        response_body['message'] = 'Listado de medias'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        media = Medias(
            media_type = data.get('media_type'),
            url = data.get('url'),
            post_id = data.get('post_id'),
        )
        db.session.add(media)
        db.session.commit()
        response_body['message'] = 'Media creada correctamente'
        response_body['results'] = media.serialize()
        return response_body, 201


"""TODO: Funciona"""
@api.route('/medias/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def media(id):
    response_body = {}
    row = db.session.execute(db.select(Medias).where(Medias.id == id)).scalar()
    # Validar si el id exite
    if not row:
        response_body['message'] =  f'La media con id: {id} no existe'
        return response_body, 400
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f'Media con id: {id}'
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.media_type = data.get('media_type')
        row.url = data.get('url')
        row.post_id = data.get('post_id')
        db.session.commit()
        response_body['message'] = f'Actualizada la media con id: {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Eliminada la media con id: {id}'
        return response_body, 200


"""TODO: Funciona"""
@api.route('/comments', methods=['GET', 'POST'])
def comments():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Comments)).scalars()
        response_body['message'] = 'Listado de comments'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        comment = Comments(
            body = data.get('body'),
            user_id = data.get('user_id'),
            post_id = data.get('post_id'),
        )
        db.session.add(comment)
        db.session.commit()
        response_body['message'] = 'Comment creado correctamente'
        response_body['results'] = comment.serialize()
        return response_body, 201


"""TODO: Funciona"""
@api.route('/comments/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def comment(id):
    response_body = {}
    row = db.session.execute(db.select(Comments).where(Comments.id == id)).scalar()
    # Validar si el id exite
    if not row:
        response_body['message'] =  f'El comment con id: {id} no existe'
        return response_body, 400
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f'Comment con id: {id}'
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.body = data.get('body')
        row.user_id = data.get('user_id')
        row.post_id = data.get('post_id')
        db.session.commit()
        response_body['message'] = f'Actualizado el comment con id: {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Eliminado el comment con id: {id}'
        return response_body, 200


"""TODO: Funciona"""
@api.route('/followers', methods=['GET', 'POST'])
def followers():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Followers)).scalars()
        response_body['message'] = 'Listado de followers'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        follower = Followers(
            follower_id = data.get('follower_id'),
            following_id = data.get('following_id'),
        )
        db.session.add(follower)
        db.session.commit()
        response_body['message'] = 'Follower creado correctamente'
        response_body['results'] = follower.serialize()
        return response_body, 201


"""TODO: Funciona"""
@api.route('/followers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def follower(id):
    response_body = {}
    row = db.session.execute(db.select(Followers).where(Followers.id == id)).scalar()
    # Validar si el id exite
    if not row:
        response_body['message'] =  f'El registro con id: {id} no existe'
        return response_body, 400
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f'Registro con id: {id}'
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.body = data.get('body')
        row.follower_id = data.get('follower_id')
        row.following_id = data.get('following_id')
        db.session.commit()
        response_body['message'] = f'Actualizado el registro con id: {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Eliminado el registro con id: {id}'
        return response_body, 200


"""TODO: Funciona"""
@api.route('/characters', methods=['GET'])
def characters():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Characters)).scalars()
        response_body['message'] = 'Listado de personajes'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    if request.method == 'POST':
        pass


"""TODO: Funciona"""
@api.route('/planets', methods=['GET'])
def planets():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Planets)).scalars()
        response_body['message'] = 'Listado de planetas'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    if request.method == 'POST':
        pass


"""TODO: Funciona"""
@api.route('/character-favorites', methods=['GET', 'POST'])
def character_favorites():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(CharacterFavorites)).scalars()
        response_body['message'] = 'Listado de personajes favoritos de cada usuario'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        character_favorite = CharacterFavorites(
            user_id = data.get('user_id'),
            character_id = data.get('character_id')
        )
        db.session.add(character_favorite)
        db.session.commit()
        response_body['message'] = 'Personaje favorito creado correctamente'
        response_body['results'] = character_favorite.serialize()
        return response_body, 201


"""TODO: Funciona"""
@api.route('/character-favorites/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def character_favorite(id):
    response_body = {}
    row = db.session.execute(db.select(CharacterFavorites).where(CharacterFavorites.id == id)).scalar()
    # Validar si el id exite
    if not row:
        response_body['message'] =  f'El registro con id: {id} no existe'
        return response_body, 400
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f'Registro con id: {id}'
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.user_id = data.get('user_id')
        row.character_id = data.get('character_id')
        db.session.commit()
        response_body['message'] = f'Actualizado el registro con id: {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Eliminado el registro con id: {id}'
        return response_body, 200


"""TODO: Funciona"""
@api.route('/planet-favorites', methods=['GET', 'POST'])
def planet_favorites():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(PlanetFavorites)).scalars()
        response_body['message'] = 'Listado de planetas favoritos de cada usuario'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        favorite_planet = PlanetFavorites(
            user_id = data.get('user_id'),
            planet_id = data.get('planet_id')
        )
        db.session.add(favorite_planet)
        db.session.commit()
        response_body['message'] = 'Planeta favorito creado correctamente'
        response_body['results'] = favorite_planet.serialize()
        return response_body, 201


"""TODO: Funciona"""
@api.route('/planet-favorites/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def planet_favorite(id):
    response_body = {}
    row = db.session.execute(db.select(PlanetFavorites).where(PlanetFavorites.id == id)).scalar()
    # Validar si el id exite
    if not row:
        response_body['message'] =  f'El registro con id: {id} no existe'
        return response_body, 400
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f'Registro con id: {id}'
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.user_id = data.get('user_id')
        row.planet_id = data.get('planet_id')
        db.session.commit()
        response_body['message'] = f'Actualizado el registro con id: {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Eliminado el registro con id: {id}'
        return response_body, 200
