import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { MouseTrail } from "@/components/MouseTrail";
import { SoundControl } from "@/components/SoundControl";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { Link } from "react-router-dom";

interface AudioResult {
  url: string;
  filename: string;
  type?: string;
}

const Index = () => {
  const [results, setResults] = useState<AudioResult[]>([]);

  return (
    <>
      <MouseTrail />
      <SoundControl />
      <div className="min-h-screen">
        <HeroSection onResults={setResults} />
        
        {/* Udio Batch CTA Section */}
        <section className="py-12 sm:py-16 px-4 relative">
          <div className="container mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-12 text-center border-2 border-primary/30 hover:border-primary/50 transition-all group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Music className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                    Udio Users?
                  </span>
                </h2>
                
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Download your entire music library from udio.com/library in one click. 
                  Perfect for backing up all your AI-generated masterpieces.
                </p>
                
                <Link to="/udio-batch">
                  <Button
                    size="lg"
                    className="h-12 sm:h-14 px-8 sm:px-12 text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Music className="mr-2 h-5 w-5" />
                    Batch Download Udio Library
                  </Button>
                </Link>
                
                <p className="text-xs text-muted-foreground">
                  Works with <code className="px-2 py-1 rounded bg-primary/10 text-primary">udio.com/library</code> - Universal for all users
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <FeaturesGrid />
      </div>
    </>
  );
};

export default Index;
