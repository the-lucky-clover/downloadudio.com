import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Lock, Check, Zap, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";

interface PaywallGuardProps {
  children: React.ReactNode;
}

export const PaywallGuard = ({ children }: PaywallGuardProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = () => {
      const subscriptionStatus = localStorage.getItem("subscriptionStatus");
      setIsSubscribed(subscriptionStatus === "active");
      setIsLoading(false);
    };

    checkSubscription();
  }, []);

  const handleSubscribe = (plan: "monthly" | "yearly") => {
    // In production, integrate with Stripe
    console.log(`Subscribing to ${plan} plan`);
    
    setIsSubscribed(true);
    localStorage.setItem("subscriptionStatus", "active");
    localStorage.setItem("subscriptionPlan", plan);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-base sm:text-lg">Loading...</div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl w-full">
          {/* Header - Mobile optimized */}
          <div className="text-center mb-6 sm:mb-8 space-y-2 sm:space-y-3">
            <div className="inline-block">
              <Badge className="mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1 inline" />
                Limited Time Offer
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Unlock Downloadudio
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">
              Choose your plan and start downloading
            </p>
          </div>

          {/* Pricing cards - Mobile first, stacks on small screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Monthly Plan */}
            <Card className="relative border-2 hover:border-indigo-500 transition-all hover:shadow-lg">
              <CardHeader className="space-y-2 pb-4">
                <Badge className="w-fit">Monthly</Badge>
                <CardTitle className="text-2xl sm:text-3xl">
                  $7.77
                  <span className="text-sm sm:text-base font-normal text-muted-foreground">/month</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Perfect for occasional users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Unlimited audio downloads",
                    "Batch download from Udio",
                    "AI-powered detection",
                    "All audio formats",
                    "Cancel anytime"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleSubscribe("monthly")} 
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                  size="lg"
                >
                  Subscribe Monthly
                </Button>
              </CardContent>
            </Card>

            {/* Yearly Plan - Highlighted */}
            <Card className="relative border-2 border-purple-500 hover:border-purple-600 transition-all shadow-lg md:scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4">
                <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1">
                  <Zap className="h-3 w-3 mr-1" />
                  BEST VALUE
                </Badge>
              </div>
              <CardHeader className="space-y-2 pb-4 pt-6 sm:pt-4">
                <Badge className="w-fit" variant="secondary">Yearly</Badge>
                <CardTitle className="text-2xl sm:text-3xl">
                  $77.77
                  <span className="text-sm sm:text-base font-normal text-muted-foreground">/year</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  <span className="text-green-600 font-semibold">Save $15.47 vs monthly!</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    { text: "Everything in Monthly, plus:", bold: true },
                    { text: "Priority support" },
                    { text: "Early access to features" },
                    { text: "Advanced batch processing" },
                    { text: "Lifetime updates" }
                  ].map((feature, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm sm:text-base ${feature.bold ? 'font-semibold' : ''}`}>
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleSubscribe("yearly")} 
                  className="w-full h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                  size="lg"
                >
                  Subscribe Yearly
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Trust badges */}
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
            <p>7-day free trial • Cancel anytime • No hidden fees</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
