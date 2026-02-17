import { useEffect, useState } from "react";
import { type UserDTO } from "../../types/user";
import { getUsersService } from "../../services/userService";
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Shield,
  Filter,
  MoreVertical,
  ChevronRight,
  User as UserIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsersService();
        setUsers(data);
      } catch {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Fetching users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col items-center gap-4 text-center">
        <div className="p-3 bg-red-100 rounded-xl text-red-600">
          <Shield size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-900">Oops! Something went wrong</h3>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Users Management</h1>
            <p className="text-gray-500 font-medium mt-1">
              View and manage all registered accounts in the system
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/create-user")}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
        >
          <UserPlus size={20} />
          Add New User
        </button>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 shadow-sm transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                <th className="px-8 py-5">Identities</th>
                <th className="px-8 py-5 text-center">Current Role</th>
                <th className="px-8 py-5">Security Level</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-gray-50/50 transition-all duration-200">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center font-extrabold text-gray-400 shadow-inner group-hover:from-primary/10 group-hover:to-primary/5 group-hover:text-primary transition-all duration-300">
                          {u.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                            {u.full_name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-gray-500 font-medium text-xs">
                            <Mail size={12} className="opacity-60" />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider ${u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200/50'
                            : u.role === 'lecturer'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200/50'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200/50'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${u.role === 'admin' ? 'bg-purple-500' : u.role === 'lecturer' ? 'bg-blue-500' : 'bg-emerald-500'
                            }`} />
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className={`
                          ${u.role === 'admin' ? 'text-purple-400' : u.role === 'lecturer' ? 'text-blue-400' : 'text-emerald-400'}
                        `} />
                        <span className="text-sm font-bold text-gray-600">Standard Access</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group/btn mx-1">
                        <MoreVertical size={18} />
                      </button>
                      <button className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group/btn">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-400 font-bold">
                      <div className="p-6 bg-gray-50 rounded-full border border-gray-100">
                        <UserIcon size={48} className="opacity-20" />
                      </div>
                      <p>No users found matching your search</p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-primary hover:underline text-sm font-extrabold uppercase tracking-widest"
                      >
                        Clear Search
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Simplified Pagination Placeholder */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-bold">{filteredUsers.length}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold text-gray-400 cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
