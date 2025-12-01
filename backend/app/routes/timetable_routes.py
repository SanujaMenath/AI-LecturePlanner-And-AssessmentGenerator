from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_timetables():
    return {"message": "Timetables route working"}