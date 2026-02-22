from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.material import MaterialCreate, MaterialUpdate, MaterialResponse
from app.services.material_service import MaterialService

router = APIRouter(prefix="/materials", tags=["Materials"])

@router.post("/", response_model=MaterialResponse)
def create_material(data: MaterialCreate, lecturer_id: str):
    # Usually, lecturer_id would come from a JWT token/Auth dependency
    try:
        return MaterialService.create_material(data, lecturer_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/course/{course_id}", response_model=List[MaterialResponse])
def get_materials_by_course(course_id: str):
    return MaterialService.get_by_course(course_id)

@router.get("/{material_id}", response_model=MaterialResponse)
def get_one(material_id: str):
    material = MaterialService.get_by_id(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material

@router.put("/{material_id}", response_model=MaterialResponse)
def update_material(material_id: str, data: MaterialUpdate):
    updated = MaterialService.update(material_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Material not found")
    return updated

@router.delete("/{material_id}")
def delete_material(material_id: str):
    MaterialService.delete(material_id)
    return {"message": "Material deleted successfully"}