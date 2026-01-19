from pydantic import BaseModel

class ExamScoreRequest(BaseModel):
    exam_name: str
    study_hours_per_day: float
    extracurricular_hours_per_day: float
    sleep_hours_per_day: float
    social_hours_per_day: float
    physical_activity_hours_per_day: float
    gpa: float
    stress_level: int


class ExamScoreResponse(BaseModel):
    predicted_score: float
