import React, { useState } from "react";
import { Sparkles, Loader2, Check, RefreshCw, Eye, Sliders, Palette, Trash2, HelpCircle } from "lucide-react";
import { BrandProfile } from "../types";

interface BrandConfiguratorProps {
  brandProfile: BrandProfile | null;
  onProfileChange: (profile: BrandProfile | null) => void;
}

export default function BrandConfigurator({ brandProfile, onProfileChange }: BrandConfiguratorProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/extract-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleText: inputText }),
      });

      if (!response.ok) {
        throw new Error(`Failed to extract voice (Status ${response.status})`);
      }

      const data: BrandProfile = await response.json();
      onProfileChange(data);
      setInputText(""); // Reset text field after successful extraction
    } catch (err: any) {
      setError(err?.message || "Brand analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    onProfileChange(null);
    setError(null);
  };

  return (
    <div id="brand-voice-configurator-container" className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header ribbon */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-slate-950 font-bold">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              1-Click Brand Persona & Visual Voice Extractor
            </h3>
            <p className="text-xs text-slate-400">
              Paste raw copy, bio, or website fragments. AI decodes voice guidelines & brand color schemes.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
        >
          {isExpanded ? "Collapse" : "Configure"}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {!brandProfile ? (
            /* Blank state: Run Extractor */
            <form onSubmit={handleExtract} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Paste existing sample content, website bio, or raw brand details:
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. 'I am an executive systems coach. I help fast-scaling B2B agencies and bootstrap founders build automated scaling platforms. We use sharp, zero-fluff text diagrams, bold metrics, and elegant high-contrast layout accents.'"
                  className="w-full h-28 rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5" />
                  No tedious questions: Decodes design layout & tone in 1 click
                </span>
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs px-5 py-2.5 transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Extracting Identity...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Scan & Sync Brand Voice</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-400 mt-2 bg-red-950/20 p-2.5 rounded-lg border border-red-900/40">
                  ⚠️ {error}
                </p>
              )}
            </form>
          ) : (
            /* Active state: Display Decoded Identity details */
            <div className="space-y-5 animate-fadeIn">
              <div className="flex flex-wrap items-start justify-between gap-4 p-4 bg-slate-950/50 border border-cyan-900/30 rounded-xl relative overflow-hidden">
                {/* Background ambient accent */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 transition-all duration-300"
                  style={{ backgroundColor: brandProfile.accentColor }}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-2.5 w-2.5 rounded-full animate-ping" style={{ backgroundColor: brandProfile.accentColor }} />
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">ACTIVE VOICE SYNCHRONIZATION</span>
                  </div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    {brandProfile.brandName}
                  </h4>
                  <p className="text-xs text-slate-400 italic font-medium">"{brandProfile.tagline}"</p>
                </div>

                <button
                  onClick={handleClear}
                  className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-red-900/55 transition"
                  title="Remove synchronized persona"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Unsync Identity</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tone and Audience */}
                <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl">
                  <div>
                    <h5 className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                      Linguistic Voice Tone
                    </h5>
                    <p className="text-xs text-slate-200 font-medium mt-1">
                      {brandProfile.voiceTone}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                      Target Audience Profile
                    </h5>
                    <p className="text-xs text-slate-300 mt-1">
                      {brandProfile.targetAudience}
                    </p>
                  </div>
                </div>

                {/* Theme & Palette Swatches */}
                <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl">
                  <h5 className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    Color Code Palette
                  </h5>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex gap-2 items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div 
                        className="h-6 w-6 rounded-md shadow" 
                        style={{ backgroundColor: brandProfile.accentColor }}
                      />
                      <div className="text-left">
                        <span className="block text-[9px] text-slate-400 font-mono">Accent</span>
                        <span className="block text-xs font-mono font-bold text-white">{brandProfile.accentColor}</span>
                      </div>
                    </div>

                    <div className="flex-1 flex gap-2 items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div 
                        className="h-6 w-6 rounded-md shadow" 
                        style={{ backgroundColor: brandProfile.secondaryColor }}
                      />
                      <div className="text-left">
                        <span className="block text-[9px] text-slate-400 font-mono">Secondary</span>
                        <span className="block text-xs font-mono font-bold text-white">{brandProfile.secondaryColor}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-slate-500">
                    * The application styles and repurposing routines dynamically conform to this palette.
                  </div>
                </div>
              </div>

              {/* Vocabulary & prohibited tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/20 border border-slate-800 rounded-xl space-y-2">
                  <h5 className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Signature Vocabulary
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {brandProfile.vocabulary.map((vocab, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-900/30">
                        {vocab}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/20 border border-slate-800 rounded-xl space-y-2">
                  <h5 className="text-[10px] font-mono font-bold uppercase text-red-400 tracking-wider flex items-center gap-1">
                    <span className="text-red-400 font-bold text-xs">✕</span>
                    Prohibited terms (Strict Filter)
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {brandProfile.prohibitedWords.map((word, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-red-950/40 text-red-300 border border-red-900/30 line-through">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio block suggestion */}
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                <h5 className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                  Polished Core Bio Paragraph (Auto-Extracted)
                </h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {brandProfile.suggestedBioUsable}
                </p>
              </div>

              {/* Calibration hint row */}
              <div className="flex items-center gap-2 text-xs text-cyan-400/90 bg-cyan-950/20 px-4 py-2.5 rounded-xl border border-cyan-900/30">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>
                  <strong>Success:</strong> Multi-channel output will now generate in <strong>{brandProfile.brandName}'s</strong> unique voice, respecting vocabulary keywords.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
