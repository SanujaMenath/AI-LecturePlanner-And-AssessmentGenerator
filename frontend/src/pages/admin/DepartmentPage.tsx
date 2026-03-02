import React, { useState, useEffect } from "react";
import { Building2, Plus, Trash2, Search, Loader2, Edit2, X, GraduationCap } from "lucide-react";
import { toast } from "react-hot-toast";
import { 
  fetchDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment, 
} from "./services/departmentService";
import type { Department } from "./services/departmentService";

const defaultDeptState = { name: "", code: "", faculty: "", description: "" };

const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDept, setNewDept] = useState(defaultDeptState);
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createDepartment(newDept);
      toast.success("Department created successfully!");
      setNewDept(defaultDeptState);
      loadData();
    } catch {
      toast.error("Failed to create department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    
    const id = editingDept._id || editingDept.id;
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateDepartment(id, {
        name: editingDept.name,
        code: editingDept.code,
        faculty: editingDept.faculty,
        description: editingDept.description,
      });
      toast.success("Department updated successfully!");
      setIsEditModalOpen(false);
      setEditingDept(null);
      loadData();
    } catch {
      toast.error("Failed to update department.");
    } finally {
      setIsSubmitting(false);
    }
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

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setIsEditModalOpen(true);
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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-5">
      
      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit2 size={20} className="text-primary" /> Update Department
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Faculty</label>
                <input
                  required
                  value={editingDept.faculty}
                  onChange={(e) => setEditingDept({ ...editingDept, faculty: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Department Name</label>
                <input
                  required
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Code</label>
                <input
                  required
                  value={editingDept.code}
                  onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                <textarea
                  rows={3}
                  value={editingDept.description}
                  onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-md transition-all flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Building2 size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Department Management</h1>
          <p className="text-gray-500 font-medium mt-1">Create and oversee academic faculties</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-primary" /> Create New Dept
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Faculty</label>
                <input
                  required
                  placeholder="ex:- Faculty of Computing"
                  value={newDept.faculty}
                  onChange={(e) => setNewDept({ ...newDept, faculty: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Department Name</label>
                <input
                  required
                  placeholder="ex:- Computer Science"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Code</label>
                <input
                  required
                  placeholder="ex:- CS"
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description..."
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {isSubmitting ? "Creating..." : "Add Department"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Department List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 shadow-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDepts.length > 0 ? (
              filteredDepts.map((dept) => (
                <div key={dept._id || dept.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md tracking-wider">
                        {dept.code}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(dept)} className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(dept._id || dept.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{dept.name}</h2>
                    
                    {dept.faculty && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mt-1.5">
                        <GraduationCap size={14} className="text-primary/70" /> {dept.faculty}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500 mt-3 line-clamp-2">{dept.description || "No description provided."}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No departments found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;