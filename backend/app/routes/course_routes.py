from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_courses():
    return {"message": "Courses route working"}