import json
from langchain_ollama import OllamaLLM
from .state import LMSState

# Initialize Gemma 3 via Ollama
llm = OllamaLLM(model="gemma3:4b", format="json")

def planner_node(state: LMSState):
    """Generates the initial high-level lecture structure."""
    
    prompt = f"""
    Act as an Academic Planner. Create a JSON lecture plan for:
    Topic: {state['module_title']}
    Audience: {state['audience']}
    Total Time: {state['duration_hours']} hours
    
    Return a JSON object with:
    - title (string)
    - total_minutes (int)
    - segments (list of objects with 'topic' and 'duration_mins')
    """
    
    try:
        response = llm.invoke(prompt)
        plan_data = json.loads(response)
        return {"lecture_plan": plan_data}
    except Exception as e:
        return {"error_log": [f"Planner failed: {str(e)}"]}