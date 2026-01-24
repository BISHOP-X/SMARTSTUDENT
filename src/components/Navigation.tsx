import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Target, 
  BarChart3, 
  Settings,
  Sparkles,
  ChevronLeft,
  LogOut,
  User,
  FileText,
  ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void; // Made optional - we'll use AuthContext directly
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, isDemo, user, logout } = useAuth();

  // Handle logout - always works regardless of which page
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get display name based on auth mode
  const getDisplayName = () => {
    if (isDemo) {
      return userRole === "student" ? "Alex Morgan (Demo)" : "Dr. Morgan (Demo)";
    }
    // Real auth - show email or "User"
    if (user?.email) {
      return user.email.split('@')[0]; // Show first part of email
    }
    return userRole === "student" ? "Student" : "Lecturer";
  };

  // Define navigation items based on user role
  const studentNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
    { id: "courses", label: "My Courses", icon: BookOpen, path: "/courses" },
    { id: "submissions", label: "My Submissions", icon: FileText, path: "/submissions" },
    { id: "ai-tools", label: "AI Study Tools", icon: Sparkles, path: "/ai-tools" },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar" },
    { id: "goals", label: "Goals", icon: Target, path: "/goals" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const lecturerNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
    { id: "courses", label: "My Courses", icon: BookOpen, path: "/courses" },
    { id: "grading", label: "Grading Queue", icon: ClipboardCheck, path: "/grading" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/courses/1/analytics" },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const navItems = userRole === "lecturer" ? lecturerNavItems : studentNavItems;

  const handleNavClick = (item: typeof navItems[0]) => {
    onTabChange(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 hidden md:flex",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-glow shrink-0">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-foreground whitespace-nowrap">EduSync</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isCollapsed && <ThemeToggle variant="icon" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("shrink-0", isCollapsed && "hidden")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-current")} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section - Fixed at bottom */}
      <div className="p-4 border-t border-sidebar-border space-y-2 shrink-0">
        {/* Theme Toggle - Visible when collapsed */}
        {isCollapsed && (
          <div className="flex justify-center mb-2">
            <ThemeToggle variant="icon" />
          </div>
        )}
        
        {/* Logout Button - Always Visible */}
        <Button 
          variant="destructive" 
          onClick={handleLogout} 
          className={cn(
            "w-full flex items-center gap-2 justify-center",
            isCollapsed && "px-2"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent",
          isCollapsed && "justify-center p-2"
        )}>
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userRole === "student" ? "Student" : "Lecturer"}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
