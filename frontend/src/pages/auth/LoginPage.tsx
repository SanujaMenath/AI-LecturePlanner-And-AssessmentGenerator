import React, { useState } from "react";
import InputValue from "../../components/ui/InputValue";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      toast.success(`Welcome back, ${loggedUser.full_name}!`);
      if (loggedUser.role === "admin") {
        navigate("/admin");
      } else if (loggedUser.role === "lecturer") {
        navigate("/lecturer");
      } else if (loggedUser.role === "student") {
        navigate("/student");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Branding/Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 text-white p-12 max-w-lg">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Master Your Learning Journey
          </h2>
          <p className="text-xl text-primary-100 mb-8 font-light">
            Welcome back! Access your courses, track your progress, and connect with your mentors in one powerful platform.
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-primary-400 flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-primary-100">Joined by 1,000+ students this month</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <h1 className="text-3xl font-bold gradient-text">LMS</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-gray-500">Please enter your details to sign in to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputValue
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="space-y-1">
              <InputValue
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end">
                <a href="#" className="text-sm font-medium text-primary hover:text-primary-600 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="btn-primary w-full py-4 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
