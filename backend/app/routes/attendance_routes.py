from fastapi import APIRouter
from app.services.attendance_service import AttendanceService
from app.models.attendance_model import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/{session_id}", response_model=AttendanceResponse)
def mark_attendance(session_id: str, data: AttendanceCreate):
    return AttendanceService.mark_attendance(session_id, data)


@router.get("/session/{session_id}")
def get_attendance_for_session(session_id: str):
    return AttendanceService.get_attendance_for_session(session_id)


@router.get("/student/{student_id}")
def get_attendance_of_student(student_id: str):
    return AttendanceService.get_attendance_of_student(student_id)


@router.delete("/{attendance_id}")
def delete_attendance(attendance_id: str):
    return AttendanceService.delete_attendance(attendance_id)
