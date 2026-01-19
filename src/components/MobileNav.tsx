import { Home, BookOpen, Calendar, Target, BarChart3, ClipboardList, User, Settings as SettingsIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  userRole: 'student' | 'lecturer';
}

export default function MobileNav({ userRole }: MobileNavProps) {
  const location = useLocation();

  const studentNavItems = [
    { icon: Home, label: 'Home', to: '/courses' },
    { icon: BookOpen, label: 'Courses', to: '/courses' },
    { icon: Calendar, label: 'Calendar', to: '/calendar' },
    { icon: Target, label: 'Goals', to: '/goals' },
  ];

  const lecturerNavItems = [
    { icon: Home, label: 'Home', to: '/courses' },
    { icon: BookOpen, label: 'Courses', to: '/courses' },
    { icon: ClipboardList, label: 'Grading', to: '/grading' },
    { icon: BarChart3, label: 'Analytics', to: '/courses' },
  ];

  const navItems = userRole === 'lecturer' ? lecturerNavItems : studentNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || 
                          (item.to !== '/courses' && location.pathname.startsWith(item.to));
          
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
      </div>
    </nav>
  );
}
