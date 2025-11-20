import { useEffect, useState } from "react";
import { Download, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AudioResult {
  url: string;
  filename: string;
  type?: string;
}

interface ScanningModalProps {
  isOpen: boolean;
  isScanning: boolean;
  results: AudioResult[];
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
}

export const ScanningModal = ({
  isOpen,
  isScanning,
  results,
  onClose,
  onDownload,
}: ScanningModalProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else if (results.length > 0) {
      setProgress(100);
    }
  }, [isScanning, results]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="glass-modal-3d w-full max-w-2xl pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              {isScanning ? (
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                </div>
              ) : results.length > 0 ? (
                <div className="relative">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                </div>
              ) : null}
              
              <div className="flex-1">
                <h3 className="text-3xl font-display font-bold gradient-text">
                  {isScanning
                    ? "Scanning for Audio..."
                    : results.length > 0
                    ? "Audio Files Found!"
                    : "Scan Complete"}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {isScanning
                    ? "Analyzing page structure and extracting media..."
                    : results.length > 0
                    ? `Found ${results.length} audio ${results.length === 1 ? "file" : "files"}`
                    : "No audio files detected"}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {isScanning && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {progress < 30 && "Fetching page content..."}
                  {progress >= 30 && progress < 60 && "Parsing HTML structure..."}
                  {progress >= 60 && progress < 90 && "Extracting audio URLs..."}
                  {progress >= 90 && "Finalizing results..."}
                </p>
              </div>
            )}
          </div>

          {/* Results */}
          {!isScanning && results.length > 0 && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="result-card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {decodeURIComponent(result.filename)}
                    </p>
                    {result.type && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.type}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(result.url, "_blank")}
                      className="hover:bg-secondary/20 hover:border-secondary transition-colors"
                    >
                      Open
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onDownload(result.url, result.filename)}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results message */}
          {!isScanning && results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No audio files were detected on this page.
              </p>
              <Button onClick={onClose} variant="outline">
                Try Another URL
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
