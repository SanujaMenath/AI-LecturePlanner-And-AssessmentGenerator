import subprocess
import json

MODEL_NAME = "gemma3:1b"

PROMPT_TEMPLATE = """
You are an academic content generator.

Generate ONLY a lecture plan.
Do NOT generate quizzes or extra explanations outside the schema.

CRITICAL RULES:
- Output MUST be valid JSON only
- Follow the schema EXACTLY
- agenda.details MUST be an array of strings
- teaching_notes MUST be an array
- Use plain double quotes only
- No text before or after JSON

JSON SCHEMA:
{
"title": "",
"audience_level": "",
"duration_minutes": 0,
"learning_objectives": [],
"prerequisites": [],
"agenda": [
{ "minutes": 0, "segment": "", "details": [] }
],
"key_concepts": [],
"teaching_notes": [],
"activity_exercise": {
"name": "",
"time_minutes": 0,
"steps": [],
"materials": [],
"expected_output": ""
},
"discussion_prompts": [],
"knowledge_check": [
{ "question": "", "answer_key": "" }
],
"homework_assignment": {
"tasks": [],
"submission_format": "",
"grading_criteria": []
},
"resources_optional": []
}

Lecture topic: {topic}
Audience level: {audience}
Duration: {duration} minutes
"""

def call_ollama(topic: str, audience: str, duration: int) -> dict:
    prompt = PROMPT_TEMPLATE.format(
        topic=topic,
        audience=audience,
        duration=duration
    )

    result = subprocess.run(
        ["ollama", "run", MODEL_NAME],
        input=prompt,
        text=True,
        capture_output=True
    )
    import sys

    sys.stderr.write("\n--- OLLAMA RAW OUTPUT ---\n")
    sys.stderr.write(result.stdout)
    sys.stderr.write("\n------------------------\n")
    sys.stderr.flush()

    sys.stderr.write("\n--- OLLAMA STDERR ---\n")
    sys.stderr.write(result.stderr or "NO STDERR")
    sys.stderr.write("\n--------------------\n")


    return json.loads(result.stdout)
