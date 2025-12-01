from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["learning_outcomes"]

class OutcomeRepository(BaseRepository):
    pass

outcome_repository = OutcomeRepository(collection)
