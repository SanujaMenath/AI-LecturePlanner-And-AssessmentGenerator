const LecturerDashboard = () => {
  const stats = [
    { label: "My Courses", value: 5 },
    { label: "Active Students", value: 240 },
    { label: "Pending Reviews", value: 12 },
    { label: "Published Assessments", value: 18 },
  ];

  const recentActivities = [
    { title: "AI Quiz created", course: "AI Basics" },
    { title: "Assignment graded", course: "DSA" },
    { title: "New submission", course: "Web Dev" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage your courses and assessments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(item => (
          <div
            key={item.label}
            className="bg-white p-6 rounded-xl shadow"
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
            Create Assessment
          </button>
          <button className="btn-secondary px-5 py-2 rounded-lg">
            Upload Material
          </button>
          <button className="btn-secondary px-5 py-2 rounded-lg">
            View Submissions
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          {recentActivities.map((a, i) => (
            <li
              key={i}
              className="flex justify-between text-sm text-gray-700"
            >
              <span>{a.title}</span>
              <span className="text-gray-400">{a.course}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LecturerDashboard;
