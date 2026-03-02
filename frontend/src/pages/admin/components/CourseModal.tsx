import { useState, useEffect } from "react";
import { createCourse, updateCourse } from "../services/courseService";
import type { Department, Lecturer, Course } from "../services/courseService";
import api from "../../../services/api";
import Button from "../../../components/ui/Button";
import { BookOpen, Code, Plus, Sparkles, Hash, CalendarDays, Layers, UserCircle, Loader2, X, Edit2 } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = { 
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  initialData?: Course | null;
};

const CourseModal = ({ isOpen, onClose, onSuccess, initialData }: Props) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState<number>(3);
  const [semester, setSemester] = useState<number>(1);
  const [department, setDepartment] = useState("");
  const [lecturerId, setLecturerId] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchingDependencies, setFetchingDependencies] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  // Pre-fill form if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name ||  "");
      setCode(initialData.code ||  "");
      setCredits(initialData.credits || 3);
      setSemester(initialData.semester || 1);
      setDepartment(initialData.department || "");
      setLecturerId(initialData.lecturerId ||  "");
    } else {
      // Reset if creating new
      setName("");
      setCode("");
      setCredits(3);
      setSemester(1);
      setDepartment("");
      setLecturerId("");
    }
  }, [initialData, isOpen]);

  // Fetch Departments and Lecturers
  useEffect(() => {
    if (!isOpen) return; // Only fetch when modal opens

    const loadDependencies = async () => {
      try {
        setFetchingDependencies(true);
        const [deptRes, userRes] = await Promise.all([
          api.get("/departments"),
          api.get("/users") 
        ]);

        const deptsData = Array.isArray(deptRes.data) ? deptRes.data : deptRes.data.data || [];
        setDepartments(deptsData);

        const usersData = Array.isArray(userRes.data) ? userRes.data : userRes.data.data || [];
        setLecturers(usersData.filter((u: Lecturer) => u.role === "lecturer"));
      } catch (error) {
        console.error("Failed to load form dependencies", error);
        toast.error("Could not load departments or lecturers.");
      } finally {
        setFetchingDependencies(false);
      }
    };

    loadDependencies();
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { name, code, credits: Number(credits), semester: Number(semester), department, lecturerId };
    
    try {
      if (initialData && (initialData._id || initialData.id)) {
        await updateCourse(initialData._id || initialData.id as string, payload);
        toast.success("Course updated successfully!");
      } else {
        await createCourse(payload);
        toast.success("Course created successfully!");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error( "Failed to save course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-xl border border-gray-100 animate-in zoom-in-95 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <X size={20} />
        </button>

        {fetchingDependencies && (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <p className="text-sm font-bold text-gray-500">Loading form data...</p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            {initialData ? <Edit2 size={24} /> : <Plus size={24} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "Update Course" : "Create New Course"}
            </h2>
            <p className="text-sm text-gray-500 font-medium">Define academic module details below</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form Fields (Same as you wrote, just adapted the layout slightly) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <BookOpen size={14} className="text-gray-400" /> Course Name
              </label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <Code size={14} className="text-gray-400" /> Course Code
              </label>
              <input value={code} onChange={(e) => setCode(e.target.value)} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <Hash size={14} className="text-gray-400" /> Credits
              </label>
              <input type="number" min="1" max="10" value={credits} onChange={(e) => setCredits(Number(e.target.value))} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <CalendarDays size={14} className="text-gray-400" /> Semester
              </label>
              <select value={semester} onChange={(e) => setSemester(Number(e.target.value))} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium appearance-none cursor-pointer">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <Layers size={14} className="text-gray-400" /> Department Name
              </label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium appearance-none cursor-pointer">
                <option value="" disabled>Select Department...</option>
                {departments.map((dept) => (
                  <option key={dept._id || dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <UserCircle size={14} className="text-gray-400" /> Assign Lecturer
              </label>
              <select value={lecturerId} onChange={(e) => setLecturerId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium appearance-none cursor-pointer">
                <option value="">No Lecturer Assigned (TBA)</option>
                {lecturers.map((lec) => (
                  <option key={lec._id || lec.id} value={lec._id || lec.id}>{lec.full_name || lec.email}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex gap-4 justify-end">
            <button type="button" onClick={onClose} className="px-6 w-1/2 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
              Cancel
            </button>
            <Button type="submit" loading={loading} disabled={fetchingDependencies} className=" w-1/2">
              {!loading && <Sparkles size={18} className="mr-1.5" />}
              {loading ? "Saving..." : (initialData ? "Save Changes" : "Create Course")}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CourseModal;