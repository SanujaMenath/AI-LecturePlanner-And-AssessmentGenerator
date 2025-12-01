from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_enrollments():
    return {"message": "Enrollments route working"}