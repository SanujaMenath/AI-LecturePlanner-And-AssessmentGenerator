from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_questions():
    return {"message": "Questions route working"}