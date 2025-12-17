import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/userService";
import ChangePassword from "./ChangePassword";

const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ full_name: name });
      alert("Profile updated");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Profile update failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-2">Manage your profile and security preferences</p>
        </div>

        <div className="grid xl:grid-cols-2 gap-8">
          {/* Profile Information */}
          <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Profile Information</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address
                </label>
                <input
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="mt-6 w-full px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* Change Password */}
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;