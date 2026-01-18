import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { isAuthenticated, userRole, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: "student" | "lecturer") => {
    login(role);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isAuthenticated && userRole) {
    return <Dashboard userRole={userRole} onLogout={handleLogout} />;
  }

  return <AuthForm onLogin={handleLogin} />;
};

export default Index;
