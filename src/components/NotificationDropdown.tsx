import { useState } from "react";
import { Bell, Check, CheckCheck, BookOpen, FileText, Calendar, Upload, Megaphone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { 
  mockNotifications, 
  mockLecturerNotifications, 
  getUnreadNotificationCount,
  type Notification 
} from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<Notification[]>(
    userRole === "lecturer" ? mockLecturerNotifications : mockNotifications
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));

    // Navigate based on notification type
    if (notification.relatedType === "assignment" && notification.relatedId) {
      // Navigate to assignment detail (assuming courseId is available)
      const assignment = mockNotifications.find(n => n.relatedId === notification.relatedId);
      if (assignment) {
        // For demo, navigate to courses page
        navigate("/courses");
      }
    } else if (notification.relatedType === "course" && notification.relatedId) {
      navigate(`/courses/${notification.relatedId}`);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "assignment_posted":
        return <BookOpen className="w-4 h-4 text-violet-400" />;
      case "grade_received":
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case "deadline_reminder":
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case "material_uploaded":
        return <Upload className="w-4 h-4 text-blue-400" />;
      case "announcement":
        return <Megaphone className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "assignment_posted":
        return "bg-violet-500/10 border-violet-500/20";
      case "grade_received":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "deadline_reminder":
        return "bg-amber-500/10 border-amber-500/20";
      case "material_uploaded":
        return "bg-blue-500/10 border-blue-500/20";
      case "announcement":
        return "bg-purple-500/10 border-purple-500/20";
      default:
        return "bg-slate-500/10 border-slate-500/20";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-400 hover:text-white" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-2 border-slate-900"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-96 bg-slate-900 border-slate-800"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-white">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto py-1 px-2 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-800" />
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No notifications yet</p>
            <p className="text-slate-500 text-xs mt-1">We'll notify you when something arrives</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all border
                    ${notification.isRead 
                      ? "bg-slate-900/50 border-transparent hover:bg-slate-800/50" 
                      : `${getNotificationColor(notification.type)} border`
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${notification.isRead ? "text-slate-300" : "text-white"}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="h-6 w-6 shrink-0 hover:bg-slate-700"
                          >
                            <Check className="w-3 h-3 text-slate-400" />
                          </Button>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${notification.isRead ? "text-slate-500" : "text-slate-400"}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem 
              className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 cursor-pointer justify-center"
              onClick={() => console.log("View all notifications")}
            >
              View All Notifications
              <ExternalLink className="w-3 h-3 ml-1" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
