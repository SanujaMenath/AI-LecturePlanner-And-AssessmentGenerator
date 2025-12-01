from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_assessments():
    return {"message": "Assessments route working"}