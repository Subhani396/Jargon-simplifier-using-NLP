import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import InputSection from "@/components/InputSection";
import OutputSection from "@/components/OutputSection";
import { FileText } from "lucide-react";
import { useBriefData } from "@/hooks/useBriefData";
import { audienceOptions } from "@/lib/audienceConfig";
import { apiClient } from "@/lib/api";

interface BriefData {
  originalText: string;
  simplifiedText: string;
  audience: string;
  title: string;
  complexity?: any;
}

const Dashboard = () => {
  const [hasResult, setHasResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBrief, setCurrentBrief] = useState<BriefData | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToHistory, history } = useBriefData();

  // State for initial values from history
  const [initialText, setInitialText] = useState("");
  const [initialAudience, setInitialAudience] = useState("Manager");
  const autoTriggerRef = useRef(false);

  // Helper function to extract simple tags from text
  const extractTags = (text: string): string[] => {
    const commonTechTerms = [
      "database", "api", "security", "performance", "deployment",
      "kubernetes", "docker", "react", "migration", "authentication",
      "architecture", "microservice", "cloud", "testing", "optimization"
    ];

    const lowerText = text.toLowerCase();
    const foundTags = commonTechTerms.filter(term => lowerText.includes(term));

    return foundTags.slice(0, 5); // Limit to 5 tags
  };

  // Handle URL parameter for history re-execution
  useEffect(() => {
    const briefId = searchParams.get('briefId');
    if (briefId && !autoTriggerRef.current) {
      const historyItem = history.find(item => item.id === briefId);
      if (historyItem) {
        // Set initial values for InputSection
        setInitialText(historyItem.originalText);
        setInitialAudience(historyItem.audience);
        autoTriggerRef.current = true;

        // Auto-trigger simplification after a short delay to ensure InputSection renders
        setTimeout(() => {
          handleSimplify(historyItem.originalText, historyItem.audience);
        }, 100);

        // Clear URL parameter to prevent re-triggering on refresh
        setSearchParams({});
      }
    }
  }, [searchParams, history, setSearchParams]);

  const handleSimplify = async (text: string, audience: string, file?: File) => {
    setIsProcessing(true);

    try {
      let result;
      let originalText = text;

      if (file) {
        // Handle file upload
        result = await apiClient.simplifyFile(file, audience);

        if (!result.success || !result.data) {
          console.error('File API Error:', result.error);
          setIsProcessing(false);
          alert(`Error processing file: ${result.error}`);
          return;
        }

        originalText = result.data.originalText;
      } else {
        // Handle text input
        result = await apiClient.simplifyText(text, audience);

        if (!result.success || !result.data) {
          console.error('API Error:', result.error);
          setIsProcessing(false);
          alert(`Error simplifying text: ${result.error}`);
          return;
        }
      }

      const { simplifiedText, complexity } = result.data;

      // Generate title from first 60 characters
      const title = originalText.length > 60
        ? originalText.substring(0, 60).trim() + '...'
        : originalText.trim();

      // Extract tags from the input text
      const tags = extractTags(originalText);

      // Add to history
      addToHistory({
        title,
        originalText,
        simplifiedText,
        audience,
        isSaved: false,
        tags,
      });

      // Store current brief for display with complexity data
      setCurrentBrief({
        originalText,
        simplifiedText,
        audience,
        title,
        complexity,
      });

      setIsProcessing(false);
      setHasResult(true);
    } catch (error) {
      console.error('Simplification error:', error);
      setIsProcessing(false);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      <DashboardSidebar />
      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="font-display font-semibold text-lg">New Brief</h1>
        </header>
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <InputSection
            onSimplify={handleSimplify}
            isProcessing={isProcessing}
            initialText={initialText}
            initialAudience={initialAudience}
          />

          {isProcessing && (
            <div className="space-y-4 animate-fade-in">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6 shadow-card">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded animate-pulse w-full" />
                    <div className="h-3 bg-muted rounded animate-pulse w-4/5" />
                    <div className="h-3 bg-muted rounded animate-pulse w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasResult && !isProcessing && currentBrief && (
            <OutputSection
              simplifiedText={currentBrief.simplifiedText}
              originalText={currentBrief.originalText}
              audience={currentBrief.audience}
              complexity={currentBrief.complexity}
            />
          )}

          {!hasResult && !isProcessing && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">No brief yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Paste a technical update above and click "Simplify" to generate an executive-ready summary.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
