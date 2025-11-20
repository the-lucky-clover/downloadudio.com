import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export const SoundControl = () => {
  const { volume, setVolume, enabled, toggleSound, playSound } = useSoundEffects();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 left-4 z-40 rounded-full bg-background/50 backdrop-blur border border-primary/20 hover:border-primary/60 hover:bg-background/80 transition-all hover:scale-110"
          onClick={() => playSound("click")}
        >
          {enabled ? (
            <Volume2 className="h-5 w-5 text-primary" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 glass-card border-primary/30" side="right">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Sound Effects</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleSound();
                  playSound("click");
                }}
                className="h-8 px-2"
              >
                {enabled ? "On" : "Off"}
              </Button>
            </div>
          </div>

          {enabled && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Volume</label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[volume * 100]}
                  onValueChange={(values) => setVolume(values[0] / 100)}
                  onValueCommit={() => playSound("click")}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Interactive sound feedback for clicks, scans, and downloads
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
