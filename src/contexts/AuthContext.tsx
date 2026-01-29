import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: "student" | "lecturer" | null;
  isDemo: boolean;
  user: User | null;
  login: (role: "student" | "lecturer", isDemo?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "lecturer" | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user role from profile (with timeout)
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setUser(session.user);
          // Use profile role, or fallback to user metadata, or default to 'student'
          const role = (profile?.role as "student" | "lecturer") || 
                       (session.user.user_metadata?.role as "student" | "lecturer") || 
                       'student';
          setUserRole(role);
          setIsAuthenticated(true);
          setIsDemo(false);
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Don't auto-authenticate here - let AuthForm handle role validation first
          // Just update the user object silently
          setUser(session.user);
            
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
          setIsDemo(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = (role: "student" | "lecturer", demoMode: boolean = true) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setIsDemo(demoMode);
    if (demoMode) {
      setUser(null); // No real user in demo mode
    }
  };

  const logout = async () => {
    if (!isDemo) {
      // Real logout from Supabase
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setUserRole(null);
    setIsDemo(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, isDemo, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
