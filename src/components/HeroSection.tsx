import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScanningModal } from "@/components/ScanningModal";
import heroBackground from "@/assets/hero-background.jpg";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Brand */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tight mb-4">
            <span className="gradient-text neon-glow">Downloadudio</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            AI-Powered Audio Extraction from Any Web Page
          </p>
        </div>

        {/* URL Input Pill */}
        <div className="max-w-3xl mx-auto mb-16 animate-scale-in">
          <div className="glass-card p-3 hover-lift">
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="Paste any URL to scan for audio..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                disabled={isScanning}
                className="flex-1 bg-background/50 border-none text-lg h-14 focus-visible:ring-primary"
              />
              <Button
                onClick={handleScan}
                disabled={isScanning}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 h-14"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Scanning
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Extract Audio
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: "🤖", title: "AI-Powered", desc: "Smart DOM scanning" },
            { icon: "⚡", title: "Lightning Fast", desc: "Instant extraction" },
            { icon: "🔒", title: "Secure", desc: "Privacy-first approach" },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card p-6 hover-lift animate-scale-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-display font-bold text-xl mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <ScanningModal
        isOpen={showModal}
        isScanning={isScanning}
        results={modalResults}
        onClose={handleCloseModal}
        onDownload={handleDownload}
      />
    </section>
  );
};
