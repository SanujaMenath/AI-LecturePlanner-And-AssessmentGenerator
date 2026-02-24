import { useState, useEffect } from "react";
import {
  GraduationCap,
  Search,
  BookOpen,
  Clock,
  ChevronRight,
  Code,
  UserCircle,
} from "lucide-react";
import { fetchEnrolledCourses, type EnrolledCourse } from "../services/CourseService";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";

const StudentCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        
        const coursesData = await fetchEnrolledCourses(user.id);
        setCourses(coursesData);
        
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast.error("Could not load your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [user?.id]);
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">
          Loading your courses...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              My Courses
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Continue your learning journey
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search my enrolled courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group relative flex flex-col h-full border border-gray-100 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Top Decorative Edge */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="p-6 space-y-5 flex-1">
                {/* Course Header */}
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 tracking-wider">
                    <Code size={12} />
                    {course.code}
                  </div>
                </div>

                {/* Course Info */}
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {course.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <UserCircle size={14} className="opacity-60" />
                    <span className="truncate">{course.lecturerName}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span
                      className={
                        course.progress === 100
                          ? "text-emerald-600"
                          : "text-gray-500"
                      }
                    >
                      {course.progress === 100 ? "Completed" : "In Progress"}
                    </span>
                    <span className="text-gray-700">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${course.progress === 100 ? "bg-emerald-500" : "bg-emerald-400"}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Clock size={14} />
                  Accessed {course.lastAccessed}
                </div>
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all shadow-sm">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-5 bg-gray-50 rounded-full">
              <BookOpen size={48} className="text-gray-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                No enrolled courses found
              </h3>
              <p className="text-gray-500 font-medium mt-1">
                Check the course catalog to enroll in new modules.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCoursesPage;
