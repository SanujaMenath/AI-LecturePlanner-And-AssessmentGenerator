from app.database.connection import get_database
from app.database.base_repository import BaseRepository

db = get_database()
collection = db["lesson_plans"]

class LessonPlanRepository(BaseRepository):
    pass

lesson_plan_repository = LessonPlanRepository(collection)
