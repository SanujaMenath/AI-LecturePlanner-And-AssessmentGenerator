from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_generated_materials():
    return {"message": "Generated Materials route working"}