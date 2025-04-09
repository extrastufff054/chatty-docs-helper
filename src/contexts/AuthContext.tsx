
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, AuthSession, LoginCredentials, SignupData } from "@/lib/auth";
import { User } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: AuthSession | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginWithToken: (token: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isInitializing: true,
  login: async () => false,
  loginWithToken: async () => false,
  signup: async () => ({ success: false }),
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  const user = session?.user || null;
  const isAuthenticated = !!session;
  const isAdmin = !!user && user.role === "admin";

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('currentSessionToken');
      if (savedToken) {
        const { valid, session: validSession } = await auth.validateSession(savedToken);
        if (valid && validSession) {
          setSession(validSession);
          auth.setCurrentSession(validSession);
        } else {
          localStorage.removeItem('currentSessionToken');
        }
      }
      setIsInitializing(false);
    };
    
    initAuth();
  }, []);

  // Login with username/password
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const result = await auth.login(credentials);
    
    if (result.success && result.session) {
      setSession(result.session);
      auth.setCurrentSession(result.session);
      toast({
        title: "Login successful",
        description: `Welcome back, ${result.session.user.username}!`,
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: result.error || "Invalid credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  // Login with admin token (for backward compatibility)
  const loginWithToken = async (token: string): Promise<boolean> => {
    const result = await auth.loginWithAdminToken(token);
    
    if (result.success && result.session) {
      setSession(result.session);
      auth.setCurrentSession(result.session);
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin panel",
      });
      return true;
    } else {
      toast({
        title: "Admin login failed",
        description: result.error || "Invalid token",
        variant: "destructive",
      });
      return false;
    }
  };

  // Sign up new user
  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    const result = await auth.signup(data);
    
    if (result.success) {
      toast({
        title: "Registration successful",
        description: "Your account has been created and is pending approval by an administrator.",
      });
    } else {
      toast({
        title: "Registration failed",
        description: result.error || "Failed to create account",
        variant: "destructive",
      });
    }
    
    return result;
  };

  // Logout
  const logout = () => {
    if (session) {
      auth.logout(session.token);
      auth.setCurrentSession(null);
      setSession(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    }
  };

  const value = {
    session,
    user,
    isAuthenticated,
    isAdmin,
    isInitializing,
    login,
    loginWithToken,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
