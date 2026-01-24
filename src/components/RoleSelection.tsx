import { useState } from "react";
import { GraduationCap, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RoleSelectionProps {
  open: boolean;
  onRoleSelect: (role: "student" | "lecturer") => void;
}

const RoleSelection = ({ open, onRoleSelect }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<"student" | "lecturer" | null>(null);

  const roles = [
    {
      id: "student" as const,
      title: "Student",
      icon: GraduationCap,
      description: "Access courses, submit assignments, and get AI-powered feedback",
      features: [
        "Enroll in courses",
        "Submit assignments",
        "Get instant AI feedback",
        "Track your progress",
        "Manage personal goals",
      ],
      gradient: "from-primary to-info",
    },
    {
      id: "lecturer" as const,
      title: "Lecturer",
      icon: BookOpen,
      description: "Create courses, manage assignments, and track student performance",
      features: [
        "Create & manage courses",
        "Upload course materials",
        "Set assignments with AI grading",
        "View student analytics",
        "Override AI grades",
      ],
      gradient: "from-accent to-destructive",
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl p-0 gap-0" hideClose>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl">Welcome to EduSync</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Choose your role to get started with your personalized experience
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                  ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }
                `}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4 shadow-md`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {role.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {role.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {role.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3 border-t border-border">
          <Button
            variant="hero"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole}
            className="min-w-[200px]"
          >
            Continue as {selectedRole ? (selectedRole === "student" ? "Student" : "Lecturer") : "..."}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelection;
