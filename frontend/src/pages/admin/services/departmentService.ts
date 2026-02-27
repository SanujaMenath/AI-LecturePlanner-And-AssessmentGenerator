// src/services/departmentService.ts
import api from "../../../services/api";

export interface Department {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  faculty: string;
  description: string;
}

export type DepartmentCreate = Omit<Department, '_id' | 'id'>; 

export const fetchDepartments = async (): Promise<Department[]> => {
  const res = await api.get("/departments");
  return Array.isArray(res.data) ? res.data : res.data.data || [];
};

export const createDepartment = async (data: DepartmentCreate) => {
  const res = await api.post("/departments", data);
  return res.data;
};

export const updateDepartment = async (id: string, data: Partial<DepartmentCreate>) => {
  const res = await api.put(`/departments/${id}`, data);
  return res.data;
};

export const deleteDepartment = async (id: string) => {
  const res = await api.delete(`/departments/${id}`);
  return res.data;
};