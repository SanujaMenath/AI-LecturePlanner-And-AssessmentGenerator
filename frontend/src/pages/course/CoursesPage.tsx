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
import CourseForm from "./CourseForm";

const CoursesPage = () => {
  const { user } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses(); // returns Course[]
        setCourses(coursesData);

        if (user?.role === "admin") {
          const lecturersData = await getLecturers(); // returns Lecturer[]
          setLecturers(lecturersData);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollCourse(courseId);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, isEnrolled: true } : c
        )
      );
      alert("Enrolled successfully");
    } catch (err) {
      console.error(err);
      alert("Enrollment failed");
    }
  };

  const handleAssign = async (courseId: string, lecturerId: string) => {
    if (!lecturerId) return;
    try {
      await assignLecturer(courseId, lecturerId);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, lecturerId } : c
        )
      );
      alert("Lecturer assigned successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to assign lecturer");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Courses</h1>

      {user?.role === "admin" && <CourseForm onSuccess={async () => setCourses(await getCourses())} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold text-lg">{course.name}</h2>
            <p className="text-gray-500">{course.code}</p>

            {user?.role === "student" && (
              <button
                className="btn-primary mt-2"
                disabled={course.isEnrolled}
                onClick={() => handleEnroll(course.id)}
              >
                {course.isEnrolled ? "Enrolled" : "Enroll"}
              </button>
            )}

            {user?.role === "admin" && (
              <select
                className="mt-2 border rounded p-1"
                value={course.lecturerId || ""}
                onChange={(e) => handleAssign(course.id, e.target.value)}
              >
                <option value="">Assign lecturer</option>
                {lecturers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
