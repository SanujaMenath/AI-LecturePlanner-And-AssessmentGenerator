# backend/app/routes/assessment_routes.py
from fastapi import APIRouter, Depends, Path, Query, HTTPException, status, Body
from typing import List, Optional
from app.models.assessment import AssessmentCreate, AssessmentUpdate, AssessmentResponse
from app.services.assessment_service import AssessmentService
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.post("/", response_model=AssessmentResponse)
def create_assessment(payload: AssessmentCreate, current_user = Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return AssessmentService.create_assessment(payload)

@router.get("/", response_model=List[AssessmentResponse])
def list_assessments(course_id: Optional[str] = Query(None), skip: int = Query(0), limit: int = Query(100)):
    return AssessmentService.list_assessments(course_id=course_id, skip=skip, limit=limit)

@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: str = Path(...)):
    return AssessmentService.get_assessment(assessment_id)

@router.put("/{assessment_id}", response_model=AssessmentResponse)
def update_assessment(assessment_id: str, payload: AssessmentUpdate, current_user = Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return AssessmentService.update_assessment(assessment_id, payload)

@router.delete("/{assessment_id}")
def delete_assessment(assessment_id: str, current_user = Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return AssessmentService.delete_assessment(assessment_id)
