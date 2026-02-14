import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import InputSection from "@/components/InputSection";
import OutputSection from "@/components/OutputSection";
import { FileText } from "lucide-react";

const Dashboard = () => {
  const [hasResult, setHasResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimplify = (text: string, audience: string) => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setHasResult(true);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      <DashboardSidebar />
      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="font-display font-semibold text-lg">New Brief</h1>
        </header>
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <InputSection onSimplify={handleSimplify} isProcessing={isProcessing} />

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

          {hasResult && !isProcessing && <OutputSection />}

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
