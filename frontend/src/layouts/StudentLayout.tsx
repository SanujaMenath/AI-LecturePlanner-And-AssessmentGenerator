import { Outlet } from "react-router-dom";
import StudentSidebar from "../pages/student/components/StudentSidebar";
import TopNav from "../components/ui/TopNav";
import Footer from "../components/ui/Footer";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />

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

export default StudentLayout;
