import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Download, 
  Trash2,
  Brain,
  MessageSquare,
  ListChecks,
  Lightbulb,
  Loader2,
  CheckCircle2,
  X,
  Settings2,
  Zap,
  BookOpen,
  Target,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  status: "processing" | "ready" | "error";
  detectedChapters?: string[];
}

interface GeneratedContent {
  id: string;
  type: "notes" | "summary" | "questions";
  title: string;
  content: string;
  createdAt: Date;
  settings: any;
}

export default function AIStudyTools() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "f1",
      name: "Chapter_3_Cell_Biology.pdf",
      size: 2400000,
      uploadedAt: new Date("2026-01-18T10:30:00"),
      status: "ready",
      detectedChapters: ["Cell Structure", "Organelles", "Cell Membrane", "Transport Mechanisms"]
    },
    {
      id: "f2",
      name: "Genetics_Lecture_Notes.pdf",
      size: 1800000,
      uploadedAt: new Date("2026-01-19T14:20:00"),
      status: "ready",
      detectedChapters: ["DNA Structure", "Replication", "Transcription", "Translation"]
    }
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Notes settings
  const [notesFormat, setNotesFormat] = useState<"bullet" | "paragraph" | "mindmap" | "cornell">("bullet");
  const [notesDetail, setNotesDetail] = useState<"concise" | "detailed" | "comprehensive">("detailed");
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeDiagrams, setIncludeDiagrams] = useState(true);

  // Summary settings
  const [summaryLength, setSummaryLength] = useState<"brief" | "moderate" | "detailed">("moderate");
  const [summaryFocus, setSummaryFocus] = useState<string[]>(["key_concepts", "definitions"]);
  const [includeKeyTerms, setIncludeKeyTerms] = useState(true);

  // Question settings
  const [questionDifficulty, setQuestionDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [questionTypes, setQuestionTypes] = useState<string[]>(["multiple_choice"]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [practiceMode, setPracticeMode] = useState<"practice" | "test">("practice");
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [timeLimit, setTimeLimit] = useState(0); // 0 = no limit

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newFile: UploadedFile = {
          id: `f${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          uploadedAt: new Date(),
          status: "processing"
        };
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Simulate processing
        setTimeout(() => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === newFile.id 
              ? { 
                  ...f, 
                  status: "ready",
                  detectedChapters: ["Chapter 1", "Chapter 2", "Chapter 3"] 
                }
              : f
          ));
          toast.success(`${file.name} processed successfully!`);
        }, 2000);
      });
    }
  };

  const deleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success("File deleted");
  };

  const generateNotes = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsGenerating(true);
    const file = uploadedFiles.find(f => f.id === selectedFile);

    // Simulate AI generation
    setTimeout(() => {
      const newNotes: GeneratedContent = {
        id: `g${Date.now()}`,
        type: "notes",
        title: `Study Notes - ${file?.name}`,
        content: generateMockNotes(notesFormat, notesDetail),
        createdAt: new Date(),
        settings: { format: notesFormat, detail: notesDetail, examples: includeExamples }
      };
      setGeneratedContent(prev => [newNotes, ...prev]);
      setIsGenerating(false);
      setActiveTab("generated");
      toast.success("📝 Study notes generated successfully!");
    }, 3000);
  };

  const generateSummary = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsGenerating(true);
    const file = uploadedFiles.find(f => f.id === selectedFile);

    setTimeout(() => {
      const newSummary: GeneratedContent = {
        id: `g${Date.now()}`,
        type: "summary",
        title: `Summary - ${file?.name}`,
        content: generateMockSummary(summaryLength),
        createdAt: new Date(),
        settings: { length: summaryLength, focus: summaryFocus }
      };
      setGeneratedContent(prev => [newSummary, ...prev]);
      setIsGenerating(false);
      setActiveTab("generated");
      toast.success("📄 Summary generated successfully!");
    }, 2500);
  };

  const generateQuestions = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsGenerating(true);
    const file = uploadedFiles.find(f => f.id === selectedFile);

    setTimeout(() => {
      const newQuestions: GeneratedContent = {
        id: `g${Date.now()}`,
        type: "questions",
        title: `Practice Questions - ${file?.name}`,
        content: generateMockQuestions(questionDifficulty, questionCount, questionTypes),
        createdAt: new Date(),
        settings: { 
          difficulty: questionDifficulty, 
          count: questionCount, 
          types: questionTypes,
          mode: practiceMode 
        }
      };
      setGeneratedContent(prev => [newQuestions, ...prev]);
      setIsGenerating(false);
      setActiveTab("generated");
      toast.success("❓ Practice questions generated successfully!");
    }, 3500);
  };

  const downloadContent = (content: GeneratedContent) => {
    // TODO: Create actual downloadable file
    toast.success(`Downloading ${content.title}...`);
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const selectedFileData = uploadedFiles.find(f => f.id === selectedFile);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation activeTab="ai-tools" onTabChange={() => {}} onLogout={logout} />
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="container mx-auto p-4 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                AI Study Tools
              </h1>
              <p className="text-slate-400 mt-2">
                Upload your study materials and let AI help you learn better
              </p>
            </div>
            <Badge className="bg-violet-600/20 text-violet-400 border-violet-600/30 text-sm px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Powered by AI
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Materials Uploaded</p>
                    <p className="text-2xl font-bold text-white mt-1">{uploadedFiles.length}</p>
                  </div>
                  <Upload className="w-8 h-8 text-violet-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Content Generated</p>
                    <p className="text-2xl font-bold text-white mt-1">{generatedContent.length}</p>
                  </div>
                  <Brain className="w-8 h-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Storage</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatFileSize(uploadedFiles.reduce((sum, f) => sum + f.size, 0))}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Study Sessions</p>
                    <p className="text-2xl font-bold text-white mt-1">12</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload & Manage
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="w-4 h-4 mr-2" />
                Generate Notes
              </TabsTrigger>
              <TabsTrigger value="summary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Create Summary
              </TabsTrigger>
              <TabsTrigger value="questions">
                <ListChecks className="w-4 h-4 mr-2" />
                Practice Questions
              </TabsTrigger>
              <TabsTrigger value="generated">
                <Sparkles className="w-4 h-4 mr-2" />
                My Content ({generatedContent.length})
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Upload Study Materials</CardTitle>
                  <CardDescription>
                    Upload PDFs, Word documents, or PowerPoint slides from your courses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-violet-600 transition-colors cursor-pointer bg-slate-800/30">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-slate-400">
                        PDF, DOC, DOCX, PPT, PPTX (Max 50MB each)
                      </p>
                    </label>
                  </div>

                  <Separator className="bg-slate-800" />

                  <div className="space-y-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      My Materials ({uploadedFiles.length})
                    </h3>
                    {uploadedFiles.map(file => (
                      <div
                        key={file.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedFile === file.id
                            ? "bg-violet-600/20 border-violet-600"
                            : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                        }`}
                        onClick={() => setSelectedFile(file.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-violet-400" />
                              <p className="text-white font-medium">{file.name}</p>
                              {file.status === "processing" && (
                                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Processing
                                </Badge>
                              )}
                              {file.status === "ready" && (
                                <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Ready
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-400 mb-3">
                              {formatFileSize(file.size)} • Uploaded {file.uploadedAt.toLocaleDateString()}
                            </p>
                            {file.detectedChapters && (
                              <div className="flex flex-wrap gap-2">
                                {file.detectedChapters.map((chapter, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {chapter}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile(file.id);
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Generation Tab */}
            <TabsContent value="notes" className="space-y-6">
              {!selectedFile ? (
                <Alert className="bg-yellow-500/10 border-yellow-500/30">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    Please select a material from the "Upload & Manage" tab first
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Settings Panel */}
                  <Card className="lg:col-span-1 bg-slate-900/50 border-slate-800 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Settings2 className="w-5 h-5" />
                        Note Settings
                      </CardTitle>
                      <CardDescription>
                        Customize how your notes are generated
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Note Format */}
                      <div className="space-y-3">
                        <Label className="text-white">Note Format</Label>
                        <RadioGroup value={notesFormat} onValueChange={(v: any) => setNotesFormat(v)}>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700 hover:border-violet-600 transition-colors">
                            <RadioGroupItem value="bullet" id="bullet" />
                            <Label htmlFor="bullet" className="flex-1 cursor-pointer text-slate-200">
                              Bullet Points
                              <p className="text-xs text-slate-400 mt-1">Quick, scannable format</p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700 hover:border-violet-600 transition-colors">
                            <RadioGroupItem value="paragraph" id="paragraph" />
                            <Label htmlFor="paragraph" className="flex-1 cursor-pointer text-slate-200">
                              Paragraphs
                              <p className="text-xs text-slate-400 mt-1">Detailed explanations</p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700 hover:border-violet-600 transition-colors">
                            <RadioGroupItem value="mindmap" id="mindmap" />
                            <Label htmlFor="mindmap" className="flex-1 cursor-pointer text-slate-200">
                              Mind Map
                              <p className="text-xs text-slate-400 mt-1">Visual connections</p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700 hover:border-violet-600 transition-colors">
                            <RadioGroupItem value="cornell" id="cornell" />
                            <Label htmlFor="cornell" className="flex-1 cursor-pointer text-slate-200">
                              Cornell Notes
                              <p className="text-xs text-slate-400 mt-1">Structured system</p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator className="bg-slate-800" />

                      {/* Detail Level */}
                      <div className="space-y-3">
                        <Label className="text-white">Detail Level</Label>
                        <Select value={notesDetail} onValueChange={(v: any) => setNotesDetail(v)}>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="concise">Concise - Key points only</SelectItem>
                            <SelectItem value="detailed">Detailed - Balanced coverage</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive - Everything</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator className="bg-slate-800" />

                      {/* Additional Options */}
                      <div className="space-y-3">
                        <Label className="text-white">Include</Label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="examples" 
                              checked={includeExamples}
                              onCheckedChange={(c) => setIncludeExamples(c as boolean)}
                            />
                            <Label htmlFor="examples" className="text-slate-200 cursor-pointer">
                              Examples & Case Studies
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="diagrams" 
                              checked={includeDiagrams}
                              onCheckedChange={(c) => setIncludeDiagrams(c as boolean)}
                            />
                            <Label htmlFor="diagrams" className="text-slate-200 cursor-pointer">
                              Diagram Descriptions
                            </Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview Panel */}
                  <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white">Selected Material</CardTitle>
                      <CardDescription>
                        {selectedFileData?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedFileData?.detectedChapters && (
                        <div>
                          <Label className="text-white mb-2 block">Detected Topics</Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedFileData.detectedChapters.map((chapter, idx) => (
                              <Badge key={idx} className="bg-violet-600/20 text-violet-300 border-violet-600/30">
                                {chapter}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Alert className="bg-blue-500/10 border-blue-500/30">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <AlertDescription className="text-blue-200">
                          AI will generate {notesDetail} notes in {notesFormat} format with{" "}
                          {includeExamples && "examples"}{includeExamples && includeDiagrams && " and "}{includeDiagrams && "diagrams"}
                        </AlertDescription>
                      </Alert>

                      <Button 
                        onClick={generateNotes} 
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                        size="lg"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Notes...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Study Notes
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Summary Generation Tab */}
            <TabsContent value="summary" className="space-y-6">
              {!selectedFile ? (
                <Alert className="bg-yellow-500/10 border-yellow-500/30">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    Please select a material from the "Upload & Manage" tab first
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Settings Panel */}
                  <Card className="lg:col-span-1 bg-slate-900/50 border-slate-800 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Settings2 className="w-5 h-5" />
                        Summary Settings
                      </CardTitle>
                      <CardDescription>
                        Customize your summary
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Length */}
                      <div className="space-y-3">
                        <Label className="text-white">Summary Length</Label>
                        <RadioGroup value={summaryLength} onValueChange={(v: any) => setSummaryLength(v)}>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700">
                            <RadioGroupItem value="brief" id="brief" />
                            <Label htmlFor="brief" className="flex-1 cursor-pointer text-slate-200">
                              Brief (1-2 paragraphs)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700">
                            <RadioGroupItem value="moderate" id="moderate" />
                            <Label htmlFor="moderate" className="flex-1 cursor-pointer text-slate-200">
                              Moderate (3-5 paragraphs)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700">
                            <RadioGroupItem value="detailed" id="detailed-summary" />
                            <Label htmlFor="detailed-summary" className="flex-1 cursor-pointer text-slate-200">
                              Detailed (Full overview)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator className="bg-slate-800" />

                      {/* Focus Areas */}
                      <div className="space-y-3">
                        <Label className="text-white">Focus On</Label>
                        <div className="space-y-2">
                          {[
                            { id: "key_concepts", label: "Key Concepts" },
                            { id: "definitions", label: "Definitions" },
                            { id: "processes", label: "Processes & Methods" },
                            { id: "relationships", label: "Relationships & Connections" },
                            { id: "applications", label: "Real-world Applications" }
                          ].map(item => (
                            <div key={item.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={item.id}
                                checked={summaryFocus.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSummaryFocus([...summaryFocus, item.id]);
                                  } else {
                                    setSummaryFocus(summaryFocus.filter(f => f !== item.id));
                                  }
                                }}
                              />
                              <Label htmlFor={item.id} className="text-slate-200 cursor-pointer">
                                {item.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-slate-800" />

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="keyterms" 
                          checked={includeKeyTerms}
                          onCheckedChange={(c) => setIncludeKeyTerms(c as boolean)}
                        />
                        <Label htmlFor="keyterms" className="text-slate-200 cursor-pointer">
                          Include Key Terms Glossary
                        </Label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview Panel */}
                  <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white">Generate Summary</CardTitle>
                      <CardDescription>
                        {selectedFileData?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert className="bg-blue-500/10 border-blue-500/30">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <AlertDescription className="text-blue-200">
                          AI will create a {summaryLength} summary focusing on {summaryFocus.length} selected areas
                        </AlertDescription>
                      </Alert>

                      <Button 
                        onClick={generateSummary} 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        size="lg"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating Summary...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Generate Summary
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Questions Generation Tab */}
            <TabsContent value="questions" className="space-y-6">
              {!selectedFile ? (
                <Alert className="bg-yellow-500/10 border-yellow-500/30">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    Please select a material from the "Upload & Manage" tab first
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Settings Panel */}
                  <Card className="lg:col-span-1 bg-slate-900/50 border-slate-800 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Settings2 className="w-5 h-5" />
                        Question Settings
                      </CardTitle>
                      <CardDescription>
                        Full customization for practice
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Difficulty */}
                      <div className="space-y-3">
                        <Label className="text-white">Difficulty Level</Label>
                        <Select value={questionDifficulty} onValueChange={(v: any) => setQuestionDifficulty(v)}>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy - Basic concepts</SelectItem>
                            <SelectItem value="medium">Medium - Moderate thinking</SelectItem>
                            <SelectItem value="hard">Hard - Advanced analysis</SelectItem>
                            <SelectItem value="mixed">Mixed - All levels</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Number of Questions */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">Number of Questions</Label>
                          <Badge variant="outline" className="text-violet-400">
                            {questionCount}
                          </Badge>
                        </div>
                        <Slider 
                          value={[questionCount]} 
                          onValueChange={(v) => setQuestionCount(v[0])}
                          min={5}
                          max={50}
                          step={5}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>5</span>
                          <span>25</span>
                          <span>50</span>
                        </div>
                      </div>

                      <Separator className="bg-slate-800" />

                      {/* Question Types */}
                      <div className="space-y-3">
                        <Label className="text-white">Question Types</Label>
                        <div className="space-y-2">
                          {[
                            { id: "multiple_choice", label: "Multiple Choice" },
                            { id: "true_false", label: "True/False" },
                            { id: "short_answer", label: "Short Answer" },
                            { id: "essay", label: "Essay Questions" },
                            { id: "fill_blank", label: "Fill in the Blanks" }
                          ].map(type => (
                            <div key={type.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={type.id}
                                checked={questionTypes.includes(type.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setQuestionTypes([...questionTypes, type.id]);
                                  } else {
                                    setQuestionTypes(questionTypes.filter(t => t !== type.id));
                                  }
                                }}
                              />
                              <Label htmlFor={type.id} className="text-slate-200 cursor-pointer">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-slate-800" />

                      {/* Chapter Selection */}
                      {selectedFileData?.detectedChapters && (
                        <div className="space-y-3">
                          <Label className="text-white">Select Topics (Optional)</Label>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {selectedFileData.detectedChapters.map((chapter, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`chapter-${idx}`}
                                  checked={selectedChapters.includes(chapter)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedChapters([...selectedChapters, chapter]);
                                    } else {
                                      setSelectedChapters(selectedChapters.filter(c => c !== chapter));
                                    }
                                  }}
                                />
                                <Label htmlFor={`chapter-${idx}`} className="text-slate-200 cursor-pointer text-sm">
                                  {chapter}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator className="bg-slate-800" />

                      {/* Mode */}
                      <div className="space-y-3">
                        <Label className="text-white">Mode</Label>
                        <RadioGroup value={practiceMode} onValueChange={(v: any) => setPracticeMode(v)}>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700">
                            <RadioGroupItem value="practice" id="practice" />
                            <Label htmlFor="practice" className="flex-1 cursor-pointer text-slate-200">
                              Practice Mode
                              <p className="text-xs text-slate-400 mt-1">Instant feedback</p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700">
                            <RadioGroupItem value="test" id="test" />
                            <Label htmlFor="test" className="flex-1 cursor-pointer text-slate-200">
                              Test Mode
                              <p className="text-xs text-slate-400 mt-1">Grade at end</p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Additional Options */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="explanations" 
                            checked={includeExplanations}
                            onCheckedChange={(c) => setIncludeExplanations(c as boolean)}
                          />
                          <Label htmlFor="explanations" className="text-slate-200 cursor-pointer">
                            Include Answer Explanations
                          </Label>
                        </div>
                      </div>

                      {/* Time Limit */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">Time Limit (minutes)</Label>
                          <Badge variant="outline" className="text-violet-400">
                            {timeLimit === 0 ? "Unlimited" : `${timeLimit} min`}
                          </Badge>
                        </div>
                        <Slider 
                          value={[timeLimit]} 
                          onValueChange={(v) => setTimeLimit(v[0])}
                          min={0}
                          max={120}
                          step={5}
                          className="py-4"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview Panel */}
                  <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white">Generate Practice Questions</CardTitle>
                      <CardDescription>
                        {selectedFileData?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Configuration Summary */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                          <p className="text-xs text-slate-400 mb-1">Questions</p>
                          <p className="text-lg font-semibold text-white">{questionCount}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                          <p className="text-xs text-slate-400 mb-1">Difficulty</p>
                          <p className="text-lg font-semibold text-white capitalize">{questionDifficulty}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                          <p className="text-xs text-slate-400 mb-1">Types</p>
                          <p className="text-lg font-semibold text-white">{questionTypes.length}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                          <p className="text-xs text-slate-400 mb-1">Mode</p>
                          <p className="text-lg font-semibold text-white capitalize">{practiceMode}</p>
                        </div>
                      </div>

                      {selectedChapters.length > 0 && (
                        <Alert className="bg-violet-500/10 border-violet-500/30">
                          <Target className="w-4 h-4 text-violet-400" />
                          <AlertDescription className="text-violet-200">
                            Questions will focus on {selectedChapters.length} selected topic(s)
                          </AlertDescription>
                        </Alert>
                      )}

                      <Alert className="bg-blue-500/10 border-blue-500/30">
                        <ListChecks className="w-4 h-4 text-blue-400" />
                        <AlertDescription className="text-blue-200">
                          AI will generate {questionCount} {questionDifficulty} questions
                          {includeExplanations && " with detailed explanations"}
                          {timeLimit > 0 && ` (${timeLimit} min time limit)`}
                        </AlertDescription>
                      </Alert>

                      <Button 
                        onClick={generateQuestions} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                        disabled={isGenerating || questionTypes.length === 0}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Questions...
                          </>
                        ) : (
                          <>
                            <ListChecks className="w-5 h-5 mr-2" />
                            Generate Practice Questions
                          </>
                        )}
                      </Button>

                      {questionTypes.length === 0 && (
                        <p className="text-sm text-yellow-400 text-center">
                          Please select at least one question type
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Generated Content Tab */}
            <TabsContent value="generated" className="space-y-4">
              {generatedContent.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardContent className="pt-12 pb-12 text-center">
                    <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Content Generated Yet</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Upload materials and use the AI tools to generate study notes, summaries, and practice questions
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {generatedContent.map(content => (
                    <Card key={content.id} className="bg-slate-900/50 border-slate-800 backdrop-blur hover:border-violet-600 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {content.type === "notes" && <FileText className="w-5 h-5 text-violet-400" />}
                              {content.type === "summary" && <MessageSquare className="w-5 h-5 text-emerald-400" />}
                              {content.type === "questions" && <ListChecks className="w-5 h-5 text-blue-400" />}
                              <CardTitle className="text-white">{content.title}</CardTitle>
                            </div>
                            <CardDescription>
                              Created {content.createdAt.toLocaleString()}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadContent(content)}
                              className="border-slate-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setGeneratedContent(prev => prev.filter(c => c.id !== content.id))}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                            {content.content}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Mock content generators
function generateMockNotes(format: string, detail: string) {
  return `# Study Notes - Cell Biology (${format} format, ${detail} detail)

## Cell Structure
${format === "bullet" ? `
• Cells are the basic unit of life
• Two main types: Prokaryotic and Eukaryotic
• Prokaryotes: No nucleus, simple structure
• Eukaryotes: Membrane-bound nucleus and organelles
` : `
Cells represent the fundamental unit of all living organisms. There are two primary categories of cells: prokaryotic and eukaryotic. Prokaryotic cells lack a membrane-bound nucleus and possess a relatively simple internal structure. In contrast, eukaryotic cells contain a well-defined nucleus enclosed by a nuclear membrane, along with various specialized organelles.
`}

## Cell Membrane
${format === "bullet" ? `
• Phospholipid bilayer structure
• Selectively permeable
• Contains proteins for transport
• Maintains cell shape and protection
` : `
The cell membrane consists of a phospholipid bilayer that serves as a selectively permeable barrier. This structure controls the passage of substances in and out of the cell. Embedded proteins facilitate various transport mechanisms, while the membrane also provides structural support and protection to the cell.
`}

[AI Generated Content - Full notes would continue with all detected topics]`;
}

function generateMockSummary(length: string) {
  const brief = "This material covers fundamental concepts in cell biology, focusing on cell structure, organelles, and membrane function. Key topics include the differences between prokaryotic and eukaryotic cells, the role of various organelles in cellular processes, and transport mechanisms across membranes.";
  
  const moderate = brief + "\n\nThe content explores cell structure in detail, explaining how the phospholipid bilayer forms the foundation of the cell membrane and controls substance movement. Various organelles are discussed, including mitochondria for energy production, ribosomes for protein synthesis, and the endoplasmic reticulum for protein and lipid processing. Transport mechanisms such as diffusion, osmosis, and active transport are explained with their energy requirements and directional flow.";
  
  const detailed = moderate + "\n\nFurther analysis reveals the intricate relationships between cellular components and their functions. The material emphasizes how cellular processes are interconnected, from DNA transcription in the nucleus to protein synthesis in ribosomes and subsequent modifications in the Golgi apparatus. Real-world applications include understanding disease mechanisms, drug development targeting specific cellular pathways, and biotechnology applications in genetic engineering. The content provides a comprehensive foundation for advanced studies in molecular biology and cellular biochemistry.";
  
  return length === "brief" ? brief : length === "moderate" ? moderate : detailed;
}

function generateMockQuestions(difficulty: string, count: number, types: string[]) {
  let output = `# Practice Questions (${difficulty} difficulty, ${count} questions)\n\n`;
  
  for (let i = 1; i <= Math.min(count, 5); i++) {
    if (types.includes("multiple_choice")) {
      output += `## Question ${i} (Multiple Choice)\n`;
      output += `What is the primary function of mitochondria?\n\n`;
      output += `A) Protein synthesis\n`;
      output += `B) ATP production through cellular respiration ✓\n`;
      output += `C) Lipid storage\n`;
      output += `D) DNA replication\n\n`;
      output += `**Explanation:** Mitochondria are the powerhouse of the cell, generating ATP through oxidative phosphorylation.\n\n`;
    }
  }
  
  output += `\n[AI would generate ${count} questions based on your settings]\n`;
  output += `Difficulty: ${difficulty} | Types: ${types.join(", ")}`;
  
  return output;
}
