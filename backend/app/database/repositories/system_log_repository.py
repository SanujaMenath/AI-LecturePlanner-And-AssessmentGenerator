from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["system_logs"]

class SystemLogRepository(BaseRepository):
    pass

system_log_repository = SystemLogRepository(collection)
