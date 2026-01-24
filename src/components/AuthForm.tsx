import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Sparkles, ArrowRight, GraduationCap, BookOpen, Play, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-auth.jpg";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AuthFormProps {
  onLogin: (role: "student" | "lecturer", isDemo?: boolean) => void;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRealAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: role,
              phone: phone,
              parent_phone: parentPhone,
            },
          },
        });

        if (error) throw error;

        // Check if email confirmation is required
        if (data.user && !data.session) {
          // Email confirmation required
          toast({
            title: "Check your email!",
            description: "We've sent you a confirmation link. Please verify your email to continue.",
          });
          setIsLoading(false);
          return;
        }

        if (data.user) {
          // Create profile record with phone numbers
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: profileError } = await (supabase.from('profiles') as any).upsert({
            id: data.user.id,
            email: email,
            full_name: name,
            role: role,
            phone: phone || null,
            parent_phone: parentPhone || null,
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Don't block login if profile creation fails
          }

          toast({
            title: "Account created!",
            description: "You've been signed up and logged in.",
          });
          setIsLoading(false);
          onLogin(role, false); // false = not demo mode
        }
      } else {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Get the user's role from their profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          const userRole = (profile?.role as "student" | "lecturer") || role;
          
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
          onLogin(userRole, false); // false = not demo mode
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    toast({
      title: "Demo Mode Activated",
      description: `Exploring as ${role}. Sample data loaded for full experience.`,
    });
    onLogin(role, true); // true = demo mode
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

      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle variant="switch" />
      </div>

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
            <span className="text-3xl font-bold text-foreground">EduSync</span>
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
        <div className="glass-card w-full max-w-md p-6 md:p-8 animate-fade-in">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">EduSync</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isSignUp 
                ? "Start your learning journey today" 
                : "Sign in to continue to your dashboard"}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="mb-5">
            <Label className="text-sm text-foreground mb-2 block">I am a...</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`
                  relative p-3 rounded-lg border-2 transition-all duration-200 text-left
                  ${
                    role === "student"
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                    ${role === "student" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}
                  `}>
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground">Student</div>
                    <div className="text-xs text-muted-foreground truncate">Learn & submit</div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setRole("lecturer")}
                className={`
                  relative p-3 rounded-lg border-2 transition-all duration-200 text-left
                  ${
                    role === "lecturer"
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                    ${role === "lecturer" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}
                  `}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground">Lecturer</div>
                    <div className="text-xs text-muted-foreground truncate">Teach & manage</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleRealAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="name" className="text-foreground text-sm">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-10"
                />
              </div>
            )}

            {isSignUp && role === "student" && (
              <>
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="phone" className="text-foreground text-sm">
                    Your Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">For important notifications and reminders</p>
                </div>

                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="parentPhone" className="text-foreground text-sm">
                    Parent/Guardian Phone Number <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    placeholder="+1 (555) 987-6543"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">We'll notify them about important updates</p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              variant="hero" 
              size="default" 
              className="w-full group mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Mode Button */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or explore with sample data</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="default"
              className="w-full mt-4 group border-primary/30 hover:border-primary hover:bg-primary/5"
              onClick={handleDemoLogin}
            >
              <Play className="w-4 h-4 mr-2 text-primary" />
              Try Demo as {role === "student" ? "Student" : "Lecturer"}
              <span className="ml-2 text-xs text-muted-foreground">(Full Experience)</span>
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
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
