import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { ResultsPanel } from "@/components/ResultsPanel";

interface AudioResult {
  url: string;
  filename: string;
  type?: string;
}

const Index = () => {
  const [results, setResults] = useState<AudioResult[]>([]);

  const handleResults = (audioResults: AudioResult[]) => {
    console.log("Index received results:", audioResults);
    console.log("Results length:", audioResults.length);
    setResults(audioResults);
  };

  console.log("Current results state:", results);
  console.log("Should render panel:", results.length > 0);

  return (
    <div className="min-h-screen">
      <HeroSection onResults={handleResults} />
      {results.length > 0 && (
        <ResultsPanel results={results} onClose={() => setResults([])} />
      )}
      <FeaturesGrid />
    </div>
  );
};

export default Index;
