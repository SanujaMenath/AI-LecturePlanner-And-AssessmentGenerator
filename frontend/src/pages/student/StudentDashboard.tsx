const StudentDashboard = () => {
  const stats = [
    { label: "Enrolled Courses", value: 6 },
    { label: "Pending Assignments", value: 3 },
    { label: "Completed Assessments", value: 14 },
    { label: "Average Score", value: "82%" },
  ];

  const upcomingTasks = [
    { title: "AI Quiz", course: "AI Basics", due: "Tomorrow" },
    { title: "DSA Assignment", course: "DSA", due: "In 3 days" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Track your learning progress
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

      {/* Upcoming Tasks */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="pb-3">Task</th>
                <th className="pb-3">Course</th>
                <th className="pb-3">Due</th>
              </tr>
            </thead>
            <tbody>
              {upcomingTasks.map((task, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-3 font-medium">{task.title}</td>
                  <td className="py-3">{task.course}</td>
                  <td className="py-3 text-gray-600">{task.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Info */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Learning Progress</h2>
        <p className="text-gray-600 leading-relaxed">
          Keep completing assessments to improve your performance.
          Your progress and feedback are updated in real time.
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
