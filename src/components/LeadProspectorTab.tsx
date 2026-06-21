import React, { useState } from "react";
import { Search, Loader2, Sparkles, Check, Copy, Linkedin, Twitter, ArrowUpRight, HelpCircle, Save, CheckSquare, MessageSquare, Flame } from "lucide-react";
import { BrandProfile, SocialLeadProspect } from "../types";

interface LeadProspectorTabProps {
  brandProfile: BrandProfile | null;
}

export default function LeadProspectorTab({ brandProfile }: LeadProspectorTabProps) {
  const [keywords, setKeywords] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<SocialLeadProspect[]>([]);
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);
  const [savedLeadIds, setSavedLeadIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/scrape-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, platformFilter })
      });

      if (response.ok) {
        const data: SocialLeadProspect[] = await response.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPitch = (leadId: string, pitch: string) => {
    navigator.clipboard.writeText(pitch);
    setCopiedLeadId(leadId);
    setTimeout(() => setCopiedLeadId(null), 2000);
  };

  const toggleSaveLead = (leadId: string) => {
    const nextSaved = new Set(savedLeadIds);
    if (nextSaved.has(leadId)) {
      nextSaved.delete(leadId);
    } else {
      nextSaved.add(leadId);
    }
    setSavedLeadIds(nextSaved);
  };

  return (
    <div id="social-lead-listening-tab" className="space-y-6">
      {/* Intro section */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🎯</span> AI Social Listener & Lead Prospector
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Instantly scan social networks (X, LinkedIn, Reddit) and web domains to identify potential customers who need your services right now, without the manual effort
        </p>
      </div>

      {/* Control center banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Enter target niches or keywords in query index:
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. B2B coaching, local citation gap, Google Maps"
                className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                required
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Filter Channel Origin:
            </label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-350 focus:border-cyan-500 focus:outline-none"
            >
              <option value="All">All platforms (X, LinkedIn, Reddit)</option>
              <option value="X/Twitter">X / Twitter posts only</option>
              <option value="LinkedIn">LinkedIn user questions</option>
              <option value="Reddit">Reddit communities (r/solopreneur)</option>
              <option value="Web/Blog">Web blogs & Guest requests</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading || !keywords.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs py-3.5 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Crawling feeds...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Harvest Custom Leaddesks</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Grid result display sheets */}
      <div className="space-y-4">
        {leads.length === 0 ? (
          <div className="bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
            <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-300">Feeds are currently idle.</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Search for terms like "Gemini citation optimization" to simulate discovery of real founders seeking your help.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-slate-400">
                Found <strong>{leads.length} high-leverage leads</strong> matching your filter setup.
              </span>
              <span className="text-[10px] bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 px-2.5 py-1 rounded-full uppercase font-bold font-mono">
                Crawling enabled
              </span>
            </div>

            {leads.map((lead) => {
              const hasSaved = savedLeadIds.has(lead.id);
              const rankColor = lead.relevanceScore >= 95 ? "text-rose-400" : "text-amber-400";
              
              return (
                <div key={lead.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 p-6 space-y-4">
                  {/* Card top banner: User Handle and Relevancy Grade */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      {lead.platform === "X/Twitter" && <span className="text-sky-400 font-mono text-xs bg-sky-950/30 px-2 py-1 rounded">X/Twitter</span>}
                      {lead.platform === "LinkedIn" && <span className="text-indigo-400 font-mono text-xs bg-indigo-950/30 px-2 py-1 rounded">LinkedIn</span>}
                      {lead.platform === "Reddit" && <span className="text-orange-400 font-mono text-xs bg-orange-950/30 px-2 py-1 rounded">Reddit</span>}
                      {lead.platform === "Web/Blog" && <span className="text-emerald-400 font-mono text-xs bg-emerald-950/30 px-2 py-1 rounded">Web Node</span>}

                      <div>
                        <h4 className="text-sm font-bold text-white">{lead.userName}</h4>
                        <span className="text-[11px] text-slate-400">{lead.userHandle} • {lead.userBio}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="block text-[9px] text-slate-500 font-mono uppercase">Relevancy Fit</span>
                        <span className={`text-sm font-black font-mono flex items-center gap-1 ${rankColor}`}>
                          <Flame className="h-4.5 w-4.5 animate-pulse" />
                          {lead.relevanceScore}%
                        </span>
                      </div>

                      <button
                        onClick={() => toggleSaveLead(lead.id)}
                        className={`text-xs p-2 rounded-lg border transition ${
                          hasSaved
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/40"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                        }`}
                        title={hasSaved ? "Unsave lead" : "Save lead descriptor"}
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scraped post content segment */}
                  <div className="bg-slate-950/70 border border-slate-850/60 rounded-xl p-4 space-y-2">
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">Captured Live Problem Statement</span>
                    <p className="text-xs text-slate-200 tracking-wide leading-relaxed italic">
                      "{lead.postContent}"
                    </p>
                    <div className="pt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-cyan-400 uppercase">Decoded Painpoint:</span>
                      <span className="text-[11px] text-slate-350">{lead.expressedNeed}</span>
                    </div>
                  </div>

                  {/* Copy Out of pitch segment */}
                  <div className="bg-slate-950 border border-indigo-900/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Personalized Outreach Pitch
                      </span>
                      
                      <button
                        onClick={() => handleCopyPitch(lead.id, lead.recommendedPitch)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg active:scale-95 transition"
                      >
                        {copiedLeadId === lead.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied Pitch</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy to clipboard</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans select-all">
                      {brandProfile 
                        ? lead.recommendedPitch.replace("Lovina Coaching Systems", brandProfile.brandName).replace("EliteCreator AI", brandProfile.brandName) 
                        : lead.recommendedPitch
                      }
                    </p>
                    
                    <div className="text-[10px] text-slate-500">
                      * This outreach pitch conforms automatically to {brandProfile ? brandProfile.brandName : "your AI branding"} guidelines.
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
