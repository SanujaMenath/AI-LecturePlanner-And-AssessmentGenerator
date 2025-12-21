import { useState } from "react";
import { createCourse } from "../../services/courseService";

type Props = { onSuccess: () => void };

const CourseForm = ({ onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCourse({ name, code });
      alert("Course created");
      setName("");
      setCode("");
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to create course");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Course Name"
        className="input"
        required
      />
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Course Code"
        className="input"
        required
      />
      <button disabled={loading} className="btn-primary">
        Create Course
      </button>
    </form>
  );
};

export default CourseForm;
