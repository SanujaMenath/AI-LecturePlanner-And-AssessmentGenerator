import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../admin/services/userService";
import ChangePassword from "./ChangePassword";
import Button from "../../components/ui/Button";
import { User, Mail, Settings, ShieldCheck, Save, PenLine } from "lucide-react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ full_name: name });
      toast.success("Profile updated successfully!");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Profile update failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Settings size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your account details and security preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={submit} className="card-hover">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-50">
              <User size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                  <Mail size={14} className="text-gray-400" />
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed font-medium transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-gray-200/50 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                    Locked
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 font-medium italic ml-1">* Email address is used for authentication</p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                  <PenLine size={14} className="text-gray-400" />
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <ShieldCheck size={14} />
                Information is securely encrypted
              </div>
              <Button
                type="submit"
                loading={loading}
                className="max-w-[200px] shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                {!loading && <Save size={18} className="mr-1" />}
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          {/* Additional Info Cards if needed */}
        </div>

        {/* Right Column: Security/Password */}
        <div className="space-y-8 h-full">
          <ChangePassword />

          <div className="bg-indigo-600 p-8 rounded-2xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <ShieldCheck size={20} />
                Security Pulse
              </h2>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-90 font-medium">
                Your account security is
                <span className="text-white font-extrabold mx-1">Excellent</span>.
                Regularly updating your password keeps your AI insights safe.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                </div>
                <span className="text-xs font-bold">85%</span>
              </div>
            </div>
            <PenLine size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
