from fastapi import APIRouter, HTTPException
from app.services.lecturer_service import LecturerService
from app.models.lecturer import (
    LecturerCreate,
    LecturerUpdate,
    LecturerResponse
)

router = APIRouter(prefix="/lecturers", tags=["Lecturers"])


@router.post("/", response_model=LecturerResponse)
def create_lecturer(data: LecturerCreate):
    try:
        return LecturerService.create_lecturer(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[LecturerResponse])
def get_all_lecturers():
    return LecturerService.get_all_lecturers()


@router.get("/{user_id}", response_model=LecturerResponse)
def get_lecturer_by_id(user_id: str):
    lecturer = LecturerService.get_lecturer_by_id(user_id)
    if not lecturer:
        raise HTTPException(status_code=404, detail="Lecturer not found")

    return lecturer


@router.put("/{user_id}", response_model=LecturerResponse)
def update_lecturer(user_id: str, data: LecturerUpdate):
    result = LecturerService.update_lecturer(user_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Lecturer not found")

    return result


@router.delete("/{user_id}")
def delete_lecturer(user_id: str):
    deleted = LecturerService.delete_lecturer(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Lecturer not found")

    return {"message": "Lecturer deleted successfully"}
