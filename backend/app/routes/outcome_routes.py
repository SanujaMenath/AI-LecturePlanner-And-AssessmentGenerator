from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_outcomes():
    return {"message": "Outcomes route working"}