import { useState, useRef, DragEvent } from "react";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface MaterialUploadProps {
  open: boolean;
  onClose: () => void;
  onUpload: (materials: UploadedMaterial[]) => void;
  courseId?: string;
}

export interface UploadedMaterial {
  id: string;
  title: string;
  file: File;
  size: number;
  type: string;
  uploadProgress: number;
  status: "pending" | "uploading" | "success" | "error";
  errorMessage?: string;
}

const ALLOWED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "text/plain": [".txt"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 10;

const MaterialUpload = ({ open, onClose, onUpload }: MaterialUploadProps) => {
  const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") return "📄";
    if (type.includes("presentation")) return "📊";
    if (type.includes("word") || type.includes("document")) return "📝";
    return "📎";
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      return {
        valid: false,
        error: "Invalid file type. Only PDF, PPTX, PPT, DOCX, DOC, and TXT files are allowed.",
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit.`,
      };
    }

    return { valid: true };
  };

  const addFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Check max files limit
    if (materials.length + fileArray.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files at a time.`);
      return;
    }

    const newMaterials: UploadedMaterial[] = fileArray.map((file) => {
      const validation = validateFile(file);
      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        file,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        status: validation.valid ? "pending" : "error",
        errorMessage: validation.error,
      };
    });

    setMaterials([...materials, ...newMaterials]);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const updateMaterialTitle = (id: string, newTitle: string) => {
    setMaterials(
      materials.map((m) => (m.id === id ? { ...m, title: newTitle } : m))
    );
  };

  const simulateUpload = async (material: UploadedMaterial): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setMaterials((prev) =>
            prev.map((m) =>
              m.id === material.id
                ? { ...m, uploadProgress: 100, status: "success" }
                : m
            )
          );
          resolve();
        } else {
          setMaterials((prev) =>
            prev.map((m) =>
              m.id === material.id
                ? { ...m, uploadProgress: Math.floor(progress), status: "uploading" }
                : m
            )
          );
        }
      }, 300);
    });
  };

  const handleUpload = async () => {
    const validMaterials = materials.filter((m) => m.status !== "error");

    if (validMaterials.length === 0) {
      return;
    }

    setIsUploading(true);

    // Simulate upload for each file
    for (const material of validMaterials) {
      await simulateUpload(material);
    }

    setIsUploading(false);

    // Call onUpload callback with all successful materials
    const successfulMaterials = materials.filter((m) => m.status === "success");
    onUpload(successfulMaterials);

    // Close dialog after short delay
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const handleClose = () => {
    if (!isUploading) {
      setMaterials([]);
      setIsDragging(false);
      onClose();
    }
  };

  const hasValidFiles = materials.some((m) => m.status !== "error");
  const allUploaded = materials.every((m) => m.status === "success");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl">Upload Course Materials</DialogTitle>
          </div>
          <DialogDescription>
            Upload lecture notes, slides, assignments, or other course materials. Supported formats:
            PDF, PPTX, PPT, DOCX, DOC, TXT (max {formatFileSize(MAX_FILE_SIZE)})
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-lg transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border bg-secondary/30",
              materials.length > 0 ? "py-8" : "py-12"
            )}
          >
            <div className="flex flex-col items-center justify-center gap-3 px-4">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                  isDragging ? "bg-primary/20" : "bg-muted"
                )}
              >
                <Upload className={cn("w-8 h-8", isDragging ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1">
                  {isDragging ? "Drop files here" : "Drag and drop files here"}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  or click the button below to browse
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={Object.values(ALLOWED_FILE_TYPES).flat().join(",")}
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Up to {MAX_FILES} files, {formatFileSize(MAX_FILE_SIZE)} each
              </p>
            </div>
          </div>

          {/* Uploaded Files List */}
          {materials.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center justify-between">
                <span>Files ({materials.length}/{MAX_FILES})</span>
                {materials.length > 0 && !isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMaterials([])}
                    className="h-auto py-1 px-2 text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="glass-card p-3 rounded-lg space-y-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0 mt-1">
                        {getFileIcon(material.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {material.status === "pending" || material.status === "uploading" ? (
                              <Input
                                value={material.title}
                                onChange={(e) => updateMaterialTitle(material.id, e.target.value)}
                                className="h-8 text-sm"
                                placeholder="Material title"
                                disabled={isUploading}
                              />
                            ) : (
                              <p className="text-sm font-medium truncate">{material.title}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {material.file.name} • {formatFileSize(material.size)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {material.status === "success" && (
                              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                            )}
                            {material.status === "error" && (
                              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                            )}
                            {material.status === "uploading" && (
                              <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
                            )}
                            {!isUploading && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemoveMaterial(material.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {(material.status === "uploading" || material.status === "success") && (
                          <div className="space-y-1">
                            <Progress value={material.uploadProgress} className="h-1.5" />
                            <p className="text-xs text-muted-foreground text-right">
                              {material.uploadProgress}%
                            </p>
                          </div>
                        )}

                        {/* Error Message */}
                        {material.status === "error" && material.errorMessage && (
                          <p className="text-xs text-destructive">{material.errorMessage}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={handleUpload}
            disabled={!hasValidFiles || isUploading || allUploaded}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : allUploaded ? (
              "All Uploaded"
            ) : (
              `Upload ${materials.filter((m) => m.status !== "error").length} ${
                materials.filter((m) => m.status !== "error").length === 1 ? "File" : "Files"
              }`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialUpload;
