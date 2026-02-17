import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
  User as UserIcon
} from "lucide-react";

const TopNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md h-20 shadow-sm border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md relative group">
        {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search courses, users, or reports..."
          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all font-medium"
        /> */}
      </div>

      {/* Right: Actions and Profile */}
      <div className="flex items-center gap-6">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
          <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* User Profile Dropdown Placeholder */}
        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div
            onClick={() => navigate(user?.role === "admin" ? "/admin/profile" : user?.role === "lecturer" ? "/lecturer/profile" : "/student/profile")}
            className="flex flex-col items-end"
          >
            <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
              {user?.full_name || "Guest User"}
            </p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">
              {user?.role || "Visitor"}
            </p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner group-hover:bg-primary/20 transition-colors">
              <UserIcon size={20} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-y-0.5" />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
