import { useState } from "react";
import { createCourse } from "../../services/courseService";
import Button from "../../components/ui/Button";
import { BookOpen, Code, Plus, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

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
      toast.success("Course created successfully!");
      setName("");
      setCode("");
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create course");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="card-hover border border-primary/10 bg-gradient-to-br from-white to-primary/5"
    >
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Plus size={18} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Create New Course</h2>
          <p className="text-xs text-gray-500 font-medium">Add a new academic module to the system</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
            <BookOpen size={14} className="text-gray-400" />
            Course Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Advanced Artificial Intelligence"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium placeholder:text-gray-300 shadow-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
            <Code size={14} className="text-gray-400" />
            Course Code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. CS402"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium placeholder:text-gray-300 shadow-sm"
            required
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          loading={loading}
          className="max-w-[240px] shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform transition-all duration-300 active:scale-95"
        >
          {!loading && <Sparkles size={18} className="mr-1" />}
          {loading ? "Generating..." : "Finalize Course Creation"}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
