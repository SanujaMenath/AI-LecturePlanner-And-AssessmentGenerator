

export interface StatsResponse {
  students: number;
  lecturers: number;
  courses: number;
  departments: number;
}

export interface UserResponse {
  name: string;
  role: "admin" | "lecturer" | "student";
  email: string;
}

export const getDashboardStats = async (token: string): Promise<StatsResponse> => {
  const response = await fetch("/api/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}