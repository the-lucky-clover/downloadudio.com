import { X, Check, Zap, Sparkles, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useHaptic } from "@/hooks/useHaptic";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: "monthly" | "yearly") => void;
}

export const PricingModal = ({ isOpen, onClose, onSubscribe }: PricingModalProps) => {
  const vibrate = useHaptic();

  if (!isOpen) return null;

  const handleSubscribe = (plan: "monthly" | "yearly") => {
    vibrate("success");
    // In production, integrate with Stripe
    console.log(`Subscribing to ${plan} plan`);
    localStorage.setItem("subscriptionStatus", "active");
    localStorage.setItem("subscriptionPlan", plan);
    onSubscribe(plan);
  };

  const handleClose = () => {
    vibrate("light");
    onClose();
  };

  return (
    <>
      {/* Backdrop with blur and darken animation */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal container - mobile-first */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-5xl pointer-events-auto animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 zoom-in-95 duration-500 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glass card with cyberpunk styling */}
          <div className="relative bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-2xl border-2 border-primary/30 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden">
            {/* Animated gradient borders */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-50 animate-pulse-glow" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            
            {/* Cyber grid overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }} />

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8 md:p-12">
              {/* Close button - mobile optimized */}
              <button
                onClick={handleClose}
                onMouseDown={() => vibrate("light")}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-background/50 hover:bg-background/80 border border-border/50 hover:border-primary/50 transition-all hover:scale-110 hover:rotate-90 duration-300 active:scale-90"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                <Badge className="mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 text-xs sm:text-sm shadow-lg shadow-primary/50 animate-pulse-scale">
                  <Sparkles className="h-3 w-3 mr-1 inline animate-spin-slow" />
                  Premium Access Required
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                    Unlock Your Audio
                  </span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-4">
                  Choose your plan to download unlimited audio files
                </p>
              </div>

              {/* Pricing cards grid - mobile-first */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                {/* Monthly Plan */}
                <div className="group relative">
                  {/* Neon glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500 animate-pulse-glow" />
                  
                  <div className="relative bg-background/80 backdrop-blur-xl border-2 border-primary/30 rounded-2xl p-6 sm:p-8 hover:border-primary/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30">
                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">Monthly</Badge>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          $7.77
                        </span>
                        <span className="text-base sm:text-lg text-muted-foreground">/month</span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">Perfect for casual users</p>
                    </div>

                    <ul className="space-y-2 sm:space-y-3 mb-6">
                      {[
                        "Unlimited audio downloads",
                        "Batch download from Udio",
                        "AI-powered detection",
                        "All audio formats",
                        "7-day free trial"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSubscribe("monthly")}
                      onMouseDown={() => vibrate("medium")}
                      className="w-full h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Start Free Trial
                    </Button>
                  </div>
                </div>

                {/* Yearly Plan - Featured */}
                <div className="group relative">
                  {/* Enhanced neon glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500 animate-glow-pulse" />
                  
                  {/* Best value badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-1.5 text-xs sm:text-sm shadow-xl shadow-pink-500/50 animate-pulse-scale">
                      <Zap className="h-3 w-3 mr-1 animate-pulse" />
                      BEST VALUE - 90% OFF
                    </Badge>
                  </div>

                  <div className="relative bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl border-2 border-purple-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-500/30 hover:border-purple-500/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                    <Badge className="mb-4 bg-purple-500/30 text-purple-300 border-purple-500/50">Yearly</Badge>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
                          $77.77
                        </span>
                        <span className="text-base sm:text-lg text-muted-foreground">/year</span>
                      </div>
                      <p className="text-xs sm:text-sm text-green-400 font-semibold mt-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                        Save $15.47 vs monthly!
                      </p>
                    </div>

                    <ul className="space-y-2 sm:space-y-3 mb-6">
                      {[
                        { text: "Everything in Monthly, plus:", bold: true },
                        { text: "Priority support" },
                        { text: "Early access to features" },
                        { text: "Advanced batch processing" },
                        { text: "7-day free trial" }
                      ].map((feature, i) => (
                        <li key={i} className={`flex items-start gap-2 text-xs sm:text-sm ${feature.bold ? 'font-semibold text-purple-300' : ''}`}>
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSubscribe("yearly")}
                      onMouseDown={() => vibrate("medium")}
                      className="w-full h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/80 transition-all hover:scale-[1.02] font-bold active:scale-95"
                    >
                      Start Free Trial
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust badges - mobile optimized */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                  <span>Secure payment • Powered by Stripe</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Cancel anytime • No hidden fees • Instant access after trial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
