import { useState, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
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
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowUpDown,
  Eye
} from "lucide-react";
import { mockStudentSubmissions, getTimeAgo, type Submission } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

interface MySubmissionsProps {
  userRole: "student" | "lecturer";
  onLogout: () => void;
}

type SortField = "submittedAt" | "score" | "courseName";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "pending" | "graded";

const MySubmissions = ({ userRole, onLogout }: MySubmissionsProps) => {
  const [activeTab, setActiveTab] = useState("submissions");
  const navigate = useNavigate();
  const { isDemo } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("submittedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Show mock data only in demo mode - memoized to prevent dependency issues
  const submissions = useMemo(() => {
    return isDemo ? mockStudentSubmissions : [];
  }, [isDemo]);

  // Get unique course names for filter dropdown
  const uniqueCourses = useMemo(() => {
    const courses = [...new Set(submissions.map(s => s.courseName))];
    return courses.sort();
  }, [submissions]);

  // Filter and sort submissions
  const filteredAndSortedSubmissions = useMemo(() => {
    let filtered = [...submissions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.assignmentTitle.toLowerCase().includes(query) ||
          s.courseName.toLowerCase().includes(query)
      );
    }

    // Apply course filter
    if (courseFilter !== "all") {
      filtered = filtered.filter(s => s.courseName === courseFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "submittedAt") {
        comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      } else if (sortField === "score") {
        const scoreA = a.manualScore ?? a.aiScore ?? 0;
        const scoreB = b.manualScore ?? b.aiScore ?? 0;
        comparison = scoreA - scoreB;
      } else if (sortField === "courseName") {
        comparison = a.courseName.localeCompare(b.courseName);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [submissions, searchQuery, courseFilter, statusFilter, sortField, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = submissions.length;
    const graded = submissions.filter(s => s.status === "graded").length;
    const pending = total - graded;
    const gradedSubmissions = submissions.filter(s => s.status === "graded");
    const averageScore = gradedSubmissions.length > 0
      ? Math.round(
          gradedSubmissions.reduce((acc, s) => {
            const score = s.manualScore ?? s.aiScore ?? 0;
            return acc + (score / s.maxScore * 100);
          }, 0) / gradedSubmissions.length
        )
      : 0;

    return { total, graded, pending, averageScore };
  }, [submissions]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleViewSubmission = (submission: Submission) => {
    navigate(`/courses/${submission.courseId}/assignments/${submission.assignmentId}`);
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
              <h1 className="text-2xl font-bold text-foreground">My Submissions</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track all your assignment submissions and grades
              </p>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Submissions</p>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Graded</p>
                    <p className="text-3xl font-bold text-foreground">{stats.graded}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending</p>
                    <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Average Grade</p>
                    <p className="text-3xl font-bold text-foreground">{stats.averageScore}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-info" />
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
                    placeholder="Search assignments or courses..."
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

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger className="w-full lg:w-48 bg-secondary/30">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="graded">Graded</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submissions List */}
          <Card className="glass-card border-0">
            <CardContent className="p-0">
              {/* Table Header - desktop only */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-secondary/20">
                <div 
                  className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort("courseName")}
                >
                  <span className="text-sm font-medium text-muted-foreground">Assignment</span>
                  {renderSortIcon("courseName")}
                </div>
                <div className="col-span-2 text-sm font-medium text-muted-foreground">Course</div>
                <div 
                  className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort("submittedAt")}
                >
                  <span className="text-sm font-medium text-muted-foreground">Submitted</span>
                  {renderSortIcon("submittedAt")}
                </div>
                <div className="col-span-2 text-sm font-medium text-muted-foreground">Status</div>
                <div 
                  className="col-span-1 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort("score")}
                >
                  <span className="text-sm font-medium text-muted-foreground">Score</span>
                  {renderSortIcon("score")}
                </div>
                <div className="col-span-1 text-sm font-medium text-muted-foreground text-right">Actions</div>
              </div>

              {/* Table Body */}
              {filteredAndSortedSubmissions.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No submissions found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || courseFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : !isDemo
                      ? "You're using a real account. Use Demo mode to see sample submissions."
                      : "You haven't submitted any assignments yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredAndSortedSubmissions.map((submission, index) => {
                    const finalScore = submission.manualScore ?? submission.aiScore ?? null;
                    const percentage = finalScore !== null ? Math.round((finalScore / submission.maxScore) * 100) : null;
                    const isExcellent = percentage !== null && percentage >= 90;
                    const isGood = percentage !== null && percentage >= 75 && percentage < 90;
                    const isFair = percentage !== null && percentage >= 60 && percentage < 75;

                    return (
                      <Fragment key={submission.id}>
                      {/* Mobile card view */}
                      <div
                        className="block md:hidden px-4 py-4 hover:bg-secondary/30 transition-colors cursor-pointer border-b border-border last:border-0"
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{submission.assignmentTitle}</h4>
                            <p className="text-sm text-muted-foreground truncate mt-0.5">{submission.courseName}</p>
                          </div>
                          {percentage !== null ? (
                            <div className="text-right shrink-0">
                              <span className={`text-lg font-bold ${isExcellent ? "text-success" : isGood ? "text-primary" : isFair ? "text-amber-600" : "text-destructive"}`}>
                                {percentage}%
                              </span>
                              <p className="text-xs text-muted-foreground">{finalScore}/{submission.maxScore}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground shrink-0">—</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {submission.status === "graded" ? (
                            <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20 text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" />Graded
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-accent/10 text-accent hover:bg-accent/20 text-xs">
                              <Clock className="w-3 h-3 mr-1" />Pending
                            </Badge>
                          )}
                          {submission.manualScore !== undefined && submission.manualScore !== null && (
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary">Manually Graded</Badge>
                          )}
                          {submission.aiScore !== undefined && submission.aiScore !== null && submission.manualScore === undefined && (
                            <Badge variant="outline" className="text-xs border-info/30 text-info">AI Graded</Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">{getTimeAgo(submission.submittedAt)}</span>
                        </div>
                      </div>

                      {/* Desktop grid row */}
                      <div
                        className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                        onClick={() => handleViewSubmission(submission)}
                      >
                        {/* Assignment Title */}
                        <div className="col-span-4">
                          <h4 className="font-medium text-foreground mb-1 truncate">
                            {submission.assignmentTitle}
                          </h4>
                          {submission.manualScore !== undefined && submission.manualScore !== null && (
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                              Manually Graded
                            </Badge>
                          )}
                          {submission.aiScore !== undefined && submission.aiScore !== null && submission.manualScore === undefined && (
                            <Badge variant="outline" className="text-xs border-info/30 text-info">
                              AI Graded
                            </Badge>
                          )}
                        </div>

                        {/* Course Name */}
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground truncate">{submission.courseName}</p>
                        </div>

                        {/* Submitted Date */}
                        <div className="col-span-2">
                          <p className="text-sm text-foreground">{getTimeAgo(submission.submittedAt)}</p>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          {submission.status === "graded" ? (
                            <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Graded
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-accent/10 text-accent hover:bg-accent/20">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>

                        {/* Score */}
                        <div className="col-span-1">
                          {percentage !== null ? (
                            <div className="text-right">
                              <span
                                className={`text-lg font-bold ${
                                  isExcellent
                                    ? "text-success"
                                    : isGood
                                    ? "text-primary"
                                    : isFair
                                    ? "text-amber-600"
                                    : "text-destructive"
                                }`}
                              >
                                {percentage}%
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {finalScore}/{submission.maxScore}
                              </p>
                            </div>
                          ) : (
                            <div className="text-right">
                              <span className="text-sm text-muted-foreground">-</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewSubmission(submission);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      </Fragment>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Count */}
          {filteredAndSortedSubmissions.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredAndSortedSubmissions.length} of {mockStudentSubmissions.length} submission
              {mockStudentSubmissions.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MySubmissions;
