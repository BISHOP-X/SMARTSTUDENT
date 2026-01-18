import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return <AuthForm onLogin={handleLogin} />;
};

export default Index;
