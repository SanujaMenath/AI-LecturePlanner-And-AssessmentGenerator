const AdminDashboard = () => {
  const stats = [
    { label: "Total Students", value: 120 },
    { label: "Lecturers", value: 18 },
    { label: "Courses", value: 32 },
    { label: "Departments", value: 6 }
  ]

  const recentUsers = [
    { name: "Student A", role: "Student", email: "stud@gmail.com" },
    { name: "Lecturer One", role: "Lecturer", email: "lec@gmail.com" },
    { name: "Admin One", role: "Admin", email: "admin@gmail.com" }
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of system activity and management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(item => (
          <div
            key={item.label}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <p className="text-gray-500 text-sm">{item.label}</p>
            <p className="text-3xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary px-5 py-2 rounded-lg">
            Create User
          </button>
          <button className="btn-secondary px-5 py-2 rounded-lg">
            Add Course
          </button>
          <button className="btn-secondary px-5 py-2 rounded-lg">
            Manage Departments
          </button>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="pb-3">Name</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-3 font-medium">{user.name}</td>
                  <td className="py-3">{user.role}</td>
                  <td className="py-3 text-gray-600">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">System Overview</h2>
        <p className="text-gray-600 leading-relaxed">
          This AI-driven LMS allows administrators to manage users,
          courses, departments, and academic workflows efficiently.
          Use the sidebar to navigate through admin features.
        </p>
      </div>
    </div>
  )
}

export default AdminDashboard
