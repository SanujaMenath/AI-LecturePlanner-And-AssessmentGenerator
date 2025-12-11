from fastapi import FastAPI

from app.routes.test_db import router as test_db_router
from app.routes.auth_routes import router as auth_router

from app.routes.user_routes import router as user_router
from app.routes.lecturer_routes import router as lecturer_router
from app.routes.student_routes import router as student_router
from app.routes.course_routes import router as course_router
from app.routes.module_routes import router as module_router
from app.routes.topic_routes import router as topic_router
from app.routes.outcome_routes import router as outcome_router
from app.routes.lesson_plan_routes import router as lesson_plan_router
from app.routes.assignment_routes import router as assignment_routes
from app.routes.question_routes import router as question_router
from app.routes.enrollment_routes import router as enrollment_router
from app.routes.timetable_routes import router as timetable_router
from app.routes.generated_material_routes import router as generated_material_router
from app.routes.system_log_routes import router as system_log_router
from app.routes.session_routes import router as session_router
from app.routes.attendance_routes import router as attendance_router
from app.routes.quiz_routes import router as quiz_router
from app.routes.exam_routes import router as exam_router

from app.config.settings import settings

app = FastAPI(title=settings.PROJECT_NAME)

@app.get("/")
def root():
    return {"message": "Backend API running"}

app.include_router(test_db_router, prefix="/system", tags=["System"])

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(lecturer_router)
app.include_router(student_router)
app.include_router(course_router)
app.include_router(module_router)
app.include_router(topic_router)
app.include_router(outcome_router)
app.include_router(lesson_plan_router)
app.include_router(assignment_routes)
app.include_router(question_router)
app.include_router(enrollment_router)
app.include_router(timetable_router)
app.include_router(generated_material_router)
app.include_router(system_log_router)
app.include_router(session_router)
app.include_router(attendance_router)
app.include_router(quiz_router)
app.include_router(exam_router)
