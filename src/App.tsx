import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorHandling";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import AssignmentDetail from "./pages/AssignmentDetail";
import MySubmissions from "./pages/MySubmissions";
import GradingQueue from "./pages/GradingQueue";
import CourseAnalytics from "./pages/CourseAnalytics";
import Calendar from "./pages/Calendar";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Routes component that uses auth context
const AppRoutes = () => {
  const { userRole, logout } = useAuth();
  const role = userRole || "student";

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses userRole={role} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetail userRole={role} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/assignments/:assignmentId"
        element={
          <ProtectedRoute>
            <AssignmentDetail userRole={role} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submissions"
        element={
          <ProtectedRoute>
            <MySubmissions userRole={role} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grading"
        element={
          <ProtectedRoute>
            <GradingQueue userRole={role} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id/analytics"
        element={
          <ProtectedRoute>
            <CourseAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
