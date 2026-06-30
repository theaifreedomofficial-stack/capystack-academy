import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Bot, Plus, Play, Pause, RefreshCw, CheckCircle, XCircle,
  Clock, Loader2, Send, Linkedin, Twitter, Instagram, Image,
  ChevronDown, ChevronRight, Copy, Download, Zap, RotateCcw,
  AlertTriangle, Sparkles, Calendar, BarChart3, Settings,
  Eye, Trash2, Radio,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Campaign {
  id: string;
  name: string;
  niche: string;
  platforms: string;    // JSON array string
  brand_voice: string;
  frequency: string;
  status: "active" | "paused";
  created_at: string;
  last_run?: string;
  next_run?: string;
}

interface ContentJob {
  id: string;
  campaign_id: string;
  campaign_name?: string;
  niche?: string;
  run_number: number;
  job_status: "running" | "completed" | "error";
  approval_status: "pending" | "approved" | "rejected" | "superseded";
  content_json?: string;    // JSON string
  image_prompts?: string;   // JSON string
  image_files?: string;     // JSON string
  research_notes?: string;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  error_msg?: string;
  created_at: string;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const API = "/api/social";

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.detail || res.statusText);
  }
  return res.json();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
      title="Copy to clipboard"
    >
      {copied ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    running:   "bg-blue-950 text-blue-400 border-blue-800",
    completed: "bg-slate-900 text-slate-400 border-slate-700",
    error:     "bg-rose-950 text-rose-400 border-rose-800",
    pending:   "bg-amber-950 text-amber-400 border-amber-800",
    approved:  "bg-emerald-950 text-emerald-400 border-emerald-800",
    rejected:  "bg-rose-950 text-rose-400 border-rose-800",
    superseded:"bg-slate-900 text-slate-500 border-slate-800",
    active:    "bg-emerald-950 text-emerald-400 border-emerald-800",
    paused:    "bg-slate-900 text-slate-500 border-slate-700",
  };
  const cls = map[status] || "bg-slate-900 text-slate-400 border-slate-800";
  return (
    <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${cls}`}>
      {status}
    </span>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p === "linkedin") return <Linkedin className="h-4 w-4 text-blue-400" />;
  if (p === "instagram") return <Instagram className="h-4 w-4 text-pink-400" />;
  return <Twitter className="h-4 w-4 text-sky-400" />;
}

// ─── Platform content preview cards ──────────────────────────────────────────

function LinkedInPreview({ content }: { content: string }) {
  return (
    <div className="bg-slate-900 border border-blue-800/40 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-950/40 border-b border-blue-800/30">
        <Linkedin className="h-4 w-4 text-blue-400" />
        <span className="text-xs font-bold text-blue-300">LinkedIn</span>
        <span className="ml-auto"><CopyBtn text={content} /></span>
      </div>
      <div className="p-4 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap max-h-[280px] overflow-y-auto">
        {content}
      </div>
    </div>
  );
}

function TwitterPreview({ tweets }: { tweets: string[] }) {
  return (
    <div className="bg-slate-900 border border-sky-800/40 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-sky-950/40 border-b border-sky-800/30">
        <Twitter className="h-4 w-4 text-sky-400" />
        <span className="text-xs font-bold text-sky-300">X / Twitter Thread</span>
        <span className="ml-auto"><CopyBtn text={tweets.join("\n\n")} /></span>
      </div>
      <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto">
        {tweets.map((tweet, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-[9px] font-mono text-slate-600 mt-1 shrink-0 w-4">{i + 1}</span>
            <p className="text-xs text-slate-300 leading-relaxed">{tweet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InstagramPreview({ content }: { content: string }) {
  return (
    <div className="bg-slate-900 border border-pink-800/40 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-pink-950/40 border-b border-pink-800/30">
        <Instagram className="h-4 w-4 text-pink-400" />
        <span className="text-xs font-bold text-pink-300">Instagram</span>
        <span className="ml-auto"><CopyBtn text={content} /></span>
      </div>
      <div className="p-4 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap max-h-[280px] overflow-y-auto">
        {content}
      </div>
    </div>
  );
}

function ImagePromptsCard({ prompts, jobId, onImagesGenerated }: {
  prompts: any[];
  jobId: string;
  onImagesGenerated: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      await apiFetch(`/jobs/${jobId}/images`, { method: "POST" });
      setTimeout(onImagesGenerated, 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-fuchsia-800/40 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-fuchsia-950/40 border-b border-fuchsia-800/30">
        <Image className="h-4 w-4 text-fuchsia-400" />
        <span className="text-xs font-bold text-fuchsia-300">Image Prompts ({prompts.length})</span>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="ml-auto flex items-center gap-1.5 text-[10px] font-bold bg-fuchsia-900/40 hover:bg-fuchsia-800/40 text-fuchsia-300 px-3 py-1 rounded-lg transition"
        >
          {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
          {generating ? "Generating..." : "Generate via ComfyUI"}
        </button>
      </div>
      <div className="p-4 space-y-3 max-h-[220px] overflow-y-auto">
        {error && <p className="text-xs text-rose-400">{error}</p>}
        {prompts.map((p, i) => (
          <div key={i} className="bg-slate-950 rounded-lg p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-fuchsia-400 uppercase">{p.style || `Style ${i + 1}`}</span>
              <span className="text-[9px] text-slate-600 font-mono">{p.width}×{p.height}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{p.prompt}</p>
            {p.negative_prompt && (
              <p className="text-[10px] text-slate-600">Negative: {p.negative_prompt}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Content Job Card (approval queue) ───────────────────────────────────────

function JobCard({ job, onAction, onRefresh }: {
  job: ContentJob;
  onAction: (jobId: string, action: string, notes?: string) => Promise<void>;
  onRefresh: () => void;
}) {
  const [activePlatform, setActivePlatform] = useState<string>("");
  const [actioning, setActioning] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [open, setOpen] = useState(true);

  const content = (() => {
    try { return JSON.parse(job.content_json || "{}"); } catch { return {}; }
  })();
  const imagePrompts = (() => {
    try { return JSON.parse(job.image_prompts || "[]"); } catch { return []; }
  })();
  const imageFiles = (() => {
    try { return JSON.parse(job.image_files || "[]"); } catch { return []; }
  })();

  const platforms = Object.keys(content).filter(k => k !== "raw" && content[k]);
  useEffect(() => {
    if (platforms.length > 0 && !activePlatform) setActivePlatform(platforms[0]);
  }, [platforms]);

  const handleAction = async (action: string) => {
    setActioning(action);
    try {
      await onAction(job.id, action, action === "reject" ? rejectNote : undefined);
      if (action !== "reject") onRefresh();
    } finally {
      setActioning(null);
      setShowRejectInput(false);
    }
  };

  const isRunning = job.job_status === "running";
  const isError = job.job_status === "error";
  const isPending = job.approval_status === "pending" && !isRunning && !isError;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Card header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-800/40 transition text-left"
      >
        <div className="flex items-center gap-2 flex-grow min-w-0">
          <span className="text-xs font-black text-white truncate">{job.campaign_name || "Campaign"}</span>
          <span className="text-[10px] text-slate-500 font-mono shrink-0">Run #{job.run_number}</span>
          <StatusBadge status={isRunning ? "running" : isError ? "error" : job.approval_status} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {platforms.map(p => <React.Fragment key={p}><PlatformIcon platform={p} /></React.Fragment>)}
          <span className="text-[10px] text-slate-500 font-mono">{job.created_at?.slice(0, 10)}</span>
          {open ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-800 p-5 space-y-5">

          {/* Running state */}
          {isRunning && (
            <div className="flex items-center gap-4 bg-blue-950/20 border border-blue-800/30 rounded-xl p-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Agents working...</p>
                <p className="text-xs text-slate-400">Researcher → Writer → Visual Director → Reviewer</p>
              </div>
              <button onClick={onRefresh} className="ml-auto p-2 text-slate-400 hover:text-white transition">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="bg-rose-950/20 border border-rose-800/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                <p className="text-sm font-bold text-rose-300">Generation failed</p>
              </div>
              <p className="text-xs text-slate-400 font-mono">{job.error_msg}</p>
              <button
                onClick={() => handleAction("regenerate")}
                disabled={!!actioning}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />Retry Generation
              </button>
            </div>
          )}

          {/* Research notes */}
          {job.research_notes && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-[9px] font-mono font-black text-amber-400 uppercase mb-1.5">Research Summary</p>
              <p className="text-xs text-slate-300 leading-relaxed">{job.research_notes}</p>
            </div>
          )}

          {/* Platform tabs + content */}
          {platforms.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {platforms.map(p => (
                  <button
                    key={p}
                    onClick={() => setActivePlatform(p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activePlatform === p
                        ? "bg-slate-700 text-white"
                        : "bg-slate-950 text-slate-500 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <PlatformIcon platform={p} />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
                {imagePrompts.length > 0 && (
                  <button
                    onClick={() => setActivePlatform("__images__")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activePlatform === "__images__"
                        ? "bg-fuchsia-900 text-fuchsia-200"
                        : "bg-slate-950 text-slate-500 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Image className="h-3.5 w-3.5" />
                    Images ({imagePrompts.length})
                  </button>
                )}
              </div>

              {activePlatform === "linkedin" && content.linkedin && (
                <LinkedInPreview content={content.linkedin} />
              )}
              {(activePlatform === "twitter" || activePlatform === "x") && (
                Array.isArray(content[activePlatform])
                  ? <TwitterPreview tweets={content[activePlatform]} />
                  : <TwitterPreview tweets={(content[activePlatform] || "").split("\n").filter(Boolean)} />
              )}
              {activePlatform === "instagram" && content.instagram && (
                <InstagramPreview content={content.instagram} />
              )}
              {activePlatform === "__images__" && (
                <ImagePromptsCard
                  prompts={imagePrompts}
                  jobId={job.id}
                  onImagesGenerated={onRefresh}
                />
              )}
              {content.raw && activePlatform === platforms[0] && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-60 overflow-y-auto">
                  <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Raw Output</p>
                  <pre className="text-[11px] text-slate-400 whitespace-pre-wrap">{content.raw}</pre>
                </div>
              )}
            </div>
          )}

          {/* Generated images */}
          {imageFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-[9px] font-mono font-black text-fuchsia-400 uppercase">Generated Images</p>
              <div className="flex gap-3 flex-wrap">
                {imageFiles.map((path: string, i: number) => {
                  const filename = path.split("/").pop();
                  const url = `/api/social/images/${filename}`;
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative h-20 w-20 rounded-lg overflow-hidden border border-slate-800 hover:border-fuchsia-500 transition"
                    >
                      <img src={url} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Approval notes from AI */}
          {job.approval_notes && (
            <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-3">
              <p className="text-[9px] font-mono font-black text-amber-400 uppercase mb-1">AI Reviewer Notes</p>
              <p className="text-xs text-amber-200/80">{job.approval_notes}</p>
            </div>
          )}

          {/* Human approval actions */}
          {isPending && (
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <p className="text-[10px] text-slate-500 font-mono uppercase font-black">Human Approval Gate</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAction("approve")}
                  disabled={!!actioning}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow disabled:opacity-40"
                >
                  {actioning === "approve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                  Approve & Queue for Posting
                </button>

                <button
                  onClick={() => handleAction("regenerate")}
                  disabled={!!actioning}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition disabled:opacity-40"
                >
                  {actioning === "regenerate" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                  Regenerate
                </button>

                <button
                  onClick={() => setShowRejectInput(!showRejectInput)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 font-bold text-xs rounded-xl border border-rose-800/40 transition"
                >
                  <XCircle className="h-3.5 w-3.5" />Reject
                </button>
              </div>

              {showRejectInput && (
                <div className="flex gap-2">
                  <input
                    value={rejectNote}
                    onChange={e => setRejectNote(e.target.value)}
                    placeholder="Optional: reason for rejection..."
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-rose-400"
                  />
                  <button
                    onClick={() => handleAction("reject")}
                    disabled={!!actioning}
                    className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition"
                  >
                    Confirm Reject
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Already processed */}
          {(job.approval_status === "approved" || job.approval_status === "rejected") && (
            <div className={`border-t border-slate-800 pt-3 flex items-center gap-2 text-xs ${
              job.approval_status === "approved" ? "text-emerald-400" : "text-rose-400"
            }`}>
              {job.approval_status === "approved"
                ? <><CheckCircle className="h-4 w-4" /> Approved by {job.approved_by} on {job.approved_at?.slice(0, 10)}</>
                : <><XCircle className="h-4 w-4" /> Rejected — {job.approval_notes || "No reason given"}</>
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Create Campaign Modal ────────────────────────────────────────────────────

const PLATFORM_OPTIONS = ["linkedin", "twitter", "instagram"];
const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily (8am UTC)" },
  { value: "2x-daily", label: "2× Daily (8am + 8pm)" },
  { value: "3x-daily", label: "3× Daily (8am, 1pm, 7pm)" },
  { value: "weekly", label: "Weekly (Mon 8am)" },
  { value: "test-5min", label: "Every 5 min (testing only)" },
];

function CreateCampaignModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: () => void;
}) {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["linkedin", "twitter"]);
  const [brandVoice, setBrandVoice] = useState("professional, data-driven, and engaging");
  const [frequency, setFrequency] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !niche || platforms.length === 0) {
      setError("Name, niche, and at least one platform are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiFetch("/campaigns", {
        method: "POST",
        body: JSON.stringify({ name, niche, platforms, brand_voice: brandVoice, frequency }),
      });
      onCreate();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in-up"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-black text-white font-mono uppercase">New Campaign</h3>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-white text-xs font-mono">✕ Cancel</button>
        </div>

        {error && (
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl px-4 py-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-black text-slate-400 uppercase">Campaign Name</label>
            <input
              required value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. AI for Small Businesses — Weekly"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-black text-slate-400 uppercase">Niche / Topic</label>
            <input
              required value={niche} onChange={e => setNiche(e.target.value)}
              placeholder="e.g. AI automation for small businesses"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-black text-slate-400 uppercase">Platforms</label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORM_OPTIONS.map(p => {
                const selected = platforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition border ${
                      selected
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:text-white"
                    }`}
                  >
                    <PlatformIcon platform={p} />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                    {selected && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-black text-slate-400 uppercase">Brand Voice</label>
            <input
              value={brandVoice} onChange={e => setBrandVoice(e.target.value)}
              placeholder="e.g. professional, data-driven, no-fluff"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-black text-slate-400 uppercase">Posting Frequency</label>
            <select
              value={frequency} onChange={e => setFrequency(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
            >
              {FREQUENCY_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs py-3.5 rounded-xl transition shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
          {loading ? "Launching agents..." : "Create Campaign & Start First Run"}
        </button>
      </form>
    </div>
  );
}

// ─── Campaign List Panel ──────────────────────────────────────────────────────

function CampaignsPanel({ campaigns, loading, onPause, onResume, onRunNow, onRefresh }: {
  campaigns: Campaign[];
  loading: boolean;
  onPause: (id: string) => Promise<void>;
  onResume: (id: string) => Promise<void>;
  onRunNow: (id: string) => Promise<void>;
  onRefresh: () => void;
}) {
  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-600" /></div>;
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <Bot className="h-12 w-12 text-slate-700 mx-auto" />
        <p className="text-sm text-slate-400">No campaigns yet. Create one to start generating content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {campaigns.map(c => {
        const platforms = (() => { try { return JSON.parse(c.platforms); } catch { return []; } })();
        return (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white">{c.name}</h4>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-xs text-slate-400">{c.niche}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onRunNow(c.id)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-cyan-900/40 hover:bg-cyan-800/40 text-cyan-300 rounded-xl border border-cyan-800/40 transition"
                  title="Run now"
                >
                  <Play className="h-3.5 w-3.5" />Run Now
                </button>
                {c.status === "active" ? (
                  <button
                    onClick={() => onPause(c.id)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
                    title="Pause campaign"
                  >
                    <Pause className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onResume(c.id)}
                    className="p-2 bg-emerald-900/40 hover:bg-emerald-800/40 text-emerald-400 rounded-xl border border-emerald-800/40 transition"
                    title="Resume campaign"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="bg-slate-950 rounded-lg px-3 py-2 space-y-0.5">
                <span className="block text-slate-500 text-[9px] uppercase">Platforms</span>
                <div className="flex gap-1">{platforms.map((p: string) => <React.Fragment key={p}><PlatformIcon platform={p} /></React.Fragment>)}</div>
              </div>
              <div className="bg-slate-950 rounded-lg px-3 py-2 space-y-0.5">
                <span className="block text-slate-500 text-[9px] uppercase">Frequency</span>
                <span className="text-white">{c.frequency}</span>
              </div>
              <div className="bg-slate-950 rounded-lg px-3 py-2 space-y-0.5">
                <span className="block text-slate-500 text-[9px] uppercase">Last Run</span>
                <span className="text-white">{c.last_run ? c.last_run.slice(0, 10) : "Never"}</span>
              </div>
              <div className="bg-slate-950 rounded-lg px-3 py-2 space-y-0.5">
                <span className="block text-slate-500 text-[9px] uppercase">Next Run</span>
                <span className="text-cyan-400">{c.next_run ? c.next_run.slice(0, 10) : "Pending"}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-600 font-mono">
              Voice: {c.brand_voice} · Created {c.created_at?.slice(0, 10)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Tab Component ───────────────────────────────────────────────────────

type SubTab = "campaigns" | "queue" | "history";

export default function SocialMediaAgentTab() {
  const [subTab, setSubTab] = useState<SubTab>("queue");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pendingJobs, setPendingJobs] = useState<ContentJob[]>([]);
  const [historyJobs, setHistoryJobs] = useState<ContentJob[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── API health check ──────────────────────────────────────────────────────

  const checkHealth = useCallback(async () => {
    try {
      await apiFetch<any>("/health");
      setApiOnline(true);
    } catch {
      setApiOnline(false);
    }
  }, []);

  // ── Data fetchers ─────────────────────────────────────────────────────────

  const fetchCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    try {
      const data = await apiFetch<Campaign[]>("/campaigns");
      setCampaigns(data);
    } catch {
      setCampaigns([]);
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  const fetchQueue = useCallback(async () => {
    setQueueLoading(true);
    try {
      // Pending + running jobs
      const pending = await apiFetch<ContentJob[]>("/jobs?approval_status=pending&limit=30");
      const running = await apiFetch<ContentJob[]>("/jobs?limit=10");
      const runningOnly = running.filter(j => j.job_status === "running" && j.approval_status === "pending");
      // Merge unique
      const merged = [...pending];
      runningOnly.forEach(j => { if (!merged.find(m => m.id === j.id)) merged.push(j); });
      merged.sort((a, b) => b.created_at.localeCompare(a.created_at));
      setPendingJobs(merged);
    } catch {
      setPendingJobs([]);
    } finally {
      setQueueLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await apiFetch<ContentJob[]>("/jobs?limit=50");
      setHistoryJobs(data.filter(j => ["approved", "rejected", "superseded"].includes(j.approval_status)));
    } catch {
      setHistoryJobs([]);
    }
  }, []);

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    checkHealth();
    fetchCampaigns();
    fetchQueue();
    fetchHistory();
  }, []);

  // Poll every 8s for queue updates (catches running jobs completing)
  useEffect(() => {
    pollRef.current = setInterval(() => {
      if (pendingJobs.some(j => j.job_status === "running")) {
        fetchQueue();
      }
    }, 8000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [pendingJobs, fetchQueue]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleJobAction = async (jobId: string, action: string, notes?: string) => {
    await apiFetch(`/jobs/${jobId}/approve`, {
      method: "POST",
      body: JSON.stringify({ action, notes }),
    });
    await fetchQueue();
    await fetchHistory();
  };

  const handlePause = async (campaignId: string) => {
    await apiFetch(`/campaigns/${campaignId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "paused" }),
    });
    await fetchCampaigns();
  };

  const handleResume = async (campaignId: string) => {
    await apiFetch(`/campaigns/${campaignId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "active" }),
    });
    await fetchCampaigns();
  };

  const handleRunNow = async (campaignId: string) => {
    await apiFetch(`/campaigns/${campaignId}/run`, { method: "POST" });
    setSubTab("queue");
    setTimeout(fetchQueue, 1000);
  };

  // ── Stats for hero ────────────────────────────────────────────────────────

  const activeCampaigns = campaigns.filter(c => c.status === "active").length;
  const pendingCount = pendingJobs.filter(j => j.job_status === "completed" && j.approval_status === "pending").length;
  const approvedCount = historyJobs.filter(j => j.approval_status === "approved").length;
  const runningCount = pendingJobs.filter(j => j.job_status === "running").length;

  return (
    <div className="space-y-6">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-6 md:p-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/6 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-cyan-400 text-slate-950 font-mono text-[10px] font-black uppercase rounded-full tracking-wider shadow-lg">
                Multi-Agent Content System 🤖
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                apiOnline === true ? "text-emerald-400 bg-emerald-950/40 border border-emerald-800/50"
                : apiOnline === false ? "text-rose-400 bg-rose-950/40 border border-rose-800/50"
                : "text-slate-500 bg-slate-900 border border-slate-800"
              }`}>
                {apiOnline === true ? "● Agent API Online" : apiOnline === false ? "● Agent API Offline" : "● Checking..."}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Social Media Content Agent
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Autonomous CrewAI agents (Researcher → Writer → Visual Director → Reviewer) generate
              platform-native content for LinkedIn, X, and Instagram — powered entirely by Ollama/Qwen locally.
              Human approval required before any post goes live.
            </p>
          </div>

          <div className="shrink-0 grid grid-cols-2 gap-2">
            {[
              { label: "Active Campaigns", value: activeCampaigns, color: "text-cyan-400" },
              { label: "Awaiting Approval", value: pendingCount, color: "text-amber-400" },
              { label: "Running Now", value: runningCount, color: "text-blue-400" },
              { label: "Approved Posts", value: approvedCount, color: "text-emerald-400" },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center">
                <span className={`block text-xl font-black ${stat.color}`}>{stat.value}</span>
                <span className="block text-[9px] text-slate-500 font-mono">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent pipeline visual */}
        <div className="mt-5 pt-4 border-t border-slate-800 relative z-10">
          <div className="flex items-center gap-1 flex-wrap text-[10px] font-mono text-slate-500">
            <span className="text-slate-400 font-bold mr-1">Agent Pipeline:</span>
            {[
              { name: "Trend Researcher", color: "text-amber-400" },
              { name: "Content Writer", color: "text-cyan-400" },
              { name: "Visual Director", color: "text-fuchsia-400" },
              { name: "Quality Reviewer", color: "text-emerald-400" },
            ].map((agent, i, arr) => (
              <React.Fragment key={agent.name}>
                <span className={`px-2 py-0.5 rounded bg-slate-900 border border-slate-800 ${agent.color} font-bold`}>
                  {agent.name}
                </span>
                {i < arr.length - 1 && <span className="text-slate-700">→</span>}
              </React.Fragment>
            ))}
            <span className="text-slate-700 ml-1">→</span>
            <span className="px-2 py-0.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300 font-bold">
              Human Approval
            </span>
            <span className="text-slate-700">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              Activepieces Posting
            </span>
          </div>
        </div>
      </div>

      {/* API offline warning */}
      {apiOnline === false && (
        <div className="bg-rose-950/20 border border-rose-800/40 rounded-2xl p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-bold text-rose-300">Social Agent API is offline</p>
            <p className="text-xs text-slate-400">
              The Python FastAPI service is not running on <code className="text-cyan-400">/api/social</code>.
              Start it with: <code className="text-emerald-400">docker compose -f docker-compose.yml -f docker-compose.social.yml up -d social-agent</code>
            </p>
          </div>
        </div>
      )}

      {/* Nav + Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {(["queue", "campaigns", "history"] as SubTab[]).map(tab => {
            const labels: Record<SubTab, string> = {
              queue: `Approval Queue${pendingCount > 0 ? ` (${pendingCount})` : ""}`,
              campaigns: "Campaigns",
              history: "History",
            };
            const icons: Record<SubTab, React.ReactNode> = {
              queue: <Radio className="h-3.5 w-3.5" />,
              campaigns: <Settings className="h-3.5 w-3.5" />,
              history: <BarChart3 className="h-3.5 w-3.5" />,
            };
            return (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  subTab === tab
                    ? "bg-slate-800 text-white border border-slate-700 shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {icons[tab]}{labels[tab]}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />New Campaign
        </button>
      </div>

      {/* Content panels */}
      {subTab === "campaigns" && (
        <CampaignsPanel
          campaigns={campaigns}
          loading={campaignsLoading}
          onPause={handlePause}
          onResume={handleResume}
          onRunNow={handleRunNow}
          onRefresh={fetchCampaigns}
        />
      )}

      {subTab === "queue" && (
        <div className="space-y-4">
          {queueLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
            </div>
          ) : pendingJobs.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-slate-900 border border-slate-800 rounded-2xl">
              <CheckCircle className="h-12 w-12 text-slate-700 mx-auto" />
              <p className="text-sm text-slate-400">No content waiting for approval.</p>
              <p className="text-xs text-slate-600">
                Create a campaign or click "Run Now" on an existing campaign to generate content.
              </p>
            </div>
          ) : (
            pendingJobs.map(job => (
              <React.Fragment key={job.id}>
                <JobCard
                  job={job}
                  onAction={handleJobAction}
                  onRefresh={fetchQueue}
                />
              </React.Fragment>
            ))
          )}
        </div>
      )}

      {subTab === "history" && (
        <div className="space-y-2">
          {historyJobs.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">No history yet.</div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] text-[9px] font-mono font-black text-slate-500 uppercase px-5 py-3 border-b border-slate-800">
                <span>Campaign / Niche</span>
                <span>Platforms</span>
                <span>Run</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {historyJobs.map(job => {
                const content = (() => { try { return JSON.parse(job.content_json || "{}"); } catch { return {}; } })();
                const platforms = Object.keys(content).filter(k => k !== "raw" && content[k]);
                return (
                  <div key={job.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-5 py-3 border-b border-slate-800/50 hover:bg-slate-800/20 transition text-xs">
                    <div>
                      <p className="font-bold text-white truncate">{job.campaign_name}</p>
                      <p className="text-slate-500 text-[10px] truncate">{job.niche}</p>
                    </div>
                    <div className="flex gap-1 items-center">
                      {platforms.map(p => <React.Fragment key={p}><PlatformIcon platform={p} /></React.Fragment>)}
                    </div>
                    <span className="text-slate-400 font-mono">#{job.run_number}</span>
                    <span><StatusBadge status={job.approval_status} /></span>
                    <span className="text-slate-500 font-mono">{job.created_at?.slice(0, 10)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create campaign modal */}
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => { fetchCampaigns(); fetchQueue(); setSubTab("queue"); }}
        />
      )}
    </div>
  );
}
