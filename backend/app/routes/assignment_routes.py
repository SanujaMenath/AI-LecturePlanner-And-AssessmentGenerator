from fastapi import APIRouter, Depends, Path, Query, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
from app.models.assignment import (
    AssignmentCreate, AssignmentUpdate, AssignmentResponse,
    SubmissionCreate, SubmissionResponse
)
from app.services.assignment_service import AssignmentService
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/assignments", tags=["Assignments"])

# Create assignment (admin or lecturer)
@router.post("/", response_model=AssignmentResponse)
def create_assignment(payload: AssignmentCreate, current_user=Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return AssignmentService.create_assignment(payload)

@router.get("/", response_model=List[AssignmentResponse])
def list_assignments(course_id: Optional[str] = Query(None), skip: int = Query(0), limit: int = Query(100)):
    return AssignmentService.list_assignments(course_id=course_id, skip=skip, limit=limit)

@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: str = Path(...)):
    return AssignmentService.get_assignment(assignment_id)

@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(assignment_id: str, payload: AssignmentUpdate, current_user=Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return AssignmentService.update_assignment(assignment_id, payload)

@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: str, current_user=Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return AssignmentService.delete_assignment(assignment_id)

# Submissions: multi-part form (file optional)
# Use form fields student_id and notes and file
@router.post("/{assignment_id}/submit", response_model=SubmissionResponse)
def submit_assignment(
    assignment_id: str,
    student_id: str = Form(...),
    notes: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    # student_id provided as form string
    return AssignmentService.submit_assignment(assignment_id, student_id, notes=notes, file=file)

@router.get("/{assignment_id}/submissions", response_model=List[SubmissionResponse])
def list_submissions(assignment_id: Optional[str] = None, student_id: Optional[str] = None, current_user=Depends(get_current_user)):
    # lecturers or admin can view all; students can view their own
    if current_user["role"] == "student" and student_id and str(current_user["id"]) != student_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students can only view their own submissions")
    return AssignmentService.list_submissions(assignment_id=assignment_id, student_id=student_id)

@router.post("/{submission_id}/grade")
def grade_submission(submission_id: str, marks_obtained: float = Form(...), feedback: Optional[str] = Form(None), current_user=Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return AssignmentService.grade_submission(submission_id, marks_obtained, feedback)

# AI helper: generate suggested assignment skeleton (not saved)
@router.post("/generate")
def generate_assignment(course_id: str = Form(...), prompt_params: Optional[str] = Form("{}"), current_user=Depends(get_current_user)):
    # require lecturer or admin
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    import json
    params = {}
    try:
        params = json.loads(prompt_params)
    except:
        params = {"raw": prompt_params}
    suggested = AssignmentService.generate_assignment_skeleton(course_id, params)
    return suggested
