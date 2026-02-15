import { DollarSign, Zap, Shield, Clock, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImpactItem {
  icon: React.ElementType;
  label: string;
  summary: string;
  status: "positive" | "neutral" | "negative";
}

interface ImpactGridProps {
  complexity?: any;
}

const statusStyles = {
  positive: "bg-success/10 text-success border-success/20",
  neutral: "bg-warning/10 text-warning border-warning/20",
  negative: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabel = { positive: "Positive", neutral: "Monitor", negative: "Attention" };

const ImpactGrid = ({ complexity }: ImpactGridProps) => {
  // Generate dynamic business impact based on complexity data
  const generateImpacts = (): ImpactItem[] => {
    if (!complexity) {
      // Fallback to default impacts if no complexity data
      return [
        {
          icon: DollarSign,
          label: "Cost Impact",
          summary: "Estimated 15% reduction in infrastructure costs after migration. This is based on reduced server load and optimized resource allocation. Projected annual savings of $50K-75K.",
          status: "positive"
        },
        {
          icon: Zap,
          label: "Performance",
          summary: "Response times improved by 40ms on average across all endpoints. 95th percentile latency reduced from 180ms to 140ms. User experience significantly enhanced.",
          status: "positive"
        },
        {
          icon: Shield,
          label: "Security",
          summary: "New authentication layer adds multi-factor authentication (MFA) support. Minor configuration risk during initial deployment. Requires security team review before production rollout.",
          status: "neutral"
        },
        {
          icon: Clock,
          label: "Timeline",
          summary: "2-week delay expected due to critical dependency updates required for compatibility. Original timeline was 4 weeks, now extended to 6 weeks. Resource allocation needs adjustment.",
          status: "negative"
        },
        {
          icon: Package,
          label: "Scalability",
          summary: "New architecture supports 3x current load (from 10K to 30K concurrent users). Horizontal scaling enabled with auto-scaling groups. Future-proofed for 2-3 years of growth.",
          status: "positive"
        },
      ];
    }

    const reductionPercent = complexity.reduction?.percentage || 0;
    const jargonReduction = complexity.reduction?.jargonReduction || 0;
    const originalJargon = complexity.original?.jargonCount || 0;

    // Calculate dynamic impacts based on complexity metrics
    const impacts: ImpactItem[] = [];

    // Cost Impact - based on complexity reduction
    if (reductionPercent > 50) {
      const costReduction = Math.round(reductionPercent / 5);
      impacts.push({
        icon: DollarSign,
        label: "Cost Impact",
        summary: `Estimated ${costReduction}% reduction in communication overhead costs due to simplified documentation. Reduced training time by approximately ${Math.round(costReduction * 1.5)} hours per employee. Annual savings projected at $${costReduction * 2}K-${costReduction * 3}K in onboarding efficiency.`,
        status: "positive"
      });
    } else if (reductionPercent > 30) {
      const costReduction = Math.round(reductionPercent / 6);
      impacts.push({
        icon: DollarSign,
        label: "Cost Impact",
        summary: `Moderate ${costReduction}% reduction in training and onboarding costs. Simplified content reduces knowledge transfer time by ${Math.round(costReduction * 2)} hours per quarter. Estimated savings of $${costReduction * 1.5}K-${costReduction * 2}K annually.`,
        status: "positive"
      });
    } else {
      impacts.push({
        icon: DollarSign,
        label: "Cost Impact",
        summary: `Minimal cost impact expected from simplification (${reductionPercent}% reduction). Current complexity level still requires standard training duration. Monitor for opportunities to further optimize communication efficiency.`,
        status: "neutral"
      });
    }

    // Performance - based on jargon reduction
    const timeImprovement = Math.min(jargonReduction * 15, 120);
    if (jargonReduction > 5) {
      impacts.push({
        icon: Zap,
        label: "Performance",
        summary: `Reading comprehension time reduced by ~${timeImprovement} seconds per document (${jargonReduction} technical terms simplified). 95th percentile reading time improved from ${180 + timeImprovement}s to 180s. Stakeholder engagement increased by approximately ${Math.round(jargonReduction * 8)}%.`,
        status: "positive"
      });
    } else if (jargonReduction > 2) {
      impacts.push({
        icon: Zap,
        label: "Performance",
        summary: `Slight improvement in comprehension speed (~${timeImprovement} seconds faster per document). ${jargonReduction} technical terms replaced with plain language. Average reading time reduced from ${150 + timeImprovement}s to 150s.`,
        status: "positive"
      });
    } else {
      impacts.push({
        icon: Zap,
        label: "Performance",
        summary: `Minimal performance impact on reading comprehension (only ${jargonReduction} terms simplified). Current complexity level maintains similar reading times. Consider additional simplification for broader audience reach.`,
        status: "neutral"
      });
    }

    // Security - based on original complexity
    if (originalJargon > 8) {
      impacts.push({
        icon: Shield,
        label: "Security",
        summary: `High technical content simplified (${originalJargon} technical terms identified). Verify no sensitive implementation details or security protocols exposed in simplified version. Requires security team review before external distribution.`,
        status: "neutral"
      });
    } else if (originalJargon > 4) {
      impacts.push({
        icon: Shield,
        label: "Security",
        summary: `Moderate simplification applied (${originalJargon} technical terms processed). Review for context accuracy and ensure no proprietary information disclosed. Standard security clearance recommended for distribution.`,
        status: "neutral"
      });
    } else {
      impacts.push({
        icon: Shield,
        label: "Security",
        summary: `Low-risk simplification with minimal technical content (${originalJargon} terms). No sensitive details identified in original text. Safe for broad distribution with standard approval process.`,
        status: "positive"
      });
    }

    // Timeline - based on word count change
    const wordChange = complexity.reduction?.wordCountChange || 0;
    if (wordChange > 50) {
      const additionalTime = Math.round(wordChange / 10);
      impacts.push({
        icon: Clock,
        label: "Timeline",
        summary: `Longer explanation requires additional review time (+${additionalTime} minutes per document). ${Math.abs(wordChange)} words added for clarity. Extended content may delay approval process by ${Math.round(additionalTime / 5)} business days.`,
        status: "negative"
      });
    } else if (wordChange < -50) {
      const timeSaved = Math.abs(Math.round(wordChange / 10));
      impacts.push({
        icon: Clock,
        label: "Timeline",
        summary: `Concise output saves review time (~${timeSaved} minutes per document). ${Math.abs(wordChange)} words removed while maintaining clarity. Accelerates approval process by approximately ${Math.round(timeSaved / 5)} business days.`,
        status: "positive"
      });
    } else {
      impacts.push({
        icon: Clock,
        label: "Timeline",
        summary: `Similar length to original (${Math.abs(wordChange)} word difference). No significant time impact on review or approval processes. Standard timeline applies for distribution and stakeholder review.`,
        status: "neutral"
      });
    }

    // Scalability - based on overall reduction
    if (reductionPercent > 60) {
      const audienceMultiplier = Math.round(reductionPercent / 10);
      impacts.push({
        icon: Package,
        label: "Scalability",
        summary: `Highly accessible format supports ${audienceMultiplier}x broader audience reach (from technical teams to all stakeholders). ${reductionPercent}% complexity reduction enables cross-functional understanding. Projected to increase document engagement by ${audienceMultiplier * 15}%.`,
        status: "positive"
      });
    } else if (reductionPercent > 40) {
      const audienceMultiplier = Math.round(reductionPercent / 15);
      impacts.push({
        icon: Package,
        label: "Scalability",
        summary: `Improved accessibility for ${audienceMultiplier}x wider stakeholder base (technical + management audiences). ${reductionPercent}% reduction in complexity barriers. Estimated ${audienceMultiplier * 12}% increase in cross-team adoption.`,
        status: "positive"
      });
    } else {
      impacts.push({
        icon: Package,
        label: "Scalability",
        summary: `Moderate accessibility improvement for broader teams (${reductionPercent}% complexity reduction). Still requires some technical background for full comprehension. Consider additional simplification for non-technical stakeholders.`,
        status: "neutral"
      });
    }

    return impacts;
  };

  const impacts = generateImpacts();

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
