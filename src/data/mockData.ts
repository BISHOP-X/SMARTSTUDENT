// Mock data for SmartStudent application
// This file contains all mock data used across the application

export interface Assignment {
  id: string;
  courseId: number;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: "upcoming" | "overdue" | "completed";
  gradingRubric?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: number;
  courseName: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: "pending" | "graded";
  contentText: string;
  aiScore?: number;
  aiFeedback?: string;
  manualScore?: number;
  manualFeedback?: string;
  maxScore: number;
}

export interface GradeEntry {
  id: string;
  assignmentTitle: string;
  courseName: string;
  submittedAt: string;
  gradedAt: string;
  score: number;
  maxScore: number;
  feedback: string;
  isAiGraded: boolean;
}

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: "a1",
    courseId: 1,
    courseName: "Molecular Biology",
    title: "DNA Replication Analysis",
    description: "Write a detailed analysis of DNA replication mechanisms, including leading and lagging strand synthesis.",
    dueDate: "2026-01-20T23:59:00",
    maxScore: 100,
    status: "upcoming",
    gradingRubric: "Comprehensive explanation of semi-conservative replication (30 pts), helicase and primase functions (25 pts), Okazaki fragments detail (25 pts), accuracy and clarity (20 pts)"
  },
  {
    id: "a2",
    courseId: 2,
    courseName: "Data Structures & Algorithms",
    title: "Binary Search Tree Implementation",
    description: "Implement a balanced BST with insertion, deletion, and traversal methods. Include time complexity analysis.",
    dueDate: "2026-01-19T23:59:00",
    maxScore: 150,
    status: "upcoming",
    gradingRubric: "Correct implementation (60 pts), balanced tree maintenance (30 pts), edge case handling (30 pts), time complexity analysis (30 pts)"
  },
  {
    id: "a3",
    courseId: 3,
    courseName: "Calculus III",
    title: "Multivariable Integration Problem Set",
    description: "Solve 10 problems involving double and triple integrals. Show all work.",
    dueDate: "2026-01-22T23:59:00",
    maxScore: 100,
    status: "upcoming",
    gradingRubric: "Correct setup of integrals (30 pts), proper integration techniques (40 pts), final answers (20 pts), work shown (10 pts)"
  },
  {
    id: "a4",
    courseId: 1,
    courseName: "Molecular Biology",
    title: "Protein Synthesis Essay",
    description: "Explain the process of translation from mRNA to protein, including ribosome structure and tRNA function.",
    dueDate: "2026-01-25T23:59:00",
    maxScore: 100,
    status: "upcoming",
    gradingRubric: "mRNA reading frame explanation (25 pts), ribosome structure and function (25 pts), tRNA role and anticodons (25 pts), peptide bond formation (15 pts), clarity and organization (10 pts)"
  },
  {
    id: "a5",
    courseId: 4,
    courseName: "Modern Literature",
    title: "Modernist Poetry Analysis",
    description: "Analyze T.S. Eliot's 'The Waste Land' focusing on themes of disillusionment and fragmentation.",
    dueDate: "2026-01-18T23:59:00",
    maxScore: 100,
    status: "overdue",
    gradingRubric: "Theme identification (20 pts), textual evidence (30 pts), critical analysis (30 pts), writing quality (20 pts)"
  },
  {
    id: "a6",
    courseId: 2,
    courseName: "Data Structures & Algorithms",
    title: "Graph Algorithms Quiz",
    description: "Complete problems on DFS, BFS, Dijkstra's algorithm, and minimum spanning trees.",
    dueDate: "2026-01-15T23:59:00",
    maxScore: 100,
    status: "completed",
    gradingRubric: "Algorithm correctness (50 pts), time complexity analysis (25 pts), space complexity (25 pts)"
  },
  {
    id: "a7",
    courseId: 3,
    courseName: "Calculus III",
    title: "Partial Derivatives Quiz",
    description: "Find partial derivatives for given multivariable functions.",
    dueDate: "2026-01-12T23:59:00",
    maxScore: 50,
    status: "completed",
    gradingRubric: "Correct derivatives (40 pts), proper notation (10 pts)"
  },
];

// Mock Submissions (for student view)
export const mockStudentSubmissions: Submission[] = [
  {
    id: "s1",
    assignmentId: "a6",
    assignmentTitle: "Graph Algorithms Quiz",
    courseId: 2,
    courseName: "Data Structures & Algorithms",
    studentId: "student1",
    studentName: "Alex Morgan",
    submittedAt: "2026-01-15T14:30:00",
    status: "graded",
    contentText: "DFS uses a stack (or recursion) to explore as far as possible along each branch. Time complexity: O(V+E). BFS uses a queue for level-order traversal. Time complexity: O(V+E). Dijkstra's algorithm finds shortest paths from source to all vertices using a priority queue. Time complexity: O((V+E)logV). MST can be found using Kruskal's or Prim's algorithm, both greedy approaches.",
    aiScore: 92,
    aiFeedback: "Excellent understanding of graph algorithms. Your explanation of time complexities is accurate and concise. Minor improvement: could have mentioned the use case differences between DFS and BFS (e.g., topological sort vs. shortest path in unweighted graphs).",
    maxScore: 100,
  },
  {
    id: "s2",
    assignmentId: "a7",
    assignmentTitle: "Partial Derivatives Quiz",
    courseId: 3,
    courseName: "Calculus III",
    studentId: "student1",
    studentName: "Alex Morgan",
    submittedAt: "2026-01-12T10:15:00",
    status: "graded",
    contentText: "For f(x,y) = x²y + 3xy², ∂f/∂x = 2xy + 3y², ∂f/∂y = x² + 6xy. For g(x,y,z) = xyz², ∂g/∂x = yz², ∂g/∂y = xz², ∂g/∂z = 2xyz.",
    aiScore: 48,
    aiFeedback: "Good work! All partial derivatives are correctly computed with proper notation. Keep up the excellent attention to detail.",
    manualScore: 50,
    manualFeedback: "Perfect work! Bonus points for clear presentation.",
    maxScore: 50,
  },
  {
    id: "s3",
    assignmentId: "a2",
    assignmentTitle: "Binary Search Tree Implementation",
    courseId: 2,
    courseName: "Data Structures & Algorithms",
    studentId: "student1",
    studentName: "Alex Morgan",
    submittedAt: "2026-01-19T20:45:00",
    status: "pending",
    contentText: "class Node { constructor(val) { this.value = val; this.left = null; this.right = null; } } class BST { constructor() { this.root = null; } insert(val) { const newNode = new Node(val); if (!this.root) { this.root = newNode; return; } let current = this.root; while (true) { if (val < current.value) { if (!current.left) { current.left = newNode; return; } current = current.left; } else { if (!current.right) { current.right = newNode; return; } current = current.right; } } } }",
    maxScore: 150,
  },
];

// Mock Submissions for lecturer (all students across all courses)
export const mockLecturerSubmissions: Submission[] = [
  {
    id: "ls1",
    assignmentId: "a1",
    assignmentTitle: "DNA Replication Analysis",
    courseId: 1,
    courseName: "Molecular Biology",
    studentId: "student2",
    studentName: "Emma Thompson",
    submittedAt: "2026-01-18T09:30:00",
    status: "pending",
    contentText: "DNA replication is a semi-conservative process where each strand serves as a template. Helicase unwinds the double helix, creating replication forks. DNA polymerase synthesizes new strands in the 5' to 3' direction. The leading strand is synthesized continuously, while the lagging strand is synthesized in Okazaki fragments. Primase creates RNA primers needed for DNA polymerase to begin synthesis. Ligase joins Okazaki fragments together.",
    maxScore: 100,
  },
  {
    id: "ls2",
    assignmentId: "a1",
    assignmentTitle: "DNA Replication Analysis",
    courseId: 1,
    courseName: "Molecular Biology",
    studentId: "student3",
    studentName: "James Rodriguez",
    submittedAt: "2026-01-19T14:22:00",
    status: "pending",
    contentText: "DNA replication happens during S phase. The process is semi-conservative, meaning each new molecule has one old strand and one new strand. Helicase opens up the DNA. DNA polymerase adds nucleotides.",
    maxScore: 100,
  },
  {
    id: "ls3",
    assignmentId: "a2",
    assignmentTitle: "Binary Search Tree Implementation",
    courseId: 2,
    courseName: "Data Structures & Algorithms",
    studentId: "student4",
    studentName: "Sophia Chen",
    submittedAt: "2026-01-19T16:10:00",
    status: "pending",
    contentText: "class BinarySearchTree { constructor() { this.root = null; } insert(value) { const node = { value, left: null, right: null }; if (!this.root) { this.root = node; } else { this._insertNode(this.root, node); } } _insertNode(root, newNode) { if (newNode.value < root.value) { if (root.left === null) root.left = newNode; else this._insertNode(root.left, newNode); } else { if (root.right === null) root.right = newNode; else this._insertNode(root.right, newNode); } } }",
    maxScore: 150,
  },
  {
    id: "ls4",
    assignmentId: "a3",
    assignmentTitle: "Multivariable Integration Problem Set",
    courseId: 3,
    courseName: "Calculus III",
    studentId: "student5",
    studentName: "Michael Brown",
    submittedAt: "2026-01-20T11:45:00",
    status: "pending",
    contentText: "Problem 1: ∫∫(x²+y²)dA over region R. Setting up in polar: ∫₀²π ∫₀² r²·r dr dθ = ∫₀²π [r⁴/4]₀² dθ = ∫₀²π 4 dθ = 8π. Problem 2: ∫∫∫(xyz)dV over cube [0,1]³...",
    maxScore: 100,
  },
  {
    id: "ls5",
    assignmentId: "a5",
    assignmentTitle: "Modernist Poetry Analysis",
    courseId: 4,
    courseName: "Modern Literature",
    studentId: "student6",
    studentName: "Olivia Martinez",
    submittedAt: "2026-01-17T22:30:00",
    status: "graded",
    contentText: "T.S. Eliot's 'The Waste Land' embodies post-WWI disillusionment through fragmented structure and diverse literary allusions. The poem's five sections present a barren landscape reflecting spiritual emptiness. The Fisher King myth symbolizes cultural sterility. Multiple voices and languages create a sense of disconnection mirroring modern alienation.",
    aiScore: 85,
    aiFeedback: "Strong analysis of modernist themes. Good use of textual evidence and understanding of historical context. To improve: could explore specific imagery more deeply and discuss the role of water symbolism throughout the work.",
    maxScore: 100,
  },
  {
    id: "ls6",
    assignmentId: "a6",
    assignmentTitle: "Graph Algorithms Quiz",
    courseId: 2,
    courseName: "Data Structures & Algorithms",
    studentId: "student7",
    studentName: "Daniel Kim",
    submittedAt: "2026-01-15T18:00:00",
    status: "graded",
    contentText: "DFS: Stack-based traversal, explores depth first. O(V+E) time. BFS: Queue-based, explores level by level. O(V+E) time. Dijkstra: Greedy shortest path, priority queue. O(ElogV). MST: Kruskal uses Union-Find, Prim uses heap.",
    aiScore: 78,
    aiFeedback: "Good grasp of algorithms. Answers are correct but could be more detailed. For full credit, include pseudocode or worked examples for at least one algorithm.",
    maxScore: 100,
  },
  {
    id: "ls7",
    assignmentId: "a4",
    assignmentTitle: "Protein Synthesis Essay",
    courseId: 1,
    courseName: "Molecular Biology",
    studentId: "student8",
    studentName: "Isabella Garcia",
    submittedAt: "2026-01-23T19:15:00",
    status: "pending",
    contentText: "Translation begins when mRNA binds to ribosome. The ribosome has two subunits (large and small) with three binding sites: A (aminoacyl), P (peptidyl), and E (exit). tRNA molecules carry amino acids and have anticodons complementary to mRNA codons. The process includes initiation (start codon AUG), elongation (peptide bonds form), and termination (stop codon reached). Each peptide bond formation requires energy from GTP.",
    maxScore: 100,
  },
];

// Mock recent grades (for student dashboard)
export const mockRecentGrades: GradeEntry[] = [
  {
    id: "g1",
    assignmentTitle: "Graph Algorithms Quiz",
    courseName: "Data Structures & Algorithms",
    submittedAt: "2026-01-15T14:30:00",
    gradedAt: "2026-01-16T10:00:00",
    score: 92,
    maxScore: 100,
    feedback: "Excellent understanding of graph algorithms. Your explanation of time complexities is accurate and concise.",
    isAiGraded: true,
  },
  {
    id: "g2",
    assignmentTitle: "Partial Derivatives Quiz",
    courseName: "Calculus III",
    submittedAt: "2026-01-12T10:15:00",
    gradedAt: "2026-01-13T15:30:00",
    score: 50,
    maxScore: 50,
    feedback: "Perfect work! Bonus points for clear presentation.",
    isAiGraded: false,
  },
  {
    id: "g3",
    assignmentTitle: "Cell Division Lab Report",
    courseName: "Molecular Biology",
    submittedAt: "2026-01-10T16:45:00",
    gradedAt: "2026-01-11T09:20:00",
    score: 88,
    maxScore: 100,
    feedback: "Good observations and analysis. Diagrams were excellent. Could improve discussion section with more references to literature.",
    isAiGraded: true,
  },
];

// Mock upcoming deadlines (for student dashboard)
export const mockUpcomingDeadlines = mockAssignments
  .filter(a => a.status === "upcoming" || a.status === "overdue")
  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  .slice(0, 5);

// Courses taught by lecturer (for lecturer dashboard)
export const mockCoursesTaught = [
  {
    id: 1,
    title: "Molecular Biology",
    code: "BIO301",
    students: 32,
    pendingSubmissions: 2,
    averageGrade: 86.5,
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    code: "CS202",
    students: 28,
    pendingSubmissions: 3,
    averageGrade: 82.3,
  },
];

// Helper function to get days until deadline
export const getDaysUntil = (dateString: string): number => {
  const now = new Date();
  const due = new Date(dateString);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to get time ago
export const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return formatDate(dateString);
};
