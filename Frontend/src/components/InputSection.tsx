import { useState } from "react";
import { Upload, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputSectionProps {
  onSimplify: (text: string, audience: string) => void;
  isProcessing: boolean;
}

const audiences = ["Manager", "Client", "Executive", "Investor"];

const InputSection = ({ onSimplify, isProcessing }: InputSectionProps) => {
  const [text, setText] = useState("");
  const [audience, setAudience] = useState("Manager");
  const [showDropdown, setShowDropdown] = useState(false);

  const maxChars = 5000;

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

      {/* Audience selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background text-sm hover:bg-accent transition-colors"
          >
            <span className="text-muted-foreground">Audience:</span>
            <span className="font-medium">{audience}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-elevated z-10 py-1 animate-scale-in">
              {audiences.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAudience(a); setShowDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={() => onSimplify(text, audience)}
          disabled={!text.trim() || isProcessing}
          className="gap-2 sm:ml-auto"
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
