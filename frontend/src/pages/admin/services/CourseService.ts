import api from "../../../services/api";

export interface CreateCoursePayload {
  name: string;
  code: string;
  credits: number;
  semester: number;
  department: string;
  lecturerId?: string;
}

export interface BackendCourseResponse {
  id?: string;
  _id?: string;
  course_name?: string;
  name?: string;
  course_code?: string;
  code?: string;
  credits?: number;
  semester?: number;
  department?: string;
  lecturer_id?: string;
  lecturerId?: string;
}

export interface Course extends CreateCoursePayload {
  _id?: string;
  id?: string;
  lecturerName?: string; // Optional: If backend returns joined name
}

export type Department = { _id?: string; id?: string; name: string; code?: string; };
export type Lecturer = { _id?: string; id?: string; full_name?: string; email?: string; role: string; };

export const getAllCourses = async (): Promise<Course[]> => {
  const res = await api.get('/courses');
  const data = Array.isArray(res.data) ? res.data : res.data.data || [];
  
  return data.map((c: BackendCourseResponse) => ({
    _id: c.id || c._id, 
    id: c.id || c._id,
    name: c.course_name || c.name || "Untitled Course",
    code: c.course_code || c.code || "N/A",
    credits: c.credits || 0,
    semester: c.semester || 1,
    department: c.department || "",
    lecturerId: c.lecturer_id || c.lecturerId || ""
  }));
};

export const createCourse = async (data: CreateCoursePayload) => {
  const payload = {
    course_name: data.name,
    course_code: data.code,
    credits: data.credits,
    semester: data.semester,
    department: data.department,
    lecturer_id: data.lecturerId || undefined,
  };
  const res = await api.post('/courses', payload);
  return res.data;
};

export const updateCourse = async (id: string, data: CreateCoursePayload) => {
  const payload = {
    course_name: data.name,
    course_code: data.code,
    credits: data.credits,
    semester: data.semester,
    department: data.department,
    lecturer_id: data.lecturerId || undefined,
  };
  const res = await api.put(`/courses/${id}`, payload);
  return res.data;
};

export const deleteCourse = async (id: string) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};