from typing import TypedDict, List, Optional

class LMSState(TypedDict):
    module_title: str
    audience: str
    duration_hours: int
    lecture_plan: Optional[dict]
    error_log: List[str]