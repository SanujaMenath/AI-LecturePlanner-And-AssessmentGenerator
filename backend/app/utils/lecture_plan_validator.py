def normalize_lecture_plan(data: dict) -> dict:
    for item in data.get("agenda", []):
        if isinstance(item.get("details"), str):
            item["details"] = [item["details"]]

    if isinstance(data.get("teaching_notes"), str):
        data["teaching_notes"] = [data["teaching_notes"]]

    if isinstance(data.get("activity_exercise"), list):
        data["activity_exercise"] = data["activity_exercise"][0]

    if isinstance(data.get("homework_assignment"), list):
        data["homework_assignment"] = data["homework_assignment"][0]

    return data
