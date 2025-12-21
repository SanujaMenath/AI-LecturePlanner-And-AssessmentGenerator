from pydantic import BaseModel
from typing import List


class AgendaItem(BaseModel):
    minutes: int
    segment: str
    details: List[str]


class ActivityExercise(BaseModel):
    name: str
    time_minutes: int
    steps: List[str]
    materials: List[str]
    expected_output: str


class KnowledgeCheck(BaseModel):
    question: str
    answer_key: str


class HomeworkAssignment(BaseModel):
    tasks: List[str]
    submission_format: str
    grading_criteria: List[str]


class LecturePlanSchema(BaseModel):
    title: str
    audience_level: str
    duration_minutes: int
    learning_objectives: List[str]
    prerequisites: List[str]
    agenda: List[AgendaItem]
    key_concepts: List[str]
    teaching_notes: List[str]
    activity_exercise: ActivityExercise
    discussion_prompts: List[str]
    knowledge_check: List[KnowledgeCheck]
    homework_assignment: HomeworkAssignment
    resources_optional: List[str]
