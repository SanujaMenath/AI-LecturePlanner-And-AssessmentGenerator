from langchain_ollama import OllamaLLM
from app.graph.state import LMSState
import json 

llm = OllamaLLM(model="gemma3:4b", format="json")

async def detailer_node(state: LMSState):
    plan = state.get("lecture_plan", {})
    segments = plan.get("segments", [])
    audience = state.get("audience", "Undergraduate")
    
    detailed_agenda = []
    
    for segment in segments:
        name = segment.get("topic")
        mins = segment.get("duration_mins")
        
        # Better prompt to ensure the keys exist
        prompt = f"""
        Expand the topic '{name}' for {audience} level students.
        Duration: {mins} minutes.
        Return ONLY a JSON object with:
        "details": [a list of 3-5 bullet points],
        "concepts": [a list of 3 key terms]
        """
        
        raw_response = await llm.ainvoke(prompt)
        
        try:
            # Convert the string response to a Python Dictionary
            data = json.loads(raw_response)
        except json.JSONDecodeError:
            data = {"details": ["AI failed to generate details"], "concepts": []}
        
        detailed_agenda.append({
            "segment": name,
            "minutes": mins,
            "details": data.get("details", []),
            "key_concepts": data.get("concepts", [])
        })

    return {
        "lecture_plan": {
            "title": state["module_title"],
            "audience_level": audience,
            "duration_minutes": state["duration_hours"] * 60,
            "learning_objectives": ["Understand " + state["module_title"]],
            "prerequisites": [],
            "agenda": detailed_agenda,
            "key_concepts": [],
            "teaching_notes": [],
            "activity_exercise": {
                "name": "Class Activity", 
                "time_minutes": 15, 
                "steps": [], 
                "materials": [], 
                "expected_output": ""
            },
            "discussion_prompts": [],
            "knowledge_check": [],
            "homework_assignment": {
                "tasks": [], 
                "submission_format": "PDF", 
                "grading_criteria": []
            },
            "resources_optional": []
        }
    }