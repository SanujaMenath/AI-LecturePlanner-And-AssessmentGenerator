// src/pages/admin/DepartmentPage.tsx
import React, { useState, useEffect } from "react";
import { Building2, Plus, Trash2, Search, Loader2, Edit2, GraduationCap } from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchDepartments, deleteDepartment } from "./services/departmentService";
import type { Department } from "./services/departmentService";
import DepartmentModal from "./components/DepartmentModal"; 

const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Unified Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchDepartments();
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

  const handleCreateNew = () => {
    setEditingDept(null); // Null means we are creating
    setIsModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept); // Passes data to pre-fill the form
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        toast.success("Department deleted.");
        loadData();
      } catch {
        toast.error("Failed to delete department.");
      }
    }
  };

  const filteredDepts = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.faculty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-8">
      
      {/* Reusable Modal for Create and Edit */}
      <DepartmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
        initialData={editingDept}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Building2 size={28} />
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

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> New Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search by faculty, name, or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-xl py-3.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all"
        />
      </div>

      {/* Departments Grid (Now taking full width) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.length > 0 ? (
          filteredDepts.map((dept) => (
            <div key={dept._id || dept.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full tracking-wider">
                    {dept.code}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(dept)} className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(dept._id || dept.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-2">
                  {dept.name}
                </h2>
                
                {dept.faculty && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 mb-3">
                    <GraduationCap size={16} className="text-primary/70" /> {dept.faculty}
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {dept.description || "No description provided."}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No departments found</h3>
            <p className="text-gray-500 font-medium mt-1">Adjust your search or create a new department.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;