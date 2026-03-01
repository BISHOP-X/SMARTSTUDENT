import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import GradingPanel from "@/components/GradingPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ArrowUpDown,
  Users,
  FileText,
  AlertCircle,
  Loader2
} from "lucide-react";
import { mockLecturerSubmissions, getTimeAgo, type Submission as MockSubmission } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { getPendingSubmissions, type Submission as DbSubmission } from "@/lib/submission-service";

interface GradingQueueProps {
  userRole: "student" | "lecturer";
  onLogout: () => void;
}

type SortField = "submittedAt" | "studentName" | "courseName";
type SortOrder = "asc" | "desc";

// Unified submission type for the queue
interface QueueSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: string;
  maxScore: number;
}

const GradingQueue = ({ userRole, onLogout }: GradingQueueProps) => {
  const [activeTab, setActiveTab] = useState("grading");
  const navigate = useNavigate();
  const { isDemo } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("submittedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedSubmission, setSelectedSubmission] = useState<QueueSubmission | null>(null);
  const [isGradingPanelOpen, setIsGradingPanelOpen] = useState(false);
  const [dbSubmissions, setDbSubmissions] = useState<DbSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load real submissions from DB
  useEffect(() => {
    if (isDemo) return;
    const loadSubs = async () => {
      setIsLoading(true);
      const { submissions, error } = await getPendingSubmissions();
      if (error) {
        console.error('Failed to load submissions:', error);
      }
      setDbSubmissions(submissions);
      setIsLoading(false);
    };
    loadSubs();
  }, [isDemo]);

  // Unify data: demo uses mock, real uses DB
  const allSubmissions: QueueSubmission[] = useMemo(() => {
    if (isDemo) {
      return mockLecturerSubmissions.map(s => ({
        id: s.id,
        assignmentId: s.assignmentId,
        assignmentTitle: s.assignmentTitle,
        courseId: String(s.courseId),
        courseName: s.courseName,
        studentId: s.studentId,
        studentName: s.studentName,
        submittedAt: s.submittedAt,
        status: s.status,
        maxScore: s.maxScore,
      }));
    }
    return dbSubmissions.map(s => ({
      id: s.id,
      assignmentId: s.assignment_id,
      assignmentTitle: s.assignment_title || "Untitled",
      courseId: s.course_id || "",
      courseName: s.course_title || "Unknown Course",
      studentId: s.student_id,
      studentName: s.student_name || "Unknown",
      submittedAt: s.submitted_at,
      status: s.status,
      maxScore: s.max_score || 100,
    }));
  }, [isDemo, dbSubmissions]);

  // Get only pending submissions
  const pendingSubmissions = useMemo(() => {
    return allSubmissions.filter(s => s.status === "pending" || s.status === "graded");
  }, [allSubmissions]);

  // Get unique course names for filter dropdown
  const uniqueCourses = useMemo(() => {
    const courses = [...new Set(pendingSubmissions.map(s => s.courseName))];
    return courses.sort();
  }, [pendingSubmissions]);

  // Filter and sort submissions
  const filteredAndSortedSubmissions = useMemo(() => {
    let filtered = [...pendingSubmissions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.studentName.toLowerCase().includes(query) ||
          s.assignmentTitle.toLowerCase().includes(query) ||
          s.courseName.toLowerCase().includes(query)
      );
    }

    // Apply course filter
    if (courseFilter !== "all") {
      filtered = filtered.filter(s => s.courseName === courseFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "submittedAt") {
        comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      } else if (sortField === "studentName") {
        comparison = a.studentName.localeCompare(b.studentName);
      } else if (sortField === "courseName") {
        comparison = a.courseName.localeCompare(b.courseName);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [pendingSubmissions, searchQuery, courseFilter, sortField, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPending = pendingSubmissions.length;
    const uniqueStudents = new Set(pendingSubmissions.map(s => s.studentId)).size;
    const uniqueAssignments = new Set(pendingSubmissions.map(s => s.assignmentId)).size;
    
    // Get oldest submission
    const oldestSubmission = pendingSubmissions.length > 0 
      ? pendingSubmissions.reduce((oldest, current) => 
          new Date(current.submittedAt) < new Date(oldest.submittedAt) ? current : oldest
        )
      : null;
    
    const oldestDays = oldestSubmission 
      ? Math.floor((Date.now() - new Date(oldestSubmission.submittedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return { totalPending, uniqueStudents, uniqueAssignments, oldestDays };
  }, [pendingSubmissions]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleGradeSubmission = (submission: QueueSubmission) => {
    setSelectedSubmission(submission);
    setIsGradingPanelOpen(true);
  };

  const handleViewAssignment = (submission: QueueSubmission) => {
    navigate(`/courses/${submission.courseId}/assignments/${submission.assignmentId}`);
  };

  const handleSaveGrade = (submissionId: string, score: number, feedback: string) => {
    console.log("Saving grade:", { submissionId, score, feedback });
    setIsGradingPanelOpen(false);
    setSelectedSubmission(null);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortOrder === "desc" ? "rotate-180" : ""} transition-transform`} 
      />
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Grading Queue</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Review and grade pending student submissions
              </p>
            </div>
            {stats.totalPending > 0 && (
              <Badge variant="destructive" className="text-lg px-4 py-2">
                {stats.totalPending} Pending
              </Badge>
            )}
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Pending</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalPending}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Students</p>
                    <p className="text-3xl font-bold text-foreground">{stats.uniqueStudents}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Assignments</p>
                    <p className="text-3xl font-bold text-foreground">{stats.uniqueAssignments}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-info" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Oldest Waiting</p>
                    <p className="text-3xl font-bold text-foreground">{stats.oldestDays}</p>
                    <p className="text-xs text-muted-foreground">day{stats.oldestDays !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student, assignment, or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary/30"
                  />
                </div>

                {/* Course Filter */}
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-full lg:w-64 bg-secondary/30">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {uniqueCourses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Queue */}
          <Card className="glass-card border-0">
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-secondary/20">
                <div 
                  className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort("studentName")}
                >
                  <span className="text-sm font-medium text-muted-foreground">Student</span>
                  {renderSortIcon("studentName")}
                </div>
                <div className="col-span-3 text-sm font-medium text-muted-foreground">Assignment</div>
                <div 
                  className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort("courseName")}
                >
                  <span className="text-sm font-medium text-muted-foreground">Course</span>
                  {renderSortIcon("courseName")}
                </div>
                <div 
                  className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort("submittedAt")}
                >
                  <span className="text-sm font-medium text-muted-foreground">Submitted</span>
                  {renderSortIcon("submittedAt")}
                </div>
                <div className="col-span-1 text-sm font-medium text-muted-foreground">Max Score</div>
                <div className="col-span-2 text-sm font-medium text-muted-foreground text-right">Actions</div>
              </div>

              {/* Table Body */}
              {filteredAndSortedSubmissions.length === 0 ? (
                <div className="text-center py-16">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Loading submissions...</h3>
                    </>
                  ) : !isDemo && allSubmissions.length === 0 ? (
                    <>
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No submissions yet</h3>
                      <p className="text-muted-foreground">
                        Students haven't submitted any assignments yet. Create assignments in your courses to get started.
                      </p>
                    </>
                  ) : stats.totalPending === 0 ? (
                    <>
                      <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground">
                        There are no pending submissions to grade at the moment.
                      </p>
                    </>
                  ) : (
                    <>
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No submissions found</h3>
                      <p className="text-muted-foreground">Try adjusting your filters</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredAndSortedSubmissions.map((submission) => {
                    const daysWaiting = Math.floor(
                      (Date.now() - new Date(submission.submittedAt).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isUrgent = daysWaiting >= 3;

                    return (
                      <div
                        key={submission.id}
                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
                      >
                        {/* Student Name */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-medium text-primary">
                                {submission.studentName.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                            <p className="font-medium text-foreground truncate">{submission.studentName}</p>
                          </div>
                        </div>

                        {/* Assignment Title */}
                        <div className="col-span-3">
                          <p className="font-medium text-foreground truncate">{submission.assignmentTitle}</p>
                          {isUrgent && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>

                        {/* Course */}
                        <div className="col-span-2">
                          <Badge variant="outline" className="text-xs">
                            {submission.courseName}
                          </Badge>
                        </div>

                        {/* Submitted Date */}
                        <div className="col-span-2">
                          <p className="text-sm text-foreground">{getTimeAgo(submission.submittedAt)}</p>
                          <p className="text-xs text-muted-foreground">
                            {daysWaiting} day{daysWaiting !== 1 ? 's' : ''} waiting
                          </p>
                        </div>

                        {/* Max Score */}
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-foreground">{submission.maxScore}</p>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAssignment(submission)}
                          >
                            View
                          </Button>
                          <Button
                            variant="hero"
                            size="sm"
                            onClick={() => handleGradeSubmission(submission)}
                          >
                            Grade Now
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Count */}
          {filteredAndSortedSubmissions.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredAndSortedSubmissions.length} of {pendingSubmissions.length} pending submission
              {pendingSubmissions.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </main>

      {/* Grading Panel */}
      {selectedSubmission && (
        <GradingPanel
          open={isGradingPanelOpen}
          onClose={() => {
            setIsGradingPanelOpen(false);
            setSelectedSubmission(null);
          }}
          submissionId={selectedSubmission.id}
          assignmentMaxScore={selectedSubmission.maxScore}
        />
      )}
    </div>
  );
};

export default GradingQueue;
