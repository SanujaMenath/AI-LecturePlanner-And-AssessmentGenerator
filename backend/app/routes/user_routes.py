from fastapi import APIRouter
from app.models.user import UserCreate, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register")
def register(data: UserCreate):
    return UserService.create_user(data)

@router.post("/login")
def login(payload: dict):
    return UserService.login(payload["email"], payload["password"])

@router.get("/{user_id}")
def get_user(user_id: str):
    return UserService.get_user_by_id(user_id)

@router.put("/{user_id}")
def update_user(user_id: str, data: UserUpdate):
    return UserService.update_user(user_id, data)
