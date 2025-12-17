import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 shadow">
      <h1 className="text-xl font-bold text-primary">AI LMS</h1>

      <div className="flex items-center gap-4">
        <span onClick={() => navigate(user?.role === "admin" ? "/admin/profile" : user?.role === "lecturer" ? "/lecturer/profile" : "/student/profile")} className="text-gray-600 text-md font-medium">
          {user?.full_name}
        </span>

        <button
          onClick={logout}
          className="text-md font-medium text-red-500 hover:transition-colors hover:bg-red-500 hover:text-white px-3 py-1 rounded-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopNav;
