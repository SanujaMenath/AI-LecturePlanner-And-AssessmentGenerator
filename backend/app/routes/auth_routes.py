from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.services.auth_service import AuthService
from app.database.connection import get_database
from app.models.object_id import PyObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest):
    db = get_database()

    user = db["users"].find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not AuthService.verify_password(data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = AuthService.create_access_token({"sub": str(user["_id"]), "role": user["role"]})

    return LoginResponse(
        access_token=token,
        role=user["role"],
        user_id=str(user["_id"])
    )


# Temporary Admin Seeder (for testing)
class AdminCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


@router.post("/create-admin")
def create_admin(data: AdminCreate):
    db = get_database()

    # Check email exists
    if db["users"].find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed = AuthService.hash_password(data.password)

    new_admin = {
        "full_name": data.full_name,
        "email": data.email,
        "password": hashed,
        "role": "admin",
    }

    result = db["users"].insert_one(new_admin)

    return {"message": "Admin created", "admin_id": str(result.inserted_id)}
