from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timezone
from app.database.connection import get_database

db = get_database()
attendance_col = db["attendance"]
sessions_col = db["sessions"]
students_col = db["students"]


class AttendanceService:

    @staticmethod
    def mark_attendance(session_id: str, data):
        if not ObjectId.is_valid(session_id):
            raise HTTPException(status_code=400, detail="Invalid session id")
        
        if not sessions_col.find_one({"_id": ObjectId(session_id)}):
            raise HTTPException(status_code=404, detail="Session not found")
        
        if not students_col.find_one({"user_id": ObjectId(data.student_id)}):
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Prevent duplicate
        if attendance_col.find_one({
            "session_id": ObjectId(session_id),
            "student_id": ObjectId(data.student_id)
        }):
            raise HTTPException(status_code=409, detail="Attendance already marked")
        
        att_doc = {
            "session_id": ObjectId(session_id),
            "student_id": ObjectId(data.student_id),
            "status": data.status,
            "marked_at": datetime.now(timezone.utc)
        }

        inserted = attendance_col.insert_one(att_doc)

        return {
            "id": str(inserted.inserted_id),
            "session_id": session_id,
            "student_id": str(data.student_id),
            "status": data.status,
            "marked_at": att_doc["marked_at"]
        }

    @staticmethod
    def get_attendance_for_session(session_id: str):
        if not ObjectId.is_valid(session_id):
            raise HTTPException(status_code=400, detail="Invalid session id")
        
        entries = attendance_col.find({"session_id": ObjectId(session_id)})
        
        result = []
        for a in entries:
            result.append({
                "id": str(a["_id"]),
                "session_id": session_id,
                "student_id": str(a["student_id"]),
                "status": a["status"],
                "marked_at": a["marked_at"]
            })
        return result

    @staticmethod
    def get_attendance_of_student(student_id: str):
        if not ObjectId.is_valid(student_id):
            raise HTTPException(status_code=400, detail="Invalid student id")

        entries = attendance_col.find({"student_id": ObjectId(student_id)})

        result = []
        for a in entries:
            result.append({
                "id": str(a["_id"]),
                "session_id": str(a["session_id"]),
                "student_id": student_id,
                "status": a["status"],
                "marked_at": a["marked_at"]
            })
        return result

    @staticmethod
    def delete_attendance(attendance_id: str):
        if not ObjectId.is_valid(attendance_id):
            raise HTTPException(status_code=400, detail="Invalid id")

        attendance_col.delete_one({"_id": ObjectId(attendance_id)})
        return True
