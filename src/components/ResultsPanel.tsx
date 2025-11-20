import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AudioResult {
  url: string;
  filename: string;
  type?: string;
}

interface ResultsPanelProps {
  results: AudioResult[];
  onClose?: () => void;
}

export const ResultsPanel = ({ results, onClose }: ResultsPanelProps) => {
  if (!results || results.length === 0) return null;

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.click();
  };

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <Card className="glass-card p-8 max-w-4xl mx-auto animate-scale-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-display font-bold gradient-text">
              Extracted Audio Files
            </h3>
            {onClose && (
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium text-foreground truncate">
                    {result.filename}
                  </p>
                  {result.type && (
                    <p className="text-sm text-muted-foreground">{result.type}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(result.url, "_blank")}
                    className="hover:bg-secondary/20"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(result.url, result.filename)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
