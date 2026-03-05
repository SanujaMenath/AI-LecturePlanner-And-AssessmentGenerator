from __future__ import annotations

from typing import Any, List, Optional

from pydantic import BaseModel, Field


class LectureSegment(BaseModel):
    sequence_index: int = Field(..., description="Order of the segment in the lecture.")
    title: str
    description: str
    duration_minutes: int
    learning_objectives: List[str]

class LecturePlan(BaseModel):
    module_title: str
    audience: str
    duration_minutes: int
    segments: List[LectureSegment]


class PlanRequest(BaseModel):
    module_title: str
    audience: str
    duration_minutes: int = Field(..., gt=0)


class PlanResponse(BaseModel):
    lecture_plan: LecturePlan


class UploadResponse(BaseModel):
    document_set_id: str
    num_pages: int
    num_chunks: int


class AssessmentQuestion(BaseModel):
    id: str
    stem: str
    options: List[str]
    correct_option_index: int
    explanation: Optional[str] = None
    source_metadata: dict[str, Any] = Field(
        default_factory=dict,
        description="Metadata about the source passages used to create this question.",
    )


class AssessmentRequest(BaseModel):
    lecture_plan: Optional[LecturePlan] = None
    document_set_id: str
    num_questions: int = Field(5, gt=0, le=50)
    focus_topics: Optional[List[str]] = None


class AssessmentResponse(BaseModel):
    questions: List[AssessmentQuestion]
    num_generated: int
    num_rejected: int

