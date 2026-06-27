import { Sparkles, ArrowUpRight, HelpCircle, Flame, Server, ShieldCheck, Coins, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Header() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  const logoImg = "https://i.imgur.com/pxLNBDg.jpeg";

  return (
    <header id="app-header" className="border-b border-slate-800 bg-slate-950 px-6 py-6 text-white relative overflow-hidden">
      {/* Light background leak glow */}
      <div className="absolute top-0 right-1/4 w-96 h-28 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 left-10 w-96 h-16 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            {/* Cool glowing mascot badge */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 opacity-75 blur-md group-hover:opacity-100 transition duration-1000 animate-pulse" />
              <img 
                src={logoImg} 
                alt="CapyStack Logo" 
                className="relative h-20 w-20 rounded-full border-2 border-slate-900 object-cover shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded-full font-black font-mono tracking-tighter uppercase whitespace-nowrap shadow-md">
                CAPY ACTIVE 🐾
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="flex h-7 px-3 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase font-mono tracking-wider shadow-lg shadow-amber-500/10 animate-bounce">
                  CapyStack AI 🐾
                </span>
                <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase font-mono flex items-center gap-1">
                  <span>⚡</span> AI Content Engine Activated
                </span>
              </div>
              
              <h1 className="mt-2.5 font-sans text-3xl font-black tracking-tight text-white md:text-5xl flex flex-wrap items-center justify-center md:justify-start gap-x-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 font-extrabold uppercase tracking-tight">CapyStack</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 font-extrabold">AI</span>
                <span className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold font-mono tracking-wide mt-1 md:mt-0">
                  THE CHILLEST STACK COLLAPSER
                </span>
              </h1>
              
              <p className="mt-2 text-sm text-slate-450 max-w-3xl leading-relaxed">
                The ultimate 5-in-1 viral workspace built for creators: models brand voice profiles, crawls local Google Maps business nodes, builds instant conversion-optimized websites, drafts multi-channel copy, and scans SEO citations.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 font-mono text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">GEO Node: Ready</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-indigo-950/40 border border-indigo-900/50 px-3.5 py-2 text-xs text-indigo-300 animate-pulse">
              <Server className="h-4 w-4" />
              <span>Webhooks, API &amp; MCP Academy</span>
            </div>
          </div>
        </div>

        {/* Education Highlight Board */}
        <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-slate-900/60 border border-slate-800 p-4 md:grid-cols-3">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-950 text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">What is GEO?</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Generative Engine Optimization ensures Gemini, Claude, and ChatGPT cite and promote your brand in AI search result summaries.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Competitor Deep Analysis</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Analyze keywords, trace competitor authority sources (Reddit, Substack feeds), and locate gaps that you can exploit.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-950 text-indigo-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">API &amp; Webhook Academy</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Unlock our exclusive blueprint on Webhooks, APIs, and the Model Context Protocol (MCP) to orchestrate ultra-lean real-time workflows.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-all"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
