
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminAuth = () => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string>("");
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    
    setIsChecking(true);
    try {
      const success = await loginWithToken(adminToken);
      
      if (success) {
        // Store the expected admin token for future use
        localStorage.setItem('expectedAdminToken', adminToken);
        // Redirect to admin panel
        navigate("/admin");
      }
    } finally {
      setIsChecking(false);
    }
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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/5 transition-colors duration-300"
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="absolute top-4 left-4">
        <Link to="/auth">
          <Button variant="outline" size="sm" className="gap-1 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        </Link>
      </div>
      
      <motion.div
        variants={fadeIn}
        className="w-[400px] mx-4"
      >
        <Card className="backdrop-blur-sm border-border/50 shadow-lg overflow-hidden">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <motion.img 
                src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
                alt="I4C Logo" 
                className="h-20 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
            </div>
            <CardDescription>
              Enter your admin token to access the document management interface
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleTokenSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="token">Admin Token</Label>
                  <Input
                    id="token"
                    placeholder="Enter your admin token"
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    required
                    className="transition-colors"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button 
                type="submit" 
                disabled={isChecking || !adminToken} 
                className="w-full relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isChecking ? 
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                    <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  }
                  Login with Token
                </span>
                <span className="absolute inset-0 bg-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminAuth;
