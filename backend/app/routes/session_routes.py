# backend/app/routes/session_routes.py
from fastapi import APIRouter, Depends, Path, Query, HTTPException, status
from typing import List, Optional
from app.models.session import SessionCreate, SessionUpdate, SessionResponse
from app.services.session_service import SessionService
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/sessions", tags=["Sessions"])

# Create session (admin or lecturer)
@router.post("/", response_model=SessionResponse)
def create_session(payload: SessionCreate, current_user = Depends(get_current_user)):
    # Only admin or lecturer can create sessions
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    # If lecturer role, ensure they can only create sessions assigned to themselves (optional)
    if current_user["role"] == "lecturer" and str(payload.lecturer_id) != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Lecturers may only create sessions for themselves")
    return SessionService.create_session(payload)

@router.get("/", response_model=List[SessionResponse])
def list_sessions(skip: int = Query(0), limit: int = Query(100), course_id: Optional[str] = None, lecturer_id: Optional[str] = None):
    return SessionService.list_sessions(skip=skip, limit=limit, course_id=course_id, lecturer_id=lecturer_id)

@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: str = Path(...)):
    return SessionService.get_session(session_id)

@router.put("/{session_id}", response_model=SessionResponse)
def update_session(session_id: str, payload: SessionUpdate, current_user = Depends(get_current_user)):
    # admin or the lecturer assigned to the session
    session = SessionService.get_session(session_id)
    if current_user["role"] == "lecturer" and str(session["lecturer_id"]) != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Lecturers can only update their own sessions")
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return SessionService.update_session(session_id, payload)

@router.delete("/{session_id}")
def delete_session(session_id: str, current_user = Depends(get_current_user)):
    session = SessionService.get_session(session_id)
    if current_user["role"] == "lecturer" and str(session["lecturer_id"]) != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Lecturers can only delete their own sessions")
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return SessionService.delete_session(session_id)

# convenience endpoints
@router.get("/course/{course_id}", response_model=List[SessionResponse])
def sessions_for_course(course_id: str):
    return SessionService.list_sessions(course_id=course_id)

@router.get("/lecturer/{lecturer_id}", response_model=List[SessionResponse])
def sessions_for_lecturer(lecturer_id: str):
    return SessionService.list_sessions(lecturer_id=lecturer_id)

@router.get("/student/{student_id}", response_model=List[SessionResponse])
def sessions_for_student(student_id: str):
    # sessions for a student -> find enrolled course_ids then query sessions
    # build list of course_ids
    from bson import ObjectId
    db = __import__("app.database.connection", fromlist=["get_database"]).get_database()
    if not ObjectId.is_valid(student_id):
        raise HTTPException(status_code=400, detail="Invalid student id")
    pipeline = [
        {"$match": {"student_id": ObjectId(student_id)}},
        {"$group": {"_id": None, "courses": {"$addToSet": "$course_id"}}}
    ]
    res = list(db["course_students"].aggregate(pipeline))
    if not res:
        return []
    course_ids = [c for c in res[0]["courses"]]
    # query sessions for those course ids
    q = {"course_id": {"$in": course_ids}}
    cursor = db["sessions"].find(q).sort("start_time", 1)
    out = []
    for s in cursor:
        s["id"] = str(s["_id"])
        s.pop("_id", None)
        out.append(s)
    return out
