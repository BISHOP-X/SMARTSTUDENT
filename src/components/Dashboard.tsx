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
import { Plus, Bell, Search, Clock, TrendingUp, BookOpen, Users, AlertCircle, CheckCircle2, GraduationCap, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  mockUpcomingDeadlines, 
  mockRecentGrades, 
  mockCoursesTaught,
  mockLecturerSubmissions,
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

  // Calculate quick stats for lecturers
  const totalStudents = mockCoursesTaught.reduce((acc, c) => acc + c.students, 0);
  const totalPendingGrades = mockLecturerSubmissions.filter(s => s.status === "pending").length;
  const courseCount = mockCoursesTaught.length;

  const renderStudentDashboard = () => (
    <>
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <p className="text-sm text-muted-foreground mb-1">Pending Assignments</p>
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
                <p className="text-3xl font-bold text-foreground">{averageGrade}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
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
              <Button variant="glass" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </Button>
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
