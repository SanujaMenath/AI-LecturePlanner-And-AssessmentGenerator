from fastapi import APIRouter
from app.graph.validator_node import agent_executor
from app.models.lecture_plan import LectureGenerateRequest, LecturePlanSchema

router = APIRouter(prefix="/lecture-plan", tags=["Lecture Plans"])


@router.post("/generate", response_model=LecturePlanSchema)
async def generate_plan(request: LectureGenerateRequest):

    inputs = {
        "module_title": request.topic,
        "audience": request.audience_level,
        "duration_hours": request.duration,
        "error_log": []
    }
    
    result = await agent_executor.ainvoke(inputs)
    return result["lecture_plan"]