from app.graph.planner_graph import _validate_lecture_plan


def test_validate_lecture_plan_exact_match():
    plan = {
        "segments": [
            {"duration_minutes": 100},
            {"duration_minutes": 200},
            {"duration_minutes": 300},
        ]
    }
    is_valid, total = _validate_lecture_plan(plan, target_duration=600, tolerance=0)
    assert is_valid is True
    assert total == 600


def test_validate_lecture_plan_out_of_tolerance():
    plan = {
        "segments": [
            {"duration_minutes": 100},
            {"duration_minutes": 200},
        ]
    }
    is_valid, total = _validate_lecture_plan(plan, target_duration=600, tolerance=10)
    assert is_valid is False
    assert total == 300

