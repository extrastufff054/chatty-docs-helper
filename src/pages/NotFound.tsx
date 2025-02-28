
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <img 
        src="/lovable-uploads/c5a04a51-a547-4a02-98be-77462c0e80b2.png" 
        alt="I4C Logo" 
        className="h-24 w-auto mb-8"
      />
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        404
      </h1>
      <p className="text-2xl md:text-3xl font-medium mb-4">Page Not Found</p>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button 
        onClick={() => window.location.href = "/"} 
        className="flex items-center gap-2 hover-scale"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;
