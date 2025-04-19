
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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

  // Derive user, isAuthenticated and isAdmin from session using useMemo for better performance
  const user = useMemo(() => session?.user || null, [session]);
  const isAuthenticated = useMemo(() => !!session, [session]);
  const isAdmin = useMemo(() => !!user && user.role === "admin", [user]);

  // Check for existing session on mount - using useEffect with empty dependency array
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('currentSessionToken');
        if (savedToken) {
          const { valid, session: validSession } = await auth.validateSession(savedToken);
          if (valid && validSession) {
            setSession(validSession);
            auth.setCurrentSession(validSession);
          } else {
            // Clean up invalid token
            localStorage.removeItem('currentSessionToken');
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clean up on error
        localStorage.removeItem('currentSessionToken');
      } finally {
        setIsInitializing(false);
      }
    };
    
    initAuth();
  }, []);

  // Login with username/password - using useCallback to prevent unnecessary recreations
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
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
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Login with admin token - using useCallback
  const loginWithToken = useCallback(async (token: string): Promise<boolean> => {
    try {
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
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Sign up new user - using useCallback
  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
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
    } catch (error) {
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: "Unexpected error" };
    }
  }, [toast]);

  // Logout - using useCallback
  const logout = useCallback(() => {
    if (session) {
      auth.logout(session.token);
      auth.setCurrentSession(null);
      setSession(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    }
  }, [session, toast]);

  // Using useMemo for the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    session,
    user,
    isAuthenticated,
    isAdmin,
    isInitializing,
    login,
    loginWithToken,
    signup,
    logout,
  }), [session, user, isAuthenticated, isAdmin, isInitializing, login, loginWithToken, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
