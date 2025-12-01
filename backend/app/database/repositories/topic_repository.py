from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["topics"]

class TopicRepository(BaseRepository):
    pass

topic_repository = TopicRepository(collection)
