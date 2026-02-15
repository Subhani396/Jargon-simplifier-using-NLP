import { Zap, BarChart3, AlertTriangle, Target, ArrowRight, Sun, Moon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Instant Simplification",
    description: "Transform complex technical jargon into clear, business-friendly language in seconds.",
  },
  {
    icon: BarChart3,
    title: "Visual Impact Dashboard",
    description: "See business impact at a glance with intuitive charts and status indicators.",
  },
  {
    icon: BookOpen,
    title: "Jargon Detection",
    description: "Automatically identify complex technical terms and domain-specific language in any text.",
  },

  {
    icon: Target,
    title: "Business-Focused Output",
    description: "Tailored summaries for managers, clients, executives, and investors.",
  },
];

const Home = () => {
  const { resolvedTheme, setTheme } = useTheme();

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  const isLightMode = resolvedTheme === 'light';


  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Jargon Simplifier</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            {/* Animated Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={cn(
                "relative h-9 w-[72px] rounded-full border transition-all duration-300",
                "flex items-center px-1",
                isLightMode
                  ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700"
                  : "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-300 dark:border-indigo-700",
                "hover:shadow-lg hover:scale-105",
                "group"
              )}
              aria-label={`Switch to ${isLightMode ? 'dark' : 'light'} mode`}
            >
              {/* Light Icon (Left) */}
              <Sun className={cn(
                "absolute left-2 h-4 w-4 transition-all duration-300",
                isLightMode
                  ? "text-amber-600 dark:text-amber-500 scale-100 opacity-100"
                  : "text-muted-foreground/30 scale-75 opacity-50"
              )} />

              {/* Sliding Toggle */}
              <div className={cn(
                "absolute h-7 w-7 rounded-full transition-all duration-500 ease-out",
                "shadow-md",
                isLightMode
                  ? "left-1 bg-gradient-to-br from-amber-400 to-orange-500"
                  : "left-[37px] bg-gradient-to-br from-indigo-500 to-purple-600",
                "group-hover:shadow-xl",
                // Glow effect
                isLightMode
                  ? "shadow-amber-400/50"
                  : "shadow-indigo-500/50"
              )}>
                {/* Inner glow */}
                <div className={cn(
                  "absolute inset-0 rounded-full blur-sm opacity-60",
                  isLightMode
                    ? "bg-amber-300"
                    : "bg-indigo-400"
                )} />
              </div>

              {/* Dark Icon (Right) */}
              <Moon className={cn(
                "absolute right-2 h-4 w-4 transition-all duration-300",
                !isLightMode
                  ? "text-indigo-400 scale-100 opacity-100"
                  : "text-muted-foreground/30 scale-75 opacity-50"
              )} />
            </button>

            <Link to="/dashboard">
              <Button size="sm">Open Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
              <Zap className="h-3.5 w-3.5" />
              NLP-Powered Technical Briefings
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
              Bridge the Gap Between{" "}
              <span className="text-gradient">Developers</span> and{" "}
              <span className="text-gradient">Decision-Makers</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
              Upload technical documents and get clean, executive-ready summaries that anyone can understand — in seconds, not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="gap-2">
                  Try Simplifying <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-border/50 bg-card p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Input Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input</span>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      "The microservice architecture leverages Kubernetes orchestration with Istio service mesh for mTLS, implementing a CQRS pattern with event sourcing via Apache Kafka for eventual consistency across bounded contexts..."
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <ArrowRight className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>

                {/* Mobile Arrow */}
                <div className="md:hidden flex justify-center -my-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg rotate-90">
                    <ArrowRight className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>

                {/* Output Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Output</span>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                    <p className="text-sm md:text-base text-foreground leading-relaxed">
                      "Our system uses a modern setup where small, independent services communicate securely. Data stays consistent across all parts of the system, even during high traffic, using an industry-standard messaging system."
                    </p>
                  </div>
                </div>
              </div>

              {/* Subtle background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed to make technical communication effortless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-background border border-border/50 hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * i}s`, opacity: 0 }}
              >
                <div className="h-11 w-11 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to clarity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Paste Your Update", desc: "Drop in your technical report, commit log, or project update." },
              { step: "02", title: "AI Processes", desc: "Our AI analyzes complexity, detects risks, and extracts business impact." },
              { step: "03", title: "Get Executive Brief", desc: "Receive a clean, visual summary ready for any stakeholder." },
            ].map((item, i) => (
              <div key={item.step} className="text-center animate-fade-in-up" style={{ animationDelay: `${0.15 * i}s`, opacity: 0 }}>
                <div className="text-5xl font-display font-extrabold text-gradient mb-4">{item.step}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="gradient-hero rounded-2xl p-12 md:p-16 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Simplify Your Briefings?
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
              Start turning technical complexity into executive clarity today.
            </p>
            <Link to="/dashboard">
              <Button variant="hero-outline" size="lg" className="gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026 Jargon Simplifier. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
