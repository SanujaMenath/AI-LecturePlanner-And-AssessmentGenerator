from pydantic import BaseModel
from typing import Optional

class Timetable(BaseModel):
    timetable_id: Optional[str]
    module_id: str
    lecturer_id: str
    start_time: str
    end_time: str
    room: Optional[str]
    day_of_week: str
