
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
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

  const inputVariants = {
    focused: { scale: 1.02, boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.2)" },
    unfocused: { scale: 1, boxShadow: "none" }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleCredentialSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <motion.div
            initial="unfocused"
            whileFocus="focused"
            variants={inputVariants}
          >
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="border-input/50 bg-background/50"
            />
          </motion.div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <motion.div
            className="relative"
            initial="unfocused"
            whileFocus="focused"
            variants={inputVariants}
          >
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="border-input/50 bg-background/50 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </motion.div>
        </div>
        
        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full group"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            )}
            Sign In
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default LoginForm;
