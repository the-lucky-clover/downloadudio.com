import { UdioBatchDownloader } from "@/components/UdioBatchDownloader";
import { Button } from "@/components/ui/button";
import { Home, Music } from "lucide-react";
import { Link } from "react-router-dom";

const UdioBatch = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_100%)]" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/">
          <Button
            variant="ghost"
            className="gap-2 hover:bg-primary/10 hover:scale-105 transition-all"
          >
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Udio Batch Downloader
          </h1>
        </div>

        <div className="w-20" /> {/* Spacer for centering */}
      </nav>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary mb-4">
            udio.com/library Universal Access
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              Download Your Entire Udio Library
            </span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Batch download all your audio creations from udio.com/library in one click. 
            Perfect for backing up your music collection.
          </p>
        </div>

        {/* Batch Downloader Component */}
        <UdioBatchDownloader />

        {/* Features */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl glass-card text-center space-y-2">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-primary">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Parallel downloads for maximum speed
            </p>
          </div>
          
          <div className="p-6 rounded-xl glass-card text-center space-y-2">
            <div className="text-3xl mb-2">🎵</div>
            <h3 className="font-semibold text-primary">All Formats</h3>
            <p className="text-sm text-muted-foreground">
              MP3, WAV, and all available formats
            </p>
          </div>
          
          <div className="p-6 rounded-xl glass-card text-center space-y-2">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="font-semibold text-primary">Batch Ready</h3>
            <p className="text-sm text-muted-foreground">
              Download hundreds of files at once
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl glass-card">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">How It Works</h3>
          <ol className="space-y-4 text-sm sm:text-base">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>Visit <code className="px-2 py-1 rounded bg-primary/10 text-primary">udio.com/library</code> and log in to your account</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>Copy the full URL from your browser (it should be exactly <code className="px-2 py-1 rounded bg-primary/10 text-primary">https://udio.com/library</code>)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>Paste it above and click "Scan Udio Library" to discover all your audio files</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span>Click "Download All" to save your entire collection locally</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UdioBatch;
