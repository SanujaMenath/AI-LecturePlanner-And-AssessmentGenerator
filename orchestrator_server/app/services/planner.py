from __future__ import annotations

from ..graph.planner_graph import PlannerState, build_planner_graph
from ..schemas import LecturePlan

_planner_graph = build_planner_graph()


async def generate_lecture_plan(
    module_title: str,
    audience: str,
    duration_minutes: int,
) -> LecturePlan:
    """Run the planner graph and return a LecturePlan model."""
    initial_state: PlannerState = {
        "module_title": module_title,
        "audience": audience,
        "duration_minutes": int(duration_minutes),
    }
    result_state = _planner_graph.invoke(
        initial_state,
        config={"recursion_limit": 25},
    )
    lecture_plan_data = result_state.get("lecture_plan")
    if lecture_plan_data is None:
        # Fallback – construct a minimal plan if something went wrong
        lecture_plan_data = {
            "module_title": module_title,
            "audience": audience,
            "duration_minutes": int(duration_minutes),
            "segments": [],
        }

    return LecturePlan.model_validate(lecture_plan_data)

