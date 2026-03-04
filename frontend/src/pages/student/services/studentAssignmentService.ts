import api from "../../../services/api";
import { fetchEnrolledCourses } from "./CourseService";

export interface BackendAssessment {
  _id?: string; 
  id?: string;
  title: string;
  course_id: string;
  assessment_type: string;
  due_date: string;
  total_marks: number;
  content?: string; 
  file_url?: string;
}

export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'overdue';

export interface Assignment {
  id: string;
  title: string;
  courseName: string;
  courseCode: string;
  dueDate: string;
  status: AssignmentStatus;
  score?: number;
  maxScore: number;
}

export interface BackendSubmission {
  id: string;
  assessment_id: string;
  student_id: string;
  status: 'submitted' | 'graded';
  score?: number;
  file_url?: string;
  answers?: Record<string, number>;
}

export const fetchStudentAssignments = async (studentId: string): Promise<Assignment[]> => {

  const courses = await fetchEnrolledCourses(studentId);
  const subRes = await api.get<BackendSubmission[]>(`/assessments/submissions/student/${studentId}`);
  const studentSubmissions = subRes.data;
  const assignmentPromises = courses.map(async (course) => {
    try {
      const res = await api.get<BackendAssessment[]>(`/assessments/?course_id=${course.id}`);
      const courseAssessments = res.data;

      return courseAssessments.map(assessment => {
        const realId = assessment.id || assessment._id || "";
        const mySubmission = studentSubmissions.find(sub => sub.assessment_id === realId);

        let currentStatus: AssignmentStatus = 'pending';
        let currentScore: number | undefined = undefined;

        if (mySubmission) {
          currentStatus = mySubmission.status;
          currentScore = mySubmission.score;
        } else {

          const isOverdue = new Date(assessment.due_date) < new Date();
          currentStatus = isOverdue ? 'overdue' : 'pending';
        }

        return {
          id: realId,
          title: assessment.title,
          courseName: course.name,
          courseCode: course.code,
          dueDate: assessment.due_date,
          status: currentStatus,       
          score: currentScore,        
          maxScore: assessment.total_marks || 100,
        } as Assignment;
      });
    } catch (error) {
      console.error(`Failed to fetch assessments for course ${course.id}`, error);
      return [];
    }
  });

  const nestedAssignments = await Promise.all(assignmentPromises);
  const allAssignments = nestedAssignments.flat();
  
  return allAssignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};


export const fetchAssessmentById = async (id: string): Promise<BackendAssessment> => {
  const res = await api.get<BackendAssessment>(`/assessments/${id}`);
  return res.data;
};


export const submitAssessmentService = async (assignmentId: string, studentId: string, payload: FormData) => {
  const res = await api.post(`/assessments/${assignmentId}/submit?student_id=${studentId}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetchSingleSubmission = async (assessmentId: string, studentId: string): Promise<BackendSubmission | null> => {
  const res = await api.get(`/assessments/${assessmentId}/submission/student/${studentId}`);
  return res.data; 
};