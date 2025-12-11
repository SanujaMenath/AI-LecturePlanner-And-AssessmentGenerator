# backend/app/routes/quiz_routes.py
from fastapi import APIRouter, Depends, HTTPException, status, Path
from typing import List
from app.models.quiz import QuizCreate, QuizUpdate, QuizResponse
from app.models.attempt import AttemptCreate, AttemptResponse
from app.services.quiz_service import QuizService
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.post("/", response_model=QuizResponse)
def create_quiz(payload: QuizCreate, current_user=Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    # if lecturer ensure course ownership could be checked
    return QuizService.create_quiz(payload)

@router.get("/", response_model=List[QuizResponse])
def list_quizzes(course_id: str = None, skip: int=0, limit: int=50):
    return QuizService.list_quizzes(course_id=course_id, skip=skip, limit=limit)

@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(quiz_id: str = Path(...)):
    return QuizService.get_quiz(quiz_id)

@router.post("/{quiz_id}/submit", response_model=AttemptResponse)
def submit_quiz(quiz_id: str, payload: AttemptCreate):
    return QuizService.submit_attempt(quiz_id, str(payload.student_id), [a.dict() for a in payload.answers])
