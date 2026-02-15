import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import InputSection from "@/components/InputSection";
import OutputSection from "@/components/OutputSection";
import { FileText } from "lucide-react";
import { useBriefData } from "@/hooks/useBriefData";
import { audienceOptions } from "@/lib/audienceConfig";

interface BriefData {
  originalText: string;
  simplifiedText: string;
  audience: string;
  title: string;
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

  // Helper function to generate audience-specific mock simplified text
  const generateMockSimplification = (text: string, audience: string): string => {
    // Audience-specific mock responses based on their focus areas
    const mockResponses = {
      Executive: `**Strategic Overview**

This initiative delivers measurable business value through enhanced system capabilities. Key outcomes include:

• **ROI Impact**: Projected 30% reduction in operational costs through improved efficiency
• **Business Continuity**: Enhanced security measures protect critical assets and reduce risk exposure
• **Competitive Advantage**: Scalability improvements position us for 2x growth capacity
• **Decision Point**: Implementation timeline of 6 weeks with minimal business disruption

**Recommendation**: Proceed with implementation. The strategic benefits significantly outweigh the investment, with positive ROI expected within Q2.`,

      Manager: `**Project Status Update**

**Current Progress**: Implementation is 60% complete and on track for the planned deadline.

**Key Deliverables**:
• System performance improvements deployed to staging environment
• Security enhancements tested and validated
• Scalability upgrades scheduled for next sprint

**Risk Assessment**:
• Minor timeline adjustments needed for integration testing (+3 days)
• Resource allocation is adequate; team capacity at 85%
• No blocking dependencies identified

**Team Implications**: The engineering team will need 2 additional days for QA validation. Overall morale is positive with clear progress milestones.

**Next Steps**: Complete integration testing by end of week, then proceed to production deployment.`,

      Client: `**What You're Getting**

We're enhancing your system to make it faster, more secure, and ready to grow with your needs.

**Deliverables**:
1. **Faster Performance**: Your system will load pages 40% quicker, improving user experience
2. **Better Security**: We're adding advanced protection to keep your data safe
3. **Room to Grow**: The system can now handle 2x more users without slowdowns

**Timeline**: 
• Testing phase: Completed this week
• Final deployment: Next week (minimal downtime during off-peak hours)
• Full availability: All features live by end of month

**What This Means for You**: Your users will notice faster load times immediately, and you'll have peace of mind knowing your platform is secure and ready to scale.`,

      Intern: `**Detailed Technical Walkthrough**

Let me break down what we're doing and why it matters:

**1. System Performance Improvements**
*What it means*: We're making the application run faster by optimizing how it processes data.
*Why it matters*: Users get a better experience with quicker page loads.
*How we're doing it*: We're implementing caching (storing frequently-used data in quick-access memory) and database query optimization (making data requests more efficient).

**2. Security Enhancements**
*What it means*: We're adding extra layers of protection to prevent unauthorized access.
*Why it matters*: Protects user data and maintains trust.
*How we're doing it*: Implementing authentication tokens (digital keys that verify user identity) and encryption (scrambling data so only authorized parties can read it).

**3. Scalability Upgrades**
*What it means*: Preparing the system to handle more users without slowing down.
*Why it matters*: As the business grows, the technology needs to keep up.
*How we're doing it*: Using load balancing (distributing work across multiple servers) and horizontal scaling (adding more servers when needed).

**The Big Picture**: These changes work together to create a robust, efficient system that's ready for future growth while keeping users happy and data secure.`
    };

    return mockResponses[audience as keyof typeof mockResponses] || mockResponses.Manager;
  };

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

  const handleSimplify = (text: string, audience: string) => {
    setIsProcessing(true);

    // Generate title from first 60 characters
    const title = text.length > 60
      ? text.substring(0, 60).trim() + '...'
      : text.trim();

    // Simulate processing
    setTimeout(() => {
      // Generate mock simplified text
      const simplifiedText = generateMockSimplification(text, audience);

      // Extract tags from the input text
      const tags = extractTags(text);

      // Add to history
      addToHistory({
        title,
        originalText: text,
        simplifiedText,
        audience,
        isSaved: false,
        tags,
      });

      // Store current brief for display
      setCurrentBrief({
        originalText: text,
        simplifiedText,
        audience,
        title,
      });

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
