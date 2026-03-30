import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Users, FileText, Target, Download, AlertCircle, MessageSquare, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { mockCourseAnalytics, type CourseAnalytics as CourseAnalyticsType } from "@/data/mockData";
import { getCourse, getCourseStudents } from "@/lib/course-service";
import { getCourseAssignments } from "@/lib/assignment-service";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function CourseAnalytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout, isDemo } = useAuth();
  const courseId = parseInt(id || "0");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [analytics, setAnalytics] = useState<CourseAnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load real analytics from DB data
  useEffect(() => {
    if (isDemo) {
      setAnalytics(mockCourseAnalytics[courseId] || null);
      return;
    }
    if (!id) return;
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const [courseResult, studentsResult, assignmentsResult] = await Promise.all([
          getCourse(id),
          getCourseStudents(id),
          getCourseAssignments(id),
        ]);

        const course = courseResult.course;
        const students = studentsResult.students || [];
        const assignments = assignmentsResult.assignments || [];

        if (!course) { setIsLoading(false); return; }

        // Fetch all submissions for this course's assignments
        const assignmentIds = assignments.map(a => a.id);
        let allSubmissions: any[] = [];
        if (assignmentIds.length > 0) {
          const { data: subs } = await supabase
            .from('submissions')
            .select('*, student:profiles(full_name)')
            .in('assignment_id', assignmentIds);
          allSubmissions = subs || [];
        }

        // Compute grade distribution
        const graded = allSubmissions.filter(s => s.manual_score !== null || s.ai_score !== null);
        const scores = graded.map(s => {
          const score = s.manual_score ?? s.ai_score ?? 0;
          const maxScore = assignments.find(a => a.id === s.assignment_id)?.max_score || 100;
          return (score / maxScore) * 100;
        });

        const gradeBuckets = [
          { range: "90-100", min: 90, max: 100 },
          { range: "80-89", min: 80, max: 89 },
          { range: "70-79", min: 70, max: 79 },
          { range: "60-69", min: 60, max: 69 },
          { range: "0-59", min: 0, max: 59 },
        ];
        const gradeDistribution = gradeBuckets.map(b => {
          const count = scores.filter(s => s >= b.min && s <= b.max).length;
          return { range: b.range, count, percentage: scores.length > 0 ? (count / scores.length) * 100 : 0 };
        });

        const averageGrade = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const totalStudents = students.length;
        const submissionRate = totalStudents > 0 && assignments.length > 0
          ? (allSubmissions.length / (totalStudents * assignments.length)) * 100
          : 0;

        // Assignment performance
        const assignmentPerformance = assignments.map(a => {
          const subs = allSubmissions.filter(s => s.assignment_id === a.id);
          const gradedSubs = subs.filter(s => s.manual_score !== null || s.ai_score !== null);
          const avgScore = gradedSubs.length > 0
            ? gradedSubs.reduce((acc, s) => acc + ((s.manual_score ?? s.ai_score ?? 0) / a.max_score) * 100, 0) / gradedSubs.length
            : 0;
          return {
            assignmentTitle: a.title,
            averageScore: avgScore,
            submissionRate: totalStudents > 0 ? (subs.length / totalStudents) * 100 : 0,
            dueDate: a.due_date,
          };
        });

        // Per-student stats
        const studentStats = students.map(s => {
          const name = (s.profile as any)?.full_name || "Unknown";
          const studentSubs = allSubmissions.filter(sub => sub.student_id === s.student_id);
          const studentGraded = studentSubs.filter(sub => sub.manual_score !== null || sub.ai_score !== null);
          const avgGrade = studentGraded.length > 0
            ? studentGraded.reduce((acc, sub) => {
                const maxScore = assignments.find(a => a.id === sub.assignment_id)?.max_score || 100;
                return acc + ((sub.manual_score ?? sub.ai_score ?? 0) / maxScore) * 100;
              }, 0) / studentGraded.length
            : 0;
          const missedDeadlines = assignments.filter(a => {
            const due = new Date(a.due_date);
            const hasSub = studentSubs.some(sub => sub.assignment_id === a.id);
            return due < new Date() && !hasSub;
          }).length;
          return { studentName: name, averageGrade: avgGrade, assignmentsCompleted: studentGraded.length, missedDeadlines };
        });

        const topPerformers = [...studentStats].sort((a, b) => b.averageGrade - a.averageGrade).slice(0, 5);
        const strugglingStudents = [...studentStats]
          .filter(s => s.averageGrade < 70 || s.missedDeadlines > 0)
          .sort((a, b) => a.averageGrade - b.averageGrade)
          .slice(0, 5);

        // Performance over time (group submissions by week)
        const performanceOverTime = (() => {
          if (graded.length === 0) return [];
          const sorted = [...graded].sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
          const weeks: Record<string, { total: number; count: number }> = {};
          sorted.forEach(s => {
            const d = new Date(s.submitted_at);
            const weekStart = new Date(d);
            weekStart.setDate(d.getDate() - d.getDay());
            const key = weekStart.toISOString().split('T')[0];
            const maxScore = assignments.find(a => a.id === s.assignment_id)?.max_score || 100;
            const pct = ((s.manual_score ?? s.ai_score ?? 0) / maxScore) * 100;
            if (!weeks[key]) weeks[key] = { total: 0, count: 0 };
            weeks[key].total += pct;
            weeks[key].count += 1;
          });
          return Object.entries(weeks).map(([date, v]) => ({
            date,
            averageScore: Math.round(v.total / v.count),
            submissionCount: v.count,
          }));
        })();

        // Ensure we always have at least a placeholder entry for empty arrays
        const safePeformers = topPerformers.length > 0 ? topPerformers : [{ studentName: "No data", averageGrade: 0, assignmentsCompleted: 0, missedDeadlines: 0 }];
        const safeStruggling = strugglingStudents.length > 0 ? strugglingStudents : [{ studentName: "No data", averageGrade: 0, assignmentsCompleted: 0, missedDeadlines: 0 }];

        setAnalytics({
          courseId: parseInt(id) || 0,
          courseName: course.title,
          courseCode: course.course_code,
          totalStudents,
          averageGrade,
          submissionRate: Math.min(submissionRate, 100),
          gradeDistribution,
          assignmentPerformance,
          topPerformers: safePeformers,
          strugglingStudents: safeStruggling,
          performanceOverTime,
        });
      } catch (err) {
        console.error("Failed to load analytics:", err);
      }
      setIsLoading(false);
    };
    loadAnalytics();
  }, [id, isDemo, courseId]);

  const sendFeedback = () => {
    // TODO: API call to send feedback/advice to student
    console.log("Sending feedback to:", selectedStudent, feedbackMessage);
    toast.success(`Advice sent to ${selectedStudent}! They'll receive a notification.`);
    setFeedbackOpen(false);
    setFeedbackMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Navigation activeTab="analytics" onTabChange={() => {}} onLogout={logout} />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto text-primary mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex h-screen bg-background">
        <Navigation activeTab="analytics" onTabChange={() => {}} onLogout={logout} />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Analytics data not available for this course.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  const barColors = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"];

  return (
    <div className="flex h-screen bg-background">
      <Navigation activeTab="analytics" onTabChange={() => {}} onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/courses/${courseId}`)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {analytics.courseName} Analytics
                </h1>
                <p className="text-muted-foreground mt-1">{analytics.courseCode}</p>
              </div>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card/80 border-border backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Students
                  </CardTitle>
                  <Users className="w-4 h-4 text-violet-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {analytics.totalStudents}
                </div>
                <p className="text-xs text-muted-foreground/60 mt-1">Enrolled this semester</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Grade
                  </CardTitle>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {analytics.averageGrade.toFixed(1)}%
                </div>
                <p className="text-xs text-emerald-500 mt-1">+2.3% from last semester</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Submission Rate
                  </CardTitle>
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {analytics.submissionRate.toFixed(1)}%
                </div>
                <Progress value={analytics.submissionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Top Performer
                  </CardTitle>
                  <Target className="w-4 h-4 text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {analytics.topPerformers[0].averageGrade.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {analytics.topPerformers[0].studentName}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-card/80 border border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grade Distribution */}
                <Card className="bg-card/80 border-border backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-foreground">Grade Distribution</CardTitle>
                    <CardDescription>
                      Distribution of student grades across the course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart 
                        data={analytics.gradeDistribution}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                          dataKey="range"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          tick={{ fill: "#94a3b8" }}
                          label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#f1f5f9" }}
                          itemStyle={{ color: "#a78bfa" }}
                          formatter={(value: any) => [`${value} students`, 'Count']}
                          cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                        />
                        <Bar 
                          dataKey="count" 
                          radius={[8, 8, 0, 0]}
                          animationDuration={800}
                          animationBegin={0}
                        >
                          {analytics.gradeDistribution.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={barColors[index]}
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {analytics.gradeDistribution.map((dist, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-sm" 
                              style={{ backgroundColor: barColors[idx] }}
                            />
                            <span className="text-muted-foreground">{dist.range}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={dist.percentage}
                              className="w-24 h-2"
                              style={{
                                ['--progress-background' as any]: barColors[idx]
                              }}
                            />
                            <span className="text-foreground/70 w-16 text-right">
                              {dist.count} ({dist.percentage.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Over Time */}
                <Card className="bg-card/80 border-border backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-foreground">Performance Trend</CardTitle>
                    <CardDescription>
                      Average scores and submission counts over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.performanceOverTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                          dataKey="date"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#f1f5f9" }}
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString();
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="averageScore"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          dot={{ fill: "#8b5cf6", r: 4 }}
                          name="Average Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                        <span className="text-muted-foreground">Average Score</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top & Struggling Students */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <Card className="bg-card/80 border-border backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5 text-amber-400" />
                      Top Performers
                    </CardTitle>
                    <CardDescription>
                      Students with highest average grades
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topPerformers.map((student, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-foreground">
                              #{idx + 1}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{student.studentName}</p>
                              <p className="text-xs text-muted-foreground">
                                {student.assignmentsCompleted} assignments completed
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            {student.averageGrade.toFixed(1)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Struggling Students */}
                <Card className="bg-card/80 border-border backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      Students Needing Support
                    </CardTitle>
                    <CardDescription>
                      Students who may need additional help
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.strugglingStudents.map((student, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border hover:border-orange-500/50 transition-all group"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{student.studentName}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {student.assignmentsCompleted} completed
                              </p>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-xs text-orange-400">
                                {student.missedDeadlines} missed
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              {student.averageGrade.toFixed(1)}%
                            </Badge>
                            <Dialog open={feedbackOpen && selectedStudent === student.studentName} onOpenChange={(open) => {
                              setFeedbackOpen(open);
                              if (open) setSelectedStudent(student.studentName);
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => setSelectedStudent(student.studentName)}
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  Send Advice
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px] bg-card border-border">
                                <DialogHeader>
                                  <DialogTitle className="text-foreground flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-orange-400" />
                                    Send Advice to {student.studentName}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Your message will be sent as a notification and email to help them improve.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  {/* Student Performance Summary */}
                                  <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Current Grade:</span>
                                      <span className="text-orange-400 font-semibold">{student.averageGrade.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Assignments Completed:</span>
                                      <span className="text-foreground">{student.assignmentsCompleted}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Missed Deadlines:</span>
                                      <span className="text-orange-400">{student.missedDeadlines}</span>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="feedback" className="text-foreground">Your Advice</Label>
                                    <Textarea
                                      id="feedback"
                                      placeholder="Share constructive feedback and encouragement...&#10;&#10;Example: I've noticed you're having difficulty with recent assignments. Let's schedule office hours to discuss strategies that can help improve your understanding of the material."
                                      className="min-h-[150px] bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/60"
                                      value={feedbackMessage}
                                      onChange={(e) => setFeedbackMessage(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Be encouraging and offer specific resources or support.
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 justify-end">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setFeedbackOpen(false);
                                      setFeedbackMessage("");
                                    }}
                                    className="border-border"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={sendFeedback}
                                    disabled={!feedbackMessage.trim()}
                                    className="bg-orange-500 hover:bg-orange-600 text-foreground"
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Advice
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-6">
              <Card className="bg-card/80 border-border backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-foreground">Assignment Performance</CardTitle>
                  <CardDescription>
                    Detailed breakdown of each assignment's results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.assignmentPerformance.map((assignment, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-muted/50 border border-border hover:border-violet-500/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{assignment.assignmentTitle}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                            Avg: {assignment.averageScore.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground/60 mb-1">Submission Rate</p>
                            <Progress value={assignment.submissionRate} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {assignment.submissionRate.toFixed(1)}% submitted
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground/60 mb-1">Average Score</p>
                            <Progress 
                              value={assignment.averageScore} 
                              className="h-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {assignment.averageScore.toFixed(1)}/100
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* All Top Performers */}
                <Card className="bg-card/80 border-border backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-foreground">All Top Performers</CardTitle>
                    <CardDescription>Complete list of high-achieving students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.topPerformers.map((student, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-foreground">
                              {student.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{student.studentName}</p>
                              <p className="text-xs text-muted-foreground">
                                {student.assignmentsCompleted}/{analytics.assignmentPerformance.length} assignments
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-400">
                              {student.averageGrade.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground/60">Average</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Students Needing Support */}
                <Card className="bg-card/80 border-border backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-foreground">Students at Risk</CardTitle>
                    <CardDescription>Students who may need intervention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.strugglingStudents.map((student, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-orange-900/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-bold text-foreground">
                              {student.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{student.studentName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{student.assignmentsCompleted} completed</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-orange-400">{student.missedDeadlines} missed</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-orange-400">
                              {student.averageGrade.toFixed(1)}%
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 text-xs border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                            >
                              Reach Out
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
