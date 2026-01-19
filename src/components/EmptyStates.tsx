import { FileX, BookOpen, ClipboardList, Calendar, Target, Bell, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center space-y-4 max-w-md mx-auto">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {action && (
          <Button onClick={action.onClick} className="mt-4">
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

// Empty states for different scenarios

export function EmptyCoursesStudent() {
  const navigate = useNavigate();
  return (
    <EmptyState
      icon={<BookOpen className="h-10 w-10 text-muted-foreground" />}
      title="No Courses Enrolled"
      description="You haven't enrolled in any courses yet. Contact your administrator to get enrolled in courses."
      action={{
        label: "Browse Available Courses",
        onClick: () => navigate('/courses')
      }}
    />
  );
}

export function EmptyCoursesLecturer() {
  return (
    <EmptyState
      icon={<BookOpen className="h-10 w-10 text-muted-foreground" />}
      title="No Courses Created"
      description="You haven't created any courses yet. Click the 'Create Course' button above to get started."
    />
  );
}

export function EmptySubmissions() {
  const navigate = useNavigate();
  return (
    <EmptyState
      icon={<ClipboardList className="h-10 w-10 text-muted-foreground" />}
      title="No Submissions Yet"
      description="You haven't submitted any assignments yet. Check your courses for available assignments."
      action={{
        label: "View My Courses",
        onClick: () => navigate('/courses')
      }}
    />
  );
}

export function EmptyGradingQueue() {
  return (
    <EmptyState
      icon={<ClipboardList className="h-10 w-10 text-green-600" />}
      title="All Caught Up!"
      description="Great work! There are no pending submissions to grade at this time."
    />
  );
}

export function EmptyAssignments() {
  return (
    <EmptyState
      icon={<FileX className="h-10 w-10 text-muted-foreground" />}
      title="No Assignments"
      description="This course doesn't have any assignments yet. Check back later or contact your lecturer."
    />
  );
}

export function EmptyMaterials() {
  return (
    <EmptyState
      icon={<FileX className="h-10 w-10 text-muted-foreground" />}
      title="No Materials Uploaded"
      description="No course materials have been uploaded yet. Check back later for resources."
    />
  );
}

export function EmptyGoals() {
  return (
    <EmptyState
      icon={<Target className="h-10 w-10 text-muted-foreground" />}
      title="No Goals Set"
      description="You haven't created any personal goals yet. Set goals to track your progress and stay organized."
    />
  );
}

export function EmptyCalendarEvents() {
  const navigate = useNavigate();
  return (
    <EmptyState
      icon={<Calendar className="h-10 w-10 text-muted-foreground" />}
      title="No Events This Day"
      description="You don't have any assignments or goals scheduled for this date."
      action={{
        label: "Create a Goal",
        onClick: () => navigate('/goals')
      }}
    />
  );
}

export function EmptyNotifications() {
  return (
    <div className="p-8 text-center text-muted-foreground">
      <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
      <p className="font-medium">No notifications</p>
      <p className="text-sm mt-1">You're all caught up!</p>
    </div>
  );
}

export function EmptyStudents() {
  return (
    <EmptyState
      icon={<Users className="h-10 w-10 text-muted-foreground" />}
      title="No Students Enrolled"
      description="No students have enrolled in this course yet."
    />
  );
}

export function EmptySearchResults({ query }: { query: string }) {
  return (
    <Card className="p-8 text-center">
      <FileX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
      <p className="text-muted-foreground">
        No results found for "<span className="font-medium">{query}</span>". Try adjusting your search or filters.
      </p>
    </Card>
  );
}

export function EmptyFilterResults() {
  return (
    <Card className="p-8 text-center">
      <FileX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Matching Items</h3>
      <p className="text-muted-foreground">
        No items match your current filters. Try adjusting your selection.
      </p>
    </Card>
  );
}
