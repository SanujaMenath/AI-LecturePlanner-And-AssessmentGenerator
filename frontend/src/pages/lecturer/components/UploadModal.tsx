import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

export interface UploadData {
  title: string;
  course_id: string;
  material_type: string;
  description: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: UploadData) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState<UploadData>({
    title: '',
    course_id: '',
    material_type: 'PDF',
    description: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onUpload(formData);
    setIsUploading(false);
    onClose();
    
    // Reset form
    setFormData({ title: '', course_id: '', material_type: 'PDF', description: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/30">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload Material</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Add new resource to course</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Material Title</label>
            <input 
              required
              type="text"
              placeholder="e.g. Week 1: Introduction to Calculus"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Course</label>
              <select 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm appearance-none"
                value={formData.course_id}
                onChange={(e) => setFormData({...formData, course_id: e.target.value})}
              >
                <option value="">Select Course</option>
                <option value="cs101">Computer Science 101</option>
                <option value="db202">Database Systems</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Material Type</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm appearance-none"
                value={formData.material_type}
                onChange={(e) => setFormData({...formData, material_type: e.target.value})}
              >
                <option value="PDF">PDF Document</option>
                <option value="Video">Video Lecture</option>
                <option value="Slides">Presentation Slides</option>
                <option value="Archive">ZIP/Code File</option>
              </select>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <Upload size={22} className="text-indigo-600" />
            </div>
            <p className="text-sm font-bold text-gray-700">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">PDF, MP4, ZIP (Max 50MB)</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isUploading}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                'Publish Material'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;