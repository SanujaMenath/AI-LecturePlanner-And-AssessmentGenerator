// src/pages/admin/components/DepartmentModal.tsx
import React, { useState, useEffect } from "react";
import { createDepartment, updateDepartment } from "../services/departmentService";
import type { Department } from "../services/departmentService";
import { Plus, Loader2, X, Edit2 } from "lucide-react";
import { toast } from "react-hot-toast";
// import Button from "../../../components/ui/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Department | null;
};

const defaultDeptState = { name: "", code: "", faculty: "", description: "" };

const DepartmentModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState(defaultDeptState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form if editing, reset if creating
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        faculty: initialData.faculty || "",
        description: initialData.description || "",
      });
    } else {
      setFormData(defaultDeptState);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData && (initialData._id || initialData.id)) {
        const id = initialData._id || initialData.id;
        await updateDepartment(id as string, formData);
        toast.success("Department updated successfully!");
      } else {
        await createDepartment(formData);
        toast.success("Department created successfully!");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error(initialData ? "Failed to update department." : "Failed to create department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl border border-gray-100 animate-in zoom-in-95 relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            {initialData ? <Edit2 size={24} /> : <Plus size={24} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "Update Department" : "Create Department"}
            </h2>
            <p className="text-sm text-gray-500 font-medium">Define academic faculty details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Faculty</label>
            <input
              required
              placeholder="ex: Faculty of Computing"
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Department Name</label>
            <input
              required
              placeholder="ex: Computer Science"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Department Code</label>
            <input
              required
              placeholder="ex: CS"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
            />
          </div>

          <div className="pt-6 border-t border-gray-50 flex gap-4 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="min-w-40 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-md transition-all flex justify-center items-center gap-2">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (initialData ? "Save Changes" : "Create Department")}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default DepartmentModal;