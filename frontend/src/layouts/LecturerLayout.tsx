import { Outlet } from "react-router-dom";
import LecturerSidebar from "../pages/lecturer/components/LecturerSidebar";
import TopNav from "../components/ui/TopNav";
import Footer from "../components/ui/Footer";

const LecturerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <LecturerSidebar />

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

export default LecturerLayout;
