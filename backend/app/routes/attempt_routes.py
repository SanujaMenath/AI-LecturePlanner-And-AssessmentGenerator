# backend/app/routes/attempt_routes.py
from fastapi import APIRouter, Depends, Path, Body, HTTPException
from typing import List
from app.services.attempt_service import AttemptService
from app.models.attempt import AttemptCreate, AttemptResponse
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/attempts", tags=["Attempts"])

@router.post("/start", response_model=AttemptResponse)
def start_attempt(payload: AttemptCreate, current_user = Depends(get_current_user)):
    # student only
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student only")
    return AttemptService.start_attempt(str(payload.assessment_id), str(payload.student_id))

@router.post("/{assessment_id}/submit", response_model=AttemptResponse)
def submit_attempt(assessment_id: str, payload: dict = Body(...), current_user = Depends(get_current_user)):
    # payload expected: { "student_id": "...", "answers": [...] }
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student only")
    student_id = payload.get("student_id")
    answers = payload.get("answers", [])
    return AttemptService.submit_attempt(assessment_id, student_id, answers)

@router.get("/{assessment_id}", response_model=List[AttemptResponse])
def list_attempts(assessment_id: str, current_user = Depends(get_current_user)):
    # lecturers or admin can list
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=403, detail="Admin or Lecturer only")
    return AttemptService.get_attempts_for_assessment(assessment_id)

@router.get("/{assessment_id}/student/{student_id}", response_model=AttemptResponse)
def get_attempt(assessment_id: str, student_id: str, current_user = Depends(get_current_user)):
    # student or lecturer/admin
    if current_user["role"] == "student" and current_user["id"] != student_id:
        raise HTTPException(status_code=403, detail="Not allowed")
    return AttemptService.get_attempt(assessment_id, student_id)
