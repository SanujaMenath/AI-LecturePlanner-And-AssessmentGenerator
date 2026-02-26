from .state import LMSState

def time_allocator_node(state: LMSState):
    """
    Mathematically adjusts segment durations to match the total target time.
    """
    plan = state.get("lecture_plan")
    target_total = state["duration_hours"] * 60 
    
    if not plan or "segments" not in plan:
        return {"error_log": ["No segments found to allocate time."]}

    segments = plan["segments"]
    current_total = sum(s.get("duration_mins", 0) for s in segments)

    if current_total != target_total:
        scale_factor = target_total / current_total
        
        for segment in segments:
            adjusted_time = round((segment["duration_mins"] * scale_factor) / 5) * 5
            segment["duration_mins"] = max(adjusted_time, 5) 

    new_total = sum(s["duration_mins"] for s in segments)
    difference = target_total - new_total
    segments[-1]["duration_mins"] += difference

    return {"lecture_plan": plan}