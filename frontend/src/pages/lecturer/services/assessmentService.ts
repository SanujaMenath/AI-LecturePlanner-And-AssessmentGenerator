import api from "../../../services/api";

export const createAssessmentService = async (formData: FormData, lecturerId: string) => {
  const res = await api.post(`/assessments/?lecturer_id=${lecturerId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};