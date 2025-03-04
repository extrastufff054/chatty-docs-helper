
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TemperatureSliderProps {
  initialTemperature?: number;
  onTemperatureChange?: (temperature: number) => void;
}

const TemperatureSlider = ({ 
  initialTemperature = 0, 
  onTemperatureChange 
}: TemperatureSliderProps) => {
  const [temperature, setTemperature] = useState(initialTemperature);

  const handleTemperatureChange = (value: number[]) => {
    const newTemp = value[0];
    setTemperature(newTemp);
    
    if (onTemperatureChange) {
      onTemperatureChange(newTemp);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Response Temperature</CardTitle>
        <CardDescription>
          Adjust the creativity level of AI responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Precise (0.0)</span>
            <span className="text-sm font-medium">{temperature.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">Creative (1.0)</span>
          </div>
          <Slider
            value={[temperature]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleTemperatureChange}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Lower values provide more consistent, focused responses. Higher values introduce more creativity and variation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureSlider;
