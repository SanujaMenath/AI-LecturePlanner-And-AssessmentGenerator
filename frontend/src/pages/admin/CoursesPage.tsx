// src/pages/admin/CoursesPage.tsx
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Code,
  Layers,
  CalendarDays,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getAllCourses, deleteCourse } from "./services/courseService";
import type { Course, Department } from "./services/courseService";
import CourseModal from "./components/CourseModal";
import api from "../../services/api";

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  // We will store departments as a map of { [id]: "Department Name" } for ultra-fast lookups
  const [departmentMap, setDepartmentMap] = useState<Record<string, string>>(
    {},
  );

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [coursesData, deptsRes] = await Promise.all([
        getAllCourses(),

        api.get<{ data?: Department[] } | Department[]>("/departments"),
      ]);

      const rawDepts: Department[] = Array.isArray(deptsRes.data)
        ? deptsRes.data
        : (deptsRes.data && !Array.isArray(deptsRes.data)
            ? deptsRes.data.data
            : []) || [];

      const deptMap: Record<string, string> = {};

      rawDepts.forEach((d) => {
        const id = d._id || d.id;
        if (id) deptMap[id] = d.name;
      });

      setDepartmentMap(deptMap);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load courses or departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateNew = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        toast.success("Course deleted successfully.");
        loadAllData(); 
      } catch {
        toast.error("Failed to delete course.");
      }
    }
  };

  // Helper to get the department name
  const getDepartmentName = (deptId: string | undefined) => {
    if (!deptId) return "No Department";
    return departmentMap[deptId] || deptId;
  };

  const filteredCourses = courses.filter((course) => {
    const cName = course.name || "";
    const cCode = course.code || "";
    const cDeptName = getDepartmentName(course.department);

    return (
      cName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cDeptName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">
          Loading course catalog...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-8">
      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadAllData}
        initialData={editingCourse}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Course Management
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Add, update, and manage academic modules
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> New Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-xl">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by course name, code, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-xl py-3.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course._id || course.id}
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wider">
                    <Code size={12} /> {course.code}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id || course.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-4">
                  {course.name}
                </h2>

                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Layers size={14} className="text-gray-400" />
                    {getDepartmentName(course.department)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <CalendarDays size={14} className="text-gray-400" />
                    Semester {course.semester} • {course.credits} Credits
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">
              No courses found
            </h3>
            <p className="text-gray-500 font-medium mt-1">
              Adjust your search or create a new course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
