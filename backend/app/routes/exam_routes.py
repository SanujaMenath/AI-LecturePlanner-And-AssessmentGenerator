# backend/app/routes/exam_routes.py
from fastapi import APIRouter, Depends, HTTPException, status, Path
from typing import List
from app.models.exam import ExamCreate, ExamUpdate, ExamResponse
from app.models.attempt import AttemptCreate, AttemptResponse
from app.services.exam_service import ExamService
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/exams", tags=["Exams"])

@router.post("/", response_model=ExamResponse)
def create_exam(payload: ExamCreate, current_user=Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    return ExamService.create_exam(payload)

@router.get("/", response_model=List[ExamResponse])
def list_exams(course_id: str = None, skip: int=0, limit: int=50):
    return ExamService.list_exams(course_id=course_id, skip=skip, limit=limit)

@router.get("/{exam_id}", response_model=ExamResponse)
def get_exam(exam_id: str = Path(...)):
    return ExamService.get_exam(exam_id)

@router.post("/{exam_id}/submit", response_model=AttemptResponse)
def submit_exam(exam_id: str, payload: AttemptCreate):
    return ExamService.submit_attempt(exam_id, str(payload.student_id), [a.dict() for a in payload.answers])
