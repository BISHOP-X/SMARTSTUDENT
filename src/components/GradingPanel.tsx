import { useState } from "react";
import { CheckCircle2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface GradingPanelProps {
  open: boolean;
  onClose: () => void;
  submissionId: number;
  assignmentMaxScore: number;
}

interface SubmissionDetail {
  id: number;
  studentName: string;
  submittedAt: string;
  contentText: string;
  aiScore: number;
  aiFeedback: string;
  status: string;
  manualScore: number | null;
  manualFeedback: string | null;
}

// Mock submission data with full details
const mockSubmissionDetails: Record<number, SubmissionDetail> = {
  1: {
    id: 1,
    studentName: "Alex Johnson",
    submittedAt: "2026-01-18T14:30:00",
    contentText:
      "DNA replication is a complex process that occurs in three main phases. During initiation, helicase unwinds the double helix. In elongation, DNA polymerase adds nucleotides to the growing strand. Finally, termination occurs when replication is complete.",
    aiScore: 78,
    aiFeedback:
      "Good explanation of the three phases. However, you missed important details about leading and lagging strands. The answer would benefit from discussing Okazaki fragments and the specific roles of different DNA polymerases.",
    status: "graded",
    manualScore: null,
    manualFeedback: null,
  },
  2: {
    id: 2,
    studentName: "Maria Garcia",
    submittedAt: "2026-01-18T15:45:00",
    contentText:
      "DNA replication involves three key phases: initiation, elongation, and termination. During initiation, helicase unwinds the DNA double helix at the origin of replication. DNA polymerase III then synthesizes new DNA strands during elongation. The leading strand is synthesized continuously in the 5' to 3' direction, while the lagging strand is synthesized discontinuously as Okazaki fragments. DNA polymerase I replaces RNA primers with DNA, and DNA ligase joins the Okazaki fragments. The process concludes during termination when the entire DNA molecule has been replicated. The proofreading activity of DNA polymerase ensures high fidelity by correcting errors during replication.",
    aiScore: 92,
    aiFeedback:
      "Excellent comprehensive answer! You covered all key phases, mentioned important enzymes (helicase, DNA polymerase III and I, DNA ligase), explained leading vs lagging strands, discussed Okazaki fragments, and even mentioned the proofreading mechanism. This demonstrates strong understanding of DNA replication.",
    status: "graded",
    manualScore: null,
    manualFeedback: null,
  },
  3: {
    id: 3,
    studentName: "James Wilson",
    submittedAt: "2026-01-19T09:15:00",
    contentText:
      "DNA replication happens when cells divide. The DNA splits and makes copies.",
    aiScore: 22,
    aiFeedback:
      "The answer is too brief and lacks important details. You need to explain the three phases (initiation, elongation, termination), mention key enzymes like helicase and DNA polymerase, and discuss the differences between leading and lagging strand synthesis. Please review the course materials and provide a more comprehensive answer.",
    status: "graded",
    manualScore: null,
    manualFeedback: null,
  },
  4: {
    id: 4,
    studentName: "Sarah Chen",
    submittedAt: "2026-01-19T11:20:00",
    contentText:
      "The DNA replication process starts with initiation where helicase enzyme unwinds the DNA helix. Then elongation occurs with DNA polymerase adding nucleotides. Leading strand goes continuously while lagging strand makes Okazaki fragments. Termination happens when replication finishes.",
    aiScore: 85,
    aiFeedback:
      "Very good answer covering the main phases and key concepts. You mentioned helicase, DNA polymerase, and correctly distinguished between leading and lagging strands including Okazaki fragments. To improve further, you could mention other enzymes like primase, ligase, and discuss the proofreading mechanism.",
    status: "graded",
    manualScore: null,
    manualFeedback: null,
  },
};

const GradingPanel = ({ open, onClose, submissionId, assignmentMaxScore }: GradingPanelProps) => {
  const submission = mockSubmissionDetails[submissionId];
  
  const [manualScore, setManualScore] = useState<string>(
    submission?.manualScore?.toString() || submission?.aiScore?.toString() || ""
  );
  const [manualFeedback, setManualFeedback] = useState(
    submission?.manualFeedback || submission?.aiFeedback || ""
  );
  const [isOverriding, setIsOverriding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!submission) return null;

  const hasOverride = submission.manualScore !== null || submission.manualFeedback !== null;
  const displayScore = hasOverride ? submission.manualScore : submission.aiScore;
  const displayFeedback = hasOverride ? submission.manualFeedback : submission.aiFeedback;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSaveOverride = async () => {
    setIsSaving(true);
    console.log("Saving manual override:", {
      submissionId,
      manualScore: Number(manualScore),
      manualFeedback,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: API call to save manual override
    setIsSaving(false);
    setIsOverriding(false);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Grade Submission</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <SheetDescription>
            {submission.studentName} • Submitted {formatDate(submission.submittedAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Student's Submission */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Student's Answer</h3>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-foreground whitespace-pre-wrap">{submission.contentText}</p>
            </div>
          </div>

          {/* AI Grade */}
          <div className="p-4 rounded-lg border border-border bg-gradient-to-br from-primary/5 to-info/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">AI Assessment</h3>
              <Badge variant="secondary" className="ml-auto">
                Auto-graded
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{submission.aiScore}</div>
                <div className="text-sm text-muted-foreground">
                  out of {assignmentMaxScore}
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-sm text-muted-foreground mb-1">Percentage</div>
                <div className="text-xl font-semibold">
                  {Math.round((submission.aiScore / assignmentMaxScore) * 100)}%
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-sm text-foreground/90">{submission.aiFeedback}</p>
            </div>
          </div>

          {/* Manual Override Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Manual Override</h3>
              {!isOverriding && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOverriding(true)}
                >
                  {hasOverride ? "Edit Override" : "Override Grade"}
                </Button>
              )}
            </div>

            {isOverriding ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manualScore" className="text-sm font-medium">
                    Manual Score
                  </Label>
                  <Input
                    id="manualScore"
                    type="number"
                    min="0"
                    max={assignmentMaxScore}
                    value={manualScore}
                    onChange={(e) => setManualScore(e.target.value)}
                    placeholder={`Max: ${assignmentMaxScore}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manualFeedback" className="text-sm font-medium">
                    Manual Feedback
                  </Label>
                  <Textarea
                    id="manualFeedback"
                    rows={6}
                    value={manualFeedback}
                    onChange={(e) => setManualFeedback(e.target.value)}
                    placeholder="Provide your feedback to the student..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="hero"
                    onClick={handleSaveOverride}
                    disabled={isSaving || !manualScore}
                  >
                    {isSaving ? "Saving..." : "Save Override"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOverriding(false);
                      setManualScore(submission.aiScore.toString());
                      setManualFeedback(submission.aiFeedback);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : hasOverride ? (
              <div className="p-4 rounded-lg border border-border bg-success/5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="font-medium text-foreground">Manual Grade Applied</span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{displayScore}</div>
                    <div className="text-xs text-muted-foreground">
                      out of {assignmentMaxScore}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <p className="text-sm text-foreground/90">{displayFeedback}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                The AI grade is being used. Click "Override Grade" to provide a manual grade.
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GradingPanel;
