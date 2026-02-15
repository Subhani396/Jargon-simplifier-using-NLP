import { useState, useEffect } from "react";
import { Upload, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { audienceOptions } from "@/lib/audienceConfig";

interface InputSectionProps {
  onSimplify: (text: string, audience: string) => void;
  isProcessing: boolean;
  initialText?: string;
  initialAudience?: string;
}

const InputSection = ({
  onSimplify,
  isProcessing,
  initialText = "",
  initialAudience = "Manager"
}: InputSectionProps) => {
  const [text, setText] = useState(initialText);
  const [audience, setAudience] = useState(initialAudience);
  const [showDropdown, setShowDropdown] = useState(false);

  const maxChars = 5000;

  // Update text when initialText prop changes
  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  // Update audience when initialAudience prop changes
  useEffect(() => {
    if (initialAudience) {
      setAudience(initialAudience);
    }
  }, [initialAudience]);

  const currentAudience = audienceOptions[audience] || audienceOptions.Manager;

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <h2 className="font-display font-semibold text-lg mb-4">Technical Input</h2>

      <div className="relative mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          placeholder="Paste your technical update here… e.g. sprint summary, deployment notes, architecture changes…"
          className="w-full h-40 p-4 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
              <Upload className="h-3.5 w-3.5" />
              Upload file
              <input type="file" className="hidden" accept=".txt,.pdf,.md" />
            </label>
          </div>
          <span>{text.length} / {maxChars}</span>
        </div>
      </div>

      {/* Audience selector with enhanced UI */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-input bg-background text-sm hover:bg-accent transition-colors w-full sm:w-auto"
          >
            <span className="text-xl">{currentAudience.icon}</span>
            <span className="text-muted-foreground">Audience:</span>
            <span className="font-medium">{currentAudience.label}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto sm:ml-2" />
          </button>

          {/* Audience description tooltip */}
          <div className="mt-2 text-xs text-muted-foreground italic">
            {currentAudience.description}
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full sm:w-96 bg-card border border-border rounded-lg shadow-elevated z-10 py-1 animate-scale-in">
              {Object.entries(audienceOptions).map(([key, option]) => (
                <button
                  key={key}
                  onClick={() => { setAudience(key); setShowDropdown(false); }}
                  className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-b-0 ${audience === key ? 'bg-accent/50' : ''
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{option.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{option.label}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={() => onSimplify(text, audience)}
          disabled={!text.trim() || isProcessing}
          className="gap-2 w-full sm:w-auto sm:ml-auto"
          variant="hero"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            "Simplify"
          )}
        </Button>
      </div>
    </div>
  );
};

export default InputSection;
