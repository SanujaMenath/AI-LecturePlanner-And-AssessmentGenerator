# backend/app/routes/module_routes.py
from fastapi import APIRouter, Depends, Path, Query, HTTPException, status
from typing import List, Optional
from app.models.module import ModuleCreate, ModuleUpdate, ModuleResponse
from app.services.module_service import ModuleService
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/modules", tags=["Modules"])

@router.post("/", response_model=ModuleResponse)
def create_module(payload: ModuleCreate, current_user = Depends(get_current_user)):
    # only admin or lecturer (optional) can create; keep admin for now
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return ModuleService.create_module(payload)

@router.get("/", response_model=List[ModuleResponse])
def list_modules(course_id: Optional[str] = Query(None), skip: int = Query(0), limit: int = Query(100)):
    return ModuleService.list_modules(course_id=course_id, skip=skip, limit=limit)

@router.get("/{module_id}", response_model=ModuleResponse)
def get_module(module_id: str = Path(...)):
    return ModuleService.get_module(module_id)

@router.put("/{module_id}", response_model=ModuleResponse)
def update_module(module_id: str, payload: ModuleUpdate, current_user = Depends(get_current_user)):
    # admin or lecturer only
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return ModuleService.update_module(module_id, payload)

@router.delete("/{module_id}")
def delete_module(module_id: str, current_user = Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return ModuleService.delete_module(module_id)

# convenience: modules for a course
@router.get("/course/{course_id}", response_model=List[ModuleResponse])
def modules_for_course(course_id: str):
    return ModuleService.list_modules(course_id=course_id)
