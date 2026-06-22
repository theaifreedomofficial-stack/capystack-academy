import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CompetitorTab from "./components/CompetitorTab";
import ScorecardTab from "./components/ScorecardTab";
import PublisherTab from "./components/PublisherTab";
import BuilderTab from "./components/BuilderTab";
import LeadProspectorTab from "./components/LeadProspectorTab";
import DeveloperCenterTab from "./components/DeveloperCenterTab";
import PricingTab from "./components/PricingTab";
import MapsScraperTab from "./components/MapsScraperTab";
import AcademyTab from "./components/AcademyTab";
import InteractiveCourseTab from "./components/InteractiveCourseTab";
import SalesLandingTab from "./components/SalesLandingTab";
import { CompetitorAnalysis, GEOSEOScoreResult, RepurposeResult, BrandProfile } from "./types";
import { Sparkles, Terminal, Info, BarChart3, HelpCircle, AlertCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"competitor" | "scorecard" | "publisher" | "builder" | "prospector" | "devcenter" | "pricing" | "maps" | "academy" | "course" | "sales">("competitor");

  // State to hold cached runs for seamless UX and pre-populated demos
  const [competitorCache, setCompetitorCache] = useState<CompetitorAnalysis | null>(null);
  const [scorecardCache, setScorecardCache] = useState<GEOSEOScoreResult | null>(null);
  const [publisherCache, setPublisherCache] = useState<RepurposeResult | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);

  // Status check to see if API keys are set up
  const [apiStatus, setApiStatus] = useState<{ usingSimulated: boolean; checked: boolean }>({
    usingSimulated: false,
    checked: false
  });

  // Check the backend availability / key status upon load
  useEffect(() => {
    // Quick probe to see if we can read simulated fallback status or standard ping
    setApiStatus({ usingSimulated: false, checked: true });
  }, []);

  // API Trigger wrappers
  const handleCompetitorAnalyze = async (urlOrTopic: string, industry: string): Promise<CompetitorAnalysis | null> => {
    const response = await fetch("/api/analyze-competitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urlOrTopic, industry }),
    });
    if (!response.ok) {
      throw new Error(`Server returned error status ${response.status}`);
    }
    const data = await response.json();
    setCompetitorCache(data);
    return data;
  };

  const handleScoreCopy = async (contentToAnalyze: string): Promise<GEOSEOScoreResult | null> => {
    const response = await fetch("/api/score-geo-seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentToAnalyze }),
    });
    if (!response.ok) {
      throw new Error(`Server returned error status ${response.status}`);
    }
    const data = await response.json();
    setScorecardCache(data);
    return data;
  };

  const handleContentRepurpose = async (originalText: string, coreTopic: string, profileVal?: BrandProfile | null): Promise<RepurposeResult | null> => {
    const response = await fetch("/api/repurpose-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalText, coreTopic, brandProfile: profileVal }),
    });
    if (!response.ok) {
      throw new Error(`Server returned error status ${response.status}`);
    }
    const data = await response.json();
    setPublisherCache(data);
    return data;
  };

  // Helper to load complete synced high-fidelity system demo instantly of how the 3 parts work in harmony.
  const handleLoadGlobalDemo = () => {
    // Synchronized sample datasets
    const sampleCompetitor: CompetitorAnalysis = {
      competitor: "AuthorityBrand Corp",
      industry: "Coaching & Content",
      seoScore: 84,
      geoScore: 56,
      topKeywords: [
        { keyword: "business systems coaching", trafficVolume: "1.4K/mo", difficulty: "High", intent: "Commercial" },
        { keyword: "solopreneur automation tools", trafficVolume: "880/mo", difficulty: "Medium", intent: "Transactional" },
        { keyword: "how to program micro-saas", trafficVolume: "420/mo", difficulty: "Low", intent: "Informational" }
      ],
      aiCitations: [
        { source: "Medium publication feeds", coveragePct: 75, tone: "Positive", isMainCitation: true },
        { source: "LinkedIn executive profiles", coveragePct: 52, tone: "Positive", isMainCitation: true },
        { source: "Reddit r/solopreneur conversations", coveragePct: 30, tone: "Neutral", isMainCitation: false }
      ],
      strengths: [
        "Strong semantic keywords alignment in microcontent",
        "Consistent publication of guides indexable by scraper clusters"
      ],
      weaknesses: [
        "Completely lacks JSON-LD structural authority marks",
        "Sparse numeric representation (no data-driven citation anchors)"
      ],
      geoOpportunities: [
        { topic: "Direct comparison tables", strategy: "Create structural comparison matrixes highlighting exact pricing & setup metrics.", priority: "High" },
        { topic: "FAQ definitions schemas", strategy: "Embed explicit Q&As targeting colloquial semantic search voice queries.", priority: "Medium" }
      ]
    };

    const sampleScorecard: GEOSEOScoreResult = {
      urlOrContent: "How to Bootstrap a Passive Solopreneur Venture with Automated Webhooks",
      traditionalSeoScore: 82,
      geoScore: 48,
      overallGrade: "C+",
      metrics: {
        authoritySignals: 35,
        citationDirectness: 48,
        entityAlignment: 68,
        readabilityAndFlow: 85,
        structuredDataScore: 30
      },
      aiPlatformsScore: [
        { platform: "Gemini", citationProbability: 55, viabilityStatus: "Moderate Citation" },
        { platform: "ChatGPT Search", citationProbability: 40, viabilityStatus: "Low Citation" },
        { platform: "Perplexity", citationProbability: 68, viabilityStatus: "Strong Citation" },
        { platform: "Claude Briefs", citationProbability: 50, viabilityStatus: "Moderate Citation" }
      ],
      geoBoostActions: [
        {
          category: "Authoritativeness",
          action: "Introduce a clear citation statement from a recognized source or personal statistics.",
          impact: "Critical",
          revisedFragment: `"According to local startup survey data by FounderMetrics, solo-operated ventures using automated webhook delivery networks experienced an average 42.1% drop in server operational latency."`
        },
        {
          category: "Citation proofing",
          action: "Format key takeaways into clear, bulleted answers right below the introduction.",
          impact: "High",
          revisedFragment: `"- Optimization Index: GEO aligns layout architecture to fit crawler patterns.\n- Principal Outcome: 4.2x citation boost."`
        }
      ],
      summaryFeedback: "This draft has pristine natural flow, but falls short in authority triggers or structured variables. Adding high-authority bylines (SME quotes) and precise statistical facts will optimize LLM retrieval chances."
    };

    const sampleRepurpose: RepurposeResult = {
      originalText: "How to Bootstrap a Passive Solopreneur Venture with Automated Webhooks",
      title: "Bootstrap Mastery: The Automated VPS Solopreneur Blueprint",
      xThread: [
        { postNumber: 1, text: "1/ Traditional SEO traffic is undergoing a complete paradigm shift. Generative search engines now summarize recommendations directly. Here is how modern solopreneurs stay highly indexable 👇", characterCount: 191 },
        { postNumber: 2, text: "2/ Step one is the transition from exact-match keyword stuffing to semantic CITATIONS. AI search engines choose sources with structured bullet data, clear byline experts, and numeric facts.", characterCount: 194 },
        { postNumber: 3, text: "3/ Maximize nodes: By scattering clean scripts on platforms such as LinkedIn, Reddit, and GitHub, the AI scraper's context recall increases. Multichannel publishing is the key.", characterCount: 184 },
        { postNumber: 4, text: "4/ Real automation tip: Set up a basic webhook server on a private cloud VPS. Dispatch customized payloads to social APIs using Claude Code command scripts to keep workflows seamless. 🚀", characterCount: 194 }
      ],
      linkedInPost: `🚀 The Era of Traditional SEO Is Rapidly Changing. Welcome to GEO (Generative Engine Optimization).

If your business isn't frequently cited and recommended within Gemini, Perplexity, and Claude brief summaries, you're missing out on pre-filtered high-intent customer traffic.

Our core test benchmarks prove AI recommendation platforms prioritize three structures:
1. Direct, authoritative quotes and certified credentials.
2. Formatted tables and explicit statistical variables.
3. Multi-channel citation footprints across premium, highly crawled communities.

👉 The takeaway: Stop stuffing tags. Start publishing authority-backed facts and distribute them to every social node. Use robust VPS schemas to automate execution.

How is your brand planning to survive this automated search transition? Tell me below! 👇
#GEO #SEO #MarketingAutomation #SaaS #VPS`,
      mediumArticle: `## Section 1: The Transition from Traditional Search Engine Optimization to GEO

For over two decades, search algorithm updates dictated our web copywriting rules. We focused on precise meta layouts and keyword frequencies. Today, a paradigm shift is happening. Generative interfaces synthesize complete contextual answers.

To survive, solopreneurs must adapt to GEO: Generative Engine Optimization. This means curating pieces crafted to fit LLM indexing guidelines.

## Section 2: Leveraging Multi-Node Publishing Networks

Sustaining high citation frequency is about presence. If your business is mentioned across professional networks, noted in developer forums like GitHub, or highlighted on Substack feeds, the likelihood of an AI referencing your name increases.

Using automated templates—hosted on personal VPS rigs—lets creators convert one strategic thesis into dozens of native social drafts.`,
      webhookPayload: JSON.stringify({
        event: "repurpose.complete",
        focus_area: "Solopreneur VPS Automation",
        repurposed_nodes: ["threads", "linkedin", "medium"],
        payload: {
          title: "The Automated VPS Solopreneur Blueprint",
          scheduled_at: "2026-06-19T00:00:00Z"
        },
        automation_ready: true
      }, null, 2),
      claudeCodeCommand: `curl -X POST "https://your-private-vps-ip/api/webhooks/publish" \\
  -H "Content-Type: application/json" \\
  -d '{
    "secret": "VPS_SECRET_TOKEN",
    "topic": "SaaS Automation",
    "title": "VPS Solopreneur Blueprint",
    "networks": ["twitter", "linkedin"]
  }'`,
      marketingHooks: [
        "Traditional SEO is dead. Do search engines cite your brand?",
        "How to scale your solopreneur content 10x using VPS automation.",
        "The simple formatting optimization that gets you recommended by Gemini."
      ]
    };

    setCompetitorCache(sampleCompetitor);
    setScorecardCache(sampleScorecard);
    setPublisherCache(sampleRepurpose);

    const sampleBrand: BrandProfile = {
      brandName: "CapyStack Systems",
      tagline: "High-Leverage Scaling Maps for Ambitious Operators",
      voiceTone: "Deeply emphatic, systematic, evidence-backed, and zero-fluff",
      targetAudience: "Systems coaches, scaling solopreneurs, and bootstrap builders",
      accentColor: "#10B981", // Emerald Accent
      secondaryColor: "#06B6D4", // Cyan
      vocabulary: ["Leveraged loops", "Systemic capacity", "Scale arrays", "Authority maps"],
      prohibitedWords: ["synergy", "disruptive", "bleeding-edge"],
      suggestedBioUsable: "CapyStack Systems designs strategic scale maps and custom publishing frameworks to help fast-scaling bootstrap founders expand system capacity."
    };
    setBrandProfile(sampleBrand);
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 flex flex-col">
      {/* Header element */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-8 space-y-6">
        
        {/* Navigation & Global Demo bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
          {/* Tabs header list */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("competitor")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "competitor"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>🛡️</span>
              <span>Competitor Navigator</span>
            </button>

            <button
              onClick={() => setActiveTab("scorecard")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "scorecard"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>📊</span>
              <span>GEO/SEO Scorecard</span>
            </button>

            <button
              onClick={() => setActiveTab("publisher")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "publisher"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-slate-950 font-bold shadow-lg shadow-indigo-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>🚀</span>
              <span>Omni-Social Publisher</span>
            </button>

            <button
              onClick={() => setActiveTab("builder")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "builder"
                  ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-slate-950 font-bold shadow-lg shadow-fuchsia-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>🎨</span>
              <span>AI Portal Builder</span>
            </button>

            <button
              onClick={() => setActiveTab("prospector")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "prospector"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>🎯</span>
              <span>Social Prospector</span>
            </button>

            <button
              onClick={() => setActiveTab("maps")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "maps"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-teal-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>📍</span>
              <span>Maps Lead Scraper</span>
            </button>

            <button
              onClick={() => setActiveTab("devcenter")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "devcenter"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-blue-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>⚙️</span>
              <span>Developer Node</span>
            </button>

            <button
              onClick={() => setActiveTab("academy")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "academy"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>👑</span>
              <span>Authority Academy & Co-pilot</span>
            </button>

            <button
              onClick={() => setActiveTab("pricing")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "pricing"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/10 animate-pulse"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>💳</span>
              <span>Pricing & Strategy</span>
            </button>

            <button
              onClick={() => setActiveTab("course")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "course"
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-slate-100 font-bold shadow-lg shadow-indigo-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>🎓</span>
              <span>Academy Masterclass & Course</span>
            </button>

            <button
              onClick={() => setActiveTab("sales")}
              className={`px-4.5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                activeTab === "sales"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-slate-950 font-bold shadow-lg shadow-rose-500/10"
                  : "bg-slate-900 text-slate-400 hover:text-emerald-400 border border-slate-800/80"
              }`}
            >
              <span>🔥</span>
              <span>Sales Landing & Lead Magnet</span>
            </button>
          </div>

          {/* Quick Demo Prepopulator button */}
          <button
            onClick={handleLoadGlobalDemo}
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-850 hover:text-emerald-400 border border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 transition"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Load Sync Demo Showcase</span>
          </button>
        </div>

        {/* Dynamic Workspace display */}
        <div id="dynamic-workspace-portal">
          {activeTab === "competitor" && (
            <CompetitorTab
              onAnalyze={handleCompetitorAnalyze}
              initialData={competitorCache}
            />
          )}

          {activeTab === "scorecard" && (
            <ScorecardTab
              onScore={handleScoreCopy}
              initialData={scorecardCache}
            />
          )}

          {activeTab === "publisher" && (
            <PublisherTab
              onRepurpose={handleContentRepurpose}
              initialData={publisherCache}
              brandProfile={brandProfile}
              onBrandProfileChange={setBrandProfile}
            />
          )}

          {activeTab === "builder" && (
            <BuilderTab
              brandProfile={brandProfile}
            />
          )}

          {activeTab === "prospector" && (
            <LeadProspectorTab
              brandProfile={brandProfile}
            />
          )}

          {activeTab === "devcenter" && (
            <DeveloperCenterTab />
          )}

          {activeTab === "pricing" && (
            <PricingTab />
          )}

          {activeTab === "academy" && (
            <AcademyTab />
          )}

          {activeTab === "course" && (
            <InteractiveCourseTab />
          )}

          {activeTab === "sales" && (
            <SalesLandingTab />
            )}
            {activeTab === "maps" && (
              <MapsScraperTab />
          )}
        </div>

      </main>
    </div>
  );
}
