import { NavLink } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/lecturer" },
  { label: "My Courses", to: "/lecturer/courses" },
  { label: "Assessments", to: "/lecturer/assessments" },
  { label: "Students", to: "/lecturer/students" },
];

const LecturerSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-primary">Lecturer Panel</h1>
      </div>

      <nav className="p-4 space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium
              ${
                isActive
                  ? "bg-primary/10 text-primary"
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

export default LecturerSidebar;
