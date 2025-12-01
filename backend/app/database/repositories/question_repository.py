from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["question_bank"]

class QuestionRepository(BaseRepository):
    pass

question_repository = QuestionRepository(collection)
