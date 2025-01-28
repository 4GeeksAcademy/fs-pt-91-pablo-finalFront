from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name = db.Column(db.String(), unique=False, nullable=True)
    phone = db.Column(db.String(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id, 
                "email": self.email,
                "is_active": self.is_active,
                "first_name": self.first_name,
                "phone": self.phone}


class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=True)
    body = db.Column(db.String(), unique=False, nullable=True)
    date = db.Column(db.DateTime(), unique=False, nullable=False)  # TODO: poner default
    image_url = db.Column(db.String(), unique=False, nullable=False)


class Medias(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    media_type = db.Column(db.Enum('image', 'video', 'podcast', name='media_type'), unique=False, nullable=False)
    url = db.Column(db.String(), unique=True, nullable=False)


class Characters(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    height = db.Column(db.Integer, unique=False, nullable=False)
    mass = db.Column(db.Integer, unique=False, nullable=False)
    hair_color = db.Column(db.String(), unique=False, nullable=True)
    skin_color = db.Column(db.String(), unique=False, nullable=True)
    eye_color = db.Column(db.String(), unique=False, nullable=True)
    birth_year = db.Column(db.Integer, unique=False, nullable=True)
    gender = db.Column(db.Enum('male', 'female', name='gender'), unique=False, nullable=True)


class CharacterFavorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    users_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('users_fav_characters_to', lazy='select'))
    character_id = db.Column(db.Integer(), db.ForeignKey('characters.id'))
    characters_to = db.relationship('Characters', foreign_keys=[character_id], backref=db.backref('characters_to', lazy='select'))

    def __repr__(self):
        return f'<User: {self.user_id} - Character: {self.character_id}>'

class Planets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    diameter = db.Column(db.Integer, unique=False, nullable=False)
    rotation_period = db.Column(db.Integer, unique=False, nullable=False)
    orbital_period = db.Column(db.Integer, unique=False, nullable=False)
    gravity = db.Column(db.String(), unique=False, nullable=False)
    population = db.Column(db.Integer, unique=False, nullable=False)
    climate = db.Column(db.String(), unique=False, nullable=False)
    terrain = db.Column(db.String(), unique=False, nullable=False)


class PlanetFavorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    users_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('users_fav_planets_to', lazy='select'))
    planet_id = db.Column(db.Integer(), db.ForeignKey('planets.id'))
    planets_to = db.relationship('Planets', foreign_keys=[planet_id], backref=db.backref('planets_to', lazy='select'))

    def __repr__(self):
        return f'<User: {self.user_id} - Planet: {self.planet_id}>'
