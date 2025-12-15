import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

        <nav className="space-y-4">
          <button className="block w-full text-left">Dashboard</button>
          <button className="block w-full text-left">Users</button>
          <button className="block w-full text-left">Courses</button>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="flex justify-between items-center bg-white p-4 shadow">
          <span className="font-medium">Welcome {user?.full_name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 border-2 border-red-500 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
          >
            Logout
          </button>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
