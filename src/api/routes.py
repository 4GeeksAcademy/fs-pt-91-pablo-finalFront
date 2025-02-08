"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import requests
from flask import Flask, request, Blueprint
from flask_cors import CORS
from api.utils import generate_sitemap, APIException
from api.models import db, Users, Posts, Medias, Comments, Followers, Characters, Planets, CharacterFavorites, PlanetFavorites
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)

    row = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active == True)).scalar()

    if not row:
        response_body["message"] = "User not found"
        return response_body, 401

    user_data = row.serialize()
    access_token = create_access_token(identity=email, additional_claims={'user_id': user_data["id"], 'is_active': user_data['is_active']})
    response_body["access_token"] = access_token
    response_body["message"] = "User logged"
    response_body["result"] = user_data
    return response_body, 200


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    response_body = {}
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    data = get_jwt()
    response_body["message"] = f'Logged in as {current_user}'
    return response_body, 200


@api.route('/users', methods=['GET', 'POST'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        response_body['message'] = 'Listado de usuarios'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        user = Users(
            first_name = data.get('first_name'),
            email = data.get('email'),
            password = data.get('password'),
            phone = data.get('phone'),
            is_active = True
        )
        db.session.add(user)
        try:
            db.session.commit()
            response_body['message'] = 'Usuario creado correctamente'
            response_body['results'] = user.serialize()
            return response_body, 201
        except IntegrityError as err:
            if 'duplicate key value violates unique constraint "users_email_key"' in str(err):
                response_body['message'] = 'Correo ya existente'
                return response_body, 403
            else:
                response_body['message'] = 'Error del servidor'
                return response_body, 500


@api.route('/users/<int:id>', methods=['GET'])
@jwt_required()
def user(id):
    additional_claims = get_jwt()
    response_body = {}
    if id != additional_claims['user_id']:
        response_body['message'] = 'No tiene autorización'
        return response_body, 401
    row = db.session.execute(db.select(Users).where(Users.id == additional_claims['user_id'])).scalar()
    # response_body['message'] = f'Datos del usuario {id}'
    response_body['result'] = row.serialize()
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
        response_body['results'] = post.serialize()
        return response_body, 201


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


@api.route('/users/<int:id>/posts', methods=['GET'])
def posts_by_user(id):
    response_body = {}
    rows = db.session.execute(db.select(Posts).where(Posts.user_id == id)).scalars()
    response_body['results'] = [row.serialize() for row in rows]
    response_body['message'] = f'Posts del usuario con id: {id}'
    return response_body, 200


@api.route('/posts/<int:id>/comments', methods=['GET'])
def comments_of_post(id):
    response_body = {}
    rows = db.session.execute(db.select(Comments).where(Comments.post_id == id)).scalars()
    response_body['results'] = [row.serialize() for row in rows]
    response_body['message'] = f'Comentarios del post con id: {id}'
    return response_body, 200


@api.route('/users/<int:id>/comments', methods=['GET'])
def comments_by_user(id):
    response_body = {}
    rows = db.session.execute(db.select(Comments).where(Comments.user_id == id)).scalars()
    response_body['results'] = [row.serialize() for row in rows]
    response_body['message'] = f'Comentarios del usuario con id: {id}'
    return response_body, 200


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


@api.route('/characters', methods=['GET'])
def characters():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Characters)).scalars()
        response_body['message'] = 'Listado de personajes'
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200


@api.route('/swapi/characters', methods=['GET'])
def characters_swapi():
    response_body = {}
    url = 'https://www.swapi.tech/api/people'
    response = requests.get(url)
    if response.status_code == 200:
        response_data = response.json()
        next_url = response_data.get('next')
        while True:
            results = response_data.get('results')
            for result in results:
                character_response = requests.get(result['url'])
                if character_response.status_code == 200:
                    character_data = character_response.json().get('result').get('properties')
                    print(character_data)
                    character = Characters(
                        id = character_data.get('id'),
                        name = character_data.get('name'),
                        height = int(character_data.get('height')) if character_data.get('height') != 'unknown' else None,
                        mass = float(character_data.get('mass').replace(',', '.')) if character_data.get('mass') != 'unknown' else None,
                        hair_color = character_data.get('hair_color'),
                        skin_color = character_data.get('skin_color'),
                        eye_color = character_data.get('eye_color'),
                        birth_year = character_data.get('birth_year'),
                        gender = character_data.get('gender'))
                    db.session.add(character)
                else:
                    response_body['message'] = 'Error al importar personajes desde SWAPI'
                    db.session.rollback()
                    return response_body, 400
            if next_url is None:
                break
            else:
                next_response = requests.get(next_url)
                response_data = next_response.json()
                next_url = response_data.get('next')
        db.session.commit()
        response_body['message'] = 'Listado de personajes desde SWAPI importados correctamente'
        return response_body, 200
    return response_body, 400


@api.route('/characters/<int:id>', methods=['GET'])
def character(id):
    response_body = {}
    row = db.session.execute(db.select(Characters).where(Characters.id == id)).scalar()
    # Validar si el id exite
    if not row:
        response_body['message'] =  f'El personaje con id: {id} no existe'
        return response_body, 400
    response_body['results'] = row.serialize()
    response_body['message'] = f'Personaje con id: {id}'
    return response_body, 200


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


@api.route('/swapi/planets', methods=['GET'])
def planets_swapi():
    response_body = {}
    url = 'https://www.swapi.tech/api/planets'
    response = requests.get(url)
    if response.status_code == 200:
        response_data = response.json()
        next_url = response_data.get('next')
        while True:
            results = response_data.get('results')
            for result in results:
                planet_response = requests.get(result['url'])
                if planet_response.status_code == 200:
                    planet_data = planet_response.json().get('result').get('properties')
                    print(planet_data)
                    planet = Planets(
                        id = planet_data.get('id'),
                        name = planet_data.get('name'),
                        diameter = int(planet_data.get('diameter')) if planet_data.get('diameter') != 'unknown' else None,
                        rotation_period = int(planet_data.get('rotation_period')) if planet_data.get('rotation_period') != 'unknown' else None,
                        orbital_period = int(planet_data.get('orbital_period')) if planet_data.get('orbital_period') != 'unknown' else None,
                        gravity = planet_data.get('gravity'),
                        population = int(planet_data.get('population')) if planet_data.get('population') != 'unknown' else None,
                        climate = planet_data.get('climate'),
                        terrain = planet_data.get('terrain'))
                    db.session.add(planet)
                else:
                    response_body['message'] = 'Error al importar planetas desde SWAPI'
                    db.session.rollback()
                    return response_body, 400            
            if next_url is None:
                break
            else:
                next_response = requests.get(next_url)
                response_data = next_response.json()
                next_url = response_data.get('next')
        db.session.commit()
        response_body['message'] = 'Listado de planetas desde SWAPI importados correctamente'
        return response_body, 200
    return response_body, 400


@api.route('/planets/<int:id>', methods=['GET'])
def planet(id):
    response_body = {}
    row = db.session.execute(db.select(Planets).where(Planets.id == id)).scalar()
    # Validar si el id exite
    if not row:
        response_body['message'] =  f'El planeta con id: {id} no existe'
        return response_body, 400
    response_body['results'] = row.serialize()
    response_body['message'] = f'Planeta con id: {id}'
    return response_body, 200


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
