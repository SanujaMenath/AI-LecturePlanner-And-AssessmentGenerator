import { useAuth } from "../../context/AuthContext";

const TopNav = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 shadow">
      <h1 className="text-xl font-bold text-primary">AI LMS</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">
          {user?.full_name}
        </span>

        <button
          onClick={logout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopNav;
