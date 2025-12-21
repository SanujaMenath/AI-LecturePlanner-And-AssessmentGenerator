from fastapi import APIRouter, HTTPException
from app.services.lecture_plan_service import LecturePlanService
from app.models.lecture_plan import LecturePlanSchema

router = APIRouter(prefix="/lecture-plans", tags=["Lecture Plans"])


@router.post("/validate", response_model=LecturePlanSchema)
def validate_lecture_plan(payload: dict):
    try:
        return LecturePlanService.validate_and_parse(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
