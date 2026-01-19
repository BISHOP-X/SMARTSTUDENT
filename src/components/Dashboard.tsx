import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeGreeting from "@/components/TimeGreeting";
import CourseCard from "@/components/CourseCard";
import CalendarWidget from "@/components/CalendarWidget";
import GoalTracker from "@/components/GoalTracker";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Clock, TrendingUp, BookOpen, Users, AlertCircle, CheckCircle2, GraduationCap, FileText, Target, Zap, Award, Calendar as CalendarIcon, ArrowRight, Sparkles, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  mockUpcomingDeadlines, 
  mockRecentGrades, 
  mockCoursesTaught,
  mockLecturerSubmissions,
  mockStudentSubmissions,
  getDaysUntil,
  formatDate,
  getTimeAgo,
  type Assignment,
  type GradeEntry
} from "@/data/mockData";

import courseBiology from "@/assets/course-biology.jpg";
import courseCs from "@/assets/course-cs.jpg";
import courseMath from "@/assets/course-math.jpg";
import courseLiterature from "@/assets/course-literature.jpg";
import NotificationDropdown from "@/components/NotificationDropdown";

interface DashboardProps {
  userRole: "student" | "lecturer";
  onLogout: () => void;
}

const courses = [
  {
    id: 1,
    title: "Molecular Biology",
    instructor: "Dr. Sarah Chen",
    progress: 68,
    nextClass: "Today, 10:00 AM",
    image: courseBiology,
    students: 32,
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    instructor: "Prof. Michael Park",
    progress: 45,
    nextClass: "Tomorrow, 2:00 PM",
    image: courseCs,
    students: 28,
  },
  {
    id: 3,
    title: "Calculus III",
    instructor: "Dr. Emily Watson",
    progress: 82,
    nextClass: "Wed, 9:00 AM",
    image: courseMath,
    students: 24,
  },
  {
    id: 4,
    title: "Modern Literature",
    instructor: "Prof. James Rivera",
    progress: 55,
    nextClass: "Thu, 11:00 AM",
    image: courseLiterature,
    students: 19,
  },
];

const Dashboard = ({ userRole, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    navigate(`/courses/${assignment.courseId}/assignments/${assignment.id}`);
  };

  const handleViewAllSubmissions = () => {
    navigate("/submissions");
  };

  const handleViewGradingQueue = () => {
    navigate("/grading");
  };

  // Calculate quick stats for students
  const coursesEnrolled = courses.length;
  const pendingAssignments = mockUpcomingDeadlines.filter(a => a.status === "upcoming").length;
  const averageGrade = mockRecentGrades.length > 0 
    ? Math.round(mockRecentGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 100), 0) / mockRecentGrades.length)
    : 0;

  // Additional stats for enhanced dashboard
  const totalSubmissions = mockStudentSubmissions.length;
  const completedAssignments = mockStudentSubmissions.filter(s => s.status === "graded").length;
  const assignmentCompletionRate = totalSubmissions > 0 
    ? Math.round((completedAssignments / totalSubmissions) * 100) 
    : 0;
  
  // Study streak (mock data - days in a row with activity)
  const studyStreak = 7; // Mock: 7 days streak
  
  // Next class calculation
  const nextClass = courses.reduce((nearest, course) => {
    const courseTime = new Date(course.nextClass).getTime();
    const nearestTime = new Date(nearest.nextClass).getTime();
    return courseTime < nearestTime ? course : nearest;
  }, courses[0]);

  // Grade trend (mock data showing improvement)
  const gradeTrend = mockRecentGrades.length >= 2 
    ? mockRecentGrades[0].score / mockRecentGrades[0].maxScore - mockRecentGrades[mockRecentGrades.length - 1].score / mockRecentGrades[mockRecentGrades.length - 1].maxScore
    : 0;
  const isTrendingUp = gradeTrend > 0;

  // Calculate performance by course
  const performanceByCourse = courses.map(course => {
    const courseGrades = mockRecentGrades.filter(g => g.courseName === course.title);
    const avgGrade = courseGrades.length > 0
      ? Math.round(courseGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 100), 0) / courseGrades.length)
      : 0;
    return { courseName: course.title, avgGrade };
  });

  // Calculate quick stats for lecturers
  const totalStudents = mockCoursesTaught.reduce((acc, c) => acc + c.students, 0);
  const totalPendingGrades = mockLecturerSubmissions.filter(s => s.status === "pending").length;
  const courseCount = mockCoursesTaught.length;

  const renderStudentDashboard = () => (
    <>
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Courses Enrolled</p>
                <p className="text-3xl font-bold text-foreground">{coursesEnrolled}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold text-foreground">{pendingAssignments}</p>
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
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-foreground">{averageGrade}%</p>
                  {isTrendingUp ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-muted-foreground rotate-180" />
                  )}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Study Streak</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-foreground">{studyStreak}</p>
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">days in a row!</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Class & Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Next Class Countdown */}
        <Card className="glass-card border-0 bg-gradient-to-br from-primary/5 to-info/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Next Class</h3>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">{nextClass.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{nextClass.nextClass}</p>
                <Button 
                  variant="hero" 
                  size="sm"
                  onClick={() => handleCourseClick(nextClass.id)}
                >
                  View Course
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Starting Soon
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 py-3"
                onClick={() => navigate("/submissions")}
              >
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-xs">Submissions</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 py-3"
                onClick={() => navigate("/calendar")}
              >
                <CalendarIcon className="w-5 h-5 text-info" />
                <span className="text-xs">Calendar</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 py-3"
                onClick={() => navigate("/goals")}
              >
                <Target className="w-5 h-5 text-success" />
                <span className="text-xs">Goals</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 py-3"
                onClick={() => navigate("/courses")}
              >
                <BookOpen className="w-5 h-5 text-accent" />
                <span className="text-xs">All Courses</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Completion & Performance Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Assignment Completion Rate */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Assignment Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">{assignmentCompletionRate}%</span>
                <span className="text-sm text-muted-foreground">
                  {completedAssignments} of {totalSubmissions} completed
                </span>
              </div>
              <Progress value={assignmentCompletionRate} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {totalSubmissions - completedAssignments > 0 
                  ? `${totalSubmissions - completedAssignments} assignment${totalSubmissions - completedAssignments > 1 ? 's' : ''} pending grade`
                  : "All assignments graded!"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Performance by Course */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Performance by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceByCourse.slice(0, 3).map((course, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate flex-1">{course.courseName}</span>
                    <span className="font-medium text-foreground ml-2">{course.avgGrade}%</span>
                  </div>
                  <Progress 
                    value={course.avgGrade} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Courses and Deadlines */}
        <div className="xl:col-span-2 space-y-6">
          {/* Courses Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Your Courses</h2>
              <Button variant="ghost" className="text-primary" onClick={() => navigate("/courses")}>
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  courseId={course.id}
                  title={course.title}
                  instructor={course.instructor}
                  progress={course.progress}
                  nextClass={course.nextClass}
                  image={course.image}
                  students={course.students}
                  onClick={handleCourseClick}
                />
              ))}
            </div>
          </section>

          {/* Upcoming Deadlines Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Upcoming Deadlines</h2>
              <Button variant="ghost" className="text-primary" onClick={handleViewAllSubmissions}>
                View All
              </Button>
            </div>

            <Card className="glass-card border-0">
              <CardContent className="p-6">
                {mockUpcomingDeadlines.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                    <p className="text-muted-foreground">No upcoming deadlines</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockUpcomingDeadlines.map((assignment) => {
                      const daysUntil = getDaysUntil(assignment.dueDate);
                      const isOverdue = daysUntil < 0;
                      const isDueSoon = daysUntil <= 2 && daysUntil >= 0;

                      return (
                        <div
                          key={assignment.id}
                          className="flex items-start justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                          onClick={() => handleAssignmentClick(assignment)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground truncate">{assignment.title}</h4>
                              {isOverdue && (
                                <Badge variant="destructive" className="shrink-0">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Overdue
                                </Badge>
                              )}
                              {isDueSoon && !isOverdue && (
                                <Badge variant="warning" className="shrink-0 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Due Soon
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{assignment.courseName}</p>
                          </div>
                          <div className="text-right ml-4 shrink-0">
                            <p className="text-sm font-medium text-foreground">
                              {isOverdue 
                                ? `${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''} overdue`
                                : daysUntil === 0
                                ? "Due today"
                                : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} left`
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Recent Grades Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Recent Grades</h2>
              <Button variant="ghost" className="text-primary" onClick={handleViewAllSubmissions}>
                View All
              </Button>
            </div>

            <Card className="glass-card border-0">
              <CardContent className="p-6">
                {mockRecentGrades.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No grades yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockRecentGrades.map((grade) => {
                      const percentage = Math.round((grade.score / grade.maxScore) * 100);
                      const isExcellent = percentage >= 90;
                      const isGood = percentage >= 75 && percentage < 90;
                      const isFair = percentage >= 60 && percentage < 75;

                      return (
                        <div
                          key={grade.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground truncate">{grade.assignmentTitle}</h4>
                              {grade.isAiGraded && (
                                <Badge variant="outline" className="shrink-0 border-primary/30 text-primary text-xs">
                                  AI Graded
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{grade.courseName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Graded {getTimeAgo(grade.gradedAt)}
                            </p>
                          </div>
                          <div className="text-right ml-4 shrink-0">
                            <div className={`text-2xl font-bold ${
                              isExcellent ? "text-success" : 
                              isGood ? "text-primary" : 
                              isFair ? "text-amber-600" : 
                              "text-destructive"
                            }`}>
                              {percentage}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {grade.score}/{grade.maxScore}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right Column - Sidebar Widgets */}
        <aside className="space-y-6">
          {/* AI Study Insights */}
          <Card className="glass-card border-0 bg-gradient-to-br from-primary/5 via-info/5 to-success/5">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Study Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-background/50">
                <p className="text-sm text-foreground mb-2">
                  <span className="font-semibold text-success">Great work!</span> Your grades have improved by 8% this week.
                </p>
                <p className="text-xs text-muted-foreground">
                  Keep up the momentum in Data Structures & Algorithms.
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-background/50">
                <p className="text-sm text-foreground mb-2">
                  <span className="font-semibold text-accent">Reminder:</span> You have 3 assignments due this week.
                </p>
                <p className="text-xs text-muted-foreground">
                  Start with "DNA Replication Analysis" (due in 2 days).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background/50">
                <p className="text-sm text-foreground mb-2">
                  <span className="font-semibold text-info">Tip:</span> Your best study time is 10-11 AM.
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on your submission patterns and grades.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Grade Received</p>
                    <p className="text-xs text-muted-foreground truncate">Graph Algorithms Quiz: 92%</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Assignment Submitted</p>
                    <p className="text-xs text-muted-foreground truncate">BST Implementation</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Material Uploaded</p>
                    <p className="text-xs text-muted-foreground truncate">Lecture 12 Notes - Biology</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">New Assignment Posted</p>
                    <p className="text-xs text-muted-foreground truncate">Protein Synthesis Essay</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-4"
                onClick={handleViewAllSubmissions}
              >
                View All Activity
              </Button>
            </CardContent>
          </Card>

          <CalendarWidget />
          <GoalTracker />
        </aside>
      </div>
    </>
  );

  const renderLecturerDashboard = () => (
    <>
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
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
                <p className="text-sm text-muted-foreground mb-1">Pending Grades</p>
                <p className="text-3xl font-bold text-foreground">{totalPendingGrades}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Courses Teaching</p>
                <p className="text-3xl font-bold text-foreground">{courseCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Courses and Submissions */}
        <div className="xl:col-span-2 space-y-6">
          {/* Courses I Teach Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Courses I Teach</h2>
              <Button variant="ghost" className="text-primary" onClick={() => navigate("/courses")}>
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mockCoursesTaught.map((course) => {
                const matchingCourseData = courses.find(c => c.id === course.id);
                return (
                  <Card key={course.id} className="glass-card border-0 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCourseClick(course.id)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.code}</p>
                        </div>
                        {course.pendingSubmissions > 0 && (
                          <Badge variant="destructive" className="shrink-0">
                            {course.pendingSubmissions} pending
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Students</span>
                          <span className="font-medium text-foreground">{course.students}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Average Grade</span>
                          <span className="font-medium text-foreground">{course.averageGrade}%</span>
                        </div>
                      </div>

                      {course.pendingSubmissions > 0 && (
                        <Button 
                          variant="hero" 
                          size="sm" 
                          className="w-full mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewGradingQueue();
                          }}
                        >
                          Grade Now ({course.pendingSubmissions})
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Recent Submissions Needing Grading */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Recent Submissions</h2>
              <Button variant="ghost" className="text-primary" onClick={handleViewGradingQueue}>
                View Queue
              </Button>
            </div>

            <Card className="glass-card border-0">
              <CardContent className="p-6">
                {mockLecturerSubmissions.filter(s => s.status === "pending").length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                    <p className="text-muted-foreground">All caught up!</p>
                    <p className="text-sm text-muted-foreground mt-1">No pending submissions to grade</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockLecturerSubmissions
                      .filter(s => s.status === "pending")
                      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
                      .slice(0, 5)
                      .map((submission) => (
                        <div
                          key={submission.id}
                          className="flex items-start justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/courses/${submission.courseId}/assignments/${submission.assignmentId}`)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground truncate">{submission.studentName}</h4>
                              <Badge variant="outline" className="shrink-0 text-xs">
                                {submission.courseName}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{submission.assignmentTitle}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Submitted {getTimeAgo(submission.submittedAt)}
                            </p>
                          </div>
                          <Button 
                            variant="hero" 
                            size="sm"
                            className="ml-4 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/courses/${submission.courseId}/assignments/${submission.assignmentId}`);
                            }}
                          >
                            Grade
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right Column - Sidebar Widgets */}
        <aside className="space-y-6">
          <CalendarWidget />
          <GoalTracker />
        </aside>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses, assignments..." 
                className="pl-10 bg-secondary/50 border-0"
              />
            </div>
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4" />
                New Task
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-8">
          {/* Time-based Greeting */}
          <TimeGreeting userName={userRole === "student" ? "Alex" : "Dr. Morgan"} />

          {/* Role-based Dashboard Content */}
          {userRole === "student" ? renderStudentDashboard() : renderLecturerDashboard()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
