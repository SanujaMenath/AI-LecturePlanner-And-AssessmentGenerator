import { useState } from "react";
import { changePassword } from "../admin/services/userService";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import { Lock, Shield, Eye, EyeOff, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
  const { logout } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        current_password: current,
        new_password: next,
      });
      toast.success("Password updated successfully. Please login again.");
      logout();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Password change failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card-hover">
      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-50">
        <Shield size={20} className="text-primary" />
        <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
            <Lock size={14} className="text-gray-400" />
            Current Password
          </label>
          <div className="relative group">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium placeholder:text-gray-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
              <RefreshCcw size={14} className="text-gray-400" />
              New Password
            </label>
            <div className="relative group">
              <input
                type={showNext ? "text" : "password"}
                placeholder="New password"
                value={next}
                onChange={e => setNext(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium placeholder:text-gray-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowNext(!showNext)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNext ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
              <Shield size={14} className="text-gray-400" />
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium placeholder:text-gray-300"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50">
        <Button
          type="submit"
          loading={loading}
          className="bg-gray-900 shadow-lg shadow-gray-200 hover:bg-black"
        >
          {!loading && <Lock size={18} className="mr-1" />}
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePassword;
