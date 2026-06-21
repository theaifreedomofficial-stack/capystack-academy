import React, { useState } from "react";
import { Sparkles, Loader2, Play, Check, Copy, Flame, HelpCircle } from "lucide-react";
import { GEOSEOScoreResult } from "../types";

interface ScorecardTabProps {
  onScore: (content: string) => Promise<GEOSEOScoreResult | null>;
  initialData: GEOSEOScoreResult | null;
}

export default function ScorecardTab({ onScore, initialData }: ScorecardTabProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GEOSEOScoreResult | null>(initialData);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Synchronize local states when global showcase demo is invoked
  React.useEffect(() => {
    if (initialData) {
      setResult(initialData);
      setContent(initialData.urlOrContent || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await onScore(content);
      if (data) {
        setResult(data);
      } else {
        setError("Could not calculate scores from analysis. Try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to process content analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="scorecard-tab-workspace" className="space-y-6 text-slate-100">
      {/* Overview Intro */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📊</span> GEO & SEO Calibration Studio
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Paste your website copy, blog posts, or landing page headers below. Our scoring engine evaluates structured citation density, semantic authority alignments, and provides optimized, copy-pasteable replacements designed for maximum LLM recommendations.
        </p>

        {/* Input content form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Draft Copy / Article Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. Paste your brand description, article draft, or marketing copy here (at least 3-4 sentences)..."
              rows={6}
              className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Characters: {content.length} | Recommended: &gt; 250 characters
            </span>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Calibrating GEO Citation Ratios...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze & Calibrate Copy</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-300">
          ⚠️ {error}
        </div>
      )}

      {/* Results presentation */}
      {result && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main indicators and progress bars */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 lg:col-span-1 space-y-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 tracking-wider">GEO PERFORMANCE GRADING</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-black text-white">{result.overallGrade}</span>
                <span className="text-xs text-slate-400 font-mono">Overall Grade</span>
              </div>
            </div>

            {/* Score ring stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-slate-500 font-mono">SEO Score</div>
                <div className="text-2xl font-bold text-teal-400 mt-1">{result.traditionalSeoScore}%</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[10px] text-indigo-400 font-mono">GEO Score</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{result.geoScore}%</div>
              </div>
            </div>

            {/* Platform Citation Probabilities */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                LLM Rec-Engine Odds
              </h4>
              <div className="space-y-2.5">
                {result.aiPlatformsScore.map((platform, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 font-sans font-medium">{platform.platform}</span>
                      <span className={`text-[10px] font-bold ${
                        platform.viabilityStatus === "Strong Citation" ? "text-emerald-400" :
                        platform.viabilityStatus === "Moderate Citation" ? "text-amber-400" : "text-rose-400"
                      }`}>{platform.citationProbability}% Odds</span>
                    </div>
                    {/* Tiny Custom Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          platform.viabilityStatus === "Strong Citation" ? "bg-emerald-400" :
                          platform.viabilityStatus === "Moderate Citation" ? "bg-amber-400" : "bg-rose-500"
                        }`}
                        style={{ width: `${platform.citationProbability}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deep Dimension Scoring + Copy Upgrades */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-md font-bold text-white mb-4 uppercase tracking-widest text-slate-400">
                🔍 5-Dimensional Core Criteria Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Authority Signals", value: result.metrics.authoritySignals, desc: "Presence of names, first-person expertise, credentials" },
                  { name: "Citation Directness", value: result.metrics.citationDirectness, desc: "Factual clarity, Q&As, statistics and metrics" },
                  { name: "Entity Alignment", value: result.metrics.entityAlignment, desc: "Presence of high-weight industry entity keywords" },
                  { name: "Readability & Flow", value: result.metrics.readabilityAndFlow, desc: "Clean syntactic loops, natural language readability" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-200">{item.name}</span>
                      <span className="text-xs font-mono text-cyan-400">{item.value}/100</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: `${item.value}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight pt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Summary message */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-xs leading-relaxed text-cyan-200">
              <span className="font-bold block text-sm text-cyan-400 mb-1">🤖 Critical Engine Feedback</span>
              {result.summaryFeedback}
            </div>

            {/* GEO BOOST SCRIPT WRITING ACTIONS */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest text-slate-400">
                  🔥 Instant Drop-in GEO Upgrades (Copy/Paste)
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono">Click code box to copy</span>
              </div>

              <div className="space-y-3">
                {result.geoBoostActions.map((action, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/20 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono font-bold">
                          {action.category}
                        </span>
                        <span className="text-xs text-slate-300 font-medium">Upgrade Blueprint</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        action.impact === "Critical" ? "bg-rose-500/10 text-rose-400" :
                        action.impact === "High" ? "bg-amber-500/10 text-amber-500" : "bg-slate-800 text-slate-400"
                      }`}>
                        {action.impact} Impact
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{action.action}</p>

                    {/* Copy Snippet box */}
                    <div
                      onClick={() => handleCopy(action.revisedFragment, i)}
                      className="group relative cursor-pointer mt-2 overflow-hidden rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500 p-3 transition"
                    >
                      <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap select-all font-semibold leading-relaxed">
                        {action.revisedFragment}
                      </pre>
                      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded text-[9px] text-slate-400">
                        {copiedIndex === i ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Snippet</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
