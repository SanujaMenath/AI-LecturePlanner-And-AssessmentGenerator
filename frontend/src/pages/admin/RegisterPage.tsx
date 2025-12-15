import React, { useState } from "react";
import InputValue from "../../components/ui/InputValue";
import Button from "../../components/ui/Button";
import { createUserService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import type { CreateUserPayload, UserRole } from "../../types/user";

const RegisterPage: React.FC = () => {
  const { token, user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<UserRole>("admin");

  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  if (!user || user.role !== "admin") {
    return <p className="text-center mt-20">Access denied</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      alert("Required fields missing");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      alert("Weak password");
      return;
    }

    if (role === "admin" && password !== confirm) {
      alert("Password confirmation mismatch");
      return;
    }

    let payload: CreateUserPayload;

    if (role === "lecturer") {
      payload = {
        full_name: fullName,
        email,
        password,
        role,
        department,
        specialization,
      };
    } else if (role === "student") {
      payload = {
        full_name: fullName,
        email,
        password,
        role,
        department,
        year: Number(year),
        semester: Number(semester),
      };
    } else {
      payload = {
        full_name: fullName,
        email,
        password,
        role: "admin",
      };
    }

    try {
      await createUserService(payload, token!);
      alert("User created successfully");

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirm("");
      setDepartment("");
      setSpecialization("");
      setYear("");
      setSemester("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Creation failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white px-8 py-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center gradient-text">
          Create User
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputValue
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <InputValue
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputValue
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {role === "admin" && (
            <InputValue
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          )}

          <div>
            <label className="font-medium">Role</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="admin">Admin</option>
              <option value="lecturer">Lecturer</option>
              <option value="student">Student</option>
            </select>
          </div>

          {role === "lecturer" && (
            <>
              <InputValue
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <InputValue
                label="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </>
          )}

          {role === "student" && (
            <>
              <InputValue
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <InputValue
                label="Year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />

              <InputValue
                label="Semester"
                type="number"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </>
          )}

          <Button type="submit" className="btn-accent w-full mt-4">
            Create User
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
