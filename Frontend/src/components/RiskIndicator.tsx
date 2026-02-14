import { cn } from "@/lib/utils";

interface RiskIndicatorProps {
  level: "low" | "medium" | "high";
}

const config = {
  low: { label: "Low Risk", color: "bg-success", ring: "ring-success/20", text: "text-success" },
  medium: { label: "Medium Risk", color: "bg-warning", ring: "ring-warning/20", text: "text-warning" },
  high: { label: "High Risk", color: "bg-destructive", ring: "ring-destructive/20", text: "text-destructive" },
};

const RiskIndicator = ({ level }: RiskIndicatorProps) => {
  const c = config[level];
  const percent = level === "low" ? 25 : level === "medium" ? 55 : 85;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <h3 className="font-display font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">Risk Level</h3>
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="36" fill="none"
              className={cn("transition-all duration-1000", level === "low" ? "stroke-success" : level === "medium" ? "stroke-warning" : "stroke-destructive")}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-lg font-bold", c.text)}>{percent}%</span>
          </div>
        </div>
        <div>
          <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", c.ring, "ring-2", c.text)}>
            <div className={cn("h-2 w-2 rounded-full", c.color)} />
            {c.label}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {level === "low" && "No significant risks detected in this update."}
            {level === "medium" && "Some areas require stakeholder attention."}
            {level === "high" && "Critical issues that need immediate review."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskIndicator;
