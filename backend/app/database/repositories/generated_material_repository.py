from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["generated_materials"]

class GeneratedMaterialRepository(BaseRepository):
    pass

generated_material_repository = GeneratedMaterialRepository(collection)
