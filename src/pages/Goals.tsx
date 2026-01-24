import { useState } from "react";
import { Plus, Target, Calendar, Trash2, Edit2, Check, X, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { mockPersonalGoals, type PersonalGoal } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function Goals() {
  const { isDemo } = useAuth();
  
  // Show mock goals only in demo mode
  const [goals, setGoals] = useState<PersonalGoal[]>(isDemo ? mockPersonalGoals : []);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<PersonalGoal | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    eventDate: "",
    category: "study" as PersonalGoal["category"],
  });

  const handleCreateGoal = () => {
    const goal: PersonalGoal = {
      id: `pg${goals.length + 1}`,
      userId: "student1",
      title: newGoal.title,
      description: newGoal.description,
      eventDate: newGoal.eventDate,
      status: "todo",
      category: newGoal.category,
      createdAt: new Date().toISOString(),
    };

    setGoals([...goals, goal]);
    setIsCreateDialogOpen(false);
    setNewGoal({ title: "", description: "", eventDate: "", category: "study" });
    console.log("Created goal:", goal);
  };

  const handleToggleStatus = (goalId: string) => {
    setGoals(goals.map(g => 
      g.id === goalId 
        ? { ...g, status: g.status === "todo" ? "done" : "todo" } 
        : g
    ));
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
    console.log("Deleted goal:", goalId);
  };

  const handleUpdateGoal = (updatedGoal: PersonalGoal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    setEditingGoal(null);
    console.log("Updated goal:", updatedGoal);
  };

  const filteredGoals = goals.filter(goal => {
    const categoryMatch = filterCategory === "all" || goal.category === filterCategory;
    const statusMatch = filterStatus === "all" || goal.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const todoGoals = filteredGoals.filter(g => g.status === "todo");
  const doneGoals = filteredGoals.filter(g => g.status === "done");

  const getCategoryColor = (category: PersonalGoal["category"]) => {
    const colors = {
      study: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      personal: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      health: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      career: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      other: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    return colors[category];
  };

  const getCategoryIcon = (category: PersonalGoal["category"]) => {
    return <Target className="w-3 h-3" />;
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date() && new Date(dateString).toDateString() !== new Date().toDateString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === "done").length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const upcomingGoals = goals.filter(g => 
    g.status === "todo" && new Date(g.eventDate) >= new Date()
  ).length;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation activeTab="goals" onTabChange={() => {}} onLogout={() => {}} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Target className="w-8 h-8 text-violet-400" />
                Personal Goals
              </h1>
              <p className="text-slate-400 mt-1">
                Track and manage your personal objectives
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
                  <DialogTitle className="text-white">Create New Goal</DialogTitle>
                  <DialogDescription>
                    Set a new personal goal to track your progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-300">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Complete Data Structures Study Guide"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">Description</Label>
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
                      <Label htmlFor="category" className="text-slate-300">Category *</Label>
                      <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value as PersonalGoal["category"] })}>
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
                      <Label htmlFor="eventDate" className="text-slate-300">Target Date *</Label>
                      <Input
                        id="eventDate"
                        type="datetime-local"
                        value={newGoal.eventDate}
                        onChange={(e) => setNewGoal({ ...newGoal, eventDate: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateGoal}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                    disabled={!newGoal.title || !newGoal.eventDate}
                  >
                    Create Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Total Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalGoals}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">{completedGoals}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-400">{completionRate}%</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{upcomingGoals}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Filter className="w-4 h-4 text-slate-400" />
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-slate-400 text-sm">Category:</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-slate-400 text-sm">Status:</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-slate-400 ml-auto">
                    Showing {filteredGoals.length} of {totalGoals} goals
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals List */}
          <Tabs defaultValue="todo" className="space-y-6">
            <TabsList className="bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="todo">
                To Do ({todoGoals.length})
              </TabsTrigger>
              <TabsTrigger value="done">
                Completed ({doneGoals.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({filteredGoals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todo" className="space-y-3">
              {todoGoals.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardContent className="pt-8 pb-8 text-center">
                    <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No pending goals</p>
                    <p className="text-slate-500 text-sm mt-1">Create a new goal to get started</p>
                  </CardContent>
                </Card>
              ) : (
                todoGoals
                  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                  .map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteGoal}
                      onEdit={setEditingGoal}
                      getCategoryColor={getCategoryColor}
                      getCategoryIcon={getCategoryIcon}
                      formatDate={formatDate}
                      isOverdue={isOverdue}
                    />
                  ))
              )}
            </TabsContent>

            <TabsContent value="done" className="space-y-3">
              {doneGoals.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardContent className="pt-8 pb-8 text-center">
                    <Check className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No completed goals yet</p>
                    <p className="text-slate-500 text-sm mt-1">Complete your first goal to see it here</p>
                  </CardContent>
                </Card>
              ) : (
                doneGoals
                  .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
                  .map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteGoal}
                      onEdit={setEditingGoal}
                      getCategoryColor={getCategoryColor}
                      getCategoryIcon={getCategoryIcon}
                      formatDate={formatDate}
                      isOverdue={isOverdue}
                    />
                  ))
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-3">
              {filteredGoals
                .sort((a, b) => {
                  if (a.status !== b.status) {
                    return a.status === "todo" ? -1 : 1;
                  }
                  return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
                })
                .map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteGoal}
                    onEdit={setEditingGoal}
                    getCategoryColor={getCategoryColor}
                    getCategoryIcon={getCategoryIcon}
                    formatDate={formatDate}
                    isOverdue={isOverdue}
                  />
                ))}
            </TabsContent>
          </Tabs>

          {/* Edit Dialog */}
          {editingGoal && (
            <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Goal</DialogTitle>
                  <DialogDescription>
                    Update your goal details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title" className="text-slate-300">Title</Label>
                    <Input
                      id="edit-title"
                      value={editingGoal.title}
                      onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description" className="text-slate-300">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editingGoal.description}
                      onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-category" className="text-slate-300">Category</Label>
                      <Select value={editingGoal.category} onValueChange={(value) => setEditingGoal({ ...editingGoal, category: value as PersonalGoal["category"] })}>
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
                      <Label htmlFor="edit-eventDate" className="text-slate-300">Target Date</Label>
                      <Input
                        id="edit-eventDate"
                        type="datetime-local"
                        value={editingGoal.eventDate.slice(0, 16)}
                        onChange={(e) => setEditingGoal({ ...editingGoal, eventDate: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleUpdateGoal(editingGoal)}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}

// Goal Card Component
interface GoalCardProps {
  goal: PersonalGoal;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (goal: PersonalGoal) => void;
  getCategoryColor: (category: PersonalGoal["category"]) => string;
  getCategoryIcon: (category: PersonalGoal["category"]) => JSX.Element;
  formatDate: (dateString: string) => string;
  isOverdue: (dateString: string) => boolean;
}

function GoalCard({ 
  goal, 
  onToggleStatus, 
  onDelete, 
  onEdit, 
  getCategoryColor, 
  getCategoryIcon, 
  formatDate,
  isOverdue
}: GoalCardProps) {
  const overdue = goal.status === "todo" && isOverdue(goal.eventDate);

  return (
    <Card className={`bg-slate-900/50 border-slate-800 backdrop-blur hover:border-violet-500/50 transition-all ${
      goal.status === "done" ? "opacity-60" : ""
    }`}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={goal.status === "done"}
            onCheckedChange={() => onToggleStatus(goal.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className={`font-semibold text-white ${goal.status === "done" ? "line-through" : ""}`}>
                  {goal.title}
                </h3>
                {goal.description && (
                  <p className="text-sm text-slate-400 mt-1">{goal.description}</p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <Badge className={getCategoryColor(goal.category)}>
                    {goal.category}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className={overdue ? "text-red-400" : ""}>
                      {formatDate(goal.eventDate)}
                    </span>
                  </div>
                  {overdue && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(goal)}
                  className="h-8 w-8 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(goal.id)}
                  className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
