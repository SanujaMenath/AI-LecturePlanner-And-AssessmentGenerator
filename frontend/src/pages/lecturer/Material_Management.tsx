import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Download,
  FileVideo,
  FileCode,
  File as FileIcon,
} from "lucide-react";
import UploadModal, { type UploadData } from "./components/UploadModal";

// 1. Define the Interface for TypeScript
interface Material {
  _id: string;
  title: string;
  course: string;
  type: string;
  date: string;
}

const MaterialManagement: React.FC = () => {
  // 2. Explicitly type the state
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("pdf")) return <FileText className="text-red-500" />;
    if (t.includes("video") || t.includes("mp4"))
      return <FileVideo className="text-blue-500" />;
    if (t.includes("code") || t.includes("zip"))
      return <FileCode className="text-amber-500" />;
    return <FileIcon className="text-gray-500" />;
  };

  const handleUpload = (data: UploadData) => {
    // Logic to send data to FastAPI goes here
    console.log("Data received from modal:", data);

    // For now, let's update the UI locally
    const newEntry: Material = {
      _id: Date.now().toString(),
      title: data.title,
      course: data.course_id, // You might want to map the ID to a Name later
      type: data.material_type,
      date: new Date().toISOString().split("T")[0],
    };
    setMaterials((prev) => [newEntry, ...prev]);
  };

  useEffect(() => {
    // Simulating an API call to avoid the "synchronous setState" warning
    const fetchData = async () => {
      const mockData: Material[] = [
        {
          _id: "1",
          title: "Introduction to React.pdf",
          course: "Web Dev 101",
          type: "PDF",
          date: "2024-03-15",
        },
        {
          _id: "2",
          title: "Database Schema Design.mp4",
          course: "Database Systems",
          type: "Video",
          date: "2024-03-18",
        },
        {
          _id: "3",
          title: "API_Documentation.zip",
          course: "Backend Engineering",
          type: "Archive",
          date: "2024-03-20",
        },
      ];
      setMaterials(mockData);
    };

    fetchData();
  }, []);

  // 3. Simple filter logic so 'searchTerm' is "used"
  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Material Management
          </h1>
          <p className="text-sm text-gray-500">
            Upload and manage course resources.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)} // Modal toggle used here
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-100"
        >
          <Plus size={18} />
          Upload Material
        </button>
      </div>
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search materials..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                File Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredMaterials.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                      {getFileIcon(item.type)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                  {item.course}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialManagement;
