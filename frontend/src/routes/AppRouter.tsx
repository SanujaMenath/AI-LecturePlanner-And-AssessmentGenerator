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
          <Route path="users" element={<UsersPage />} />
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
        </Route>

        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
