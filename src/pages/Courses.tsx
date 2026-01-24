import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, BookOpen, Users, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import CourseCreationForm, { CourseFormData } from "@/components/CourseCreationForm";
import { useAuth } from "@/contexts/AuthContext";

// Import course images
import courseBiology from "@/assets/course-biology.jpg";
import courseCs from "@/assets/course-cs.jpg";
import courseMath from "@/assets/course-math.jpg";
import courseLiterature from "@/assets/course-literature.jpg";

interface CoursesPageProps {
  userRole: "student" | "lecturer";
  onLogout: () => void;
}

const CoursesPage = ({ userRole, onLogout }: CoursesPageProps) => {
  const navigate = useNavigate();
  const { isDemo } = useAuth();
  const [activeTab] = useState("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateCourse = (courseData: CourseFormData) => {
    console.log("Creating course:", courseData);
    // TODO: API call to create course
    // After successful creation, refresh course list
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  // Mock data - only shown in demo mode
  const mockCourses = [
    {
      id: 1,
      title: "Molecular Biology",
      courseCode: "BIO301",
      instructor: "Dr. Sarah Chen",
      description: "Advanced study of cellular and molecular processes",
      progress: 68,
      students: 32,
      assignments: 8,
      nextClass: "Today, 10:00 AM",
      image: courseBiology,
      status: "active",
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      courseCode: "CS202",
      instructor: "Prof. Michael Park",
      description: "Fundamental algorithms and data structures for software development",
      progress: 45,
      students: 28,
      assignments: 12,
      nextClass: "Tomorrow, 2:00 PM",
      image: courseCs,
      status: "active",
    },
    {
      id: 3,
      title: "Calculus III",
      courseCode: "MATH301",
      instructor: "Dr. Emily Watson",
      description: "Multivariable calculus and vector analysis",
      progress: 82,
      students: 24,
      assignments: 10,
      nextClass: "Wed, 9:00 AM",
      image: courseMath,
      status: "active",
    },
    {
      id: 4,
      title: "Modern Literature",
      courseCode: "ENG205",
      instructor: "Prof. James Rivera",
      description: "Contemporary literature and critical analysis",
      progress: 55,
      students: 19,
      assignments: 6,
      nextClass: "Thu, 11:00 AM",
      image: courseLiterature,
      status: "active",
    },
  ];

  // Show mock data only in demo mode, empty array for real auth
  const courses = isDemo ? mockCourses : [];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={() => {}} onLogout={onLogout} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  {userRole === "student" ? "My Courses" : "Courses I Teach"}
                </h1>
                <p className="text-muted-foreground">
                  {userRole === "student"
                    ? "Continue your learning journey"
                    : "Manage your courses and track student progress"}
                </p>
              </div>
              {userRole === "lecturer" && (
                <Button variant="hero" size="lg" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-5 h-5" />
                  Create Course
                </Button>
              )}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, instructors, or codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-0"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] bg-secondary/50 border-0">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Courses Grid */}
        <div className="p-6">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : !isDemo
                  ? "You're using a real account. Use Demo mode to see sample courses."
                  : userRole === "student"
                  ? "Browse the course catalog to enroll in your first course"
                  : "Create your first course to get started"}
              </p>
              {userRole === "student" && isDemo && (
                <Button variant="hero">Browse Courses</Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="course-card group cursor-pointer"
                  onClick={() => handleCourseClick(course.id)}
                >
                  {/* Course Image */}
                  <div className="aspect-card w-full">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
                    {/* Progress Bar */}
                    {userRole === "student" && (
                      <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Course Info */}
                    <div className="mb-2">
                      <Badge variant="secondary" className="mb-2">
                        {course.courseCode}
                      </Badge>
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {course.instructor}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{course.students}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{course.assignments}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.nextClass}</span>
                      </div>
                    </div>

                    {/* Hover Badge */}
                    {userRole === "student" && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                          <TrendingUp className="w-3 h-3" />
                          {course.progress}%
                        </div>
                      </div>
                    )}

                    {/* Course Icon */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Course Creation Modal */}
      <CourseCreationForm
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCourse}
      />
    </div>
  );
};

export default CoursesPage;
