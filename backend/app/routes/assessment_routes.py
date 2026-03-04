import os
import shutil
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Path, Query, HTTPException, status, UploadFile, File, Form
from app.models.assessment import AssessmentCreate, AssessmentUpdate, AssessmentResponse
from app.services.assessment_service import AssessmentService
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/assessments", tags=["Assessments"])

UPLOAD_DIR = "uploads/assessments"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=AssessmentResponse)
async def create_assessment(
    lecturer_id: str,
    title: str = Form(...),
    course_id: str = Form(...),
    assessment_type: str = Form(...),
    due_date: datetime = Form(...),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    try:
        file_url = None
        
        if assessment_type == "pdf" and file:
            file_location = f"{UPLOAD_DIR}/{file.filename}"
            with open(file_location, "wb+") as file_object:
                shutil.copyfileobj(file.file, file_object)
            file_url = f"/{file_location}"

        data = AssessmentCreate(
            title=title,
            course_id=course_id,
            assessment_type=assessment_type,
            due_date=due_date,
            content=content,
            file_url=file_url
        )

        return AssessmentService.create_assessment(data, lecturer_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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