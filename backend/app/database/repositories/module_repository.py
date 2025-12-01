from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["modules"]

class ModuleRepository(BaseRepository):
    pass

module_repository = ModuleRepository(collection)
