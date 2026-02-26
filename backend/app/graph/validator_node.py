from pydantic import ValidationError
from langgraph.graph import END, StateGraph
from app.graph.state import LMSState
from app.models.lecture_plan import LecturePlanSchema
from app.graph.planner_node import planner_node
from app.graph.time_allocator_node import time_allocator_node
from app.graph.detailer_node import detailer_node

def validator_node(state: LMSState):
    plan_data = state.get("lecture_plan")
    
    try:
        # Try to initialize the Pydantic model
        LecturePlanSchema(**plan_data)
        return "end" # If successful, go to END
    except ValidationError as e:
        # If it fails, log the error and go back to detailer
        error_msg = f"Schema Validation Failed: {str(e)}"
        return "fail"

workflow = StateGraph(LMSState)

# 1. Add all nodes
workflow.add_node("planner", planner_node)
workflow.add_node("allocator", time_allocator_node)
workflow.add_node("detailer", detailer_node)

# 2. Define the flow
workflow.set_entry_point("planner")
workflow.add_edge("planner", "allocator")
workflow.add_edge("allocator", "detailer")

# 3. Add the logic gate (The Validator)
workflow.add_conditional_edges(
    "detailer",
    validator_node,
    {
        "end": END,          # Success!
        "fail": "detailer"   
    }
)

agent_executor = workflow.compile()