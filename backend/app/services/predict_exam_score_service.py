from pathlib import Path
import joblib
import pandas as pd

MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "ml_model"
    / "trained_models"
    / "exam_score_predictor_model.joblib"
)


class ExamScoreService:
    _model = None

    @classmethod
    def load_model(cls):
        if cls._model is None:
            with open(MODEL_PATH, "rb") as f:
                cls._model = joblib.load(f)
        return cls._model

    @classmethod
    def predict(cls, data) -> float:
        model = cls.load_model()

        features = pd.DataFrame(
            [
                {
                    "Exam_Name": data.exam_name,
                    "Study_Hours_Per_Day": data.study_hours_per_day,
                    "Extracurricular_Hours_Per_Day": data.extracurricular_hours_per_day,
                    "Sleep_Hours_Per_Day": data.sleep_hours_per_day,
                    "Social_Hours_Per_Day": data.social_hours_per_day,
                    "Physical_Activity_Hours_Per_Day": data.physical_activity_hours_per_day,
                    "GPA": data.gpa,
                    "Stress_Level": data.stress_level,
                }
            ]
        )

        prediction = model.predict(features)
        return float(prediction[0])
