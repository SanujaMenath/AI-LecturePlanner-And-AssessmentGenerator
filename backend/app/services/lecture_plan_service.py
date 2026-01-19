from app.services.ollama_service import call_ollama
from app.utils.lecture_plan_validator import normalize_lecture_plan
from app.models.lecture_plan import LecturePlanSchema

class LecturePlanService:

    @staticmethod
    def generate(topic: str, audience: str, duration: int) -> LecturePlanSchema:
        raw = call_ollama(topic, audience, duration)
        fixed = normalize_lecture_plan(raw)
        return LecturePlanSchema(**fixed)
