import { useState } from "react";
import { Copy, Download, Share2, BookmarkPlus, Check, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImpactGrid from "./ImpactGrid";
import { toast } from "sonner";

interface Jargon {
  term: string;
  short: string;
  detailed: string;
}

interface OutputSectionProps {
  simplifiedText: string;
  originalText: string;
  audience: string;
  complexity?: any;
  jargons?: Jargon[];
  complexityReasoning?: string;
}

const OutputSection = ({ simplifiedText, originalText, audience, complexity, jargons = [], complexityReasoning }: OutputSectionProps) => {
  const [mode, setMode] = useState<"short" | "detailed">("short");
  const [expandedJargons, setExpandedJargons] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // Function to strip all markdown formatting and return clean plain text
  const stripMarkdown = (text: string): string => {
    let cleaned = text;

    // Remove citations like [1], [2], [1][2][3]
    cleaned = cleaned.replace(/\[\d+\]/g, '');

    // Remove headers (###, ##, #)
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

    // Remove bold (**text** or __text__)
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
    cleaned = cleaned.replace(/__([^_]+)__/g, '$1');

    // Remove italic (*text* or _text_)
    cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
    cleaned = cleaned.replace(/_([^_]+)_/g, '$1');

    // Remove links [text](url)
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Remove inline code (`code`)
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

    // Remove strikethrough (~~text~~)
    cleaned = cleaned.replace(/~~([^~]+)~~/g, '$1');

    // Remove bullet points and list markers
    cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
    cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');

    // Remove blockquotes (> text)
    cleaned = cleaned.replace(/^\s*>\s+/gm, '');

    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    cleaned = cleaned.trim();

    return cleaned;
  };

  // Get clean text without markdown
  const cleanText = stripMarkdown(simplifiedText);

  // Generate a powerful, distinct executive one-liner
  const generateExecutiveOneLiner = (text: string, audience: string): string => {
    // Extract key phrases and patterns
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    if (sentences.length === 0) return text;

    // Look for outcome-focused patterns
    const outcomePatterns = [
      /(?:you'?ll get|what you'?ll get|this (?:will|means|delivers|provides))/i,
      /(?:benefits?|advantages?|improvements?|results?)/i,
      /(?:enables?|allows?|helps?|supports?)/i,
      /(?:faster|quicker|easier|simpler|better|more efficient)/i,
    ];

    // Look for business value patterns
    const valuePatterns = [
      /(?:\d+%|percentage|reduction|increase|improvement)/i,
      /(?:cost|time|performance|efficiency|scalability)/i,
      /(?:saves?|reduces?|improves?|increases?|enhances?)/i,
    ];

    // Look for action/implementation patterns
    const actionPatterns = [
      /(?:we'?ll|we will|you'?ll|you will|this will)/i,
      /(?:implement|deploy|build|create|set up|establish)/i,
      /(?:by|through|using|via)/i,
    ];

    // Score each sentence based on executive relevance
    const scoredSentences = sentences.map((sentence, index) => {
      let score = 0;
      const trimmed = sentence.trim();

      // Prefer middle sentences (often contain key outcomes)
      if (index > 0 && index < sentences.length - 1) score += 2;

      // Boost for outcome patterns
      if (outcomePatterns.some(pattern => pattern.test(trimmed))) score += 5;

      // Boost for business value
      if (valuePatterns.some(pattern => pattern.test(trimmed))) score += 4;

      // Boost for action-oriented content
      if (actionPatterns.some(pattern => pattern.test(trimmed))) score += 3;

      // Prefer concise sentences (20-50 words)
      const wordCount = trimmed.split(/\s+/).length;
      if (wordCount >= 15 && wordCount <= 40) score += 3;
      else if (wordCount < 10) score -= 2;
      else if (wordCount > 50) score -= 3;

      // Penalize first sentence (too similar to main explanation)
      if (index === 0) score -= 4;

      // Look for specific value propositions
      if (/(?:without|no need|eliminates?|removes?)/i.test(trimmed)) score += 2;
      if (/(?:independent|reliable|scalable|flexible|secure)/i.test(trimmed)) score += 2;

      return { sentence: trimmed, score, index };
    });

    // Get the highest scoring sentence
    const bestSentence = scoredSentences.reduce((best, current) =>
      current.score > best.score ? current : best
    );

    // If the best sentence is still the first one or has low score, create a synthesized summary
    if (bestSentence.index === 0 || bestSentence.score < 3) {
      // Extract key concepts and create a power statement
      const keyTerms = extractKeyTerms(text);
      const outcome = extractOutcome(text);

      if (outcome) {
        return outcome;
      } else if (keyTerms.length > 0) {
        return `Transform your ${keyTerms[0]} into ${keyTerms[1] || 'streamlined operations'} with ${keyTerms[2] || 'modern solutions'} that deliver measurable results.`;
      }
    }

    return bestSentence.sentence + ".";
  };

  // Helper: Extract key terms from text
  const extractKeyTerms = (text: string): string[] => {
    const terms: string[] = [];
    const lowerText = text.toLowerCase();

    // Common technical/business terms
    const termPatterns = [
      'microservices', 'architecture', 'system', 'application', 'platform',
      'infrastructure', 'solution', 'process', 'workflow', 'pipeline',
      'deployment', 'integration', 'automation', 'optimization'
    ];

    termPatterns.forEach(term => {
      if (lowerText.includes(term)) terms.push(term);
    });

    return terms.slice(0, 3);
  };

  // Helper: Extract outcome statement
  const extractOutcome = (text: string): string | null => {
    // Look for sentences with clear outcomes
    const outcomeMatch = text.match(/(?:this (?:delivers?|provides?|means?|gives?|enables?)|you'?ll get|what you'?ll get)[^.!?]*[.!?]/i);

    if (outcomeMatch) {
      let outcome = outcomeMatch[0].trim();
      // Clean up and make it punchy
      outcome = outcome.replace(/^(?:this|what)\s+/i, '');
      outcome = outcome.charAt(0).toUpperCase() + outcome.slice(1);
      return outcome;
    }

    return null;
  };

  // Generate the executive one-liner
  const executiveOneLiner = generateExecutiveOneLiner(cleanText, audience);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleJargon = (term: string) => {
    const newExpanded = new Set(expandedJargons);
    if (newExpanded.has(term)) {
      newExpanded.delete(term);
    } else {
      newExpanded.add(term);
    }
    setExpandedJargons(newExpanded);
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
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
          {mode === "short" ? cleanText.split(". ").slice(0, 2).join(". ") + "." : cleanText}
        </p>
      </div>

      {/* Jargons Section */}
      {jargons && jargons.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="font-display font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">
            Technical Terms Explained
          </h3>
          <div className="space-y-3">
            {jargons.map((jargon) => {
              const isExpanded = expandedJargons.has(jargon.term);
              const displayText = mode === "detailed" || isExpanded ? jargon.detailed : jargon.short;

              return (
                <div
                  key={jargon.term}
                  className="p-4 rounded-lg border border-border bg-background hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-primary">{jargon.term}</h4>
                    <button
                      onClick={() => toggleJargon(jargon.term)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {displayText}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Complexity Reduction - Full Width */}
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
        {complexityReasoning ? (
          <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-xs text-foreground leading-relaxed">
              <span className="font-semibold text-success">Why: </span>
              {complexityReasoning}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-4">
            Complexity reduced by <span className="font-semibold text-success">{complexity?.reduction?.percentage || 74}%</span>
          </p>
        )}
      </div>


      <ImpactGrid complexity={complexity} />

      {/* Executive Summary */}
      <div className="gradient-primary rounded-xl p-6 shadow-lg">
        <h3 className="font-display font-semibold text-sm text-primary-foreground/70 uppercase tracking-wide mb-3">
          Executive One-Liner
        </h3>
        <p className="text-primary-foreground font-medium text-lg leading-relaxed">
          "{executiveOneLiner}"
        </p>
      </div>
    </div>
  );
};

export default OutputSection;
