import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";

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
        </Route>

        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
