from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_system_logs():
    return {"message": "System Logs route working"}