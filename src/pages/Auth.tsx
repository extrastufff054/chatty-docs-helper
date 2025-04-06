
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogIn, UserPlus } from "lucide-react";

export const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleLoginSuccess = () => {
    navigate("/");
  };

  const handleSignupSuccess = () => {
    // After signup, switch to login tab
    setActiveTab("login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
            alt="I4C Logo" 
            className="h-20 w-auto"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login" className="flex gap-2 items-center">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex gap-2 items-center">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="login" className="flex justify-center">
              <LoginForm onSuccess={handleLoginSuccess} />
            </TabsContent>
            
            <TabsContent value="signup" className="flex justify-center">
              <SignupForm onSuccess={handleSignupSuccess} />
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Are you an administrator?{" "}
            <Link to="/admin" className="text-primary hover:underline">
              Access Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
