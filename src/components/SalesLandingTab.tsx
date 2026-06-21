import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Volume2, 
  Maximize2,
  BookOpen,
  Award,
  Zap,
  Flame,
  FileText,
  DollarSign,
  Heart,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export default function SalesLandingTab() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [activePlanActivated, setActivePlanActivated] = useState<string>(() => {
    try {
      return localStorage.getItem("capystack_active_plan") || "No plan active";
    } catch {
      return "No plan active";
    }
  });

  const [leadPage, setLeadPage] = useState(0);
  const [claimedTrial, setClaimedTrial] = useState(false);

  const leadMagnetPages = [
    {
      chapter: "Chapter 1: The Raw Time Leak",
      content: "Traditional video filming and publishing is a hidden leakage container in your business. Most coaching founders and agencies loose between 15 to 20 hours every single week editing tracks, recording re-takes, struggling with microphones, and managing video processing. Spending your highly leveraged brains executing low-level repetitive activities limits your capacity and caps your revenue.",
      quote: "Leverage means dissolving low-yield labor pipelines in exchange for client capacity.",
      takeaway: "Bypassing typical rendering loops opens up 10-20 raw hours weekly."
    },
    {
      chapter: "Chapter 2: What is CapyStack AI?",
      content: "CapyStack is a unified Maps Prospecting & AI Multi-Channel Syndication framework. It handles the complete client acquisition and client delivery cycle: 1. Scrapes physical map leads in any city. 2. Extracts community platform complaints for pre-formatted outreach pitches. 3. Evaluates competitors' pricing plans. 4. Grades your content citations for AI search engines (GEO). 5. Formats multi-channel publishes.",
      quote: "Do not pay for separated databases. Maintain one centralized data system.",
      takeaway: "CapyStack unites maps scraping, citation optimizing, and social publishing."
    },
    {
      chapter: "Chapter 3: The Clonic Video Blueprint",
      content: "Instead of sitting in front of a camera, write. Your CapyStack system hooks directly to ElevenLabs Instant Voice Cloning APIs and HeyGen video avatars. By piping formatted scripts generated inside our Academy tab across webhooks like n8n or Activepieces, speech tracks are rendered and mouth-synced automatically onto your AI avatar. No camera or microphones needed.",
      quote: "Deploy authority from your keyboard, while your digital avatar films the media assets.",
      takeaway: "Saves days of recording work by compiling video takes programmatically."
    },
    {
      chapter: "Chapter 4: Consolidating Segmented Subscriptions",
      content: "Modern creators use 5 divided tools that drain fees: a maps scraper ($90/mo), an SEO scanner ($49/mo), automatic social schedulers ($49/mo), audio converters ($25/mo), and standard video suites ($99/mo). CapyStack collapses this overhead into a single $29 account, saving over $3,000 annually. It is a no-brainer financial swap for fast-scaling operators.",
      quote: "Collapse divided structures. Protect your business gross margin.",
      takeaway: "Paying $29/mo replaces $300/mo of segmented applications instantly."
    }
  ];

  const handleClaimTrialInstant = () => {
    try {
      localStorage.setItem("capystack_trial_active", "true");
      localStorage.setItem("capystack_active_plan", "7-Day Free Trial (Active)");
      setActivePlanActivated("7-Day Free Trial (Active)");
      setClaimedTrial(true);
      
      // Also notify any pricing tabs active
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* LANDING PAGE HERO BANNER */}
      <div className="relative text-center py-12 md:py-16 px-4 rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-800/80 rounded-full text-emerald-400 text-[10px] font-mono tracking-widest uppercase font-extrabold animate-pulse">
            <Zap className="h-3 w-3" /> CapyStack Systems Launch Suite
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1] font-sans uppercase">
            Automate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Daily Workflows</span> &amp; Unify Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Marketing Tools</span>
          </h1>

          <p className="text-sm md:text-base text-slate-350 leading-relaxed font-sans max-w-2xl mx-auto">
            The Launch System: Manage maps prospecting, content multi-posting, citation scoring, and video production within a unified software container.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <a
              href="#sales-lead-magnet-blueprint"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition duration-150 shadow-lg shadow-emerald-500/15 flex items-center gap-2 uppercase tracking-wider"
            >
              <BookOpen className="h-4 w-4" />
              GUIDE TO CAPYSTACK
            </a>

            <button
              onClick={() => {
                const el = document.getElementById("public-sales-pricing-grid");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-slate-905 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition border border-slate-800 flex items-center gap-1.5 uppercase tracking-wider"
            >
              View Pricing Plans
              <ArrowRight className="h-3.5 w-3.5 text-slate-450" />
            </button>
          </div>

          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-900 mt-8 text-left">
            <div>
              <span className="block text-xl font-bold font-mono text-white tracking-tight">15-20Hrs</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Weekly Recording Saved</span>
            </div>
            <div>
              <span className="block text-xl font-bold font-mono text-white tracking-tight">$3,240.00</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Annual SaaS Swapped</span>
            </div>
            <div>
              <span className="block text-xl font-bold font-mono text-white tracking-tight">1-Click</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">n8n / API Outbound JSON</span>
            </div>
            <div>
              <span className="block text-xl font-bold font-mono text-white tracking-tight">100% Secure</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Server Hidden Secrets</span>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================== */}
      {/*   THE FREE LEAD MAGNET BLUEPRINT REVEALED PANEL DIRECTLY IN APP   */}
      {/* ========================================================== */}
      <div id="sales-lead-magnet-blueprint" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-450 text-slate-950 font-mono text-[9px] font-black uppercase rounded-full">
                FREE LEAD MAGNET BLUEPRINT 📖
              </span>
              <span className="text-[10px] text-slate-500 font-mono">CapyStack Authority Series</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
              The 20-Hour System Collapse Framework
            </h3>
            <p className="text-xs text-slate-400 max-w-xl font-sans">
              Flip through our official strategy report explaining exactly how modern consultants and professional service providers orchestrate automated digital workflows to scale their business operations.
            </p>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            Swipeable Digital Document Guide • Page {leadPage + 1} of {leadMagnetPages.length}
          </span>
        </div>

        {/* E-BOOK SIMULATOR PAGE COMPONENT */}
        <div className="bg-slate-950 border border-slate-850 p-5 md:p-8 rounded-2xl relative overflow-hidden space-y-6 shadow-inner select-text">
          <div className="absolute top-3.5 right-4 text-[9px] text-slate-650 font-mono font-bold uppercase tracking-wider">
            CapyStack Launch Intelligence Guide
          </div>

          {/* Chapter header */}
          <div className="space-y-1">
            <h4 className="text-sm font-black text-emerald-400 font-mono uppercase tracking-wide">
              {leadMagnetPages[leadPage].chapter}
            </h4>
            <div className="h-0.5 w-16 bg-gradient-to-r from-emerald-500 to-transparent" />
          </div>

          {/* Page main copy text */}
          <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
            {leadMagnetPages[leadPage].content}
          </p>

          {/* Golden quote block */}
          <div className="border-l-4 border-amber-450 pl-4 py-1 italic text-slate-405 font-sans text-xs bg-slate-900/40 rounded-r-lg pr-4.5">
            "{leadMagnetPages[leadPage].quote}"
          </div>

          {/* Main Takeaway badge list */}
          <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl flex items-center gap-2.5">
            <span className="text-md">💡</span>
            <span className="text-xs text-emerald-405 font-bold font-sans">
              **Strategic Takeaway**: {leadMagnetPages[leadPage].takeaway}
            </span>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-900">
            <button
              disabled={leadPage === 0}
              onClick={() => setLeadPage(p => Math.max(0, p - 1))}
              className="bg-slate-900 hover:bg-slate-850 hover:text-white disabled:opacity-20 text-slate-400 text-xs font-bold px-3 py-2 rounded-xl border border-slate-805 transition flex items-center gap-1.5 font-mono"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev Page
            </button>

            <div className="flex gap-1.5">
              {leadMagnetPages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLeadPage(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${i === leadPage ? "bg-emerald-500 w-5" : "bg-slate-800"}`}
                />
              ))}
            </div>

            {leadPage < leadMagnetPages.length - 1 ? (
              <button
                onClick={() => setLeadPage(p => p + 1)}
                className="bg-slate-900 hover:bg-slate-850 text-emerald-400 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-805 transition flex items-center gap-1.5 font-mono"
              >
                Next Page
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <span className="text-emerald-400 text-xs font-black font-mono animate-pulse uppercase tracking-wider">
                Finished! Read Blueprint Complete 📖
              </span>
            )}
          </div>

        </div>

        {/* GLOWING CALL TO ACTION DIRECT LINK TO CONVERT THEM TO GET A TRIAL */}
        <div className="bg-gradient-to-br from-emerald-950/30 to-teal-950/20 border border-emerald-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-2xl rounded-full" />
          
          <div className="space-y-1.5 z-10 text-center md:text-left">
            <h4 className="text-base font-black text-white uppercase tracking-tight">
              Ready to reduce SaaS costs and activate your automated loops?
            </h4>
            <p className="text-xs text-slate-400 font-sans max-w-xl">
              Claim your <strong className="text-white font-bold">7-Day Free Trial</strong> today! This training program and access pass is shared across our organic social channels, high-converting landing pages, and free educational lead magnets to empower scaling coaches.
            </p>
          </div>

          <div className="z-10 shrink-0">
            {claimedTrial ? (
              <div className="bg-emerald-950 border border-emerald-900 px-5 py-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-400 font-extrabold font-mono shadow-lg">
                <Check className="h-4.5 w-4.5" />
                🎉 Live Trial Active! See Pricing & Strategy Tab
              </div>
            ) : (
              <button
                onClick={handleClaimTrialInstant}
                className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl transition duration-150 tracking-wider shadow-xl shadow-emerald-500/20 flex items-center gap-2 uppercase font-sans animate-bounce"
              >
                🎁 Activate 7-Day Free Trial Instantly
                <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================== */}
      {/*   THE STRUCTURAL PUBLIC SALES PRICING TIER STATION         */}
      {/* ========================================================== */}
      <div id="public-sales-pricing-grid" className="space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-normal">
            Pricing Plans Tailored For Leveraged Scaling
          </h2>
          <p className="text-xs text-slate-550 max-w-lg mx-auto font-sans">
            Start completely free to outline your campaigns, scraping strategies and lessons. Upgrade to live API channels when you are ready to syndiate.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="inline-flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-mono mt-3">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-3 py-1.5 rounded-lg transition ${
                billingPeriod === "monthly" ? "bg-slate-800 text-white font-bold" : "text-slate-500 hover:text-slate-350"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                billingPeriod === "yearly" ? "bg-emerald-950 text-emerald-400 font-bold border border-emerald-900/30" : "text-slate-500 hover:text-slate-350"
              }`}
            >
              Yearly (Save 20%) 🎁
            </button>
          </div>
        </div>

        {/* Plan card columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Plan 1 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold">Standard Setup</span>
                  <h4 className="text-base font-black text-white font-mono">CAPYSTACK STARTER</h4>
                </div>
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-550 font-mono">Solopreneur</span>
              </div>

              <div className="flex items-baseline gap-1.5 text-white font-mono border-b border-gutter py-3">
                <span className="text-sm text-slate-550">$</span>
                <span className="text-3xl font-black">{billingPeriod === "yearly" ? "23" : "29"}</span>
                <span className="text-xs text-slate-500">/ mo</span>
              </div>

              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                Excellent for physical maps scraping, local reviews prospecting, and scoring content copy search eligibility parameters.
              </p>

              <ul className="text-[10px] text-slate-300 space-y-2 pt-2 border-t border-slate-900 font-mono">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Maps Lead Scrapes (400 records)</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> GEO Scorecard Analysis (30 monthly runs)</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Social Repurpose Publisher channels</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Local cached memory state</li>
              </ul>
            </div>

            <button 
              onClick={handleClaimTrialInstant}
              className="w-full bg-slate-950 hover:bg-slate-850 text-white font-extrabold text-xs py-3 rounded-xl transition font-sans border border-slate-800 mt-4 uppercase tracking-wider"
            >
              Start Starter Free
            </button>
          </div>

          {/* Plan 2 - HIGHLIGHTED BEST VALUE */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-500/40 p-6 rounded-3xl space-y-5 relative overflow-hidden flex flex-col justify-between shadow-2xl scale-[1.03]">
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-mono text-[9px] font-black uppercase rounded-bl-xl tracking-wider">
            
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-[10px] text-amber-500 font-mono uppercase tracking-wider font-bold">Systems Coach Special</span>
                  <h4 className="text-base font-black text-white font-mono">LAUNCH ELITE PACKAGE</h4>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 text-white font-mono border-b border-slate-900 py-3">
                <span className="text-sm text-emerald-400">$</span>
                <span className="text-4xl font-black text-emerald-400">{billingPeriod === "yearly" ? "79" : "99"}</span>
                <span className="text-xs text-slate-500 font-bold font-mono">/ mo</span>
              </div>

              <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                Our core recommendation for scaling professional consultants. Adds advanced AI content systems, script planning endpoints, and direct outbound webhook connectors.
              </p>

              <ul className="text-[10px] text-slate-200 space-y-2 pt-2 border-t border-slate-900 font-mono">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Everything in Starter plan</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Unlimited Maps Lead Scrapes</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Strategic Launch Co-pilot Assistant</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Interactive Script Teleprompter Generator</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Active Webhooks & n8n JSON nodes</li>
              </ul>
            </div>

            <button 
              onClick={handleClaimTrialInstant}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-xl transition duration-150 shadow-lg shadow-emerald-500/15 font-sans mt-4 uppercase tracking-wider"
            >
              🎁 Claim Launch Elite Trial
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold">Ultimate Capacity</span>
                  <h4 className="text-base font-black text-white font-mono">AUTHORITY AGENCY PROTOCOL</h4>
                </div>
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-550 font-mono">Agency Elite</span>
              </div>

              <div className="flex items-baseline gap-1.5 text-white font-mono border-b border-slate-900 py-3">
                <span className="text-sm text-slate-550">$</span>
                <span className="text-3xl font-black">{billingPeriod === "yearly" ? "151" : "189"}</span>
                <span className="text-xs text-slate-500">/ mo</span>
              </div>

              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                Tailored for multi-client operations and high-volume lead syndicators. Grants full developer capabilities.
              </p>

              <ul className="text-[10px] text-slate-300 space-y-2 pt-2 border-t border-slate-900 font-mono">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Everything in Launch Elite package</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Unlimited social channel profiles</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Claude-Desktop / Cursor MCP servers</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Dedicated high-reputation API channels</li>
              </ul>
            </div>

            <button 
              onClick={handleClaimTrialInstant}
              className="w-full bg-slate-950 hover:bg-slate-850 text-white font-extrabold text-xs py-3 rounded-xl transition font-sans border border-slate-800 mt-4 uppercase tracking-wider"
            >
              Start Authority Free
            </button>
          </div>

        </div>

      </div>

      {/* Authenticity FAQ board dropdown */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
          Frequently Answered Scaler Inquiries
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl space-y-1">
            <h4 className="text-xs font-bold text-slate-205">Is there a setup fee associated with active clone generation?</h4>
            <p className="text-[10px] text-slate-500 leading-normal font-sans">
              No, our automation engine handles production workflows natively using optimized background processes.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl space-y-1">
            <h4 className="text-xs font-bold text-slate-205">How do I export scraped leads profiles from maps?</h4>
            <p className="text-[10px] text-slate-500 leading-normal font-sans">
              Leads are scraped and cached in your list instantly. You can query custom datasets on map nodes or download curated txt plans for immediate sales engagement call sessions.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
