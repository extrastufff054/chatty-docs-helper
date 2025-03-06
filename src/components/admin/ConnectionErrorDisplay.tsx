
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ConnectionErrorDisplayProps {
  errorMessage: string;
}

/**
 * Connection Error Display Component
 * 
 * Shows a helpful error message when the backend connection fails
 */
const ConnectionErrorDisplay: React.FC<ConnectionErrorDisplayProps> = ({ errorMessage }) => {
  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2" />
            Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{errorMessage}</p>
          <p>Please check:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The backend server is running on port 5000</li>
            <li>No firewall is blocking the connection</li>
            <li>You're using the correct URL</li>
          </ul>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionErrorDisplay;
