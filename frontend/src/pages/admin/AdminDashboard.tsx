import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  UserPlus,
  PlusCircle,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Students", value: 120, icon: <Users size={24} />, color: "bg-blue-50 text-blue-600", trend: "+12% this month" },
    { label: "Lecturers", value: 18, icon: <GraduationCap size={24} />, color: "bg-purple-50 text-purple-600", trend: "+2 new joined" },
    { label: "Courses", value: 32, icon: <BookOpen size={24} />, color: "bg-emerald-50 text-emerald-600", trend: "4 active tracks" },
    { label: "Departments", value: 6, icon: <Building2 size={24} />, color: "bg-orange-50 text-orange-600", trend: "All active" },
  ];

  const recentUsers = [
    { name: "Student A", role: "Student", email: "stud@gmail.com", status: "Active", time: "2h ago" },
    { name: "Lecturer One", role: "Lecturer", email: "lec@gmail.com", status: "Active", time: "4h ago" },
    { name: "Admin One", role: "Admin", email: "admin@gmail.com", status: "Online", time: "Now" },
  ];

  const quickActions = [
    { label: "Add User", icon: <UserPlus size={20} />, onClick: () => navigate("/admin/create-user"), description: "Register new students or staff" },
    { label: "Add Course", icon: <PlusCircle size={20} />, onClick: () => { }, description: "Create new learning modules" },
    { label: "Add Department", icon: <Building2 size={20} />, onClick: () => { }, description: "Configure academic units" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard size={24} className="text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-500 font-medium">
            Welcome back! Here's what's happening in your system today.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <Clock size={16} />
          <span>Last Updated: Jan 22, 22:52</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="card-hover group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${item.color} transition-transform group-hover:scale-110 duration-300`}>
                {item.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                {item.trend}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{item.label}</p>
            <p className="text-3xl font-bold mt-1 text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Users - Spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
              <button className="text-sm font-semibold text-primary hover:text-primary-600 transition flex items-center gap-1">
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentUsers.map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Online' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                        {user.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-primary/20 hover:bg-primary/5 transition text-left group"
                >
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition">
                    {action.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{action.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-2">System Insight</h2>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                AI-driven analysis shows a 15% increase in course engagement this week.
                Consider reviewing new department proposals.
              </p>
              <button className="mt-4 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition">
                View Full Report
              </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <GraduationCap size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
