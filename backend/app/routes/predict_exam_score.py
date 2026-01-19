from fastapi import APIRouter
from app.models.predict_exam_score import ExamScoreRequest, ExamScoreResponse
from app.services.predict_exam_score_service import ExamScoreService

router = APIRouter(prefix="/predict-exam-score", tags=["Exam Score Prediction"])

@router.post("/predict", response_model=ExamScoreResponse)
def predict_exam_score(request: ExamScoreRequest):
    score = ExamScoreService.predict(request)
    return ExamScoreResponse(predicted_score=score)

