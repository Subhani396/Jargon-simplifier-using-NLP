import { Zap, BarChart3, AlertTriangle, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.png";

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
    icon: AlertTriangle,
    title: "Risk Detection",
    description: "Automatically identify and highlight potential risks with severity indicators.",
  },
  {
    icon: Target,
    title: "Business-Focused Output",
    description: "Tailored summaries for managers, clients, executives, and investors.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">BrieflyAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          </div>
          <Link to="/dashboard">
            <Button size="sm">Open Dashboard</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Technical Briefings
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
              Bridge the Gap Between{" "}
              <span className="text-gradient">Developers</span> and{" "}
              <span className="text-gradient">Decision-Makers</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
              Convert complex technical updates into clear, executive-ready insights.
              No more lost-in-translation moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="gap-2">
                  Try Simplifying <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-border/50">
              <img
                src={heroImage}
                alt="Developer to AI to Stakeholder flow"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
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
          © 2026 BrieflyAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
