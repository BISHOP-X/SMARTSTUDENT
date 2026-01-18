import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Users, FileText, Target, Download, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { mockCourseAnalytics } from "@/data/mockData";
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
  const courseId = parseInt(id || "0");

  const analytics = mockCourseAnalytics[courseId];

  if (!analytics) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navigation />
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
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/courses/${courseId}`)}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {analytics.courseName} Analytics
                </h1>
                <p className="text-slate-400 mt-1">{analytics.courseCode}</p>
              </div>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Total Students
                  </CardTitle>
                  <Users className="w-4 h-4 text-violet-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {analytics.totalStudents}
                </div>
                <p className="text-xs text-slate-500 mt-1">Enrolled this semester</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Average Grade
                  </CardTitle>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {analytics.averageGrade.toFixed(1)}%
                </div>
                <p className="text-xs text-emerald-500 mt-1">+2.3% from last semester</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Submission Rate
                  </CardTitle>
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {analytics.submissionRate.toFixed(1)}%
                </div>
                <Progress value={analytics.submissionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Top Performer
                  </CardTitle>
                  <Target className="w-4 h-4 text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {analytics.topPerformers[0].averageGrade.toFixed(1)}%
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {analytics.topPerformers[0].studentName}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grade Distribution */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Grade Distribution</CardTitle>
                    <CardDescription>
                      Distribution of student grades across the course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.gradeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                          dataKey="range"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                        />
                        <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#f1f5f9" }}
                          itemStyle={{ color: "#a78bfa" }}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                          {analytics.gradeDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={barColors[index]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {analytics.gradeDistribution.map((dist, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">{dist.range}</span>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={dist.percentage}
                              className="w-24 h-2"
                              style={{ 
                                //@ts-ignore
                                "--progress-background": barColors[idx] 
                              }}
                            />
                            <span className="text-slate-300 w-12 text-right">
                              {dist.count} ({dist.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Over Time */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Performance Trend</CardTitle>
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
                        <span className="text-slate-400">Average Score</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top & Struggling Students */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
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
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white">
                              #{idx + 1}
                            </div>
                            <div>
                              <p className="font-medium text-white">{student.studentName}</p>
                              <p className="text-xs text-slate-400">
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
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      Students Needing Support
                    </CardTitle>
                    <CardDescription>
                      Students who may need additional help
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.strugglingStudents.map((student, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                        >
                          <div>
                            <p className="font-medium text-white">{student.studentName}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-slate-400">
                                {student.assignmentsCompleted} completed
                              </p>
                              <span className="text-slate-600">•</span>
                              <p className="text-xs text-orange-400">
                                {student.missedDeadlines} missed
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {student.averageGrade.toFixed(1)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Assignment Performance</CardTitle>
                  <CardDescription>
                    Detailed breakdown of each assignment's results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.assignmentPerformance.map((assignment, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-violet-500/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-white">{assignment.assignmentTitle}</h3>
                            <p className="text-sm text-slate-400 mt-1">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                            Avg: {assignment.averageScore.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Submission Rate</p>
                            <Progress value={assignment.submissionRate} className="h-2" />
                            <p className="text-xs text-slate-400 mt-1">
                              {assignment.submissionRate.toFixed(1)}% submitted
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Average Score</p>
                            <Progress 
                              value={assignment.averageScore} 
                              className="h-2"
                            />
                            <p className="text-xs text-slate-400 mt-1">
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
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">All Top Performers</CardTitle>
                    <CardDescription>Complete list of high-achieving students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.topPerformers.map((student, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-white">
                              {student.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-white">{student.studentName}</p>
                              <p className="text-xs text-slate-400">
                                {student.assignmentsCompleted}/{analytics.assignmentPerformance.length} assignments
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-400">
                              {student.averageGrade.toFixed(1)}%
                            </p>
                            <p className="text-xs text-slate-500">Average</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Students Needing Support */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Students at Risk</CardTitle>
                    <CardDescription>Students who may need intervention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.strugglingStudents.map((student, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-orange-900/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-bold text-white">
                              {student.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-white">{student.studentName}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>{student.assignmentsCompleted} completed</span>
                                <span className="text-slate-600">•</span>
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
