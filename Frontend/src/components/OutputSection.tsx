import { useState } from "react";
import { Copy, Download, Share2, BookmarkPlus, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import RiskIndicator from "./RiskIndicator";
import ImpactGrid from "./ImpactGrid";
import { toast } from "sonner";

interface OutputSectionProps {
  simplifiedText: string;
  originalText: string;
  audience: string;
  complexity?: any;
}

const OutputSection = ({ simplifiedText, originalText, audience, complexity }: OutputSectionProps) => {
  const [mode, setMode] = useState<"short" | "detailed">("short");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(simplifiedText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setMode("short")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "short" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Short
          </button>
          <button
            onClick={() => setMode("detailed")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "detailed" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Detailed
          </button>
        </div>
        <div className="flex gap-1.5 ml-auto">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> PDF
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <BookmarkPlus className="h-3.5 w-3.5" /> Save
          </Button>
        </div>
      </div>

      {/* Simple Explanation */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Simplified Explanation
          </h3>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-primary">
            <Lightbulb className="h-3.5 w-3.5" /> Explain Even Simpler
          </Button>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">
          {mode === "short" ? simplifiedText.split(". ").slice(0, 2).join(". ") + "." : simplifiedText}
        </p>
      </div>

      {/* Risk + Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskIndicator level="medium" />
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="font-display font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">
            Complexity Reduction
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Technical (Original)</span>
                <span className="font-medium">{complexity?.original?.complexityScore || 92}%</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all duration-1000" style={{ width: `${complexity?.original?.complexityScore || 92}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Simplified (Output)</span>
                <span className="font-medium text-success">{complexity?.simplified?.complexityScore || 24}%</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full transition-all duration-1000" style={{ width: `${complexity?.simplified?.complexityScore || 24}%` }} />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Complexity reduced by <span className="font-semibold text-success">{complexity?.reduction?.percentage || 74}%</span></p>
        </div>
      </div>

      <ImpactGrid />

      {/* Executive Summary */}
      <div className="gradient-primary rounded-xl p-6 shadow-lg">
        <h3 className="font-display font-semibold text-sm text-primary-foreground/70 uppercase tracking-wide mb-3">
          Executive One-Liner
        </h3>
        <p className="text-primary-foreground font-medium text-lg leading-relaxed">
          "{simplifiedText.split(". ")[0]}."
        </p>
      </div>
    </div>
  );
};

export default OutputSection;
