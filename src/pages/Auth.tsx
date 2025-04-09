
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate("/");
  };

  const handleSignupSuccess = () => {
    // After signup, switch to login tab
    setActiveTab("login");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/5 transition-colors duration-300"
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md mx-auto px-4">
        <motion.div 
          variants={fadeIn}
          className="flex justify-center mb-8"
        >
          <img 
            src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
            alt="I4C Logo" 
            className="h-24 w-auto hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          className="bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 overflow-hidden"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login" className="flex gap-2 items-center data-[state=active]:bg-primary/20">
                  <LogIn className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex gap-2 items-center data-[state=active]:bg-primary/20">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="login" className="flex justify-center mt-0">
                <LoginForm onSuccess={handleLoginSuccess} />
              </TabsContent>
              
              <TabsContent value="signup" className="flex justify-center mt-0">
                <SignupForm onSuccess={handleSignupSuccess} />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
        
        <motion.div 
          variants={fadeIn}
          className="text-center mt-6"
        >
          <Link 
            to="/admin-auth" 
            className="flex items-center justify-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-300 group"
          >
            <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
            <span className="text-sm group-hover:underline">Access Admin Portal</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;
