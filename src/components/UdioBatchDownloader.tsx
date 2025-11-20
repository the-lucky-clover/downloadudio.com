import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Download, Loader2, Music, ExternalLink, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AudioTrack {
  id: string;
  title: string;
  url: string;
  songUrl: string;
  duration?: string;
  status?: 'pending' | 'extracting' | 'ready' | 'failed';
}

export const UdioBatchDownloader = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [libraryUrl, setLibraryUrl] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  const scanUdioLibrary = async () => {
    if (!libraryUrl.includes("udio.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Udio URL (library or profile)",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setTracks([]);
    
    try {
      // Use the same edge function to scan the Udio library page
      // It will extract all song links from the DOM
      const { data, error } = await supabase.functions.invoke("scan-audio", {
        body: { 
          url: libraryUrl,
          mode: 'udio-library' // Special mode to extract song links
        },
      });

      if (error) throw error;

      if (data?.songLinks && data.songLinks.length > 0) {
        // Create track objects with pending status
        const foundTracks: AudioTrack[] = data.songLinks.map((link: string, index: number) => ({
          id: `track-${index}`,
          title: `Song ${index + 1}`,
          url: '',
          songUrl: link,
          status: 'pending'
        }));
        
        setTracks(foundTracks);
        
        toast({
          title: "Library Scanned",
          description: `Found ${foundTracks.length} songs. Click "Extract All" to get audio files.`,
        });
      } else {
        toast({
          title: "No Songs Found",
          description: "No songs detected on this page. Make sure it's a valid Udio library page.",
        });
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast({
        title: "Scan Failed",
        description: "Unable to scan the library. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const extractAllAudio = async () => {
    if (tracks.length === 0) return;

    setIsExtracting(true);
    setProgress({ current: 0, total: tracks.length });

    const updatedTracks = [...tracks];

    for (let i = 0; i < updatedTracks.length; i++) {
      const track = updatedTracks[i];
      
      // Update status to extracting
      updatedTracks[i] = { ...track, status: 'extracting' };
      setTracks([...updatedTracks]);
      setProgress({ current: i + 1, total: tracks.length });

      try {
        // Extract audio from individual song page
        const { data, error } = await supabase.functions.invoke("scan-audio", {
          body: { url: track.songUrl },
        });

        if (error) throw error;

        if (data?.audioUrls && data.audioUrls.length > 0) {
          const audioFile = data.audioUrls[0];
          updatedTracks[i] = {
            ...track,
            url: audioFile.url,
            title: audioFile.filename || track.title,
            status: 'ready'
          };
        } else {
          updatedTracks[i] = { ...track, status: 'failed' };
        }
      } catch (error) {
        console.error(`Failed to extract ${track.songUrl}:`, error);
        updatedTracks[i] = { ...track, status: 'failed' };
      }

      setTracks([...updatedTracks]);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsExtracting(false);
    
    const successCount = updatedTracks.filter(t => t.status === 'ready').length;
    toast({
      title: "Extraction Complete",
      description: `Successfully extracted ${successCount} of ${tracks.length} tracks`,
    });
  };

  const downloadTrack = (track: AudioTrack) => {
    if (!track.url) return;
    
    const link = document.createElement("a");
    link.href = track.url;
    link.download = track.title;
    link.target = "_blank";
    link.click();
  };

  const downloadAll = () => {
    const readyTracks = tracks.filter(t => t.status === 'ready');
    
    toast({
      title: "Downloading",
      description: `Starting download of ${readyTracks.length} tracks...`,
    });

    readyTracks.forEach((track, index) => {
      setTimeout(() => downloadTrack(track), index * 300);
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'extracting':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'ready':
        return <span className="text-green-500">✓</span>;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <span className="text-muted-foreground">○</span>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl">
      <CardHeader className="space-y-2 sm:space-y-3 pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl">
          <Music className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Udio Library Batch Download
          </span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm md:text-base">
          Paste your Udio library URL. We'll find all songs and extract audio files.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Input section - Mobile optimized */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="https://udio.com/my-songs or profile URL..."
              value={libraryUrl}
              onChange={(e) => setLibraryUrl(e.target.value)}
              className="h-11 sm:h-12 text-sm sm:text-base pr-10"
              disabled={isScanning || isExtracting}
            />
            <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button 
            onClick={scanUdioLibrary} 
            disabled={isScanning || isExtracting || !libraryUrl}
            className="h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Scanning...</span>
                <span className="sm:hidden">Scan</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Scan Library</span>
                <span className="sm:hidden">Scan</span>
              </>
            )}
          </Button>
        </div>

        {/* Results section - Mobile optimized */}
        {tracks.length > 0 && (
          <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <div className="text-sm sm:text-base text-muted-foreground">
                Found <span className="font-semibold text-foreground">{tracks.length}</span> songs
              </div>
              {isExtracting && (
                <div className="text-xs sm:text-sm text-primary font-medium">
                  Extracting {progress.current}/{progress.total}
                </div>
              )}
            </div>

            {/* Tracks list - Scrollable on mobile */}
            <div className="max-h-[50vh] sm:max-h-[400px] overflow-y-auto space-y-2 sm:space-y-3 border rounded-xl p-3 sm:p-4 bg-background/50">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getStatusIcon(track.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
                        <div className="font-medium text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                          {track.title}
                        </div>
                      </div>
                      {track.status === 'extracting' && (
                        <div className="text-xs text-primary">Extracting audio...</div>
                      )}
                      {track.status === 'failed' && (
                        <div className="text-xs text-destructive">Failed to extract</div>
                      )}
                    </div>
                  </div>
                  
                  {track.status === 'ready' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadTrack(track)}
                      className="flex-shrink-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {!isExtracting && tracks.every(t => t.status === 'pending') && (
                <Button 
                  onClick={extractAllAudio} 
                  className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <Loader2 className="mr-2 h-5 w-5" />
                  Extract All Audio
                </Button>
              )}
              
              {tracks.some(t => t.status === 'ready') && !isExtracting && (
                <Button 
                  onClick={downloadAll} 
                  className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download All ({tracks.filter(t => t.status === 'ready').length})
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Empty state hint */}
        {tracks.length === 0 && !isScanning && (
          <div className="text-center py-8 sm:py-12 text-muted-foreground space-y-2">
            <Music className="h-12 w-12 sm:h-16 sm:w-16 mx-auto opacity-20 mb-3" />
            <p className="text-sm sm:text-base font-medium">How it works:</p>
            <ol className="text-xs sm:text-sm opacity-70 space-y-1 max-w-md mx-auto text-left list-decimal list-inside">
              <li>Paste your Udio library or profile URL</li>
              <li>We'll scan and find all your songs</li>
              <li>Extract audio from each song individually</li>
              <li>Download all tracks at once</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
