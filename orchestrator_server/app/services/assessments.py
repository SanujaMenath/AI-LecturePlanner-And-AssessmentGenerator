from __future__ import annotations

from typing import Any, Dict, List

from ..graph.assessment_graph import AssessmentState, build_assessment_graph
from ..schemas import AssessmentQuestion, AssessmentRequest, AssessmentResponse
from ..config import settings

_assessment_graph = build_assessment_graph()


async def generate_assessments(request: AssessmentRequest) -> AssessmentResponse:
    """Run the assessment graph and return validated questions."""
    
    # Safely handle the optional lecture plan
    safe_lecture_plan = request.lecture_plan.model_dump() if request.lecture_plan else {}

    initial_state: AssessmentState = {
        "lecture_plan": safe_lecture_plan,
        "document_set_id": request.document_set_id,
        "num_questions": request.num_questions,
        "max_attempts": request.num_questions * settings.assessment_max_attempt_multiplier,
    }
    
    if request.focus_topics:
        initial_state["focus_topics"] = list(request.focus_topics)

    final_state = _assessment_graph.invoke(
        initial_state,
        config={"recursion_limit": 150},
    )

    raw_questions: List[Dict[str, Any]] = list(final_state.get("questions") or [])
    questions = [AssessmentQuestion.model_validate(q) for q in raw_questions]
    num_rejected = int(final_state.get("num_rejected", 0))

    return AssessmentResponse(
        questions=questions,
        num_generated=len(questions),
        num_rejected=num_rejected,
    )

