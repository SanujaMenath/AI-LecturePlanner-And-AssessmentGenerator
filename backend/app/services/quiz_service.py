# backend/app/services/quiz_service.py
from app.database.connection import get_database
from bson import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException, status

db = get_database()
quizzes_col = db["quizzes"]
questions_col = db["question_bank"]
quiz_attempts_col = db["quiz_attempts"]
course_students_col = db["course_students"]
users_col = db["users"]

class QuizService:
    @staticmethod
    def _now():
        return datetime.now(timezone.utc)

    @staticmethod
    def _to_str_id(doc, id_field="_id"):
        doc["id"] = str(doc[id_field])
        doc.pop(id_field, None)
        return doc

    @staticmethod
    def create_quiz(payload):
        # validate course, questions exist
        for qid in payload.questions:
            if not ObjectId.is_valid(str(qid)):
                raise HTTPException(status_code=400, detail="Invalid question id in list")
            if not questions_col.find_one({"_id": ObjectId(str(qid))}):
                raise HTTPException(status_code=404, detail=f"Question {qid} not found")

        now = QuizService._now()
        doc = {
            "course_id": ObjectId(str(payload.course_id)),
            "module_id": ObjectId(str(payload.module_id)) if payload.module_id else None,
            "title": payload.title,
            "instructions": payload.instructions,
            "questions": [ObjectId(str(q)) for q in payload.questions],
            "duration_minutes": payload.duration_minutes,
            "due_date": payload.due_date,
            "is_published": payload.is_published,
            "created_at": now,
            "updated_at": now
        }
        res = quizzes_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        return QuizService._to_str_id(doc)

    @staticmethod
    def list_quizzes(course_id=None, skip=0, limit=50):
        q = {}
        if course_id:
            if not ObjectId.is_valid(course_id):
                raise HTTPException(status_code=400, detail="Invalid course id")
            q["course_id"] = ObjectId(course_id)
        cursor = quizzes_col.find(q).skip(int(skip)).limit(int(limit)).sort("created_at", -1)
        out = []
        for d in cursor:
            out.append(QuizService._to_str_id(d))
        return out

    @staticmethod
    def get_quiz(quiz_id):
        if not ObjectId.is_valid(quiz_id):
            raise HTTPException(status_code=400, detail="Invalid quiz id")
        d = quizzes_col.find_one({"_id": ObjectId(quiz_id)})
        if not d:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return QuizService._to_str_id(d)

    @staticmethod
    def submit_attempt(quiz_id: str, student_id: str, answers: list):
        # validate ids
        if not ObjectId.is_valid(quiz_id) or not ObjectId.is_valid(student_id):
            raise HTTPException(status_code=400, detail="Invalid id")
        quiz = quizzes_col.find_one({"_id": ObjectId(quiz_id)})
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        # enrollment check
        if not course_students_col.find_one({"course_id": quiz["course_id"], "student_id": ObjectId(student_id)}):
            raise HTTPException(status_code=403, detail="Student not enrolled")

        # due_date check
        now = QuizService._now()
        if quiz.get("due_date") and now > quiz["due_date"]:
            raise HTTPException(status_code=400, detail="Quiz due date passed")

        # auto-grade MCQs: fetch question docs for mapping
        question_map = {}
        qdocs = questions_col.find({"_id": {"$in": quiz["questions"]}})
        for q in qdocs:
            question_map[str(q["_id"])] = q

        total = 0.0
        obtained = 0.0

        processed_answers = []
        for a in answers:
            qid = str(a["question_id"])
            qdoc = question_map.get(qid)
            if not qdoc:
                raise HTTPException(status_code=400, detail=f"Question {qid} not in quiz")
            # assume question doc has: type: "mcq" or "essay", points: float, correct_options: [0,2] etc.
            pts = float(qdoc.get("points", 1))
            total += pts
            if qdoc.get("type") == "mcq":
                # compare selected options list with correct_options
                selected = a.get("selected_options") or []
                correct = qdoc.get("correct_options") or []
                # simple exact-match scoring
                if sorted(selected) == sorted(correct):
                    obtained += pts
                processed_answers.append({"question_id": ObjectId(qid), "selected_options": selected})
            else:
                # essay: no auto grade; store text
                processed_answers.append({"question_id": ObjectId(qid), "text_answer": a.get("text_answer")})
        # upsert attempt
        att_doc = {
            "assessment_id": ObjectId(quiz_id),
            "student_id": ObjectId(student_id),
            "answers": processed_answers,
            "score": obtained,
            "max_score": total,
            "submitted_at": now,
            "graded": False if any([questions_col.find_one({"_id": ObjectId(str(x["question_id"]))}).get("type") != "mcq" for x in processed_answers]) else True
        }

        existing = quiz_attempts_col.find_one({"assessment_id": ObjectId(quiz_id), "student_id": ObjectId(student_id)})
        if existing:
            quiz_attempts_col.update_one({"_id": existing["_id"]}, {"$set": att_doc})
            att_doc["_id"] = existing["_id"]
        else:
            res = quiz_attempts_col.insert_one(att_doc)
            att_doc["_id"] = res.inserted_id

        return QuizService._to_str_id(att_doc, id_field="_id")
