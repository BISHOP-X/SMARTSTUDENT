/**
 * ============================================
 * Theme Toggle Component - Beautiful Light/Dark Switch
 * ============================================
 * 
 * A gorgeous animated toggle for switching between light and dark modes.
 * Features smooth transitions and visual feedback.
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "default" | "icon" | "switch" | "dropdown";
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = "icon", 
  className,
  showLabel = false 
}) => {
  const { theme, toggleTheme, setTheme, isDark } = useTheme();

  // Simple icon button toggle
  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn(
          "relative h-9 w-9 rounded-full transition-all duration-300",
          "hover:bg-accent/20 hover:scale-110",
          "focus-visible:ring-2 focus-visible:ring-primary",
          className
        )}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <Sun className={cn(
          "h-5 w-5 transition-all duration-500",
          "absolute",
          isDark 
            ? "rotate-90 scale-0 opacity-0" 
            : "rotate-0 scale-100 opacity-100 text-amber-500"
        )} />
        <Moon className={cn(
          "h-5 w-5 transition-all duration-500",
          "absolute",
          isDark 
            ? "rotate-0 scale-100 opacity-100 text-slate-300" 
            : "-rotate-90 scale-0 opacity-0"
        )} />
      </Button>
    );
  }

  // Beautiful animated switch toggle
  if (variant === "switch") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isDark 
            ? "bg-slate-700 hover:bg-slate-600" 
            : "bg-gradient-to-r from-amber-300 to-orange-400 hover:from-amber-400 hover:to-orange-500",
          className
        )}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Background decorations */}
        <span className={cn(
          "absolute inset-1 rounded-full transition-all duration-500",
          isDark 
            ? "bg-gradient-to-br from-slate-800 to-slate-900" 
            : "bg-gradient-to-br from-sky-100 to-blue-50"
        )}>
          {/* Stars for dark mode */}
          {isDark && (
            <>
              <span className="absolute top-1 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
              <span className="absolute top-2 left-4 w-1 h-1 bg-white/70 rounded-full animate-pulse delay-150" />
              <span className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white/50 rounded-full animate-pulse delay-300" />
            </>
          )}
          {/* Clouds for light mode */}
          {!isDark && (
            <span className="absolute top-1 right-2 w-4 h-2 bg-white/60 rounded-full blur-[1px]" />
          )}
        </span>
        
        {/* Toggle knob */}
        <span
          className={cn(
            "absolute flex items-center justify-center w-6 h-6 rounded-full shadow-lg transition-all duration-500 ease-out",
            isDark 
              ? "left-1 bg-gradient-to-br from-slate-200 to-slate-300" 
              : "left-9 bg-gradient-to-br from-amber-400 to-orange-500"
          )}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-slate-700" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-white" />
          )}
        </span>
      </button>
    );
  }

  // Dropdown menu variant
  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-300",
              "hover:bg-accent/20",
              className
            )}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-300" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[120px]">
          <DropdownMenuItem 
            onClick={() => setTheme('light')}
            className={cn(
              "cursor-pointer gap-2",
              theme === 'light' && "bg-accent"
            )}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme('dark')}
            className={cn(
              "cursor-pointer gap-2",
              theme === 'dark' && "bg-accent"
            )}
          >
            <Moon className="h-4 w-4 text-slate-400" />
            <span>Dark</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default button with optional label
  return (
    <Button
      variant="outline"
      size={showLabel ? "default" : "icon"}
      onClick={toggleTheme}
      className={cn(
        "gap-2 transition-all duration-300",
        "hover:bg-accent/20 hover:border-primary/50",
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <Moon className="h-4 w-4 text-slate-300" />
          {showLabel && <span>Dark Mode</span>}
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 text-amber-500" />
          {showLabel && <span>Light Mode</span>}
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
