import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Building2, UserPlus, Hash, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Department {
  _id?: string;
  id?: string;
  name: string;
  code: string;
}

const DepartmentEnrollmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await api.get("/departments");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        toast.error("Failed to load departments.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDeptId || !studentId.trim()) {
      toast.error("Please select a department and enter a valid Student ID.");
      return;
    }

    setIsEnrolling(true);
    try {
      // Calls your existing FastAPI route: @router.post("/{dept_id}/enroll/{student_id}")
      await api.post(`/departments/${selectedDeptId}/enroll/${studentId.trim()}`);
      toast.success("Student successfully enrolled in the department!");
      setStudentId(""); // Clear the input after success
    } catch {
      toast.error("Failed to enroll student. Please check the ID and try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading enrollment system...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-8">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <UserPlus size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Student Enrollment</h1>
          <p className="text-gray-500 font-medium mt-1">Assign students to their respective academic departments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Enrollment Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-primary" /> Assign Student
          </h2>

          <form onSubmit={handleEnroll} className="space-y-6">
            {/* Department Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                <Building2 size={16} className="text-gray-400" />
                Select Department
              </label>
              <div className="relative">
                <select
                  required
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none font-medium text-gray-700"
                >
                  <option value="" disabled>Choose a department...</option>
                  {departments.map((dept) => (
                    <option key={dept._id || dept.id} value={dept._id || dept.id}>
                      {dept.code} - {dept.name}
                    </option>
                  ))}
                </select>
                {/* Custom Dropdown Arrow to replace the default HTML one */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Student ID Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                <Hash size={16} className="text-gray-400" />
                Student ID
              </label>
              <input
                required
                type="text"
                placeholder="Enter MongoDB User ID of the student"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-mono placeholder:font-sans"
              />
              <p className="text-xs text-gray-400 font-medium ml-1 mt-1">
                Make sure the ID is exactly 24 characters long.
              </p>
            </div>

            <button
              type="submit"
              disabled={isEnrolling}
              className="w-full py-3.5 mt-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              {isEnrolling ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              {isEnrolling ? "Enrolling Student..." : "Confirm Enrollment"}
            </button>
          </form>
        </div>

        {/* Right Column: Instructions / Guidelines */}
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col justify-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
            <Building2 size={32} className="text-primary/40" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">How Enrollment Works</h3>
          <ul className="space-y-4 text-sm text-gray-600 font-medium">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary shrink-0 text-xs font-bold">1</span>
              Select the target department from the dropdown menu. This list is pulled dynamically from the database.
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary shrink-0 text-xs font-bold">2</span>
              Enter the student's unique Database ID (ObjectId).
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary shrink-0 text-xs font-bold">3</span>
              Click confirm. The student will be granted access to department-specific resources and courses.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DepartmentEnrollmentPage;