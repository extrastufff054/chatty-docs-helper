
import TemperatureSlider from "@/components/admin/TemperatureSlider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TemperaturePanelProps {
  globalTemperature: number;
  setGlobalTemperature: (temp: number) => void;
}

const TemperaturePanel = ({ globalTemperature, setGlobalTemperature }: TemperaturePanelProps) => {
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <TemperatureSlider 
        initialTemperature={globalTemperature}
        onTemperatureChange={(temp) => {
          setGlobalTemperature(temp);
          toast({
            title: "Temperature updated",
            description: `Global temperature set to ${temp.toFixed(1)}`,
          });
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Temperature Settings</CardTitle>
          <CardDescription>
            How temperature affects AI responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">0.0</span>
              <span className="text-sm">Precise, deterministic, focused answers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">0.5</span>
              <span className="text-sm">Balanced responses with some variation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">1.0</span>
              <span className="text-sm">Creative, diverse, more unpredictable</span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="mb-2">For document Q&A, lower temperatures (0.0-0.3) are recommended for factual accuracy.</p>
              <p>Temperature adjustments apply to newly uploaded documents and system prompts.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemperaturePanel;
