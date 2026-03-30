import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Users, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getMyCourses, type Course } from "@/lib/course-service";

export default function AnalyticsHub() {
  const navigate = useNavigate();
  const { logout, isDemo } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      // demo: redirect to course 1 analytics
      navigate("/courses/1/analytics", { replace: true });
      return;
    }
    const load = async () => {
      const { courses: c } = await getMyCourses();
      setCourses(c);
      // If only one course, go directly
      if (c.length === 1) {
        navigate(`/courses/${c[0].id}/analytics`, { replace: true });
        return;
      }
      setIsLoading(false);
    };
    load();
  }, [isDemo, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Navigation activeTab="analytics" onTabChange={() => {}} onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation activeTab="analytics" onTabChange={() => {}} onLogout={logout} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Course Analytics</h1>
            <p className="text-muted-foreground mt-1">Select a course to view detailed analytics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="bg-card/80 border-border backdrop-blur hover:border-violet-500/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}/analytics`)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-violet-400" />
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{course.course_code}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {course.student_count || 0} students
                    </div>
                    <Button variant="ghost" size="sm">
                      View <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {courses.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No courses found. Create a course first to view analytics.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
