from app.models.lecture_plan import LecturePlanSchema
from app.utils.lecture_plan_validator import normalize_lecture_plan


class LecturePlanService:

    @staticmethod
    def validate_and_parse(raw_data: dict) -> LecturePlanSchema:
        normalized = normalize_lecture_plan(raw_data)
        return LecturePlanSchema(**normalized)
