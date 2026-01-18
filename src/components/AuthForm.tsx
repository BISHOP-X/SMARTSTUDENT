import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-auth.jpg";

interface AuthFormProps {
  onLogin: () => void;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Cinematic Background */}
      <img
        src={heroImage}
        alt="Student having an aha moment in a modern library"
        className="hero-image"
        loading="eager"
      />
      <div className="hero-overlay" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-12">
        {/* Brand Section - Desktop */}
        <div className="hidden lg:flex flex-col max-w-lg mr-24 mb-0 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-glow">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold text-foreground">SmartStudent</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Learn smarter.</span>
            <br />
            <span className="text-gradient">Achieve more.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The AI-powered learning platform that adapts to you. 
            Unified academic management meets intelligent personal organization.
          </p>
        </div>

        {/* Glass Login Card */}
        <div className="glass-card w-full max-w-md p-8 md:p-10 animate-fade-in">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">SmartStudent</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp 
                ? "Start your learning journey today" 
                : "Sign in to continue to your dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full group">
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-primary font-medium hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
