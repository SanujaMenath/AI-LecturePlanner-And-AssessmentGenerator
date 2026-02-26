import { useEffect, useState } from "react";
import {
  getCourses,
  getLecturers,
  enrollCourse,
  assignLecturer,
  type Course,
  type Lecturer,
} from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";
import CourseForm from "./components/CourseForm";
import Button from "../../components/ui/Button";
import {
  BookOpen,
  Code,
  Search,
  Filter,
  CheckCircle2,
  GraduationCap,
  Users2,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "react-hot-toast";

const CoursesPage = () => {
  const { user } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollLoadingId, setEnrollLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);

        if (user?.role === "admin") {
          const lecturersData = await getLecturers();
          setLecturers(lecturersData);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleEnroll = async (courseId: string) => {
    setEnrollLoadingId(courseId);
    try {
      await enrollCourse(courseId);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, isEnrolled: true } : c)),
      );
      toast.success("Successfully enrolled in the course!");
    } catch (err) {
      console.error(err);
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setEnrollLoadingId(null);
    }
  };

  const handleAssign = async (courseId: string, lecturerId: string) => {
    if (!lecturerId) return;
    try {
      await assignLecturer(courseId, lecturerId);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, lecturerId } : c)),
      );
      toast.success("Lecturer assigned successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign lecturer");
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">
          Organizing courses...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Academic Courses
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Explore and manage your educational curriculum
            </p>
          </div>
        </div>
      </div>

      {/* Admin Course Creation Area */}
      {user?.role === "admin" && (
        <div className="space-y-4">
          <CourseForm onSuccess={async () => setCourses(await getCourses())} />
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 shadow-sm transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
          <Filter size={18} />
          Sort by Level
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="card-hover group relative flex flex-col h-full border border-gray-100 bg-white"
            >
              {/* Card Top Decorative Edge */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/50 to-primary rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="p-6 space-y-4 flex-1">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 tracking-wider">
                    <Code size={12} />
                    {course.code}
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                    {course.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Users2 size={14} className="opacity-60" />
                    <span>Multiple Batches available</span>
                  </div>
                </div>

                {/* Enrollment Status/Lecturer Info */}
                <div className="pt-4 border-t border-gray-50">
                  {user?.role === "student" && course.isEnrolled && (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-2 rounded-lg w-fit">
                      <CheckCircle2 size={14} />
                      Current Enrolled
                    </div>
                  )}

                  {user?.role === "admin" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                        Assigned Educator
                      </label>
                      <select
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                        value={course.lecturerId || ""}
                        onChange={(e) =>
                          handleAssign(course.id, e.target.value)
                        }
                      >
                        <option value="">Choose Lecturer...</option>
                        {lecturers.map((l, index) => (
                          <option key={l.id || index} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 rounded-b-2xl flex items-center justify-between">
                {user?.role === "student" ? (
                  <Button
                    loading={enrollLoadingId === course.id}
                    disabled={course.isEnrolled}
                    className={`text-xs h-10 shadow-none hover:shadow-lg hover:shadow-primary/10 ${
                      course.isEnrolled ? "bg-gray-100 text-gray-400" : ""
                    }`}
                    onClick={() => handleEnroll(course.id)}
                  >
                    {course.isEnrolled
                      ? "Access Material"
                      : "Start Learning Now"}
                    {!course.isEnrolled && !enrollLoadingId && (
                      <ChevronRight size={14} className="ml-1" />
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 w-full text-gray-400">
                    <span className="text-[11px] font-bold italic flex-1">
                      Active Academic Module
                    </span>
                    <button className="p-2 hover:bg-white hover:text-primary rounded-lg transition-colors shadow-sm">
                      <MoreHorizontal size={16} />
                    </button>
                    <button className="p-2 hover:bg-white hover:text-primary rounded-lg transition-colors shadow-sm">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
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
                No courses match your criteria
              </h3>
              <p className="text-gray-500 font-medium">
                Try adjusting your search terms or check back later.
              </p>
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2 text-primary font-bold hover:bg-primary/5 rounded-xl transition-all"
            >
              Show all courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
