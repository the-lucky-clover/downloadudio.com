import { Zap, Shield, Globe, Download } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant audio detection and extraction powered by advanced AI algorithms",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your URLs are processed securely with no data retention or tracking",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    icon: Globe,
    title: "Universal Compatibility",
    description: "Works with any website containing audio elements or embedded media",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Download,
    title: "One-Click Download",
    description: "Direct download links for all discovered audio sources",
    gradient: "from-primary/20 to-accent/5",
  },
];

export const FeaturesGrid = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-display font-black mb-4">
            <span className="gradient-text">Why Downloadudio?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Next-generation audio extraction technology at your fingertips
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-8 hover-lift group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
