from fastapi import APIRouter, HTTPException
from app.models.lecture_plan import LecturePlanSchema, LectureGenerateRequest
from app.services.lecture_plan_service import LecturePlanService

router = APIRouter(prefix="/lecture-plans", tags=["Lecture Plans"])

@router.post("/generate", response_model=LecturePlanSchema)
def generate_lecture(req: LectureGenerateRequest):
    try:
        return LecturePlanService.generate(
            req.topic,
            req.audience_level,
            req.duration
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
