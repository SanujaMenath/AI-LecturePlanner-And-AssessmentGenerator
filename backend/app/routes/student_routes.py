from fastapi import APIRouter, HTTPException
from app.models.student import StudentCreate, StudentUpdate, StudentResponse
from app.services.student_service import StudentService

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("/", response_model=StudentResponse)
def create_student(data: StudentCreate):
    try:
        return StudentService.create_student(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[StudentResponse])
def get_students():
    return StudentService.get_all()

@router.get("/{user_id}", response_model=StudentResponse)
def get_student(user_id: str):
    student = StudentService.get_by_id(user_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{user_id}", response_model=StudentResponse)
def update_student(user_id: str, data: StudentUpdate):
    return StudentService.update_student(user_id, data)

@router.delete("/{user_id}")
def delete_student(user_id: str):
    StudentService.delete_student(user_id)
    return {"message": "Student deleted successfully"}
