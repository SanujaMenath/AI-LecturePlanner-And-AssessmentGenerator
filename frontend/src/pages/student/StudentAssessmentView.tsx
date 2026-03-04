import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, CheckCircle2, UploadCloud, FileText, Loader2, Send, Edit3, Check
} from "lucide-react";
import { 
  fetchAssessmentById, 
  submitAssessmentService, 
  fetchSingleSubmission,
  type BackendAssessment,
  type BackendSubmission
} from "./services/studentAssignmentService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

interface ParsedMCQ {
  id: string;
  question: string;
  options: string[];
}

const StudentAssessmentView: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessment, setAssessment] = useState<BackendAssessment | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<BackendSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!assignmentId || !user?.id) return;
      try {
        setLoading(true);
        // Fetch the assignment AND the student's submission simultaneously
        const [assessmentData, submissionData] = await Promise.all([
          fetchAssessmentById(assignmentId),
          fetchSingleSubmission(assignmentId, user.id)
        ]);
        
        setAssessment(assessmentData);
        setExistingSubmission(submissionData);

        // Pre-fill data if a submission already exists
        if (submissionData) {
          if (submissionData.answers) setMcqAnswers(submissionData.answers);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load assessment details.");
        navigate('/student/assignments');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [assignmentId, user?.id, navigate]);

  const handleSubmit = async () => {
    if (!user?.id || !assessment) return;
    const currentAssessmentId = assessment.id || assessment._id;
    if (!currentAssessmentId) return;

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      
      if (assessment.assessment_type === 'mcq') {
        const questions: ParsedMCQ[] = JSON.parse(assessment.content || "[]");
        if (Object.keys(mcqAnswers).length < questions.length) {
          toast.error("Please answer all questions before submitting.");
          setIsSubmitting(false);
          return;
        }
        payload.append("answers", JSON.stringify(mcqAnswers));
      } 
      else if (assessment.assessment_type === 'pdf') {
        if (!submissionFile && !existingSubmission?.file_url) {
          toast.error("Please select a file to upload.");
          setIsSubmitting(false);
          return;
        }
        if (submissionFile) {
          payload.append("file", submissionFile);
        } else {
           toast.success("No changes made to your file.");
           setIsSubmitting(false);
           return;
        }
      }

      await submitAssessmentService(currentAssessmentId, user.id, payload);
      toast.success(existingSubmission ? "Submission updated!" : "Assignment submitted successfully!");
      navigate('/student/assignments');

    } catch {
      toast.error("Failed to submit assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading assessment...</p>
      </div>
    );
  }

  const parsedQuestions: ParsedMCQ[] = assessment.assessment_type === 'mcq' && assessment.content 
    ? JSON.parse(assessment.content) : [];
  
  const hasSubmitted = !!existingSubmission;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-8">
      
      {/* Top Navigation */}
      <button onClick={() => navigate("/student/assignments")} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors">
        <ArrowLeft size={16} /> Back to Assignments
      </button>

      {/* Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg">
              {assessment.assessment_type === 'mcq' ? 'Quiz' : 'Assignment'}
            </span>
            {hasSubmitted && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1">
                <Check size={14}/> Submitted
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{assessment.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400"/> Due: {new Date(assessment.due_date).toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-gray-400"/> {assessment.total_marks || 100} Points</span>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shrink-0 disabled:opacity-70
            ${hasSubmitted 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'}`}
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (hasSubmitted ? <Edit3 size={20} /> : <Send size={20} />)}
          {hasSubmitted ? 'Update Submission' : 'Submit Work'}
        </button>
      </div>

      {/* --- MCQ UI --- */}
      {assessment.assessment_type === 'mcq' && (
        <div className="space-y-6">
          {parsedQuestions.map((q, qIndex) => (
            <div key={q.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                <span className="text-emerald-600 mr-2">{qIndex + 1}.</span> {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((opt, oIndex) => {
                  const isSelected = mcqAnswers[q.id] === oIndex;
                  return (
                    <button
                      key={oIndex}
                      onClick={() => setMcqAnswers(prev => ({ ...prev, [q.id]: oIndex }))}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4
                        ${isSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 bg-white hover:border-emerald-200'}
                      `}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                        ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}
                      `}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- PDF Upload UI --- */}
      {assessment.assessment_type === 'pdf' && (
        <div className="space-y-6">
          {assessment.file_url && (
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl text-gray-600 shadow-sm"><FileText size={24} /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Assignment Brief</h3>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Download the instructions for this assignment.</p>
                </div>
              </div>
              <a href={`http://127.0.0.1:8000${assessment.file_url}`} target="_blank" rel="noopener noreferrer" download className="px-5 py-2.5 bg-white text-gray-700 font-bold rounded-xl shadow-sm hover:shadow transition-all border border-gray-200">
                Download PDF
              </a>
            </div>
          )}

          {/* Current Submission Display */}
          {existingSubmission?.file_url && !submissionFile && (
             <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <h3 className="font-bold text-blue-900 flex items-center gap-2"><CheckCircle2 size={18}/> Your Current Submission</h3>
                 <p className="text-sm text-blue-700 mt-1">You have already uploaded a file. Uploading a new one will replace it.</p>
               </div>
               <a href={`http://127.0.0.1:8000${existingSubmission.file_url}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-blue-700 text-sm font-bold rounded-lg shadow-sm">
                 View Submitted File
               </a>
             </div>
          )}

          {/* Upload Box */}
          <div className={`p-12 rounded-3xl border-2 border-dashed text-center flex flex-col items-center justify-center transition-all bg-white
            ${submissionFile ? 'border-emerald-400 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-300'}
          `}>
             <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors
               ${submissionFile ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400'}
             `}>
               <UploadCloud size={40} />
             </div>
             <h3 className="text-xl font-bold text-gray-900">
               {submissionFile ? 'New File Selected' : (hasSubmitted ? 'Replace your submission' : 'Upload your submission')}
             </h3>
             <p className="text-gray-500 font-medium mt-2 mb-8 max-w-sm">
               {submissionFile ? submissionFile.name : 'Please ensure your file is in PDF format. Max file size: 10MB.'}
             </p>
             
             <input type="file" id="submission-upload" className="hidden" accept=".pdf,.docx,.zip" onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)} />
             <label htmlFor="submission-upload" className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 cursor-pointer transition-all shadow-md">
               {submissionFile ? "Change File" : "Browse Files"}
             </label>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentAssessmentView;