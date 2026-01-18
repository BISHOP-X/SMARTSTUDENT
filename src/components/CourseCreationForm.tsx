import { useState } from "react";
import { BookOpen, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CourseCreationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (courseData: CourseFormData) => void;
}

export interface CourseFormData {
  title: string;
  courseCode: string;
  description: string;
  semester: string;
  credits: number;
  coverImage: File | null;
  coverImagePreview: string | null;
}

const CourseCreationForm = ({ open, onClose, onSubmit }: CourseCreationFormProps) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    courseCode: "",
    description: "",
    semester: "",
    credits: 3,
    coverImage: null,
    coverImagePreview: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, coverImage: "Please upload an image file" });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, coverImage: "Image size must be less than 5MB" });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          coverImage: file,
          coverImagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);

      // Clear error
      const { coverImage: _, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      coverImage: null,
      coverImagePreview: null,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CourseFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "Course code is required";
    } else if (!/^[A-Z]{2,4}\d{3,4}$/.test(formData.courseCode.toUpperCase())) {
      newErrors.courseCode = "Invalid format (e.g., CS101, BIO301)";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.semester.trim()) {
      newErrors.semester = "Semester is required";
    }

    if (formData.credits < 1 || formData.credits > 6) {
      newErrors.credits = "Credits must be between 1 and 6";
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
      courseCode: "",
      description: "",
      semester: "",
      credits: 3,
      coverImage: null,
      coverImagePreview: null,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl">Create New Course</DialogTitle>
          </div>
          <DialogDescription>
            Fill in the course details. Students will be able to enroll once you publish the course.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="coverImage" className="text-sm font-medium">
              Cover Image <span className="text-muted-foreground">(Optional)</span>
            </Label>
            {formData.coverImagePreview ? (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border-2 border-border">
                <img
                  src={formData.coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="coverImage"
                className="flex flex-col items-center justify-center aspect-video w-full rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer bg-secondary/30"
              >
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground mb-1">
                  Click to upload cover image
                </span>
                <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
            {errors.coverImage && (
              <p className="text-sm text-destructive">{errors.coverImage}</p>
            )}
          </div>

          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Course Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Introduction to Computer Science"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Course Code and Credits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseCode" className="text-sm font-medium">
                Course Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="courseCode"
                placeholder="e.g., CS101"
                value={formData.courseCode}
                onChange={(e) =>
                  setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })
                }
                className={errors.courseCode ? "border-destructive" : ""}
              />
              {errors.courseCode && (
                <p className="text-sm text-destructive">{errors.courseCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits" className="text-sm font-medium">
                Credits <span className="text-destructive">*</span>
              </Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                className={errors.credits ? "border-destructive" : ""}
              />
              {errors.credits && <p className="text-sm text-destructive">{errors.credits}</p>}
            </div>
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <Label htmlFor="semester" className="text-sm font-medium">
              Semester <span className="text-destructive">*</span>
            </Label>
            <Input
              id="semester"
              placeholder="e.g., Spring 2026"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className={errors.semester ? "border-destructive" : ""}
            />
            {errors.semester && <p className="text-sm text-destructive">{errors.semester}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Course Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of the course content, objectives, and what students will learn..."
              rows={6}
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
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCreationForm;
