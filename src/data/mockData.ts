// Mock data for EduSync application
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

// ==================== ANALYTICS DATA ====================

export interface CourseAnalytics {
  courseId: number;
  courseName: string;
  courseCode: string;
  totalStudents: number;
  averageGrade: number;
  submissionRate: number;
  gradeDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  assignmentPerformance: {
    assignmentTitle: string;
    averageScore: number;
    submissionRate: number;
    dueDate: string;
  }[];
  topPerformers: {
    studentName: string;
    averageGrade: number;
    assignmentsCompleted: number;
  }[];
  strugglingStudents: {
    studentName: string;
    averageGrade: number;
    assignmentsCompleted: number;
    missedDeadlines: number;
  }[];
  performanceOverTime: {
    date: string;
    averageScore: number;
    submissionCount: number;
  }[];
}

export const mockCourseAnalytics: Record<number, CourseAnalytics> = {
  1: {
    courseId: 1,
    courseName: "Molecular Biology",
    courseCode: "BIO301",
    totalStudents: 32,
    averageGrade: 86.5,
    submissionRate: 94.3,
    gradeDistribution: [
      { range: "90-100", count: 12, percentage: 37.5 },
      { range: "80-89", count: 14, percentage: 43.75 },
      { range: "70-79", count: 4, percentage: 12.5 },
      { range: "60-69", count: 2, percentage: 6.25 },
      { range: "0-59", count: 0, percentage: 0 },
    ],
    assignmentPerformance: [
      {
        assignmentTitle: "DNA Replication Analysis",
        averageScore: 88.5,
        submissionRate: 93.75,
        dueDate: "2026-01-20",
      },
      {
        assignmentTitle: "Protein Synthesis Essay",
        averageScore: 85.2,
        submissionRate: 96.88,
        dueDate: "2026-01-25",
      },
      {
        assignmentTitle: "Cell Division Lab Report",
        averageScore: 87.8,
        submissionRate: 100,
        dueDate: "2026-01-10",
      },
      {
        assignmentTitle: "Enzyme Kinetics Problem Set",
        averageScore: 84.3,
        submissionRate: 90.63,
        dueDate: "2026-01-08",
      },
    ],
    topPerformers: [
      { studentName: "Emma Thompson", averageGrade: 96.5, assignmentsCompleted: 4 },
      { studentName: "Michael Chen", averageGrade: 94.2, assignmentsCompleted: 4 },
      { studentName: "Sarah Johnson", averageGrade: 92.8, assignmentsCompleted: 4 },
    ],
    strugglingStudents: [
      { studentName: "James Rodriguez", averageGrade: 65.3, assignmentsCompleted: 3, missedDeadlines: 1 },
      { studentName: "David Lee", averageGrade: 68.9, assignmentsCompleted: 3, missedDeadlines: 1 },
    ],
    performanceOverTime: [
      { date: "2026-01-08", averageScore: 84.3, submissionCount: 29 },
      { date: "2026-01-10", averageScore: 87.8, submissionCount: 32 },
      { date: "2026-01-12", averageScore: 86.1, submissionCount: 31 },
      { date: "2026-01-15", averageScore: 88.5, submissionCount: 30 },
    ],
  },
  2: {
    courseId: 2,
    courseName: "Data Structures & Algorithms",
    courseCode: "CS202",
    totalStudents: 28,
    averageGrade: 82.3,
    submissionRate: 89.7,
    gradeDistribution: [
      { range: "90-100", count: 8, percentage: 28.57 },
      { range: "80-89", count: 12, percentage: 42.86 },
      { range: "70-79", count: 6, percentage: 21.43 },
      { range: "60-69", count: 2, percentage: 7.14 },
      { range: "0-59", count: 0, percentage: 0 },
    ],
    assignmentPerformance: [
      {
        assignmentTitle: "Binary Search Tree Implementation",
        averageScore: 81.5,
        submissionRate: 85.71,
        dueDate: "2026-01-19",
      },
      {
        assignmentTitle: "Graph Algorithms Quiz",
        averageScore: 84.8,
        submissionRate: 92.86,
        dueDate: "2026-01-15",
      },
      {
        assignmentTitle: "Dynamic Programming Problems",
        averageScore: 79.2,
        submissionRate: 89.29,
        dueDate: "2026-01-05",
      },
      {
        assignmentTitle: "Sorting Algorithms Analysis",
        averageScore: 83.6,
        submissionRate: 96.43,
        dueDate: "2026-01-02",
      },
    ],
    topPerformers: [
      { studentName: "Alex Morgan", averageGrade: 93.5, assignmentsCompleted: 4 },
      { studentName: "Sophia Chen", averageGrade: 91.3, assignmentsCompleted: 4 },
      { studentName: "Daniel Kim", averageGrade: 89.7, assignmentsCompleted: 4 },
    ],
    strugglingStudents: [
      { studentName: "Jessica Brown", averageGrade: 67.2, assignmentsCompleted: 3, missedDeadlines: 1 },
      { studentName: "Ryan Martinez", averageGrade: 69.8, assignmentsCompleted: 3, missedDeadlines: 1 },
    ],
    performanceOverTime: [
      { date: "2026-01-02", averageScore: 83.6, submissionCount: 27 },
      { date: "2026-01-05", averageScore: 79.2, submissionCount: 25 },
      { date: "2026-01-15", averageScore: 84.8, submissionCount: 26 },
      { date: "2026-01-19", averageScore: 81.5, submissionCount: 24 },
    ],
  },
  3: {
    courseId: 3,
    courseName: "Calculus III",
    courseCode: "MATH303",
    totalStudents: 35,
    averageGrade: 78.9,
    submissionRate: 91.4,
    gradeDistribution: [
      { range: "90-100", count: 6, percentage: 17.14 },
      { range: "80-89", count: 15, percentage: 42.86 },
      { range: "70-79", count: 10, percentage: 28.57 },
      { range: "60-69", count: 3, percentage: 8.57 },
      { range: "0-59", count: 1, percentage: 2.86 },
    ],
    assignmentPerformance: [
      {
        assignmentTitle: "Multivariable Integration Problem Set",
        averageScore: 76.5,
        submissionRate: 88.57,
        dueDate: "2026-01-22",
      },
      {
        assignmentTitle: "Partial Derivatives Quiz",
        averageScore: 82.3,
        submissionRate: 94.29,
        dueDate: "2026-01-12",
      },
      {
        assignmentTitle: "Vector Fields Assignment",
        averageScore: 77.8,
        submissionRate: 91.43,
        dueDate: "2026-01-06",
      },
    ],
    topPerformers: [
      { studentName: "Kevin Zhang", averageGrade: 96.2, assignmentsCompleted: 3 },
      { studentName: "Lisa Anderson", averageGrade: 94.5, assignmentsCompleted: 3 },
      { studentName: "Alex Morgan", averageGrade: 92.0, assignmentsCompleted: 3 },
    ],
    strugglingStudents: [
      { studentName: "Tom Wilson", averageGrade: 58.3, assignmentsCompleted: 2, missedDeadlines: 1 },
      { studentName: "Rachel Green", averageGrade: 64.7, assignmentsCompleted: 3, missedDeadlines: 0 },
    ],
    performanceOverTime: [
      { date: "2026-01-06", averageScore: 77.8, submissionCount: 32 },
      { date: "2026-01-12", averageScore: 82.3, submissionCount: 33 },
      { date: "2026-01-22", averageScore: 76.5, submissionCount: 31 },
    ],
  },
};

// ==================== CALENDAR & GOALS DATA ====================

export interface PersonalGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  eventDate: string;
  status: "todo" | "done";
  category: "study" | "personal" | "health" | "career" | "other";
  createdAt: string;
}

export const mockPersonalGoals: PersonalGoal[] = [
  {
    id: "pg1",
    userId: "student1",
    title: "Complete Data Structures Study Guide",
    description: "Finish comprehensive study guide covering all tree structures and graph algorithms",
    eventDate: "2026-01-21T14:00:00",
    status: "todo",
    category: "study",
    createdAt: "2026-01-15T10:00:00",
  },
  {
    id: "pg2",
    userId: "student1",
    title: "Gym Session",
    description: "Leg day workout - squats, lunges, leg press",
    eventDate: "2026-01-19T18:00:00",
    status: "todo",
    category: "health",
    createdAt: "2026-01-14T08:30:00",
  },
  {
    id: "pg3",
    userId: "student1",
    title: "Review Calculus Notes",
    description: "Go over partial derivatives and integration techniques",
    eventDate: "2026-01-20T16:00:00",
    status: "done",
    category: "study",
    createdAt: "2026-01-13T12:00:00",
  },
  {
    id: "pg4",
    userId: "student1",
    title: "Coffee with Study Group",
    description: "Meet at campus cafe to discuss Bio project",
    eventDate: "2026-01-22T15:00:00",
    status: "todo",
    category: "personal",
    createdAt: "2026-01-16T14:20:00",
  },
  {
    id: "pg5",
    userId: "student1",
    title: "Practice Coding Problems",
    description: "LeetCode medium difficulty - focus on dynamic programming",
    eventDate: "2026-01-23T20:00:00",
    status: "todo",
    category: "study",
    createdAt: "2026-01-17T11:15:00",
  },
  {
    id: "pg6",
    userId: "student1",
    title: "Career Fair Preparation",
    description: "Update resume and prepare elevator pitch",
    eventDate: "2026-01-24T10:00:00",
    status: "todo",
    category: "career",
    createdAt: "2026-01-16T09:00:00",
  },
  {
    id: "pg7",
    userId: "student1",
    title: "Morning Run",
    description: "5K run around campus",
    eventDate: "2026-01-25T07:00:00",
    status: "todo",
    category: "health",
    createdAt: "2026-01-17T20:00:00",
  },
  {
    id: "pg8",
    userId: "student1",
    title: "Read Literature Chapter",
    description: "Finish chapters 5-7 for next class discussion",
    eventDate: "2026-01-18T19:00:00",
    status: "done",
    category: "study",
    createdAt: "2026-01-12T15:30:00",
  },
];

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: "assignment" | "goal" | "exam" | "class";
  courseId?: number;
  courseName?: string;
  status?: string;
  category?: string;
}

// Helper function to generate calendar events (combines assignments + goals)
export const getCalendarEvents = (userRole: "student" | "lecturer"): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  // Add assignments as events
  if (userRole === "student") {
    mockAssignments
      .filter(a => a.status === "upcoming" || a.status === "overdue")
      .forEach(assignment => {
        events.push({
          id: `assignment-${assignment.id}`,
          title: assignment.title,
          description: assignment.description,
          date: assignment.dueDate,
          type: "assignment",
          courseId: assignment.courseId,
          courseName: assignment.courseName,
          status: assignment.status,
        });
      });

    // Add personal goals as events
    mockPersonalGoals.forEach(goal => {
      events.push({
        id: `goal-${goal.id}`,
        title: goal.title,
        description: goal.description,
        date: goal.eventDate,
        type: "goal",
        status: goal.status,
        category: goal.category,
      });
    });
  }

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Helper to get events for a specific date
export const getEventsForDate = (date: Date, userRole: "student" | "lecturer"): CalendarEvent[] => {
  const events = getCalendarEvents(userRole);
  const targetDate = date.toISOString().split('T')[0];
  
  return events.filter(event => {
    const eventDate = new Date(event.date).toISOString().split('T')[0];
    return eventDate === targetDate;
  });
};

// Helper to get events for a date range
export const getEventsForRange = (startDate: Date, endDate: Date, userRole: "student" | "lecturer"): CalendarEvent[] => {
  const events = getCalendarEvents(userRole);
  
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
};

// ==================== NOTIFICATIONS DATA ====================

export interface Notification {
  id: string;
  userId: string;
  type: "assignment_posted" | "grade_received" | "deadline_reminder" | "material_uploaded" | "announcement";
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: "assignment" | "course" | "submission" | "material";
  isRead: boolean;
  createdAt: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    userId: "student1",
    type: "grade_received",
    title: "New Grade Available",
    message: "Your submission for 'Graph Algorithms Quiz' has been graded. Score: 92/100",
    relatedId: "a6",
    relatedType: "assignment",
    isRead: false,
    createdAt: "2026-01-18T10:30:00",
  },
  {
    id: "n2",
    userId: "student1",
    type: "assignment_posted",
    title: "New Assignment Posted",
    message: "Dr. Morgan posted 'DNA Replication Analysis' in Molecular Biology",
    relatedId: "a1",
    relatedType: "assignment",
    isRead: false,
    createdAt: "2026-01-18T08:15:00",
  },
  {
    id: "n3",
    userId: "student1",
    type: "deadline_reminder",
    title: "⏰ Assignment Due in 1 Hour!",
    message: "'Binary Search Tree Implementation' is due in 1 hour (11:59 PM today). Submit now to avoid late penalty!",
    relatedId: "a2",
    relatedType: "assignment",
    isRead: false,
    createdAt: "2026-01-19T22:59:00",
  },
  {
    id: "n3b",
    userId: "student1",
    type: "deadline_reminder",
    title: "⏰ Assignment Due in 1 Hour!",
    message: "'DNA Replication Analysis' is due in 1 hour (11:59 PM today). Make sure to review before submitting!",
    relatedId: "a1",
    relatedType: "assignment",
    isRead: false,
    createdAt: "2026-01-20T22:59:00",
  },
  {
    id: "n4",
    userId: "student1",
    type: "material_uploaded",
    title: "New Course Material",
    message: "New lecture slides uploaded for Data Structures & Algorithms",
    relatedId: "1",
    relatedType: "course",
    isRead: true,
    createdAt: "2026-01-17T16:45:00",
  },
  {
    id: "n5",
    userId: "student1",
    type: "grade_received",
    title: "Grade Updated",
    message: "Your grade for 'Partial Derivatives Quiz' was updated to 50/50",
    relatedId: "a7",
    relatedType: "assignment",
    isRead: true,
    createdAt: "2026-01-17T14:20:00",
  },
  {
    id: "n6",
    userId: "student1",
    type: "deadline_reminder",
    title: "Assignment Due in 3 Days",
    message: "'Multivariable Integration Problem Set' is due on January 22",
    relatedId: "a3",
    relatedType: "assignment",
    isRead: true,
    createdAt: "2026-01-17T09:00:00",
  },
  {
    id: "n7",
    userId: "student1",
    type: "announcement",
    title: "Course Announcement",
    message: "Office hours this week moved to Thursday 2-4 PM",
    relatedId: "2",
    relatedType: "course",
    isRead: true,
    createdAt: "2026-01-16T11:30:00",
  },
  {
    id: "n8",
    userId: "student1",
    type: "assignment_posted",
    title: "New Assignment Posted",
    message: "Prof. Smith posted 'Protein Synthesis Essay' in Molecular Biology",
    relatedId: "a4",
    relatedType: "assignment",
    isRead: true,
    createdAt: "2026-01-15T15:00:00",
  },
];

// Lecturer notifications
export const mockLecturerNotifications: Notification[] = [
  {
    id: "ln1",
    userId: "lecturer1",
    type: "assignment_posted",
    title: "Submissions Pending",
    message: "5 new submissions waiting for review in your courses",
    isRead: false,
    createdAt: "2026-01-18T09:45:00",
  },
  {
    id: "ln2",
    userId: "lecturer1",
    type: "deadline_reminder",
    title: "Assignment Deadline Approaching",
    message: "'DNA Replication Analysis' is due in 2 days",
    relatedId: "a1",
    relatedType: "assignment",
    isRead: false,
    createdAt: "2026-01-18T07:00:00",
  },
  {
    id: "ln3",
    userId: "lecturer1",
    type: "announcement",
    title: "Student Reached Out",
    message: "Emma Thompson sent you a message about Assignment 1",
    isRead: true,
    createdAt: "2026-01-17T13:20:00",
  },
];

// Helper to get unread count
export const getUnreadNotificationCount = (userRole: "student" | "lecturer"): number => {
  const notifications = userRole === "lecturer" ? mockLecturerNotifications : mockNotifications;
  return notifications.filter(n => !n.isRead).length;
};

// Helper to mark notification as read
export const markNotificationAsRead = (notificationId: string, userRole: "student" | "lecturer"): void => {
  const notifications = userRole === "lecturer" ? mockLecturerNotifications : mockNotifications;
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

// Helper to mark all as read
export const markAllNotificationsAsRead = (userRole: "student" | "lecturer"): void => {
  const notifications = userRole === "lecturer" ? mockLecturerNotifications : mockNotifications;
  notifications.forEach(n => n.isRead = true);
};
