import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "lecturer" | null>(null);
  const navigate = useNavigate();

  const handleLogin = (role: "student" | "lecturer") => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
  };

  if (isAuthenticated && userRole) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return <AuthForm onLogin={handleLogin} />;
};

export default Index;
