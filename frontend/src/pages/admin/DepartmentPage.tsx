import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Building2, Plus, Trash2, Users, Search, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Department {
  _id?: string;
  id?: string; 
  name: string;
  code: string;
  description: string;
}

const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDept, setNewDept] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/departments");

      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to load departments.");
      setDepartments([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/departments", newDept);
      toast.success("Department created successfully!");
      setNewDept({ name: "", code: "", description: "" });
      loadData();
    } catch {
      toast.error("Failed to create department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await api.delete(`/departments/${id}`);
        toast.success("Department deleted.");
        loadData();
      } catch {
        toast.error("Failed to delete department.");
      }
    }
  };

  const filteredDepts = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">
          Loading departments...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-8">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Building2 size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Department Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Create and oversee academic faculties
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleCreate}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-primary" /> Create New Dept
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Department Name
                </label>
                <input
                  required
                  placeholder="ex:- Computer Science"
                  value={newDept.name}
                  onChange={(e) =>
                    setNewDept({ ...newDept, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Code
                </label>
                <input
                  required
                  placeholder="ex:- CS"
                  value={newDept.code}
                  onChange={(e) =>
                    setNewDept({ ...newDept, code: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description..."
                  value={newDept.description}
                  onChange={(e) =>
                    setNewDept({ ...newDept, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
                {isSubmitting ? "Creating..." : "Add Department"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Department List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all"
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDepts.length > 0 ? (
              filteredDepts.map((dept) => (
                <div
                  key={dept._id || dept.id}
                  className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md tracking-wider">
                        {dept.code}
                      </span>
                      <button
                        onClick={() => handleDelete(dept._id || dept.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {dept.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {dept.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50">
                    <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors w-full justify-center bg-primary/5 py-2 rounded-xl">
                      <Users size={16} /> Manage Enrollment
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">
                  No departments found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;
