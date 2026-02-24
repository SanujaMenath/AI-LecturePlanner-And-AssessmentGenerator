import api from "./api";

export type Course = {
  id: string;
  name: string;
  code: string;
  isEnrolled?: boolean;
  lecturerId?: string; //for admin/lecturer display
};

export type Lecturer = {
  id: string;
  name: string;
};

export type CreateCoursePayload = {
  name: string;
  code: string;
};

// Types for internal API mapping
type CourseApi = {
  id: string;
  course_name: string;
  course_code: string;
  is_enrolled?: boolean;
  lecturer_id?: string;
};

// Get courses for current user
export const getCourses = async (): Promise<Course[]> => {
  const res = await api.get<CourseApi[]>("/courses/me");
  return res.data.map((c) => ({
    id: c.id,
    name: c.course_name,
    code: c.course_code,
    isEnrolled: c.is_enrolled,
    lecturerId: c.lecturer_id,
  }));
};

// Create a new course
export const createCourse = (payload: CreateCoursePayload) =>
  api.post("/courses", {
    course_name: payload.name,
    course_code: payload.code,
  });

// Update course by ID
export const updateCourse = (id: string, payload: CreateCoursePayload) =>
  api.put(`/courses/${id}`, {
    course_name: payload.name,
    course_code: payload.code,
  });

// Delete course by ID
export const deleteCourse = (id: string) => api.delete(`/courses/${id}`);

// Enroll logged-in student
export const enrollCourse = (courseId: string) =>
  api.post(`/courses/${courseId}/enroll`);

// Assign lecturer (admin only)
export const assignLecturer = (courseId: string, lecturerId: string) =>
  api.post(`/courses/${courseId}/assign-lecturer`, { lecturer_id: lecturerId });

// Optional: fetch all lecturers for dropdown
export const getLecturers = async (): Promise<Lecturer[]> => {
  const res = await api.get("/lecturers");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.data.map((l: any) => ({ id: l.id, name: l.name }));
};


