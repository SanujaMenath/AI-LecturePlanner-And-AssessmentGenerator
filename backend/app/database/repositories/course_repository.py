from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["courses"]

class CourseRepository(BaseRepository):
    pass

course_repository = CourseRepository(collection)
