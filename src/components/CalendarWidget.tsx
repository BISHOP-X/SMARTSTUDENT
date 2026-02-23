import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarWidgetProps {
  isDemo?: boolean;
}

const CalendarWidget = ({ isDemo = true }: CalendarWidgetProps) => {
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  
  // Generate calendar days
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  
  // Sample events - only show for demo mode
  const events = isDemo ? [
    { day: today.getDate(), title: "Biology Lab", time: "10:00 AM", color: "bg-primary" },
    { day: today.getDate() + 2, title: "CS Assignment Due", time: "11:59 PM", color: "bg-accent" },
    { day: today.getDate() + 5, title: "Math Midterm", time: "2:00 PM", color: "bg-destructive" },
  ] : [];

  const hasEvent = (day: number) => events.find(e => e.day === day);

  return (
    <div className="glass-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">{currentMonth} {currentYear}</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const event = hasEvent(day);
          const isToday = day === today.getDate();
          
          return (
            <button
              key={day}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center relative
                text-sm transition-all duration-200
                ${isToday 
                  ? 'bg-primary text-primary-foreground font-semibold' 
                  : 'hover:bg-secondary text-foreground'}
              `}
            >
              {day}
              {event && !isToday && (
                <div className={`absolute bottom-1 w-1 h-1 rounded-full ${event.color}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Upcoming</h4>
        {events.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-3">No upcoming events</p>
        ) : (
          events.slice(0, 3).map((event, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className={`w-1 h-10 rounded-full ${event.color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;
