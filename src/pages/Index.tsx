import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { UdioBatchDownloader } from "@/components/UdioBatchDownloader";

interface AudioResult {
  url: string;
  filename: string;
  type?: string;
}

const Index = () => {
  const [results, setResults] = useState<AudioResult[]>([]);

  return (
    <div className="min-h-screen">
      <HeroSection onResults={setResults} />
      
      <div className="container mx-auto px-4 py-12">
        <UdioBatchDownloader />
      </div>
      
      <FeaturesGrid />
    </div>
  );
};

export default Index;
