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
from app.routes.assessment_routes import router as assessment_router
from app.routes.question_routes import router as question_router
from app.routes.enrollment_routes import router as enrollment_router
from app.routes.timetable_routes import router as timetable_router
from app.routes.generated_material_routes import router as generated_material_router
from app.routes.system_log_routes import router as system_log_router

from app.config.settings import settings

app = FastAPI(title=settings.PROJECT_NAME)

@app.get("/")
def root():
    return {"message": "Backend API running"}

app.include_router(test_db_router, prefix="/system", tags=["System"])
# Register all routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(lecturer_router)
app.include_router(student_router)
app.include_router(course_router)
app.include_router(module_router, prefix="/modules", tags=["Modules"])
app.include_router(topic_router, prefix="/topics", tags=["Topics"])
app.include_router(outcome_router, prefix="/outcomes", tags=["Learning Outcomes"])
app.include_router(lesson_plan_router, prefix="/lesson-plans", tags=["Lesson Plans"])
app.include_router(assessment_router, prefix="/assessments", tags=["Assessments"])
app.include_router(question_router, prefix="/questions", tags=["Questions"])
app.include_router(enrollment_router, prefix="/enrollments", tags=["Enrollments"])
app.include_router(timetable_router, prefix="/timetable", tags=["Timetables"])
app.include_router(generated_material_router, prefix="/generated-materials", tags=["Generated Materials"])
app.include_router(system_log_router, prefix="/system-logs", tags=["System Logs"])
