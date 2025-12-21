import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersPage from "../pages/admin/UsersPage";
import LecturerLayout from "../layouts/LecturerLayout";
import StudentLayout from "../layouts/StudentLayout";
import LecturerDashboard from "../pages/lecturer/LecturerDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import RegisterPage from "../pages/admin/RegisterPage";
import ProfilePage from "../pages/profile/ProfilePage";
import CoursesPage from "../pages/course/CoursesPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

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
          <Route path="profile" element={<ProfilePage />}/>
          <Route path="courses" element={<CoursesPage />}/>
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
          <Route path="profile" element={<ProfilePage />}/>
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
          <Route path="profile" element={<ProfilePage />}/>
        </Route>

        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
