import { useState } from "react";
import { 
  FileText, 
  ListTodo, 
  UploadCloud, 
  Sparkles,
  ArrowLeft,
  Trash2,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- Types ---
type AssessmentType = 'select' | 'mcq' | 'pdf' | 'short_answer' | 'ai';

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface ShortAnswer {
  id: string;
  question: string;
  points: number;
}

const AssessmentCreation = () => {
  // --- State ---
  const [step, setStep] = useState<1 | 2>(1); // 1: Basic Info & Type, 2: Builder
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('select');
  
  // Basic Details
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Builders State
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [shortAnswers, setShortAnswers] = useState<ShortAnswer[]>([]);
//   const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  // AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSourceFile, setAiSourceFile] = useState<File | null>(null);

  // --- Handlers ---
  const handleNext = (type: AssessmentType) => {
    if (!title || !course || !dueDate) {
      toast.error("Please fill in all basic details first.");
      return;
    }
    setAssessmentType(type);
    
    // Initialize with one empty question if manual
    if (type === 'mcq' && mcqs.length === 0) {
      setMcqs([{ id: Date.now().toString(), question: "", options: ["", "", "", ""], correctIndex: 0 }]);
    }
    if (type === 'short_answer' && shortAnswers.length === 0) {
      setShortAnswers([{ id: Date.now().toString(), question: "", points: 10 }]);
    }
    
    setStep(2);
  };

  const handleAIGeneration = async () => {
    if (!aiSourceFile) {
      toast.error("Please upload a lecture note first.");
      return;
    }

    setIsGenerating(true);
    // Simulate AI API Call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI Response
    const generatedQuestions: MCQ[] = [
      { id: "ai1", question: "What is the primary function of a Convolutional Neural Network (CNN)?", options: ["Text generation", "Image recognition", "Database querying", "Sorting arrays"], correctIndex: 1 },
      { id: "ai2", question: "Which activation function is commonly used in the hidden layers of a deep neural network?", options: ["Sigmoid", "Linear", "ReLU", "Step"], correctIndex: 2 },
    ];
    
    setMcqs(generatedQuestions);
    setIsGenerating(false);
    toast.success("AI successfully generated questions!");
    
    // Smoothly transition them into the MCQ builder to review/edit
    setAssessmentType('mcq'); 
  };

  const handlePublish = () => {
    // Here you will collect all state and send to your FastAPI backend
    toast.success(`${title} published successfully!`);
    // Reset or redirect
  };

  // --- Sub-components for Builders ---

  const renderMCQBuilder = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Multiple Choice Questions</h3>
        <button 
          onClick={() => setMcqs([...mcqs, { id: Date.now().toString(), question: "", options: ["", "", "", ""], correctIndex: 0 }])}
          className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          <Plus size={16} /> Add Question
        </button>
      </div>

      {mcqs.map((mcq, qIndex) => (
        <div key={mcq.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
          <button 
            onClick={() => setMcqs(mcqs.filter(q => q.id !== mcq.id))}
            className="absolute right-4 top-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 ml-1">Question {qIndex + 1}</label>
              <input 
                value={mcq.question}
                onChange={(e) => {
                  const newMcqs = [...mcqs];
                  newMcqs[qIndex].question = e.target.value;
                  setMcqs(newMcqs);
                }}
                placeholder="Enter your question here..."
                className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mcq.options.map((opt, oIndex) => (
                <div key={oIndex} className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${mcq.correctIndex === oIndex ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 bg-white'}`}>
                  <button
                    onClick={() => {
                      const newMcqs = [...mcqs];
                      newMcqs[qIndex].correctIndex = oIndex;
                      setMcqs(newMcqs);
                    }}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${mcq.correctIndex === oIndex ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300'}`}
                  >
                    {mcq.correctIndex === oIndex && <CheckCircle2 size={14} />}
                  </button>
                  <input 
                    value={opt}
                    onChange={(e) => {
                      const newMcqs = [...mcqs];
                      newMcqs[qIndex].options[oIndex] = e.target.value;
                      setMcqs(newMcqs);
                    }}
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAIGenerator = () => (
    <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-amber-100 text-amber-600 rounded-2xl mb-2 shadow-inner">
          <Sparkles size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-900">AI Assessment Generator</h2>
        <p className="text-gray-500 font-medium">Upload your lecture notes, and our AI will instantly generate a comprehensive draft assessment for you to review.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-indigo-900/5">
        {!isGenerating ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-400 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:-translate-y-1 transition-transform">
                <UploadCloud size={28} className="text-indigo-600" />
              </div>
              <p className="text-base font-bold text-gray-900">Drag & drop your lecture notes</p>
              <p className="text-sm text-gray-500 mt-1">Supports PDF, DOCX, or TXT (Max 10MB)</p>
              
              <input 
                type="file" 
                className="hidden" 
                id="ai-upload"
                onChange={(e) => setAiSourceFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="ai-upload" className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all cursor-pointer">
                Browse Files
              </label>
            </div>
            {aiSourceFile && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-600" size={20} />
                  <span className="text-sm font-bold text-gray-700">{aiSourceFile.name}</span>
                </div>
                <button onClick={handleAIGeneration} className="px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" /> Generate Now
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Analyzing Document...</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Extracting key concepts and generating questions.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Creation</h1>
          <p className="text-sm text-gray-500">Design evaluations to test student comprehension.</p>
        </div>
        {step === 2 && (
          <div className="flex gap-3">
            <button 
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to Setup
            </button>
            <button 
              onClick={handlePublish}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={18} /> Publish Assessment
            </button>
          </div>
        )}
      </div>

      {step === 1 ? (
        <div className="max-w-4xl space-y-8 animate-in fade-in">
          {/* Step 1: Basic Details */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs">1</span>
              Basic Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Assessment Title</label>
                <input 
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Target Course</label>
                <select 
                  value={course} onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                >
                  <option value="">Select Course...</option>
                  <option value="cs101">Computer Science 101</option>
                  <option value="db202">Database Systems</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Due Date & Time</label>
                <input 
                  type="datetime-local"
                  value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Assessment Type Selection */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs">2</span>
              Choose Format
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manual Options */}
              <button onClick={() => handleNext('mcq')} className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left group">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                  <ListTodo size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Multiple Choice Quiz</h3>
                <p className="text-sm text-gray-500 font-medium">Create questions with predefined options. Automatically graded.</p>
              </button>

              <button onClick={() => handleNext('short_answer')} className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left group">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Short Answer Quiz</h3>
                <p className="text-sm text-gray-500 font-medium">Open-ended questions requiring text-based student submissions.</p>
              </button>

              <button onClick={() => handleNext('pdf')} className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left group">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">PDF-Based Assignment</h3>
                <p className="text-sm text-gray-500 font-medium">Upload a PDF question sheet. Students submit answers via PDF upload.</p>
              </button>

              {/* AI Option */}
              <button onClick={() => handleNext('ai')} className="p-6 bg-linear-to-br from-gray-900 to-indigo-900 border border-gray-800 rounded-2xl hover:shadow-xl hover:shadow-indigo-900/20 transition-all text-left group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform backdrop-blur-sm">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  Generate with AI <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
                </h3>
                <p className="text-sm text-gray-300 font-medium relative z-10">Upload your lecture notes and let the system automatically generate a draft assessment.</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // --- Step 2: Show Selected Builder ---
        <div className="max-w-5xl">
          {assessmentType === 'ai' && renderAIGenerator()}
          {assessmentType === 'mcq' && renderMCQBuilder()}
          
          {/* Placeholders for PDF and Short Answer to keep code concise */}
          {assessmentType === 'pdf' && (
             <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                <UploadCloud size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Upload Assignment PDF</h3>
                <p className="text-gray-500 mt-1">Students will download this file and submit their work as a PDF.</p>
             </div>
          )}
          {assessmentType === 'short_answer' && (
             <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Short Answer Builder</h3>
                <p className="text-gray-500 mt-1">Ready for implementation: Open-ended question interface.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentCreation;