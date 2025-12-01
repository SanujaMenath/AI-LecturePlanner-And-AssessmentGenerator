from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["users"]

class UserRepository(BaseRepository):
    pass

user_repository = UserRepository(collection)
