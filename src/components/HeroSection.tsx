import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScanningModal } from "@/components/ScanningModal";

interface AudioResult {
  url: string;
  filename: string;
  type?: string;
}

interface HeroSectionProps {
  onResults: (results: AudioResult[]) => void;
}

// Haptic feedback utility
const hapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 50
    };
    navigator.vibrate(patterns[intensity]);
  }
};

// Mouse trail effect
const MouseTrail = () => {
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = { id: trailId++, x: e.clientX, y: e.clientY };
      setTrails(prev => [...prev.slice(-15), newTrail]);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block">
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
            opacity: (index / trails.length) * 0.5,
            transform: `scale(${(index / trails.length) * 0.8 + 0.2})`,
            transition: 'opacity 0.5s, transform 0.5s'
          }}
        />
      ))}
    </div>
  );
};

export const HeroSection = ({ onResults }: HeroSectionProps) => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalResults, setModalResults] = useState<AudioResult[]>([]);
  const { toast } = useToast();

  const handleScan = async () => {
    hapticFeedback('medium');
    
    if (!url.trim()) {
      hapticFeedback('heavy');
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
        hapticFeedback('light');
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
      hapticFeedback('heavy');
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
    hapticFeedback('light');
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

  const handleQuickExample = (exampleUrl: string) => {
    hapticFeedback('light');
    setUrl(exampleUrl);
  };

  return (
    <>
      <MouseTrail />
      
      {/* Mobile-centered hero section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200/20 via-background to-background" />
        
        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content - scaled down and centered */}
        <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-4 sm:space-y-6 animate-slide-up">
          {/* Title */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Downloadudio
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              AI-Powered Audio Extraction from Any Web Page
            </p>
          </div>

          {/* Input section */}
          <div className="w-full max-w-xl mx-auto space-y-3 px-2">
            <div className="flex flex-col gap-2 w-full">
              <Input
                type="url"
                placeholder="Paste any URL to extract audio..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                onFocus={() => hapticFeedback('light')}
                className="h-11 sm:h-12 text-sm sm:text-base px-4 bg-background/50 backdrop-blur-sm border-2 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400/50"
                disabled={isScanning}
              />
              <Button
                onClick={handleScan}
                disabled={isScanning || !url.trim()}
                size="lg"
                className="h-11 sm:h-12 px-6 text-sm sm:text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 active:scale-95"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Extract Audio
                  </>
                )}
              </Button>
            </div>

            {/* Quick examples */}
            <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Try with:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { name: 'Udio', url: 'https://udio.com/songs/...' },
                  { name: 'YouTube', url: 'https://youtube.com/watch?v=...' },
                  { name: 'SoundCloud', url: 'https://soundcloud.com/...' }
                ].map((example) => (
                  <button
                    key={example.name}
                    onClick={() => handleQuickExample(example.url)}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-xs sm:text-sm backdrop-blur-sm active:scale-95"
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Features badges */}
          <div className="flex flex-wrap gap-2 justify-center text-xs sm:text-sm">
            {[
              { icon: '⚡', text: 'Lightning Fast' },
              { icon: '🔒', text: 'Secure' },
              { icon: '🌍', text: 'Universal' }
            ].map((badge, index) => (
              <div
                key={badge.text}
                className="px-3 sm:px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-background/70 transition-all animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="mr-1">{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

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
