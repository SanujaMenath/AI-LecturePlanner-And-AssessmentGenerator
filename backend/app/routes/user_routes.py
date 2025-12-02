from typing import List
from fastapi import APIRouter, Depends, Query, Path
from app.models.user import UserCreate, UserUpdate, UserResponse
from app.services.user_service import UserService
from app.dependencies.auth_dependencies import require_role, get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

# Create user
# Admins can create lecturers or admins; self-registration can be a separate public route if needed
@router.post("/", response_model=UserResponse, dependencies=[Depends(require_role("admin"))])
def create_user(payload: UserCreate):
    return UserService.create_user(payload)

# List users (admin only)
@router.get("/", response_model=List[UserResponse], dependencies=[Depends(require_role("admin"))])
def list_users(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200)):
    return UserService.list_users(skip=skip, limit=limit)

# Get single user (admin or the user themself)
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str = Path(...), current_user=Depends(get_current_user)):
    # allow admin or same user
    if current_user["role"] != "admin" and current_user["id"] != user_id:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return UserService.get_user_public(user_id)

# Update user (self or admin)
@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: str, payload: UserUpdate, current_user=Depends(get_current_user)):
    if current_user["role"] != "admin" and current_user["id"] != user_id:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return UserService.update_user(user_id, payload)

# Delete user (admin only)
@router.delete("/{user_id}", dependencies=[Depends(require_role("admin"))])
def delete_user(user_id: str):
    return UserService.delete_user(user_id)
