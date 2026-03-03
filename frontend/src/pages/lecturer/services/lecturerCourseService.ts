import api from "../../../services/api";

export type LecturerCourse = {
  id: string;
  course_id: string;
  course_code: string;
  course_name: string;
  department: string;
  credits: number;
  semester: number;
  enrolled_students?: number;
};

export const fetchLecturerCourses = async (): Promise<LecturerCourse[]> => {
  const res = await api.get<LecturerCourse[]>("/courses/me");
  return res.data;
};