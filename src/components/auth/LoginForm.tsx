
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const { login } = useAuth();

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login({ username, password });
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] animate-scale-in">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your username and password to access the system
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleCredentialSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
