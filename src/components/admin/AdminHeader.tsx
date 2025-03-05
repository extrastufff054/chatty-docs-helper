
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminHeader = () => {
  return (
    <div className="flex justify-between items-center animate-fade-in">
      <div className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
          alt="I4C Logo" 
          className="app-logo h-20 w-auto mr-2"
        />
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Indian Cybercrime Coordination Centre
        </h1>
      </div>
      <div className="flex gap-2">
        <ThemeToggle />
        <Button variant="outline" onClick={() => window.location.href = "/"} className="hover-scale">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
