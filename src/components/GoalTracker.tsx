import { CheckCircle2, Circle, Clock, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const GoalTracker = () => {
  const goals = [
    {
      id: 1,
      title: "Complete Biology Module 3",
      progress: 75,
      dueDate: "Jan 20",
      streak: 5,
    },
    {
      id: 2,
      title: "Practice Coding Problems",
      progress: 40,
      dueDate: "Jan 22",
      streak: 12,
    },
    {
      id: 3,
      title: "Read 2 Literature Chapters",
      progress: 100,
      dueDate: "Completed",
      streak: 0,
    },
  ];

  const dailyTasks = [
    { id: 1, title: "Review lecture notes", completed: true },
    { id: 2, title: "Submit assignment draft", completed: true },
    { id: 3, title: "Attend study group", completed: false },
    { id: 4, title: "Practice flashcards", completed: false },
  ];

  const completedCount = dailyTasks.filter(t => t.completed).length;

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Goals & Progress</h3>
        <div className="flex items-center gap-1.5 text-accent">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-medium">12 day streak</span>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-info/10 border border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground font-medium">Today's Progress</span>
          <span className="text-sm text-primary font-bold">{completedCount}/{dailyTasks.length}</span>
        </div>
        <Progress value={(completedCount / dailyTasks.length) * 100} className="h-2" />
      </div>

      {/* Daily Tasks */}
      <div className="space-y-2 mb-6">
        {dailyTasks.map((task) => (
          <div 
            key={task.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <span className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {task.title}
            </span>
          </div>
        ))}
      </div>

      {/* Weekly Goals */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Weekly Goals</h4>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground font-medium truncate pr-2">{goal.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {goal.streak > 0 && (
                    <div className="flex items-center gap-1 text-accent text-xs">
                      <Flame className="w-3 h-3" />
                      {goal.streak}
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                </div>
              </div>
              <Progress 
                value={goal.progress} 
                className={`h-1.5 ${goal.progress === 100 ? 'bg-success/20' : ''}`}
              />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {goal.dueDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;
