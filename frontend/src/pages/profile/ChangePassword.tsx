import { useState } from "react";
import { changePassword } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const ChangePassword = () => {
  const { logout } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) return alert("Passwords do not match");

    setLoading(true);
    try {
      await changePassword({
        current_password: current,
        new_password: next,
      });
      alert("Password changed. Login again");
      logout();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Password change failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Security Settings</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Enter current password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="New password"
              value={next}
              onChange={e => setNext(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              required
            />
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="mt-6 w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default ChangePassword;