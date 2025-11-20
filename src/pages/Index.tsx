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

  return (
    <div className="min-h-screen">
      <HeroSection onResults={setResults} />
      {results.length > 0 && (
        <ResultsPanel results={results} onClose={() => setResults([])} />
      )}
      <FeaturesGrid />
    </div>
  );
};

export default Index;
