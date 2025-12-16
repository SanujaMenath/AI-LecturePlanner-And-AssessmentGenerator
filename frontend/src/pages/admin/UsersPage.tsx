const UsersPage = () => {
  const users = [
    { name: "Admin One", role: "admin", email: "admin@test.com" },
    { name: "Sanuja", role: "lecturer", email: "lec@test.com" },
    { name: "Student A", role: "student", email: "stud@test.com" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Users</h2>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-3 font-medium">{u.name}</td>
                <td className="py-3 capitalize">{u.role}</td>
                <td className="py-3 text-gray-600">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
