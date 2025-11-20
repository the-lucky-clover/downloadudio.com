import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Lock, Check, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

interface PaywallGuardProps {
  children: React.ReactNode;
}

export const PaywallGuard = ({ children }: PaywallGuardProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check subscription status from localStorage or API
    const checkSubscription = () => {
      const subscriptionStatus = localStorage.getItem("subscriptionStatus");
      setIsSubscribed(subscriptionStatus === "active");
      setIsLoading(false);
    };

    checkSubscription();
  }, []);

  const handleSubscribe = (plan: "monthly" | "yearly") => {
    // In production, integrate with Stripe, Paddle, or Cloudflare Workers KV
    console.log(`Subscribing to ${plan} plan`);
    
    // For demo purposes, simulate payment
    setIsSubscribed(true);
    localStorage.setItem("subscriptionStatus", "active");
    localStorage.setItem("subscriptionPlan", plan);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Unlock Downloadudio
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose your plan and start downloading
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <Card className="relative border-2 hover:border-indigo-500 transition-all hover:shadow-lg">
              <CardHeader>
                <Badge className="w-fit mb-2">Monthly</Badge>
                <CardTitle className="text-3xl">
                  $7.77
                  <span className="text-base font-normal text-muted-foreground">/month</span>
                </CardTitle>
                <CardDescription>Perfect for occasional users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Unlimited audio downloads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Batch download from Udio library</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>AI-powered detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>All audio formats supported</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handleSubscribe("monthly")} 
                  className="w-full" 
                  size="lg"
                >
                  Subscribe Monthly
                </Button>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="relative border-2 border-purple-500 hover:border-purple-600 transition-all shadow-lg">
              <div className="absolute -top-3 right-4">
                <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <Zap className="h-3 w-3 mr-1" />
                  BEST VALUE
                </Badge>
              </div>
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Yearly</Badge>
                <CardTitle className="text-3xl">
                  $7.77
                  <span className="text-base font-normal text-muted-foreground">/year</span>
                </CardTitle>
                <CardDescription>
                  <span className="text-green-600 font-semibold">Save $85.47 vs monthly!</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="font-semibold">Everything in Monthly, plus:</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Early access to new features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Advanced batch processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Lifetime updates</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handleSubscribe("yearly")} 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                  size="lg"
                >
                  Subscribe Yearly
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <Lock className="inline h-4 w-4 mr-1" />
            Secure payment powered by Stripe • Cancel anytime
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
