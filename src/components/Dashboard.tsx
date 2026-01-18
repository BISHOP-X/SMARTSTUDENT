import { useState } from "react";
import TimeGreeting from "@/components/TimeGreeting";
import CourseCard from "@/components/CourseCard";
import CalendarWidget from "@/components/CalendarWidget";
import GoalTracker from "@/components/GoalTracker";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import courseBiology from "@/assets/course-biology.jpg";
import courseCs from "@/assets/course-cs.jpg";
import courseMath from "@/assets/course-math.jpg";
import courseLiterature from "@/assets/course-literature.jpg";

interface DashboardProps {
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

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
          <TimeGreeting userName="Alex" />

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Courses Section - Takes 2 columns */}
            <section className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Your Courses</h2>
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    title={course.title}
                    instructor={course.instructor}
                    progress={course.progress}
                    nextClass={course.nextClass}
                    image={course.image}
                    students={course.students}
                  />
                ))}
              </div>
            </section>

            {/* Sidebar Widgets */}
            <aside className="space-y-6">
              <CalendarWidget />
              <GoalTracker />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
