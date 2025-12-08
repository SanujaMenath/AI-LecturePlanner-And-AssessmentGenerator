# backend/app/routes/topic_routes.py
from fastapi import APIRouter, Depends, Path, Query, HTTPException, status
from typing import List, Optional
from app.models.topic import TopicCreate, TopicUpdate, TopicResponse
from app.services.topic_service import TopicService
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.post("/", response_model=TopicResponse)
def create_topic(payload: TopicCreate, current_user = Depends(get_current_user)):
    # admin or lecturer allowed
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return TopicService.create_topic(payload)

@router.get("/", response_model=List[TopicResponse])
def list_topics(module_id: Optional[str] = Query(None), skip: int = Query(0), limit: int = Query(100)):
    return TopicService.list_topics(module_id=module_id, skip=skip, limit=limit)

@router.get("/{topic_id}", response_model=TopicResponse)
def get_topic(topic_id: str = Path(...)):
    return TopicService.get_topic(topic_id)

@router.put("/{topic_id}", response_model=TopicResponse)
def update_topic(topic_id: str, payload: TopicUpdate, current_user = Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return TopicService.update_topic(topic_id, payload)

@router.delete("/{topic_id}")
def delete_topic(topic_id: str, current_user = Depends(get_current_user)):
    if current_user["role"] not in ("admin", "lecturer"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Lecturer only")
    return TopicService.delete_topic(topic_id)

# convenience: topics for module
@router.get("/module/{module_id}", response_model=List[TopicResponse])
def topics_for_module(module_id: str):
    return TopicService.list_topics(module_id=module_id)
