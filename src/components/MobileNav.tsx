import { Home, BookOpen, Calendar, Target, ClipboardList, Brain, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavProps {
  userRole: 'student' | 'lecturer';
}

export default function MobileNav({ userRole }: MobileNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const studentNavItems = [
    { icon: Home,         label: 'Home',        to: '/' },
    { icon: BookOpen,     label: 'Courses',     to: '/courses' },
    { icon: Brain,        label: 'AI Tools',    to: '/ai-tools' },
    { icon: Target,       label: 'Goals',       to: '/goals' },
  ];

  const lecturerNavItems = [
    { icon: Home,         label: 'Home',        to: '/' },
    { icon: BookOpen,     label: 'Courses',     to: '/courses' },
    { icon: ClipboardList,label: 'Grading',     to: '/grading' },
    { icon: Calendar,     label: 'Calendar',    to: '/calendar' },
  ];

  const navItems = userRole === 'lecturer' ? lecturerNavItems : studentNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        <Link
          to="/profile"
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
            location.pathname === '/profile' 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className={cn("h-5 w-5", location.pathname === '/profile' && "fill-current")} />
          <span className="text-xs font-medium">Profile</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-full space-y-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}
