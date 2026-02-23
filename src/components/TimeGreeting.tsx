import { useMemo } from "react";
import morningBanner from "@/assets/morning-banner.jpg";
import afternoonBanner from "@/assets/afternoon-banner.jpg";
import eveningBanner from "@/assets/evening-banner.jpg";

interface TimeGreetingProps {
  userName: string;
  isDemo?: boolean;
  tasksDueToday?: number;
  upcomingClasses?: number;
}

const TimeGreeting = ({ userName, isDemo = true, tasksDueToday = 0, upcomingClasses = 0 }: TimeGreetingProps) => {
  const { greeting, banner, message } = useMemo(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        greeting: "Good morning",
        banner: morningBanner,
        message: "Ready to start your day strong?",
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: "Good afternoon",
        banner: afternoonBanner,
        message: "Keep up the great momentum!",
      };
    } else {
      return {
        greeting: "Good evening",
        banner: eveningBanner,
        message: "Time for some focused learning.",
      };
    }
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={banner}
          alt="Time of day banner"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-10 md:py-12">
        <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wider">
          {greeting}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {userName} 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          {message}
        </p>

        {/* Stats Pills - Only show when there's actual data */}
        {(tasksDueToday > 0 || upcomingClasses > 0) && (
          <div className="flex flex-wrap gap-3 mt-6">
            {tasksDueToday > 0 && (
              <div className="glass-card px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-foreground">{tasksDueToday} task{tasksDueToday !== 1 ? 's' : ''} due today</span>
              </div>
            )}
            {upcomingClasses > 0 && (
              <div className="glass-card px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground">{upcomingClasses} class{upcomingClasses !== 1 ? 'es' : ''} upcoming</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeGreeting;
