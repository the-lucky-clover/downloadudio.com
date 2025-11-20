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
    <section className="py-12 sm:py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black animate-fade-in">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              Why Downloadudio?
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 animate-fade-in animation-delay-200">
            Next-generation audio extraction technology at your fingertips
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 sm:p-8 rounded-2xl glass-card hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/50`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Animated border glow */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
