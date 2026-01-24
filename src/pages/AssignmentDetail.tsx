import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import GradingPanel from "@/components/GradingPanel";
import { useAuth } from "@/contexts/AuthContext";
import { gradeSubmission, canUseAI } from "@/lib/ai-service";

interface AssignmentDetailProps {
  userRole: "student" | "lecturer";
  onLogout: () => void;
}

// Mock assignment data
const mockAssignment = {
  id: 1,
  title: "DNA Replication Essay",
  description:
    "Write a comprehensive essay explaining the process of DNA replication. Your answer should cover the three main phases: initiation, elongation, and termination. Include the roles of key enzymes such as helicase, DNA polymerase, and primase. Discuss the differences between leading and lagging strand synthesis.",
  dueDate: "2026-01-25",
  maxScore: 100,
  courseId: 1,
  courseName: "Molecular Biology",
  courseCode: "BIO301",
  allowFileUpload: false,
  gradingRubric:
    "A complete answer should explain DNA replication in 3 steps: initiation, elongation, and termination. Must mention helicase, DNA polymerase, and leading/lagging strands. Bonus points for discussing Okazaki fragments and the proofreading mechanism.",
};

// Mock submission data (student's own submission)
const mockStudentSubmission = {
  id: 1,
  assignmentId: 1,
  studentId: 1,
  contentText:
    "DNA replication is a complex process that occurs in three main phases. During initiation, helicase unwinds the double helix. In elongation, DNA polymerase adds nucleotides to the growing strand. Finally, termination occurs when replication is complete.",
  submittedAt: "2026-01-18T14:30:00",
  status: "graded" as const,
  aiScore: 78,
  aiFeedback:
    "Good explanation of the three phases. However, you missed important details about leading and lagging strands. The answer would benefit from discussing Okazaki fragments and the specific roles of different DNA polymerases.",
};

// Mock submissions data (all students - for lecturer view)
const mockAllSubmissions = [
  {
    id: 1,
    studentName: "Alex Johnson",
    studentId: 1,
    submittedAt: "2026-01-18T14:30:00",
    status: "graded" as const,
    score: 78,
  },
  {
    id: 2,
    studentName: "Maria Garcia",
    studentId: 2,
    submittedAt: "2026-01-18T15:45:00",
    status: "graded" as const,
    score: 92,
  },
  {
    id: 3,
    studentName: "James Wilson",
    studentId: 3,
    submittedAt: "2026-01-19T09:15:00",
    status: "pending" as const,
    score: null,
  },
  {
    id: 4,
    studentName: "Sarah Chen",
    studentId: 4,
    submittedAt: "2026-01-19T11:20:00",
    status: "pending" as const,
    score: null,
  },
];

const AssignmentDetail = ({ userRole, onLogout }: AssignmentDetailProps) => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [activeTab] = useState("courses");
  const { isDemo } = useAuth();

  // Student submission state
  const [submissionText, setSubmissionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    feedback: string;
    isRealAI: boolean;
  } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Lecturer grading state
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

  const assignment = mockAssignment;
  const studentSubmission = userRole === "student" ? mockStudentSubmission : null;
  const hasSubmitted = studentSubmission !== null;

  const handleBack = () => {
    navigate(`/courses/${courseId}`);
  };

  const handleSubmit = async () => {
    if (!submissionText.trim()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Check if user can use real AI
      const aiCheck = await canUseAI();
      
      if (!isDemo && aiCheck.canUse) {
        // Use real AI grading
        setIsGrading(true);
        
        const result = await gradeSubmission({
          assignmentTitle: assignment.title,
          assignmentContext: `${assignment.description}\n\nGrading Rubric: ${assignment.gradingRubric}`,
          studentAnswer: submissionText,
          maxScore: assignment.maxScore,
        });
        
        setIsGrading(false);

        if (result.error || result.score === null) {
          setSubmissionError(result.error || 'Failed to grade submission');
          setIsSubmitting(false);
          return;
        }

        setSubmissionResult({
          score: result.score,
          feedback: result.feedback || 'No feedback provided',
          isRealAI: true,
        });
      } else {
        // Demo mode - simulate grading
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Generate mock grade based on answer length
        const wordCount = submissionText.split(/\s+/).length;
        const mockScore = Math.min(
          assignment.maxScore,
          Math.round((wordCount / 50) * 30 + Math.random() * 40 + 30)
        );
        
        setSubmissionResult({
          score: mockScore,
          feedback: "This is a demo grade. Sign in with a real account to get AI-powered grading with detailed feedback on your submission.",
          isRealAI: false,
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError(error instanceof Error ? error.message : 'An error occurred');
    }
    
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilDue = () => {
    const due = new Date(assignment.dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={() => {}} onLogout={onLogout} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline">{assignment.courseCode}</Badge>
                  <span className="text-sm text-muted-foreground">{assignment.courseName}</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {assignment.title}
                </h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                    {isOverdue && (
                      <Badge variant="destructive" className="ml-2">Overdue</Badge>
                    )}
                    {isDueSoon && (
                      <Badge variant="secondary" className="ml-2">Due Soon</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Max Score: {assignment.maxScore}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 max-w-5xl mx-auto space-y-6">
          {/* Assignment Instructions */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Instructions</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{assignment.description}</p>
          </div>

          {/* STUDENT VIEW */}
          {userRole === "student" && (
            <>
              {/* AI Mode Indicator */}
              <Alert className={isDemo ? "bg-yellow-500/10 border-yellow-500/30" : "bg-green-500/10 border-green-500/30"}>
                <Sparkles className={`w-4 h-4 ${isDemo ? "text-yellow-400" : "text-green-400"}`} />
                <AlertDescription className={isDemo ? "text-yellow-200" : "text-green-200"}>
                  {isDemo 
                    ? "Demo Mode: Using simulated AI grading. Sign in with a real account for actual AI-powered feedback."
                    : "AI Grading Active: Your submission will be graded by real AI powered by Groq's llama-3.3-70b-versatile model."}
                </AlertDescription>
              </Alert>

              {hasSubmitted || submissionResult ? (
                /* Show submitted work and grade */
                <div className="space-y-6">
                  {/* Submission Status */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-foreground">Your Submission</h2>
                      <Badge
                        variant="default"
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Graded
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {studentSubmission ? `Submitted on ${formatDate(studentSubmission.submittedAt)}` : "Just submitted"}
                    </p>
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <p className="text-foreground whitespace-pre-wrap">
                        {studentSubmission?.contentText || submissionText}
                      </p>
                    </div>
                  </div>

                  {/* Grade and Feedback */}
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-semibold text-foreground">Grade & Feedback</h2>
                      {submissionResult && (
                        <Badge variant={submissionResult.isRealAI ? "default" : "secondary"}>
                          {submissionResult.isRealAI ? "Real AI" : "Demo"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">
                          {submissionResult?.score ?? studentSubmission?.aiScore}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          out of {assignment.maxScore}
                        </div>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Percentage</div>
                        <div className="text-2xl font-semibold">
                          {Math.round(((submissionResult?.score ?? studentSubmission?.aiScore ?? 0) / assignment.maxScore) * 100)}%
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                      <h3 className="font-medium text-foreground mb-2">
                        {submissionResult?.isRealAI ? "AI Feedback (Groq)" : "AI Feedback"}
                      </h3>
                      <p className="text-sm text-foreground/90">
                        {submissionResult?.feedback ?? studentSubmission?.aiFeedback}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Show submission form */
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Submit Your Work</h2>
                  
                  {submissionError && (
                    <Alert className="mb-4 bg-red-500/10 border-red-500/30">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <AlertDescription className="text-red-200">
                        {submissionError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="answer" className="text-sm font-medium">
                        Your Answer <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="answer"
                        placeholder="Type your answer here..."
                        rows={12}
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        className="resize-none"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        {submissionText.length} characters
                      </p>
                    </div>

                    {assignment.allowFileUpload && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Or Upload File
                        </Label>
                        <div className="flex items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4">
                      <Button
                        type="submit"
                        variant="hero"
                        disabled={!submissionText.trim() || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {isGrading ? "AI is grading..." : "Submitting..."}
                          </>
                        ) : (
                          "Submit Assignment"
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        {isDemo 
                          ? "Demo mode - simulated grading"
                          : "You'll receive real AI feedback within seconds"}
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}

          {/* LECTURER VIEW */}
          {userRole === "lecturer" && (
            <>
              {/* Grading Rubric (for reference) */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Grading Rubric</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {assignment.gradingRubric}
                </p>
              </div>

              {/* Submissions List */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Student Submissions ({mockAllSubmissions.length})
                </h2>
                <div className="space-y-2">
                  {mockAllSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedSubmission(submission.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {submission.studentName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Submitted {formatDate(submission.submittedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {submission.status === "graded" && submission.score !== null ? (
                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              {submission.score}/{assignment.maxScore}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round((submission.score / assignment.maxScore) * 100)}%
                            </div>
                          </div>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Grading Panel (Lecturer only) */}
      {userRole === "lecturer" && selectedSubmission && (
        <GradingPanel
          open={selectedSubmission !== null}
          onClose={() => setSelectedSubmission(null)}
          submissionId={selectedSubmission}
          assignmentMaxScore={assignment.maxScore}
        />
      )}
    </div>
  );
};

export default AssignmentDetail;
