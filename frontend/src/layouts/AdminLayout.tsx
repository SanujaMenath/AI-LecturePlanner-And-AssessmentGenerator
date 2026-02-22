import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/admin/components/AdminSidebar";
import TopNav from "../components/ui/TopNav";
import Footer from "../components/ui/Footer";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <TopNav />

        <main className="p-6 flex-1">
          <Outlet />
        </main>
         <Footer />
      </div>
      
    </div>
  );
};

export default AdminLayout;
