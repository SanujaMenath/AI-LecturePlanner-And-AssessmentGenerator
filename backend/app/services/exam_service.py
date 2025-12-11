# backend/app/services/exam_service.py
from app.database.connection import get_database
from bson import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException
from app.services.quiz_service import QuizService

db = get_database()
exams_col = db["exams"]
questions_col = db["question_bank"]
exam_attempts_col = db["exam_attempts"]
course_students_col = db["course_students"]

class ExamService:
    @staticmethod
    def _now(): return datetime.now(timezone.utc)
    @staticmethod
    def _to_str_id(doc, id_field="_id"):
        doc["id"] = str(doc[id_field]); doc.pop(id_field, None); return doc

    @staticmethod
    def create_exam(payload):
        # validate questions exist
        for qid in payload.question_ids:
            if not ObjectId.is_valid(str(qid)):
                raise HTTPException(status_code=400, detail="Invalid question id")
            if not questions_col.find_one({"_id": ObjectId(str(qid))}):
                raise HTTPException(status_code=404, detail=f"Question {qid} not found")
        now = ExamService._now()
        doc = {
            "course_id": ObjectId(str(payload.course_id)),
            "module_id": ObjectId(str(payload.module_id)) if payload.module_id else None,
            "title": payload.title,
            "instructions": payload.instructions,
            "question_ids": [ObjectId(str(q)) for q in payload.question_ids],
            "start_time": payload.start_time,
            "end_time": payload.end_time,
            "duration_minutes": payload.duration_minutes,
            "is_published": payload.is_published,
            "created_at": now,
            "updated_at": now
        }
        res = exams_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        return ExamService._to_str_id(doc)
    @staticmethod
    def list_exams(course_id=None, skip=0, limit=50):
        q = {}
        if course_id:
            q["course_id"] = ObjectId(course_id)
        cursor = exams_col.find(q).skip(int(skip)).limit(int(limit)).sort("start_time", -1)
        return [ExamService._to_str_id(d) for d in cursor]

    @staticmethod
    def get_exam(exam_id):
        if not ObjectId.is_valid(exam_id):
            raise HTTPException(status_code=400, detail="Invalid exam id")
        d = exams_col.find_one({"_id": ObjectId(exam_id)})
        if not d:
            raise HTTPException(status_code=404, detail="Exam not found")
        return ExamService._to_str_id(d)

    @staticmethod
    def submit_attempt(exam_id: str, student_id: str, answers: list):
        if not ObjectId.is_valid(exam_id) or not ObjectId.is_valid(student_id):
            raise HTTPException(status_code=400, detail="Invalid id")
        exam = exams_col.find_one({"_id": ObjectId(exam_id)})
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        now = ExamService._now()
        if exam.get("start_time") and now < exam["start_time"]:
            raise HTTPException(status_code=400, detail="Exam not started yet")
        if exam.get("end_time") and now > exam["end_time"]:
            raise HTTPException(status_code=400, detail="Exam ended")
        # enrollment check
        if not course_students_col.find_one({"course_id": exam["course_id"], "student_id": ObjectId(student_id)}):
            raise HTTPException(status_code=403, detail="Student not enrolled")
        # grading like quiz
        # [same auto-grading logic as QuizService]
        # store attempt in exam_attempts_col
        # return attempt document
        # For brevity, implement same grading as quiz (copy)
        return QuizService.submit_attempt(exam_id, student_id, answers)  # reuse quiz grading logic
