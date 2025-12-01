from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["timetables"]

class TimetableRepository(BaseRepository):
    pass

timetable_repository = TimetableRepository(collection)
