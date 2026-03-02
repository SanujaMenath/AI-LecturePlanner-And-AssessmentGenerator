import api from "../../../services/api";

export interface DashboardStats {
  students: number;
  lecturers: number;
  courses: number;
  departments: number;
}

export interface RecentUser {
  id?: string;
  _id?: string;
  full_name: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface AdminDashboardData {
  stats: DashboardStats;
  recentUsers: RecentUser[];
}

export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  // Fetch everything concurrently, strictly typing the users response
  const [usersRes, coursesRes, deptsRes] = await Promise.all([
    api.get<{ data?: RecentUser[] } | RecentUser[]>("/users?limit=1000"),
    api.get("/courses"),
    api.get("/departments")
  ]);

  // Safely extract arrays and type 'users' as an array of RecentUser
  const users: RecentUser[] = Array.isArray(usersRes.data) 
    ? usersRes.data 
    : (usersRes.data && !Array.isArray(usersRes.data) ? usersRes.data.data : []) || [];
    
  const courses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.data || [];
  const depts = Array.isArray(deptsRes.data) ? deptsRes.data : deptsRes.data.data || [];

  // Look ma, no 'any'! TypeScript automatically infers that 'u' is a RecentUser.
  const studentsCount = users.filter((u) => u.role === "student").length;
  const lecturersCount = users.filter((u) => u.role === "lecturer").length;

  // TypeScript also infers 'a' and 'b' are RecentUsers.
  const sortedUsers = [...users].sort((a, b) => {
    // Adding a fallback to 0 just in case a user is missing the created_at field
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });

  return {
    stats: {
      students: studentsCount,
      lecturers: lecturersCount,
      courses: courses.length,
      departments: depts.length
    },
    recentUsers: sortedUsers.slice(0, 5)
  };
};