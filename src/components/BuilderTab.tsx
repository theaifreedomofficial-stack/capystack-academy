import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Play, Eye, Code, Save, RefreshCw, Layers, Edit2, Globe, Heart, Monitor, Phone, ArrowRight, CheckCircle } from "lucide-react";
import { BrandProfile, AIWebsiteTemplate } from "../types";

interface BuilderTabProps {
  brandProfile: BrandProfile | null;
}

export default function BuilderTab({ brandProfile }: BuilderTabProps) {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<AIWebsiteTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<"live" | "code">("live");
  const [viewPortMode, setViewPortMode] = useState<"desktop" | "mobile">("desktop");
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit states
  const [editedTitle, setEditedTitle] = useState("");
  const [editedHeroHeader, setEditedHeroHeader] = useState("");
  const [editedSubtitle, setEditedSubtitle] = useState("");

  const activeAccent = brandProfile?.accentColor || "#10B981";
  const activeSecondary = brandProfile?.secondaryColor || "#06B6D4";

  // Trigger default build when brand profile changes or on mount
  useEffect(() => {
    if (brandProfile) {
      handleAutoGenerate();
    }
  }, [brandProfile]);

  const handleAutoGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandProfile,
          niche: niche || "Passive Systems Consulting Matrix"
        })
      });
      if (response.ok) {
        const data: AIWebsiteTemplate = await response.json();
        setTemplate(data);
        setEditedTitle(data.title);
        setEditedHeroHeader(data.heroHeader);
        setEditedSubtitle(data.subtitle);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdits = () => {
    if (template) {
      setTemplate({
        ...template,
        title: editedTitle,
        heroHeader: editedHeroHeader,
        subtitle: editedSubtitle
      });
      setIsEditing(false);
    }
  };

  return (
    <div id="ai-website-builder-tab" className="space-y-6">
      {/* Intro Ribbon */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🎨</span> AI Instant Portal & Website Builder
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          This generator automatically synthesizes high-converting, fully customized landing pages utilizing your synchronized brand colors, tone of voice, and customized target demographics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Controls Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Build parameters
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Target Business Niche</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. B2B LinkedIn Copywriter"
                  className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Synchronized Stylesheet</span>
                {brandProfile ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeAccent }} />
                      <span>Accent: <strong>{brandProfile.brandName}</strong></span>
                    </div>
                    <div className="flex gap-2 items-center text-[10px] text-slate-400 font-mono">
                      <span>Palette: {activeAccent} → {activeSecondary}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-amber-500 font-semibold block">⚠️ No Brand Profile Sync'd. Using default slate styles.</span>
                )}
              </div>

              <button
                onClick={handleAutoGenerate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs py-3 transition shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Laying Web Grid...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate AI Landing Page</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Custom Editor Sheet */}
          {template && (
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Interactive content editor
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>{isEditing ? "Cancel" : "Modify Copy"}</span>
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-medium">Page Tab Title</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-medium">Hero Heading</label>
                    <textarea
                      value={editedHeroHeader}
                      onChange={(e) => setEditedHeroHeader(e.target.value)}
                      className="w-full text-xs h-16 rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-medium">Subtitle / Pitch</label>
                    <textarea
                      value={editedSubtitle}
                      onChange={(e) => setEditedSubtitle(e.target.value)}
                      className="w-full text-xs h-16 rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveEdits}
                    className="w-full text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 transition"
                  >
                    Apply Modifications
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-400 space-y-2">
                  <p>You can click on the right button to inject customized alterations or headers directly into the preview module.</p>
                  <div className="p-3 bg-slate-950/40 rounded-xl space-y-1">
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">Search Optimization (GEO)</span>
                    <p className="text-[11px] text-slate-350 italic">Meta title: "{template.metaTitle}"</p>
                    <p className="text-[10px] text-slate-500">Citing markup successfully injected.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Playground Showcase Container */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode("live")}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  previewMode === "live" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Live Interactive Preview</span>
              </button>
              <button
                onClick={() => setPreviewMode("code")}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  previewMode === "code" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                <span>Raw Template JSON</span>
              </button>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <button
                onClick={() => setViewPortMode("desktop")}
                className={`p-1.5 rounded-md transition ${viewPortMode === "desktop" ? "bg-slate-800 text-cyan-400" : "text-slate-500 hover:text-slate-350"}`}
                title="Desktop viewport"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewPortMode("mobile")}
                className={`p-1.5 rounded-md transition ${viewPortMode === "mobile" ? "bg-slate-800 text-cyan-400" : "text-slate-500 hover:text-slate-350"}`}
                title="Mobile viewport"
              >
                <Phone className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[500px]">
            {!template ? (
              <div className="h-full bg-slate-950/20 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
                <Globe className="h-12 w-12 text-slate-600 mb-3 animate-pulse" />
                <h4 className="text-sm font-semibold text-slate-300">No Web Instance Configured Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Ensure you sync your Brand Voice card above first or select a custom target niche, then click "Generate AI Landing Page".
                </p>
              </div>
            ) : previewMode === "code" ? (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl h-full font-mono text-xs text-emerald-400 overflow-auto max-h-[550px]">
                <pre>{JSON.stringify(template, null, 2)}</pre>
              </div>
            ) : (
              /* High-fidelity interactive mockup window */
              <div 
                className={`bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 mx-auto ${
                  viewPortMode === "mobile" ? "max-w-[360px]" : "w-full"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {/* Browser frame heading */}
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-slate-400 text-[11px] font-mono select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="bg-slate-950 px-3 py-1 rounded-md text-[10px] text-slate-400 flex items-center gap-1 max-w-[220px] truncate">
                    <Globe className="h-3 w-3 text-cyan-500 shrink-0" />
                    <span>https://{brandProfile?.brandName.toLowerCase().replace(/[^a-z0-9]/g, "") || "preview"}.pages.dev</span>
                  </div>
                  <div className="w-8" />
                </div>

                {/* Simulated landing HTML body */}
                <div className="bg-slate-950 max-h-[500px] overflow-y-auto custom-scroll text-slate-300 relative">
                  
                  {/* Web Header */}
                  <div className="sticky top-0 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeAccent }} />
                      {brandProfile?.brandName || "Company Core"}
                    </span>
                    <button 
                      className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg text-slate-100 hover:opacity-85"
                      style={{ backgroundColor: activeAccent, color: "#030712" }}
                    >
                      {template.heroButtonText}
                    </button>
                  </div>

                  {/* Web Hero banner */}
                  <div className="px-6 py-12 text-center space-y-4 relative overflow-hidden bg-gradient-to-b from-slate-900/40 via-transparent to-transparent">
                    {/* Visual gradient node background */}
                    <div 
                      className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 blur-3xl opacity-15"
                      style={{ backgroundColor: activeAccent }}
                    />

                    <h1 
                      className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight max-w-lg mx-auto"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {template.heroHeader}
                    </h1>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      {template.subtitle}
                    </p>
                    <div className="pt-2">
                      <button 
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl text-slate-950 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                        style={{ backgroundColor: activeAccent, color: "#030712" }}
                      >
                        <span>{template.heroButtonText}</span>
                        <ArrowRight className="h-3.5 w-3.5 font-bold" />
                      </button>
                    </div>
                  </div>

                  {/* Features panel */}
                  <div className="px-6 py-8 border-t border-slate-900 bg-slate-950/50 space-y-4">
                    <div className="text-center">
                      <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Core Platform Pillars</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {template.features.map((feature, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-900 flex flex-col justify-between space-y-2 text-left">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" style={{ color: activeAccent }} />
                            <h5 className="text-[11px] font-bold text-white transition">{feature.title}</h5>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="px-6 py-8 border-t border-slate-900 space-y-4">
                    <div className="text-center">
                      <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">OBJECTION DISMISSALS</span>
                    </div>
                    <div className="space-y-2.5">
                      {template.faqs.map((faq, i) => (
                        <div key={i} className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl space-y-1">
                          <h6 className="text-[11px] font-bold text-slate-200 italic">Q: {faq.question}</h6>
                          <p className="text-[10px] text-slate-400 leading-relaxed">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA block */}
                  <div className="px-6 py-10 border-t border-slate-900 text-center space-y-3 bg-gradient-to-t from-slate-900/40 to-transparent">
                    <h3 className="text-base font-bold text-white">{template.ctaHeader}</h3>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">{template.ctaText}</p>
                    <div className="pt-2">
                      <input 
                        type="email" 
                        placeholder="Enter your email to align..." 
                        className="text-[11px] rounded-l-lg bg-slate-950 border border-slate-800 p-2 text-slate-200 outline-none w-44 focus:border-slate-700"
                        disabled
                      />
                      <button 
                        className="text-[11px] font-bold px-3 py-2 rounded-r-lg hover:opacity-90 inline-block align-top"
                        style={{ backgroundColor: activeAccent, color: "#030712" }}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>

                  {/* Web Footer */}
                  <div className="px-6 py-4 border-t border-slate-900 flex items-center justify-between text-[9px] text-slate-500 bg-slate-950">
                    <span>© 2026 {brandProfile?.brandName || "Company"}. Alignment secure.</span>
                    <div className="flex gap-2">
                      <span>Twitter</span>
                      <span>LinkedIn</span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
