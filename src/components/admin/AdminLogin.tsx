
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminLoginProps {
  adminToken: string;
  setAdminToken: (token: string) => void;
  isTokenValid: boolean;
  setIsTokenValid: (isValid: boolean) => void;
}

/**
 * Admin Login Component
 * 
 * Provides an authentication form for the admin panel
 */
const AdminLogin = ({ adminToken, setAdminToken, setIsTokenValid }: AdminLoginProps) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const { loginWithToken } = useAuth();

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    
    setIsChecking(true);
    try {
      const success = await loginWithToken(adminToken);
      
      if (success) {
        setIsTokenValid(true);
        
        // Store the expected admin token for future use
        localStorage.setItem('expectedAdminToken', adminToken);
      } else {
        setIsTokenValid(false);
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-[400px] glass-card animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
              alt="I4C Logo" 
              className="h-20 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">I4C Chatbot Admin</CardTitle>
          <CardDescription>
            Enter the admin token to access the document management interface.
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
          <CardFooter className="flex justify-center">
            <Button type="submit" disabled={isChecking || !adminToken} className="w-full hover-scale">
              {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Login with Token
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
