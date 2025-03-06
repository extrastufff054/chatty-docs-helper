
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Thermometer, Save, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/config/apiConfig";

interface TemperatureSliderProps {
  adminToken: string;
  defaultTemperature?: number;
}

/**
 * Temperature Slider Component
 * 
 * Allows admins to set the default temperature for AI responses
 */
const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ adminToken, defaultTemperature = 0 }) => {
  const [temperature, setTemperature] = useState<number>(defaultTemperature);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleSaveTemperature = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings/temperature`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ temperature })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update temperature settings");
      }
      
      toast({
        title: "Temperature updated",
        description: `Default temperature has been set to ${temperature.toFixed(1)}`,
      });
    } catch (error) {
      console.error("Error updating temperature:", error);
      toast({
        title: "Error updating temperature",
        description: "Please try again or check the server logs.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Default Temperature
        </CardTitle>
        <CardDescription>
          Set the default temperature for AI responses across all prompts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Temperature: {temperature.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              {temperature < 0.3 ? "More precise" : temperature > 0.7 ? "More creative" : "Balanced"}
            </span>
          </div>
          <Slider
            value={[temperature]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={(value) => setTemperature(value[0])}
            className="my-4"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Low (0.0):</span> More precise, consistent responses
            <br />
            <span className="font-medium">High (1.0):</span> More creative, varied responses
          </div>
          <Button 
            onClick={handleSaveTemperature}
            disabled={isSaving}
            size="sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureSlider;
