from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_lesson_plans():
    return {"message": "Lesson Plans route working"}