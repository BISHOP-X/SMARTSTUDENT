import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, BookOpen, Target, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { getCalendarEvents, getEventsForDate, type CalendarEvent } from "@/data/mockData";

export default function Calendar() {
  const { userRole, isDemo } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "study",
    time: "12:00",
  });

  // Get all events for the current month - only in demo mode
  const allEvents = isDemo ? getCalendarEvents(userRole) : [];

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDay = (day: number): CalendarEvent[] => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getEventsForDate(date, userRole);
  };

  const handleCreateGoal = () => {
    const date = selectedDate || currentDate;
    const [hours, minutes] = newGoal.time.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    
    console.log("Creating goal:", {
      ...newGoal,
      eventDate: date.toISOString(),
      userId: "student1",
      status: "todo",
      createdAt: new Date().toISOString(),
    });
    
    setIsCreateDialogOpen(false);
    setNewGoal({ title: "", description: "", category: "study", time: "12:00" });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const getEventColor = (event: CalendarEvent) => {
    if (event.type === "assignment") {
      return event.status === "overdue" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-violet-500/20 text-violet-400 border-violet-500/30";
    }
    const colors: Record<string, string> = {
      study: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      health: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      personal: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      career: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      other: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    return colors[event.category || "other"] || colors.other;
  };

  const getEventIcon = (event: CalendarEvent) => {
    if (event.type === "assignment") return <BookOpen className="w-3 h-3" />;
    return <Target className="w-3 h-3" />;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation activeTab="calendar" onTabChange={() => {}} onLogout={() => {}} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 text-violet-400" />
                Calendar
              </h1>
              <p className="text-slate-400 mt-1">
                Manage your academic deadlines and personal goals
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-violet-600 hover:bg-violet-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Personal Goal</DialogTitle>
                  <DialogDescription>
                    Add a new goal to your calendar
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-300">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Study for Midterm"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add details about your goal..."
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-slate-300">Category</Label>
                      <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-slate-300">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newGoal.time}
                        onChange={(e) => setNewGoal({ ...newGoal, time: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateGoal}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                    disabled={!newGoal.title}
                  >
                    Create Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">{monthName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={previousMonth}
                        className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-300" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentDate(new Date())}
                        className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextMonth}
                        className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => {
                      if (day === null) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                      }

                      const dayEvents = getEventsForDay(day);
                      const hasEvents = dayEvents.length > 0;

                      return (
                        <button
                          key={day}
                          onClick={() => handleDateClick(day)}
                          className={`
                            aspect-square p-2 rounded-lg border transition-all
                            ${isToday(day) 
                              ? "bg-violet-600 border-violet-500 text-white font-bold" 
                              : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-violet-500/50"
                            }
                            ${selectedDate?.getDate() === day && 
                              selectedDate?.getMonth() === currentDate.getMonth() &&
                              selectedDate?.getFullYear() === currentDate.getFullYear()
                              ? "ring-2 ring-violet-500"
                              : ""
                            }
                          `}
                        >
                          <div className="text-sm font-medium">{day}</div>
                          {hasEvents && (
                            <div className="flex gap-1 mt-1 flex-wrap justify-center">
                              {dayEvents.slice(0, 3).map((event, idx) => (
                                <div
                                  key={idx}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    event.type === "assignment" 
                                      ? event.status === "overdue" 
                                        ? "bg-red-500" 
                                        : "bg-violet-500"
                                      : "bg-blue-500"
                                  }`}
                                />
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events Sidebar */}
            <div className="space-y-4">
              {/* Selected Date Events */}
              {selectedDate ? (
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">
                      {selectedDate.toLocaleDateString("en-US", { 
                        weekday: "long", 
                        month: "long", 
                        day: "numeric" 
                      })}
                    </CardTitle>
                    <CardDescription>
                      {getEventsForDate(selectedDate, userRole).length} event(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getEventsForDate(selectedDate, userRole).length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4">
                          No events scheduled
                        </p>
                      ) : (
                        getEventsForDate(selectedDate, userRole).map((event) => (
                          <div
                            key={event.id}
                            className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-violet-500/50 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-1">{getEventIcon(event)}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white text-sm truncate">
                                  {event.title}
                                </p>
                                {event.courseName && (
                                  <p className="text-xs text-slate-400 mt-1">{event.courseName}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={`text-xs ${getEventColor(event)}`}>
                                    {event.type === "assignment" ? "Assignment" : event.category}
                                  </Badge>
                                  <span className="text-xs text-slate-500">
                                    {new Date(event.date).toLocaleTimeString("en-US", { 
                                      hour: "2-digit", 
                                      minute: "2-digit" 
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Upcoming Events */
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Upcoming Events</CardTitle>
                    <CardDescription>Next 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {allEvents
                        .filter((event) => {
                          const eventDate = new Date(event.date);
                          const today = new Date();
                          const sevenDaysLater = new Date(today);
                          sevenDaysLater.setDate(today.getDate() + 7);
                          return eventDate >= today && eventDate <= sevenDaysLater;
                        })
                        .slice(0, 5)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-1">{getEventIcon(event)}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white text-sm truncate">
                                  {event.title}
                                </p>
                                {event.courseName && (
                                  <p className="text-xs text-slate-400 mt-1">{event.courseName}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={`text-xs ${getEventColor(event)}`}>
                                    {event.type === "assignment" ? "Assignment" : event.category}
                                  </Badge>
                                  <span className="text-xs text-slate-500">
                                    {new Date(event.date).toLocaleDateString("en-US", { 
                                      month: "short", 
                                      day: "numeric" 
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Legend */}
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Event Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                      <span className="text-slate-300">Assignments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-slate-300">Overdue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-slate-300">Study Goals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-300">Health Goals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-slate-300">Personal Goals</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
