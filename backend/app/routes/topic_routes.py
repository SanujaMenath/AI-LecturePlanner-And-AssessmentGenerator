from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_topics():
    return {"message": "Topics route working"}