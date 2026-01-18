import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Download,
  FileText,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navigation from "@/components/Navigation";
import MaterialUpload, { UploadedMaterial } from "@/components/MaterialUpload";

// Import course images
import courseBiology from "@/assets/course-biology.jpg";
import courseCs from "@/assets/course-cs.jpg";
import courseMath from "@/assets/course-math.jpg";
import courseLiterature from "@/assets/course-literature.jpg";

interface CourseDetailProps {
  userRole: "student" | "lecturer";
  onLogout: () => void;
}

// Mock course database - will be replaced with API calls
const mockCourses = {
  1: {
    title: "Molecular Biology",
    courseCode: "BIO301",
    instructor: "Dr. Sarah Chen",
    description:
      "Advanced study of cellular and molecular processes, including DNA replication, gene expression, and protein synthesis. This course covers fundamental concepts in molecular biology with practical laboratory applications.",
    progress: 68,
    students: 32,
    assignments: 8,
    nextClass: "Today, 10:00 AM",
    image: courseBiology,
    semester: "Spring 2026",
    credits: 4,
  },
  2: {
    title: "Data Structures & Algorithms",
    courseCode: "CS202",
    instructor: "Prof. Michael Park",
    description:
      "Comprehensive study of fundamental data structures and algorithmic techniques. Topics include arrays, linked lists, trees, graphs, sorting, searching, and complexity analysis.",
    progress: 45,
    students: 28,
    assignments: 12,
    nextClass: "Tomorrow, 2:00 PM",
    image: courseCs,
    semester: "Spring 2026",
    credits: 4,
  },
  3: {
    title: "Calculus III",
    courseCode: "MATH301",
    instructor: "Dr. Emily Watson",
    description:
      "Multivariable calculus covering partial derivatives, multiple integrals, vector calculus, and applications in physics and engineering.",
    progress: 82,
    students: 24,
    assignments: 10,
    nextClass: "Wed, 9:00 AM",
    image: courseMath,
    semester: "Spring 2026",
    credits: 3,
  },
  4: {
    title: "Modern Literature",
    courseCode: "LIT205",
    instructor: "Prof. James Rivera",
    description:
      "Exploration of 20th and 21st century literary works, examining themes of identity, society, and human experience through diverse cultural perspectives.",
    progress: 55,
    students: 19,
    assignments: 6,
    nextClass: "Thu, 11:00 AM",
    image: courseLiterature,
    semester: "Spring 2026",
    credits: 3,
  },
};

const CourseDetail = ({ userRole, onLogout }: CourseDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleMaterialUpload = (uploadedMaterials: UploadedMaterial[]) => {
    console.log("Uploaded materials:", uploadedMaterials);
    // TODO: API call to save materials
    // After successful upload, refresh materials list
  };

  // Get course from mock database
  const courseId = Number(id);
  const courseData = mockCourses[courseId as keyof typeof mockCourses];

  // If course not found, redirect to courses page
  if (!courseData) {
    navigate("/courses");
    return null;
  }

  const course = {
    id: courseId,
    ...courseData,
    status: "active",
  };

  const materials = [
    {
      id: 1,
      title: "Chapter 1: Introduction to Molecular Biology",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "2 days ago",
    },
    {
      id: 2,
      title: "Lecture Slides - DNA Structure",
      type: "PDF",
      size: "1.8 MB",
      uploadedAt: "1 week ago",
    },
    {
      id: 3,
      title: "Lab Manual - Gel Electrophoresis",
      type: "PDF",
      size: "3.2 MB",
      uploadedAt: "2 weeks ago",
    },
  ];

  const assignments = [
    {
      id: 1,
      title: "DNA Replication Essay",
      dueDate: "Jan 25, 2026",
      status: "pending",
      maxScore: 100,
      submissions: 12,
    },
    {
      id: 2,
      title: "Gene Expression Quiz",
      dueDate: "Jan 30, 2026",
      status: "upcoming",
      maxScore: 50,
      submissions: 0,
    },
    {
      id: 3,
      title: "Lab Report - PCR Analysis",
      dueDate: "Jan 15, 2026",
      status: "graded",
      maxScore: 100,
      submissions: 32,
      score: 87,
    },
  ];

  const students = [
    { id: 1, name: "Alex Johnson", email: "alex.j@university.edu", progress: 85 },
    { id: 2, name: "Sarah Williams", email: "sarah.w@university.edu", progress: 92 },
    { id: 3, name: "Michael Chen", email: "michael.c@university.edu", progress: 78 },
    { id: 4, name: "Emily Rodriguez", email: "emily.r@university.edu", progress: 95 },
  ];

  const handleBack = () => {
    navigate("/courses");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="relative h-64 w-full">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

          {/* Back Button */}
          <Button
            variant="glass"
            size="icon"
            className="absolute top-6 left-6 z-10"
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Course Actions (Lecturer Only) */}
          {userRole === "lecturer" && (
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              <Button variant="glass" size="icon">
                <Edit className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Course
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Course Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{course.courseCode}</Badge>
                  <Badge variant="outline">{course.semester}</Badge>
                  <Badge>{course.credits} Credits</Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
                <p className="text-muted-foreground">{course.instructor}</p>
              </div>

              {userRole === "lecturer" ? (
                <Button variant="hero" size="lg">
                  <Plus className="w-5 h-5" />
                  Add Material
                </Button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm text-muted-foreground">Your Progress</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-primary">{course.progress}%</div>
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-y border-border bg-secondary/30">
          <div className="px-6 py-4 flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-semibold text-foreground">{course.students}</span>
                <span className="text-muted-foreground"> Students</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-semibold text-foreground">{course.assignments}</span>
                <span className="text-muted-foreground"> Assignments</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-semibold text-foreground">Next Class:</span>
                <span className="text-muted-foreground"> {course.nextClass}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="materials">Materials ({materials.length})</TabsTrigger>
              <TabsTrigger value="assignments">Assignments ({assignments.length})</TabsTrigger>
              {userRole === "lecturer" && (
                <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
              )}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">About This Course</h2>
                <p className="text-muted-foreground leading-relaxed">{course.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">Recent Materials</h3>
                  <div className="space-y-3">
                    {materials.slice(0, 3).map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {material.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {material.size} • {material.uploadedAt}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">Upcoming Assignments</h3>
                  <div className="space-y-3">
                    {assignments
                      .filter((a) => a.status !== "graded")
                      .slice(0, 3)
                      .map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                        >
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {assignment.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Due: {assignment.dueDate}
                            </div>
                          </div>
                          <Badge
                            variant={assignment.status === "pending" ? "default" : "secondary"}
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Course Materials</h2>
                  {userRole === "lecturer" && (
                    <Button variant="hero" onClick={() => setIsUploadModalOpen(true)}>
                      <Plus className="w-4 h-4" />
                      Upload Material
                    </Button>
                  )}
                </div>

                {materials.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No materials uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{material.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {material.type} • {material.size} • Uploaded {material.uploadedAt}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                          {userRole === "lecturer" && (
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Assignments</h2>
                  {userRole === "lecturer" && (
                    <Button variant="hero">
                      <Plus className="w-4 h-4" />
                      Create Assignment
                    </Button>
                  )}
                </div>

                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No assignments yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-foreground">{assignment.title}</h3>
                            <Badge
                              variant={
                                assignment.status === "graded"
                                  ? "default"
                                  : assignment.status === "pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {assignment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Due: {assignment.dueDate}</span>
                            <span>Max Score: {assignment.maxScore}</span>
                            {userRole === "lecturer" && (
                              <span>Submissions: {assignment.submissions}/{course.students}</span>
                            )}
                          </div>
                        </div>
                        {assignment.status === "graded" && assignment.score && userRole === "student" && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{assignment.score}</div>
                            <div className="text-xs text-muted-foreground">/{assignment.maxScore}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Students Tab (Lecturer Only) */}
            {userRole === "lecturer" && (
              <TabsContent value="students">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Enrolled Students</h2>

                  <div className="space-y-2">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-primary-foreground font-semibold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Progress</div>
                            <div className="text-lg font-semibold text-foreground">
                              {student.progress}%
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      {/* Material Upload Modal */}
      <MaterialUpload
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleMaterialUpload}
        courseId={id}
      />
    </div>
  );
};

export default CourseDetail;
