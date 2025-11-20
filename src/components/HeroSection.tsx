import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroBackground from "@/assets/hero-background.jpg";

export const HeroSection = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
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
    try {
      const { data, error } = await supabase.functions.invoke("scan-audio", {
        body: { url },
      });

      if (error) throw error;

      if (data?.audioUrls?.length > 0) {
        toast({
          title: "Audio Found!",
          description: `Discovered ${data.audioUrls.length} audio source(s)`,
        });
        // You can emit this data to a parent component or state manager
        console.log("Audio URLs:", data.audioUrls);
      } else {
        toast({
          title: "No Audio Found",
          description: "No audio sources were detected on this page",
        });
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast({
        title: "Scan Failed",
        description: "Unable to scan the URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
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
                className="flex-1 bg-background/50 border-border/50 text-lg h-14 rounded-xl focus-visible:ring-primary"
                disabled={isScanning}
              />
              <Button
                onClick={handleScan}
                disabled={isScanning}
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg"
                style={{ boxShadow: "var(--glow-cyan)" }}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Scanning...
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

        {/* Trust indicators */}
        <div className="flex flex-wrap gap-8 justify-center items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>AI-Powered Scanning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span>Instant Extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>No Sign-up Required</span>
          </div>
        </div>
      </div>
    </section>
  );
};
