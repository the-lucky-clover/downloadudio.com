import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Download, Loader2, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioTrack {
  id: string;
  title: string;
  url: string;
  duration?: string;
}

export const UdioBatchDownloader = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [libraryUrl, setLibraryUrl] = useState("");
  const { toast } = useToast();

  const scanUdioLibrary = async () => {
    if (!libraryUrl.includes("udio.com/library")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Udio library URL",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    try {
      // Simulated scanning - in production, this would call your API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data - replace with actual API call
      const mockTracks: AudioTrack[] = [
        { id: "1", title: "Track 1", url: "https://example.com/track1.mp3", duration: "3:45" },
        { id: "2", title: "Track 2", url: "https://example.com/track2.mp3", duration: "2:30" },
        { id: "3", title: "Track 3", url: "https://example.com/track3.mp3", duration: "4:15" },
      ];
      
      setTracks(mockTracks);
      
      toast({
        title: "Library Scanned",
        description: `Found ${mockTracks.length} tracks`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scan library. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const downloadAll = async () => {
    toast({
      title: "Downloading",
      description: `Starting download of ${tracks.length} tracks...`,
    });
    
    // In production, implement actual batch download logic
    for (const track of tracks) {
      console.log(`Downloading: ${track.title}`);
      // Add actual download implementation
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Udio Library Batch Download
        </CardTitle>
        <CardDescription>
          Enter your Udio library URL to download all tracks at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="https://udio.com/library/..."
            value={libraryUrl}
            onChange={(e) => setLibraryUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={scanUdioLibrary} disabled={isScanning || !libraryUrl}>
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning
              </>
            ) : (
              "Scan Library"
            )}
          </Button>
        </div>

        {tracks.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Found {tracks.length} tracks
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 bg-secondary/50 rounded"
                >
                  <div className="flex-1">
                    <div className="font-medium">{track.title}</div>
                    {track.duration && (
                      <div className="text-xs text-muted-foreground">{track.duration}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={downloadAll} className="w-full" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download All ({tracks.length} tracks)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
