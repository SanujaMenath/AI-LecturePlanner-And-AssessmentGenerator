from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["assessments"]

class AssessmentRepository(BaseRepository):
    pass

assessment_repository = AssessmentRepository(collection)
