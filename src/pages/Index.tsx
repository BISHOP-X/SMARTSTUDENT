import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { isAuthenticated, userRole, isDemo, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: "student" | "lecturer", isDemoMode: boolean = true) => {
    login(role, isDemoMode);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isAuthenticated && userRole) {
    return <Dashboard userRole={userRole} onLogout={handleLogout} isDemo={isDemo} />;
  }

  return <AuthForm onLogin={handleLogin} />;
};

export default Index;
