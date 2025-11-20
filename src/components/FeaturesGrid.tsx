import { Zap, Shield, Globe, Download } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant audio detection and extraction powered by advanced AI algorithms",
    gradient: "from-indigo-500/20 to-purple-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your URLs are processed securely with no data retention or tracking",
    gradient: "from-purple-500/20 to-pink-500/10",
  },
  {
    icon: Globe,
    title: "Universal",
    description: "Works with any website containing audio elements or embedded media",
    gradient: "from-pink-500/20 to-indigo-500/10",
  },
  {
    icon: Download,
    title: "One-Click",
    description: "Direct download links for all discovered audio sources",
    gradient: "from-indigo-500/20 to-purple-500/10",
  },
];

export const FeaturesGrid = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Section header - Mobile optimized */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Downloadudio?
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Next-generation audio extraction technology at your fingertips
          </p>
        </div>

        {/* Mobile-first grid - Single column on mobile, 2 cols on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 sm:p-8 rounded-2xl bg-background/50 backdrop-blur border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                {/* Icon container - Optimized size for mobile */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                </div>

                {/* Text content - Mobile optimized */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
