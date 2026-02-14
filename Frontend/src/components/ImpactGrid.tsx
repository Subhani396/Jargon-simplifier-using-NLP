import { DollarSign, Zap, Shield, Clock, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImpactItem {
  icon: React.ElementType;
  label: string;
  summary: string;
  status: "positive" | "neutral" | "negative";
}

const impacts: ImpactItem[] = [
  { icon: DollarSign, label: "Cost Impact", summary: "Estimated 15% reduction in infra costs after migration.", status: "positive" },
  { icon: Zap, label: "Performance", summary: "Response times improved by 40ms on average.", status: "positive" },
  { icon: Shield, label: "Security", summary: "New auth layer adds MFA — minor config risk.", status: "neutral" },
  { icon: Clock, label: "Timeline", summary: "2-week delay expected due to dependency update.", status: "negative" },
  { icon: Package, label: "Scalability", summary: "New architecture supports 3x current load.", status: "positive" },
];

const statusStyles = {
  positive: "bg-success/10 text-success border-success/20",
  neutral: "bg-warning/10 text-warning border-warning/20",
  negative: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabel = { positive: "Positive", neutral: "Monitor", negative: "Attention" };

const ImpactGrid = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <h3 className="font-display font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">Business Impact</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {impacts.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-lg border border-border bg-background hover:shadow-card-hover transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{item.summary}</p>
            <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border", statusStyles[item.status])}>
              {statusLabel[item.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactGrid;
