import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/pages/AdminDashboard";
import UsersPage from "../pages/admin/pages/UsersPage";
import LecturerLayout from "../layouts/LecturerLayout";
import StudentLayout from "../layouts/StudentLayout";
import LecturerDashboard from "../pages/lecturer/pages/LecturerDashboard";
import StudentDashboard from "../pages/student/pages/StudentDashboard";
import RegisterPage from "../pages/admin/pages/RegisterPage";
import ProfilePage from "../pages/profile/ProfilePage";
import CoursesPage from "../pages/course/CoursesPage";
import AboutPage from "../pages/AboutPage";
import MaterialManagement from "../pages/lecturer/pages/Material_Management";
import StudentCoursesPage from "../pages/student/pages/CoursesPage";
import StudentAssignmentsPage from "../pages/student/pages/AssignmentsPage";
import StudentGradesPage from "../pages/student/pages/GradesPage";
import AssessmentCreation from "../pages/lecturer/pages/AssessmentCreation";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="create-user" element={<RegisterPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="courses" element={<CoursesPage />} />
        </Route>

        <Route
          path="/lecturer"
          element={
            <ProtectedRoute role="lecturer">
              <LecturerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LecturerDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="materials" element={<MaterialManagement />} />
           <Route path="assessment-creation" element={<AssessmentCreation />} />
        </Route>

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="my-courses" element={<StudentCoursesPage />} />
          <Route path="assignments" element={<StudentAssignmentsPage />} />
          <Route path="grades" element={<StudentGradesPage />} />
        </Route>

        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
