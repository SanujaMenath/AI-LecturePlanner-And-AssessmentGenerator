from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["enrollments"]

class EnrollmentRepository(BaseRepository):
    pass

enrollment_repository = EnrollmentRepository(collection)
