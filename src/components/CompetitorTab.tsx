import React, { useState } from "react";
import { Search, Loader2, ArrowUpRight, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { CompetitorAnalysis } from "../types";

interface CompetitorTabProps {
  onAnalyze: (urlOrTopic: string, industry: string) => Promise<CompetitorAnalysis | null>;
  initialData: CompetitorAnalysis | null;
}

export default function CompetitorTab({ onAnalyze, initialData }: CompetitorTabProps) {
  const [urlOrTopic, setUrlOrTopic] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompetitorAnalysis | null>(initialData);
  const [error, setError] = useState<string | null>(null);

  // Synchronize local states when global showcase demo is invoked
  React.useEffect(() => {
    if (initialData) {
      setResult(initialData);
      setUrlOrTopic(initialData.competitor || "");
      setIndustry(initialData.industry || "Technology");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlOrTopic.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await onAnalyze(urlOrTopic, industry);
      if (data) {
        setResult(data);
      } else {
        setError("Could not complete competitor analysis. Check your connection.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during research.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="competitor-tab-workspace" className="space-y-6 text-slate-100">
      {/* Intro panel */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🔍</span> Competitor AI-Citation Navigator
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Analyze competitors to understand where they are currently cited in generative AI searches, which traditional search keywords drive traffic, and discover gaps to redirect citations to your own brand.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Competitor URL or Topic Key
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={urlOrTopic}
                onChange={(e) => setUrlOrTopic(e.target.value)}
                placeholder="e.g. AcmeSaaS.com or 'low code sales builder'"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-3 pl-11 pr-4 text-sm text-white focus:border-emerald-500 focus:outline-none"
                required
              />
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Industry Segment
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 py-3 px-4 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="Technology">Technology & SaaS</option>
              <option value="E-Commerce">E-Commerce & Retail</option>
              <option value="Coaching & Content">Coaching & Content Creation</option>
              <option value="Agency & Service">Agencies & Services</option>
              <option value="Health & Fitness">Health & Wellness</option>
              <option value="General Business">General Solopreneur Venture</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Crawl & Deep Researching AI Networks...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4.5 w-4.5" />
                  <span>Start Competitor Intel Crawl</span>
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

      {/* Results Workspace */}
      {result && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Scoring Overview Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <div className="text-xs text-emerald-400 font-mono">INTELLIGENCE RECORD</div>
              <h3 className="text-2xl font-black text-white mt-1">{result.competitor}</h3>
              <p className="text-xs text-slate-400">Category: {result.industry}</p>
            </div>

            {/* Circular or Segmented Double Indicator dial */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs font-mono text-slate-400">SEO Footprint</div>
                <div className="text-4xl font-extrabold text-teal-400 mt-2">{result.seoScore}%</div>
                <div className="text-[10px] mt-1 text-slate-500">Traditional Visibility</div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/50 text-center">
                <div className="text-xs font-mono text-slate-400">GEO Authority</div>
                <div className="text-4xl font-extrabold text-indigo-400 mt-2">{result.geoScore}%</div>
                <div className="text-[10px] mt-1 text-indigo-400 font-medium">AI Citation Probability</div>
              </div>
            </div>

            {/* Competitor AI citation references */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200">Traceable AI Citation Footprints</h4>
              <p className="text-[11px] text-slate-500">Platforms where this competitor is heavily quoted by search LLMs:</p>

              <div className="space-y-2">
                {result.aiCitations.map((citation, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-900">
                    <div className="truncate pr-1">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wide">
                        {citation.source}
                      </span>
                      <span className="text-xs font-medium text-slate-200 truncate pr-2">
                        {citation.isMainCitation ? "⭐ Primary citation node" : "Secondary mention"}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-300 block">
                        {citation.coveragePct}% Density
                      </span>
                      <span className={`text-[9px] font-semibold px-1 py-0.5 rounded ${
                        citation.tone === "Positive" ? "bg-emerald-500/10 text-emerald-400" :
                        citation.tone === "Critical" ? "bg-rose-500/10 text-rose-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        {citation.tone} Tone
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords & Analysis lists */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* SWOT highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-950 text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Key Citation Strengths</span>
                </div>
                <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300 leading-normal pl-4 list-disc">
                  {result.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-rose-950 text-slate-300">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wide">
                  <AlertTriangle className="h-4.5 w-4.5" />
                  <span>Authority Vulnerabilities</span>
                </div>
                <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300 leading-normal pl-4 list-disc">
                  {result.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keyword theft strategy */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest text-slate-400">
                  📈 Keyword Target Footprints (SEO + GEO Intent)
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Sorted by theft prioritization</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs bg-slate-950 text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Search Phrase</th>
                      <th className="py-3 px-4">Estimated Traffic</th>
                      <th className="py-3 px-4">AI Search Intent</th>
                      <th className="py-3 px-4 text-right">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {result.topKeywords.map((kw, i) => (
                      <tr key={i} className="hover:bg-slate-900/30">
                        <td className="py-2.5 px-4 font-medium text-slate-200">{kw.keyword}</td>
                        <td className="py-2.5 px-4 font-mono">{kw.trafficVolume}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[10px] text-slate-300 font-medium whitespace-nowrap">
                            {kw.intent}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                            kw.difficulty === "Low" ? "bg-emerald-500" :
                            kw.difficulty === "Medium" ? "bg-amber-500" : "bg-rose-500"
                          }`}></span>
                          {kw.difficulty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GEO Opportunities - How to beat them */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                ⚡ Citation-Hijack Action Blueprints
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {result.geoOpportunities.map((op, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/20 transition flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{op.topic}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          op.priority === "High" ? "bg-rose-500/10 text-rose-400" :
                          op.priority === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-slate-800 text-slate-400"
                        }`}>
                          {op.priority} Priority
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 leading-normal">{op.strategy}</p>
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
