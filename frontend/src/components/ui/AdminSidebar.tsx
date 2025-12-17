import { NavLink } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/admin" },
  { label: "Profile", to: "/admin/profile" },
  { label: "Users", to: "/admin/users" },
  { label: "Courses", to: "/admin/courses" },
  { label: "Departments", to: "/admin/departments" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-500 min-h-screen sticky top-0">
       <div className="p-4 h-16  border-b-gray-200  shadow">
        <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
      </div>
      <nav className="p-4 space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
