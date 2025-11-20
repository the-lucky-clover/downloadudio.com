import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScanningModal } from "@/components/ScanningModal";
import { Scene3D } from "@/components/Scene3D";

interface AudioResult {
  url: string;
  filename: string;
  type?: string;
}

interface HeroSectionProps {
  onResults: (results: AudioResult[]) => void;
}

export const HeroSection = ({ onResults }: HeroSectionProps) => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalResults, setModalResults] = useState<AudioResult[]>([]);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!url.trim()) {
      toast({
        title: "Enter a URL",
        description: "Please paste a valid URL to scan for audio",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setShowModal(true);
    setModalResults([]);

    try {
      const { data, error } = await supabase.functions.invoke("scan-audio", {
        body: { url },
      });

      if (error) throw error;

      if (data?.audioUrls?.length > 0) {
        setModalResults(data.audioUrls);
        onResults(data.audioUrls);
        toast({
          title: "Audio Found!",
          description: `Discovered ${data.audioUrls.length} audio source(s)`,
        });
      } else {
        setModalResults([]);
        toast({
          title: "No Audio Found",
          description: "No audio sources were detected on this page",
        });
      }
    } catch (error) {
      console.error("Scan error:", error);
      setShowModal(false);
      toast({
        title: "Scan Failed",
        description: "Unable to scan the URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleDownload = (fileUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename;
    link.target = "_blank";
    link.click();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalResults([]);
  };

  return (
    <>
      {/* Mobile-first hero section */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 overflow-hidden">
        {/* 3D Interactive Background */}
        <div className="absolute inset-0 opacity-60">
          <Scene3D />
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_100%)]" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Title - Mobile optimized with 3D effect */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight perspective-1000">
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.8)] animate-float"
                    style={{ 
                      textShadow: '0 10px 30px rgba(139, 92, 246, 0.3), 0 0 50px rgba(168, 85, 247, 0.2)',
                      transform: 'translateZ(50px)',
                      transformStyle: 'preserve-3d'
                    }}>
                Downloadudio
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto px-4">
              AI-Powered Audio Extraction from Any Web Page
            </p>
          </div>

          {/* Input section - Mobile optimized */}
          <div className="w-full max-w-2xl mx-auto space-y-4 px-2">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full">
              <Input
                type="url"
                placeholder="Paste any URL to extract audio..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg px-4 sm:px-6 bg-background/50 backdrop-blur border-2 focus:border-primary transition-all"
                disabled={isScanning}
              />
              <Button
                onClick={handleScan}
                disabled={isScanning || !url.trim()}
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span className="hidden sm:inline">Scanning...</span>
                    <span className="sm:hidden">Scan</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    <span className="hidden sm:inline">Extract Audio</span>
                    <span className="sm:hidden">Extract</span>
                  </>
                )}
              </Button>
            </div>

            {/* Quick examples - Mobile friendly */}
            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Try with:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setUrl("https://udio.com/songs/...")}
                  className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-xs sm:text-sm"
                >
                  Udio
                </button>
                <button
                  onClick={() => setUrl("https://youtube.com/watch?v=...")}
                  className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-xs sm:text-sm"
                >
                  YouTube
                </button>
                <button
                  onClick={() => setUrl("https://soundcloud.com/...")}
                  className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-xs sm:text-sm"
                >
                  SoundCloud
                </button>
              </div>
            </div>
          </div>

          {/* Features badges - Mobile optimized */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center text-xs sm:text-sm px-4">
            <div className="px-3 sm:px-4 py-2 rounded-full bg-background/50 backdrop-blur border border-primary/20">
              ⚡ Lightning Fast
            </div>
            <div className="px-3 sm:px-4 py-2 rounded-full bg-background/50 backdrop-blur border border-primary/20">
              🔒 Secure
            </div>
            <div className="px-3 sm:px-4 py-2 rounded-full bg-background/50 backdrop-blur border border-primary/20">
              🌍 Universal
            </div>
          </div>
        </div>
      </section>

      {/* Scanning Modal */}
      <ScanningModal
        isOpen={showModal}
        onClose={handleCloseModal}
        isScanning={isScanning}
        results={modalResults}
        onDownload={handleDownload}
      />
    </>
  );
};
