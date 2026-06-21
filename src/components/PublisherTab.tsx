import React, { useState, useEffect } from "react";
import { Loader2, Zap, Send, Copy, Check, Terminal, ExternalLink, HelpCircle, FileJson, Twitter, Linkedin, BookOpen, Sparkles } from "lucide-react";
import { RepurposeResult, BrandProfile } from "../types";
import BrandConfigurator from "./BrandConfigurator";

interface PublisherTabProps {
  onRepurpose: (text: string, title: string, profileVal?: BrandProfile | null) => Promise<RepurposeResult | null>;
  initialData: RepurposeResult | null;
  brandProfile: BrandProfile | null;
  onBrandProfileChange: (profile: BrandProfile | null) => void;
}

export default function PublisherTab({ onRepurpose, initialData, brandProfile, onBrandProfileChange }: PublisherTabProps) {
  const [originalText, setOriginalText] = useState("");
  const [coreTopic, setCoreTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RepurposeResult | null>(initialData);
  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>({});
  const [activeSubTab, setActiveSubTab] = useState<"threads" | "linkedin" | "medium" | "developer_vps">("threads");
  const [error, setError] = useState<string | null>(null);

  // Keep result synchronized with initialData changes (e.g. when template demo loads)
  useEffect(() => {
    setResult(initialData);
    if (initialData) {
      setOriginalText(initialData.originalText || "");
      setCoreTopic(initialData.title || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await onRepurpose(originalText, coreTopic, brandProfile);
      if (data) {
        setResult(data);
      } else {
        setError("Could not auto-generate multi-channel publications.");
      }
    } catch (err: any) {
      setError(err?.message || "Content transformation error.");
    } finally {
      setLoading(false);
    }
  };

  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedState(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <div id="publisher-tab-workspace" className="space-y-6 text-slate-100">
      {/* Brand Configurator (Identity & Colors decoder) */}
      <BrandConfigurator
        brandProfile={brandProfile}
        onProfileChange={onBrandProfileChange}
      />

      {/* Intro section */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🚀</span> Omni-Social Auto-Publisher
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Transform a simple blog concept or a single sentence into highly viral, platform-native narratives. Learn how to fire content dynamically via custom webhooks, n8n pipelines, and Model Context Protocol (MCP) clients.
        </p>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Core Topic / Focus Angle
              </label>
              <input
                type="text"
                value={coreTopic}
                onChange={(e) => setCoreTopic(e.target.value)}
                placeholder="e.g. AI Agency scale-up, or 'passive SaaS growth'"
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Primary Idea or Raw Draft
              </label>
              <input
                type="text"
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="What is the core message or thesis of your post?"
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-slate-950 transition disabled:opacity-50 hover:opacity-90"
              style={brandProfile ? { backgroundColor: brandProfile.accentColor } : { backgroundColor: "#6366f1" }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Platform Layouts...</span>
                </>
              ) : (
                <>
                  {brandProfile ? <Sparkles className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                  <span>
                    {brandProfile ? `Synthesize as ${brandProfile.brandName}` : "Synthesize Viral Campaign"}
                  </span>
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

      {/* Results split layout */}
      {result && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left panel: Quick hooks and campaign info */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 h-fit space-y-6">
            <div>
              <span className="text-xs font-mono text-indigo-400 tracking-wider">CREATOR BLUEPRINT ACTIVATED</span>
              <h3 className="text-xl font-bold text-white mt-1">{result.title}</h3>
              <p className="text-xs text-slate-400 mt-2">
                This campaign focuses heavily on viral hooks. Below are high-performing psychological triggers tailored to your focus:
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Viral Angles</h4>
              <div className="space-y-2">
                {result.marketingHooks.map((hook, hIdx) => (
                  <div key={hIdx} className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-xs leading-normal">
                    <span className="text-teal-400 font-bold block mb-0.5">Angle {hIdx+1}:</span>
                    "{hook}"
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Tabbed multichannel layouts */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col min-h-[500px]">
            {/* Sub-navigation tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveSubTab("threads")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeSubTab === "threads" ? "bg-slate-100 text-slate-950" : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                <Twitter className="h-3.5 w-3.5" />
                <span>X / Twitter Thread</span>
              </button>

              <button
                onClick={() => setActiveSubTab("linkedin")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeSubTab === "linkedin" ? "bg-slate-100 text-slate-950" : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>LinkedIn Insights</span>
              </button>

              <button
                onClick={() => setActiveSubTab("medium")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeSubTab === "medium" ? "bg-slate-100 text-slate-950" : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Medium Essay</span>
              </button>

              <button
                onClick={() => setActiveSubTab("developer_vps")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ${
                  activeSubTab === "developer_vps" ? "bg-indigo-500 text-slate-950" : "bg-indigo-950/40 text-indigo-300 hover:bg-slate-950"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Webhooks, APIs &amp; MCP Academy</span>
              </button>
            </div>

            {/* Tab contents */}
            <div className="mt-5 flex-grow">
              {/* X THREAD */}
              {activeSubTab === "threads" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Threads format automatically restricts posts to 280 chars.</span>
                    <button
                      onClick={() => triggerCopy(result.xThread.map(t => t.text).join("\n\n"), "threads")}
                      className="flex items-center gap-1 px-3 py-1 bg-slate-950 hover:bg-slate-800 rounded-lg text-xs font-mono text-slate-300"
                    >
                      {copiedState["threads"] ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>Copy Entire Thread</span>
                    </button>
                  </div>

                  <div className="space-y-3 mt-2">
                    {result.xThread.map((tweet) => (
                      <div key={tweet.postNumber} className="relative group p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-[10px] font-mono text-slate-500">
                          <span>POST {tweet.postNumber}</span>
                          <span>{tweet.characterCount}/280 Characters</span>
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed font-sans">{tweet.text}</p>
                        <button
                          onClick={() => triggerCopy(tweet.text, `tweet_${tweet.postNumber}`)}
                          className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition p-1 bg-slate-900 hover:bg-slate-800 rounded text-slate-400"
                        >
                          {copiedState[`tweet_${tweet.postNumber}`] ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LINKEDIN */}
              {activeSubTab === "linkedin" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Optimized with clean linebreaks and clear CTA.</span>
                    <button
                      onClick={() => triggerCopy(result.linkedInPost, "linkedin")}
                      className="flex items-center gap-1 px-3 py-1 bg-slate-950 hover:bg-slate-800 rounded-lg text-xs font-mono text-slate-300"
                    >
                      {copiedState["linkedin"] ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>Copy LinkedIn Draft</span>
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
                    <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed select-all">
                      {result.linkedInPost}
                    </pre>
                  </div>
                </div>
              )}

              {/* MEDIUM */}
              {activeSubTab === "medium" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Format ready for blogging platforms or newsletter publications.</span>
                    <button
                      onClick={() => triggerCopy(result.mediumArticle, "medium")}
                      className="flex items-center gap-1 px-3 py-1 bg-slate-950 hover:bg-slate-800 rounded-lg text-xs font-mono text-slate-300"
                    >
                      {copiedState["medium"] ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>Copy Medium Prose</span>
                    </button>
                  </div>

                  <div className="p-5 bg-slate-950 border border-slate-900 rounded-xl leading-relaxed text-sm text-slate-300">
                    <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed select-all">
                      {result.mediumArticle}
                    </pre>
                  </div>
                </div>
              )}

              {/* DEVELOPER WEBHOOK, API & MCP ACADEMY */}
              {activeSubTab === "developer_vps" && (
                <div className="space-y-6">
                  {/* Premium Educational Bonus Panel */}
                  <div className="p-5 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/60 rounded-2xl text-left space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-500 text-slate-950 text-[9px] font-black font-mono px-2 py-0.5 rounded uppercase">
                        🎓 Bonus Core Lesson
                      </span>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight font-sans">
                        Understanding Webhooks, APIs &amp; Model Context Protocol (MCP)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">
                      To collapse expensive subscription software stacks, you must understand the "digital pipes" that connect modern applications. Here is your zero-nonsense guide:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                      <div className="p-3.5 bg-slate-950/80 border border-slate-850 rounded-xl space-y-2">
                        <div className="flex items-center gap-1 text-indigo-400 font-bold uppercase font-mono text-[10px]">
                          <span>🔗</span> 1. Webhooks (Push)
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          <strong>Concept:</strong> "Don't call us, we'll call you." Instead of repeatedly polling an external server for updates, a Webhook automatically pushes real-time JSON event data to your receiver URL the microsecond an event occurs (e.g. Stripe transaction, Lead capture, cold response).
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-950/80 border border-slate-850 rounded-xl space-y-2">
                        <div className="flex items-center gap-1 text-cyan-400 font-bold uppercase font-mono text-[10px]">
                          <span>⚡</span> 2. APIs (Request)
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          <strong>Concept:</strong> A bi-directional system enabling software tools to request data or trigger commands. APIs operate via strict HTTP routines (GET request, POST payload) with Bearer token protection, letting you automatically update database rows or inject brand parameters.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-950/80 border border-slate-850 rounded-xl space-y-2">
                        <div className="flex items-center gap-1 text-emerald-400 font-bold uppercase font-mono text-[10px]">
                          <span>🤖</span> 3. MCP protocol
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          <strong>Concept:</strong> Anthropic's new open-source standard. Model Context Protocol allows secure LLMs (like Claude &amp; Gemini) to connect safely to local directories, custom dev containers, memory cache repositories, and secure system APIs without creating custom brittle backend adapters.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Payload Tools */}
                  <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-xs text-indigo-300 space-y-2 text-left leading-relaxed font-sans">
                    <span className="font-bold flex items-center gap-1 text-sm text-indigo-400 uppercase">
                      <Terminal className="h-4 w-4" /> Live Webhook Schema for: "{result.title}"
                    </span>
                    <p className="text-slate-400 text-xs">
                      Ready to execute across automation suites (like n8n, Make, or custom API endpoints). Fire this structured telemetry schema to instantly automate distribution of your generated brand drafts:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-left">
                      <span className="text-xs text-slate-400 font-medium font-mono">1. JSON Webhook Schema Payload</span>
                      <button
                        onClick={() => triggerCopy(result.webhookPayload, "vps_json")}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 hover:bg-slate-800 rounded text-[11px] font-mono text-slate-400 cursor-pointer"
                      >
                        {copiedState["vps_json"] ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>Copy Payload</span>
                      </button>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl">
                      <pre className="text-[11px] font-mono text-cyan-400 select-all overflow-x-auto text-left">
                        {result.webhookPayload}
                      </pre>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-left">
                      <span className="text-xs text-slate-400 font-medium font-mono">2. Ready-to-Run Terminal Curl Dispatch Snippet</span>
                      <button
                        onClick={() => triggerCopy(result.claudeCodeCommand, "vps_curl")}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 hover:bg-slate-800 rounded text-[11px] font-mono text-slate-400 cursor-pointer"
                      >
                        {copiedState["vps_curl"] ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>Copy Terminal Command</span>
                      </button>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl bg-slate-950">
                      <code className="text-[11px] font-mono text-slate-200 select-all whitespace-pre-wrap block text-left">
                        {result.claudeCodeCommand}
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
