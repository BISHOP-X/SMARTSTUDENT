import { useState } from "react";
import { Calendar, FileText, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AssignmentCreationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (assignmentData: AssignmentFormData) => void;
  courseId: string;
}

export interface AssignmentFormData {
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  gradingRubric: string;
  allowFileUpload: boolean;
}

const AssignmentCreationForm = ({ open, onClose, onSubmit, courseId }: AssignmentCreationFormProps) => {
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: "",
    description: "",
    dueDate: "",
    maxScore: 100,
    gradingRubric: "",
    allowFileUpload: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AssignmentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AssignmentFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Assignment title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    if (formData.maxScore <= 0) {
      newErrors.maxScore = "Max score must be greater than 0";
    } else if (formData.maxScore > 1000) {
      newErrors.maxScore = "Max score cannot exceed 1000";
    }

    if (!formData.gradingRubric.trim()) {
      newErrors.gradingRubric = "Grading rubric is required for AI grading";
    } else if (formData.gradingRubric.length < 50) {
      newErrors.gradingRubric = "Rubric must be at least 50 characters for accurate AI grading";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSubmit(formData);
    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      maxScore: 100,
      gradingRubric: "",
      allowFileUpload: false,
    });
    setErrors({});
    onClose();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl">Create Assignment</DialogTitle>
          </div>
          <DialogDescription>
            Create a new assignment with AI-powered grading. Students will receive instant feedback upon submission.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Assignment Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Assignment Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., DNA Replication Essay"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Due Date and Max Score */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="dueDate"
                  type="date"
                  min={today}
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`pl-10 ${errors.dueDate ? "border-destructive" : ""}`}
                />
              </div>
              {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxScore" className="text-sm font-medium">
                Max Score <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maxScore"
                type="number"
                min="1"
                max="1000"
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                className={errors.maxScore ? "border-destructive" : ""}
              />
              {errors.maxScore && <p className="text-sm text-destructive">{errors.maxScore}</p>}
            </div>
          </div>

          {/* Description/Instructions */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Instructions <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide detailed instructions for students. What should they do? What format should they use?"
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              {errors.description ? (
                <p className="text-sm text-destructive">{errors.description}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Minimum 20 characters ({formData.description.length}/20)
                </p>
              )}
            </div>
          </div>

          {/* Grading Rubric */}
          <div className="space-y-2">
            <Label htmlFor="gradingRubric" className="text-sm font-medium flex items-center gap-2">
              AI Grading Rubric <span className="text-destructive">*</span>
              <span className="text-xs font-normal text-muted-foreground">(What makes a good answer?)</span>
            </Label>
            <Textarea
              id="gradingRubric"
              placeholder="Describe what you're looking for in a correct answer. E.g., 'A complete answer should explain DNA replication in 3 steps: initiation, elongation, and termination. Must mention helicase, DNA polymerase, and leading/lagging strands.'"
              rows={6}
              value={formData.gradingRubric}
              onChange={(e) => setFormData({ ...formData, gradingRubric: e.target.value })}
              className={errors.gradingRubric ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              {errors.gradingRubric ? (
                <p className="text-sm text-destructive">{errors.gradingRubric}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Minimum 50 characters for accurate AI grading ({formData.gradingRubric.length}/50)
                </p>
              )}
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-info/10 border border-info/20">
              <AlertCircle className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
              <p className="text-xs text-info-foreground">
                The AI will use this rubric to grade student submissions. Be specific about what you expect.
              </p>
            </div>
          </div>

          {/* File Upload Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="allowFileUpload" className="text-sm font-medium cursor-pointer">
                  Allow File Uploads
                </Label>
                <p className="text-xs text-muted-foreground">
                  Students can upload files instead of text answers
                </p>
              </div>
            </div>
            <Switch
              id="allowFileUpload"
              checked={formData.allowFileUpload}
              onCheckedChange={(checked) => setFormData({ ...formData, allowFileUpload: checked })}
            />
          </div>

          {/* Form Actions */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentCreationForm;
