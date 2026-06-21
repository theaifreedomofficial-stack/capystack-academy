import React, { useState } from "react";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Users, 
  HelpCircle, 
  Terminal, 
  TrendingUp, 
  Link as LinkIcon, 
  Share2, 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  BadgeAlert, 
  Coins, 
  Heart,
  MessageSquare,
  Award,
  Video,
  Globe,
  CreditCard,
  Lock,
  ArrowRight,
  Sparkle,
  Bookmark,
  Percent,
  CheckCircle,
  HelpCircle as HelpIcon,
  Plus,
  Minus
} from "lucide-react";

export default function PricingTab() {
  const logoImg = "/src/assets/images/capystack_logo_1781831134736.jpg";
  
  // Tabs: "landing" = Public Marketing Landing Page, "strategy" = B2B Scaling Blueprints & GPU Calculator
  const [currentSubTab, setCurrentSubTab] = useState<"landing" | "strategy">("landing");
  const [selectedTier, setSelectedTier] = useState<"starter" | "creator" | "agency" | "freetrial">("creator");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  
  // Real / Simulated Stripe checkout state
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState<{
    simulated: boolean;
    checkoutUrl: string;
    planName?: string;
    priceAmount?: number;
  } | null>(null);

  // Simulated Overlay State
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [payingSimulated, setPayingSimulated] = useState(false);
  const [activePlanActivated, setActivePlanActivated] = useState<string | null>(() => {
    return localStorage.getItem("capystack_active_plan") || null;
  });

  // Dynamic calculator state for strategy tab
  const [monthlyPosts, setMonthlyPosts] = useState(15);
  const [monthlyImages, setMonthlyImages] = useState(30);
  const [monthlyCompetitorScans, setMonthlyCompetitorScans] = useState(10);

  // Lovina Robinson's B2B Blueprint interactive state
  const [activePlaybookStep, setActivePlaybookStep] = useState<"positioning" | "automation" | "stripe_launch">("positioning");
  const [completedBlueprints, setCompletedBlueprints] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("capystack_completed_blueprints");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleBlueprintTask = (taskId: string) => {
    const updated = completedBlueprints.includes(taskId)
      ? completedBlueprints.filter(id => id !== taskId)
      : [...completedBlueprints, taskId];
    setCompletedBlueprints(updated);
    localStorage.setItem("capystack_completed_blueprints", JSON.stringify(updated));
  };

  // Stack Collapser comparison states
  const [hasBuffer, setHasBuffer] = useState(true);
  const [hasWix, setHasWix] = useState(true);
  const [hasScraper, setHasScraper] = useState(true);
  const [hasSeoTool, setHasSeoTool] = useState(true);

  const calculateCustomStackCost = () => {
    let sum = 0;
    if (hasBuffer) sum += 99; // social tools average
    if (hasWix) sum += 29;    // web builder
    if (hasScraper) sum += 49; // prospecting tools
    if (hasSeoTool) sum += 99; // SEO analyzers
    return sum;
  };

  // 7-Day Free Trial Promo States & Functions
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ status: "success" | "error"; text: string } | null>(null);
  const [usedPromos, setUsedPromos] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("capystack_used_promos");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = promoInput.trim().toLowerCase();
    
    if (normalized === "capystack" || normalized === "7 days free") {
      if (usedPromos.includes(normalized)) {
        setPromoMessage({
          status: "error",
          text: `The code "${promoInput}" has already been used once on this device!`
        });
        return;
      }

      // Success - grant 7-day free trial on the spot
      const nextPromos = [...usedPromos, normalized];
      setUsedPromos(nextPromos);
      localStorage.setItem("capystack_used_promos", JSON.stringify(nextPromos));
      localStorage.setItem("capystack_trial_active", "true");
      localStorage.setItem("capystack_active_plan", "7-Day Free Trial (Active)");
      setActivePlanActivated("7-Day Free Trial (Active)");

      setPromoMessage({
        status: "success",
        text: `🎉 Code applied successfully! Your 7-Day Free Trial of CapyStack is now active!`
      });
      setPromoInput("");
    } else {
      setPromoMessage({
        status: "error",
        text: `Invalid code! Try using "capystack" or "7 days free".`
      });
    }
  };

  // Credit calculation engine
  const calculatedCreditsUsed = (monthlyImages * 15) + (monthlyCompetitorScans * 5);
  const billingMultiplier = billingPeriod === "yearly" ? 0.8 : 1.0;

  // Pricing config
  const pricingTiers = {
    freetrial: {
      name: "7-Day Free Trial",
      price: 0,
      accounts: "Up to 3",
      credits: 60,
      apiAccess: "Locked during trial",
      badge: "Sandbox Tester",
      desc: "Instant playground setup. Evaluate brand voice consistency and citation grade extraction.",
      features: [
        "Single Brand Profile matrix",
        "Limited Competitor scans",
        "Unlimited text drafting preview",
        "Basic SEO metadata checks",
        "Community Discord access"
      ]
    },
    starter: {
      name: "Starter Plan",
      price: 29,
      accounts: "20 Connected Accounts",
      credits: 1250,
      apiAccess: "Full Access (REST, n8n, Make.com)",
      badge: "Best for Solo Operators",
      desc: "Perfect for content solopreneurs collapsing multiple separate subscriptions into one unified, incredibly chill hub.",
      features: [
        "Unlimited AI blog & social generations",
        "Full API & Webhook Node integration",
        "High-fidelity conversion website builder",
        "Google Maps citations locator",
        "Unlimited static website pages",
        "Express server pipeline priorities"
      ]
    },
    creator: {
      name: "Launch Elite Package",
      price: 97,
      accounts: "40 Connected Accounts",
      credits: 5000,
      apiAccess: "Full Access (REST, n8n, Make.com)",
      badge: "Best for Scaling Coaches",
      desc: "Highly requested by content teams and scaling growth operators managing dozens of client properties.",
      features: [
        "Everything in Starter plan",
        "Viral Social Feed scraper logger",
        "Preconfigured Make.com JSON blueprints",
        "Multi-profile brand voice alignment Matrix",
        "Real-time outreach client generation notes",
        "Premium support & webhook priorities"
      ]
    },
    agency: {
      name: "Agency Plan",
      price: 499,
      accounts: "Unlimited Accounts",
      credits: 28000,
      apiAccess: "Full Access (REST, n8n, Make.com)",
      badge: "Industrial Agency Scale",
      desc: "Engineered specifically for content publishers, digital media agencies, and high-frequency automated pipelines.",
      features: [
        "Everything in Creator plan",
        "Dedicated VIP priority hardware nodes",
        "Premium White-Label custom domains",
        "Self-provisioned SSL client certificates",
        "1-on-1 solutions architect consultations",
        "24/7 Priority telephone/Slack back-channel"
      ]
    }
  };

  // Initiate Stripe or Simulation flow
  const handleSubscribeClick = async (tierKey: keyof typeof pricingTiers) => {
    const tier = pricingTiers[tierKey];
    const finalPrice = billingPeriod === "yearly" ? Math.floor(tier.price * 0.8) : tier.price;
    
    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: tier.name,
          priceAmount: finalPrice,
          billingPeriod: billingPeriod
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCheckoutSession(data);
        
        if (data.simulated) {
          // Open beautiful inside-app interactive simulator modal
          setCardNumber("");
          setCardExpiry("");
          setCardCvc("");
          setPaymentSuccess(false);
          setShowSimulatedModal(true);
        } else if (data.checkoutUrl) {
          // Redirect the browser window to real authenticated Stripe page!
          window.location.href = data.checkoutUrl;
        }
      }
    } catch (err) {
      console.error("Stripe Checkout fetch failed:", err);
      // fallback to simulation modal
      setShowSimulatedModal(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSimulatedPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayingSimulated(true);
    
    setTimeout(() => {
      setPayingSimulated(false);
      setPaymentSuccess(true);
      
      if (checkoutSession?.planName) {
        localStorage.setItem("capystack_active_plan", checkoutSession.planName);
        setActivePlanActivated(checkoutSession.planName);
      }
    }, 1800);
  };

  return (
    <div id="capystack-management-suite" className="space-y-8">

      {/* Primary Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-2xl gap-2">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setCurrentSubTab("landing")}
            className={`w-1/2 sm:w-auto text-xs px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
              currentSubTab === "landing" 
                ? "bg-slate-800 text-white shadow-md border border-slate-700/60" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Public Landing Page</span>
          </button>
          
          <button
            onClick={() => setCurrentSubTab("strategy")}
            className={`w-1/2 sm:w-auto text-xs px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
              currentSubTab === "strategy" 
                ? "bg-slate-800 text-white shadow-md border border-slate-700/60" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="h-4 w-4 text-emerald-400" />
            <span>Strategy & GPU Credit tool</span>
          </button>
        </div>

        {activePlanActivated && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-[11px] font-mono font-bold text-emerald-400 self-stretch sm:self-auto justify-center">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Active Plan: {activePlanActivated}</span>
          </div>
        )}
      </div>

      {/* ==================== VIEW 1: HIGH-CONVERTING PUBLIC LANDING PAGE ==================== */}
      {currentSubTab === "landing" && (
        <div id="capystack-marketing-landing-page" className="space-y-12">
          
          {/* Main Hero Panel */}
          <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-8 md:p-14 text-center space-y-6">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
            
            {/* Super Cute Centered Mascot with Pulse Glow */}
            <div className="mx-auto w-24 h-24 relative group mb-2">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 opacity-60 blur group-hover:opacity-100 transition duration-1000 animate-pulse" />
              <img 
                src={logoImg} 
                alt="CapyStack AI Mascot" 
                className="relative h-24 w-24 rounded-full border-4 border-slate-950 object-cover shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1.5 bg-amber-400 text-slate-900 text-[9px] px-2 py-0.5 rounded-full font-black font-semibold whitespace-nowrap uppercase font-mono shadow-md tracking-widest">
                extremely chill 🐾
              </span>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-block text-xs font-bold font-mono tracking-widest text-amber-400 uppercase bg-amber-950/40 border border-amber-900/40 px-3 py-1 rounded-full">
                Collapse Your Tech Stack. Consolidate to One.
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Say Goodbye to Stack Overload. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-300 to-indigo-400">Meet CapyStack AI.</span>
              </h2>
              <p className="text-base text-slate-350 leading-relaxed font-sans max-w-2xl mx-auto">
                Stop paying separate subscriptions for social schedulers, local list scraping, page builders, and SEO tools. CapyStack merges them into a single, incredibly chill hub. No surprise pricing. Just smooth, flat-rate branding.
              </p>
            </div>

            {/* Quick checkout action button */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  const pricingElement = document.getElementById("subscription-pricing-grid");
                  if (pricingElement) pricingElement.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-2"
              >
                <span>View Low Flat Plans</span>
                <ArrowRight className="h-4 w-4 text-slate-950" />
              </button>

              <button
                onClick={() => handleSubscribeClick("freetrial")}
                className="text-xs bg-slate-900 text-white font-bold border border-slate-800 px-6 py-3.5 rounded-xl hover:bg-slate-850 transition"
              >
                Claim Free Trial
              </button>
            </div>

            <div className="pt-6 flex justify-center">
              <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="text-indigo-400">🔒</span> Stripe Secure Protocol
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-indigo-400">⚡</span> Powered by Advanced AI
                </span>
              </div>
            </div>
          </div>

          {/* ==================== 🎁 LEAD MAGNET & 7-DAY TRIAL ACTIVATION STATION ==================== */}
          <div id="lead-magnet-distribution-panel" className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono text-[9px] font-black uppercase rounded-full">
                    GIVEAWAY LEAD MAGNET 📖
                  </span>
                  <span className="text-xs text-slate-500 font-mono">CapyStack Funnel Engine</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-white">
                  The "10-20 Hrs Saved & $300 Subs Collapsed" Lead Blueprint
                </h3>
                <p className="text-xs text-slate-400 max-w-xl font-sans">
                  Use this integrated guide as a viral conversion lead magnet. Your clients will see exactly how you save them <strong>10 to 20 raw hours weekly</strong> and <strong>$300/mo on separate SaaS tools</strong>, then invite them to initialize their active 7-Day Free Trial!
                </p>
              </div>

              {/* Promo Activation Panel Card */}
              <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-2xl shrink-0 min-w-full sm:min-w-[280px] shadow-lg flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2">Claim 7-Day Trial Portal</span>
                  
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 w-full"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition"
                    >
                      Apply
                    </button>
                  </form>

                  {promoMessage && (
                    <div className={`mt-2.5 p-2 rounded-lg text-[10px] font-mono leading-relaxed ${
                      promoMessage.status === "success" 
                        ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/30 font-bold" 
                        : "bg-rose-950/50 text-rose-400 border border-rose-900/30"
                    }`}>
                      {promoMessage.text}
                    </div>
                  )}
                </div>

                <div className="mt-3 border-t border-slate-900 pt-2 flex items-center justify-between text-[10px] font-mono font-bold">
                  <span className="text-slate-500">Allowed uses per device:</span>
                  <span className="text-amber-450 uppercase">Only 1 Time Limit</span>
                </div>
              </div>
            </div>

            {/* Quick conversion features layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-900 space-y-1">
                <span className="text-lg">⚡</span>
                <h4 className="text-xs font-bold text-slate-200">Optimize Digital Content Asset Creation</h4>
                <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                  Clients utilize HeyGen lip-syncing and premium ElevenLabs audio generation to construct polished scripts, eliminating costly manual recording procedures.
                </p>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-900 space-y-1">
                <span className="text-lg">💸</span>
                <h4 className="text-xs font-bold text-slate-200">Rationalize Core Software Overheads</h4>
                <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                  Consolidate segmented applications. Unify landing page builders, lead map scrapers, social distribution platforms, and SEO crawlers within CapyStack.
                </p>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-900 space-y-1">
                <span className="text-lg">🎟️</span>
                <h4 className="text-xs font-bold text-slate-200">Active Promo Trial Codes</h4>
                <p className="text-[10px] text-slate-450 leading-relaxed font-sans font-mono text-amber-400/90">
                  Allow prospects to use code <code className="bg-slate-905 px-1 py-0.5 rounded text-white font-bold text-[9px]">capystack</code> or <code className="bg-slate-905 px-1 py-0.5 rounded text-white font-bold text-[9px]">7 days free</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Stack Comparison Math - "Why Pay $286/mo when you can pay $29/mo?" */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">Interactive Cost Sandbox</span>
                <h3 className="text-lg md:text-xl font-bold text-white">Calculate Your Monthly Subscription Savings</h3>
                <p className="text-xs text-slate-400">
                  Toggle the expensive single-use tools you currently pay for, and watch the CapyStack consolidator melt down the pricing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center gap-3 select-none shrink-0">
                  <span className="text-amber-400">✨</span>
                  <span className="font-bold text-slate-100">CapyStack Core System</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl text-center shrink-0 self-stretch sm:self-auto flex flex-col justify-center">
                  <span className="block text-[10px] text-slate-500 font-mono uppercase">You Save Up To</span>
                  <span className="text-emerald-400 font-black text-xl font-mono">${Math.max(0, calculateCustomStackCost() - 29)}/mo</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Option 1 */}
              <div 
                onClick={() => setHasBuffer(prev => !prev)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 select-none ${
                  hasBuffer 
                    ? "bg-slate-950/80 border-cyan-800/60 ring-1 ring-cyan-900/20" 
                    : "bg-slate-950/20 border-slate-900 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold font-mono ${hasBuffer ? "text-cyan-400" : "text-slate-600"}`}>Social Schedulers</span>
                  <input type="checkbox" checked={hasBuffer} readOnly className="rounded border-slate-700 bg-slate-950 text-cyan-500 pointer-events-none" />
                </div>
                <h4 className={`text-xs font-bold ${hasBuffer ? "text-slate-200" : "text-slate-500"}`}>Buffer / Hootsuite Pro</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-mono hover:underline">$99.00 / month cost</p>
              </div>

              {/* Option 2 */}
              <div 
                onClick={() => setHasWix(prev => !prev)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 select-none ${
                  hasWix 
                    ? "bg-slate-950/80 border-cyan-800/60 ring-1 ring-cyan-900/20" 
                    : "bg-slate-950/20 border-slate-900 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold font-mono ${hasWix ? "text-cyan-400" : "text-slate-600"}`}>Website Builders</span>
                  <input type="checkbox" checked={hasWix} readOnly className="rounded border-slate-700 bg-slate-950 text-cyan-500 pointer-events-none" />
                </div>
                <h4 className={`text-xs font-bold ${hasWix ? "text-slate-200" : "text-slate-500"}`}>Wix / Squarespace</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-mono hover:underline">$29.00 / month cost</p>
              </div>

              {/* Option 3 */}
              <div 
                onClick={() => setHasScraper(prev => !prev)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 select-none ${
                  hasScraper 
                    ? "bg-slate-950/80 border-cyan-800/60 ring-1 ring-cyan-900/20" 
                    : "bg-slate-950/20 border-slate-900 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold font-mono ${hasScraper ? "text-cyan-400" : "text-slate-600"}`}>Maps Scrapers</span>
                  <input type="checkbox" checked={hasScraper} readOnly className="rounded border-slate-700 bg-slate-950 text-cyan-500 pointer-events-none" />
                </div>
                <h4 className={`text-xs font-bold ${hasScraper ? "text-slate-200" : "text-slate-500"}`}>Local Outbound Tools</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-mono hover:underline">$49.00 / month cost</p>
              </div>

              {/* Option 4 */}
              <div 
                onClick={() => setHasSeoTool(prev => !prev)}
                className={`cursor-pointer bg-slate-800 p-4 rounded-lg border transition-all duration-200 select-none ${
                  hasSeoTool ? "border-blue-500/60 ring-1 ring-blue-500/10" : "border-slate-700 text-slate-400"
                }`}
              >
                <div className="text-xs font-bold text-blue-400 mb-2 uppercase font-mono">SEO Analyzers</div>
                <input 
                  type="checkbox" 
                  className="mb-2 rounded border-slate-650 bg-slate-950 text-blue-500 cursor-pointer" 
                  checked={hasSeoTool} 
                  readOnly 
                />
                <div className="font-bold text-slate-200">Professional SEO Suites</div>
                <div className="text-sm text-slate-400 font-mono mt-1">$99.00 / month cost</div>
              </div>
            </div>

            {/* Savings Display Bar widget */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Traditional Divided Stacks: <strong className="text-rose-450">${calculateCustomStackCost()}/mo</strong></span>
                <span>CapyStack Solution: <strong className="text-emerald-400">$29/mo</strong></span>
              </div>
              
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(10, (29 / Math.max(1, calculateCustomStackCost())) * 100))}%` }}
                />
                <div 
                  className="bg-rose-500/20 h-full flex-grow" 
                />
              </div>
              <span className="block text-[10px] text-slate-550 text-center italic">
                CapyStack collapses these costs into a single, responsive flat rate with high-performance execution nodes.
              </span>
            </div>
          </div>

          {/* Pricing Grid Header */}
          <div id="subscription-pricing-grid" className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-white">Choose Your Access Level</h3>
                <p className="text-xs text-slate-400 mt-0.5">Secure, low flat fees. Upgrade or cancel anytime with one click.</p>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="bg-slate-900/80 border border-slate-800 p-1 rounded-xl flex items-center self-start">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition ${
                    billingPeriod === "monthly" ? "bg-slate-800 text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Monthly billing
                </button>
                <button
                  onClick={() => setBillingPeriod("yearly")}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    billingPeriod === "yearly" ? "bg-slate-800 text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>Yearly save</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* 4 Cards Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(Object.keys(pricingTiers) as Array<keyof typeof pricingTiers>).map((tierKey) => {
                const tier = pricingTiers[tierKey];
                const isSelected = selectedTier === tierKey;
                const finalPrice = billingPeriod === "yearly" ? Math.floor(tier.price * 0.8) : tier.price;

                return (
                  <div 
                    key={tierKey}
                    onClick={() => setSelectedTier(tierKey)}
                    className={`cursor-pointer rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                      tierKey === "creator"
                        ? "border-2 border-indigo-500 bg-slate-800 shadow-2xl scale-[1.01]"
                        : isSelected 
                          ? "bg-slate-900 border-amber-500 ring-2 ring-amber-500/20 shadow-2xl scale-[1.01]" 
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/60 hover:border-slate-800"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={tierKey === "creator" ? "w-full text-center" : ""}>
                          <span className={`${
                            tierKey === "creator" 
                              ? "text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-widest block text-center" 
                              : "text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold"
                          }`}>
                            {tier.badge}
                          </span>
                          <h4 className={`${
                            tierKey === "creator" 
                              ? "text-xl font-bold text-white mb-2 text-center" 
                              : "text-base font-black text-white mt-1"
                          }`}>
                            {tier.name}
                          </h4>
                        </div>
                        {isSelected && tierKey !== "creator" && (
                          <span className="h-5 w-5 bg-amber-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-slate-950" />
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-450 leading-relaxed min-h-[48px]">
                        {tier.desc}
                      </p>

                      <div className="border-t border-slate-850 pt-4 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white font-mono">${finalPrice}</span>
                        <span className="text-xs text-slate-500 font-mono">/mo</span>
                      </div>

                      {/* Tier Specs */}
                      <div className="bg-slate-950/60 rounded-xl p-3 space-y-2 border border-slate-900 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Connected Accounts:</span>
                          <span className="text-slate-200 font-semibold">{tier.accounts}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">AI Credits:</span>
                          <span className="text-amber-400 font-bold font-mono">{tier.credits.toLocaleString()} /mo</span>
                        </div>
                        <div className="flex flex-col pt-1 border-t border-slate-900">
                          <span className="text-[9px] text-slate-550 font-mono uppercase">API/Integrations:</span>
                          <span className="text-slate-350 text-[10px] italic">{tier.apiAccess}</span>
                        </div>
                      </div>

                      {/* Bullet Features */}
                      <div className="space-y-2 pt-2">
                        <span className="block text-[9px] font-mono uppercase tracking-widest text-slate-400">Included Features:</span>
                        <ul className="space-y-1.5 text-xs text-slate-350">
                          {tier.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-5 mt-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscribeClick(tierKey);
                        }}
                        disabled={checkoutLoading}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition text-center flex items-center justify-center gap-2 ${
                          isSelected 
                            ? "bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black shadow-lg shadow-amber-500/10" 
                            : "bg-slate-900 text-slate-350 hover:bg-slate-800"
                        }`}
                      >
                        {checkoutLoading && isSelected ? (
                          <span>Spawning Stripe Secure...</span>
                        ) : tierKey === "freetrial" ? (
                          "Initialize Free Trial"
                        ) : (
                          `Subscribe to ${tier.name}`
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ==================== VIEW 2: B2B TACTICAL STRATEGY & CREDITS TOOL ==================== */}
      {currentSubTab === "strategy" && (
        <div id="capystack-b2b-strategy-playbooks" className="space-y-8">
          
          {/* Dynamic AI CPU Credit Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div id="gpu-credit-calculator-widget" className="lg:col-span-7 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Coins className="h-4.5 w-4.5 text-amber-400" />
                  Dynamic AI CPU & GPU Resource usage Calculator
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Plan out your month. Raw copywriting and brand profiles utilize <strong>0 credits</strong> (completely unlimited flat-rate). Rendering visually heavy visuals or conducting deep citation search engine diagnostics utilize GPU units calculated below:
                </p>
              </div>

              <div className="space-y-4">
                {/* Slider 1 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Monthly Social Drafts:</span>
                    <span className="text-cyan-400 font-bold font-mono">{monthlyPosts} Posts (0 credits)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={monthlyPosts}
                    onChange={(e) => setMonthlyPosts(parseInt(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Slider 2 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Generative Portals & Images:</span>
                    <span className="text-indigo-400 font-bold font-mono">{monthlyImages} Visuals ({monthlyImages * 15} credits)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={monthlyImages}
                    onChange={(e) => setMonthlyImages(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Slider 3 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Google Maps Scrapes & GEO Audits:</span>
                    <span className="text-emerald-400 font-bold font-mono">{monthlyCompetitorScans} Scans ({monthlyCompetitorScans * 5} credits)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={monthlyCompetitorScans}
                    onChange={(e) => setMonthlyCompetitorScans(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Calculations Panel */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between text-center">
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Estimated Budget Fit</span>
                
                <div className="py-2">
                  <span className="block text-xs text-slate-400 font-medium">Estimated Monthly Cost Credits:</span>
                  <span className="text-3xl font-black text-amber-400 mt-1 font-mono">{calculatedCreditsUsed.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl space-y-1">
                  <span className="block text-[11px] font-bold text-slate-200">Recommended Plan match:</span>
                  {calculatedCreditsUsed <= 60 ? (
                    <span className="text-xs text-indigo-400 font-black uppercase">7-Day Free Trial (60 Cr)</span>
                  ) : calculatedCreditsUsed <= 1250 ? (
                    <span className="text-xs text-emerald-400 font-black uppercase">Starter Plan (1,250 Cr)</span>
                  ) : calculatedCreditsUsed <= 5000 ? (
                    <span className="text-xs text-cyan-400 font-black uppercase">Creator Plan (5,000 Cr)</span>
                  ) : (
                    <span className="text-xs text-purple-400 font-black uppercase">Agency Plan (28,000 Cr)</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900">
                <p className="text-[10px] text-slate-550 leading-normal">
                  No extra overage fees. Once your monthly allocations exhaust, core automated copywriting remains unlimited, or you can purchase 1,000 extra credits for just $10 flat.
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Advisor Panel - B2B growth and viral strategies */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">Viral Strategy Guide</span>
              <h3 className="text-lg font-bold text-white mt-1">
                How CapyStack AI Solves Deep Creator Problems & Goes Viral
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Creators hate friction and being nickeled-and-dimed for team members. CapyStack is engineered around natural growth multipliers:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strategy 1 */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="h-6 w-6 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-xs">1</span>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Collapsing the Creator Stack</h4>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed font-sans">
                  Unlike traditional single-purpose apps that charge premium rates, we bundle <strong>landing page builders</strong>, <strong>outbound social lead generators</strong>, and <strong>GEO optimization diagnostics</strong>. It's an instant cost-melter.
                </p>
              </div>

              {/* Strategy 2 */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="h-6 w-6 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs">2</span>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Referral Attribution Loops</h4>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed font-sans">
                  When a creator constructs a customized high-converting landing page inside our portal builder, we place an elegant badge: <em>"🐾 Portal powered by CapyStack"</em>. Clicking it rewards both sides with 250 valuable GPU credits.
                </p>
              </div>

              {/* Strategy 3 */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="h-6 w-6 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs">3</span>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Outbound Lead Prospector</h4>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed font-sans">
                  Finding targeted agencies is standard solopreneur friction. Our automated Google Maps and social listening scrapers build outbound pitches tuned to your exact brand profile in seconds, delivering high-intent clients directly.
                </p>
              </div>

              {/* Strategy 4 */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="h-6 w-6 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center font-bold text-xs">4</span>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Surviving search agent citation wars</h4>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed font-sans">
                  Traditional web search is changing: models like Perplexity and Gemini summarize answers directly. Our <strong>GEO Rating Card</strong> highlights exactly what terminology changes to apply to survive search engine evolution.
                </p>
              </div>
            </div>
          </div>

          {/* ==================== INTERACTIVE MASTER PLAYBOOK STEP-BY-STEP (CONNECT-THE-DOTS) ==================== */}
          <div id="lovina-playbook-blueprint-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-mono text-[9px] font-black uppercase rounded-full">
                    SaaS Launch Matrix 🐾
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Ver 2.6</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  CapyStack B2B Authority Blueprint & Playbook
                </h3>
                <p className="text-xs text-slate-400">
                  Follow this comprehensive, step-by-step interactive blueprint to position your personal brand, automate your media, and launch Stripe.
                </p>
              </div>

              {/* Progress Gauge */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-center shrink-0 min-w-[140px] shadow-lg">
                <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Milestones Met</span>
                <span className="text-3xl font-mono font-black text-amber-400 block my-1">
                  {Math.round((completedBlueprints.length / 10) * 100)}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {completedBlueprints.length} of 10 Cleared
                </span>
              </div>
            </div>

            {/* Playbook Navigation Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button
                onClick={() => setActivePlaybookStep("positioning")}
                className={`flex items-center gap-3 p-3.5 rounded-xl text-left border transition ${
                  activePlaybookStep === "positioning"
                    ? "bg-slate-800 border-amber-500 text-white shadow-md shadow-amber-500/5"
                    : "bg-slate-950/40 border-slate-850/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Award className={`h-5 w-5 shrink-0 ${activePlaybookStep === "positioning" ? "text-amber-400" : "text-slate-500"}`} />
                <div>
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500">Phase 1</span>
                  <span className="text-xs font-bold block">Authority Positioning</span>
                </div>
              </button>

              <button
                onClick={() => setActivePlaybookStep("automation")}
                className={`flex items-center gap-3 p-3.5 rounded-xl text-left border transition ${
                  activePlaybookStep === "automation"
                    ? "bg-slate-800 border-amber-500 text-white shadow-md shadow-amber-500/5"
                    : "bg-slate-950/40 border-slate-850/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Video className={`h-5 w-5 shrink-0 ${activePlaybookStep === "automation" ? "text-amber-400" : "text-slate-500"}`} />
                <div>
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500">Phase 2</span>
                  <span className="text-xs font-bold block">10-Hr Content Automation</span>
                </div>
              </button>

              <button
                onClick={() => setActivePlaybookStep("stripe_launch")}
                className={`flex items-center gap-3 p-3.5 rounded-xl text-left border transition ${
                  activePlaybookStep === "stripe_launch"
                    ? "bg-slate-800 border-amber-500 text-white shadow-md shadow-amber-500/5"
                    : "bg-slate-950/40 border-slate-850/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                <CreditCard className={`h-5 w-5 shrink-0 ${activePlaybookStep === "stripe_launch" ? "text-amber-400" : "text-slate-500"}`} />
                <div>
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500">Phase 3</span>
                  <span className="text-xs font-bold block">Stripe Setup & Launch</span>
                </div>
              </button>
            </div>

            {/* TAB CONTENT: AUTHORITY POSITIONING */}
            {activePlaybookStep === "positioning" && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-amber-400">
                    👑 Strategic positioning: Personal brand vs the umbrella
                  </h4>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans">
                    When scaling B2B coaching and software, human beings buy from other human beings. Follow the legendary playbooks of <strong>Julia McCoy</strong> (Content at Scale) and <strong>Sabrina Ramanov</strong>: Lead with your personal name (TRUST & LONG-TERM REVENUE), while using your software platform as your proprietary technological superpower.
                  </p>
                </div>

                {/* Grid Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2.5">
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-mono font-bold px-2 py-0.5 rounded">
                      WINNING STRATEGY: Personal Brand First
                    </span>
                    <h5 className="text-xs font-bold text-slate-200">Your Authority Brand (The Mastermind)</h5>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc pl-4 font-sans">
                      <li>Sell high-ticket $2k-$10k strategic automation masterminds effortlessly.</li>
                      <li>Incredible trust. Video content features your real face and professional authority.</li>
                      <li>Positions you as a tech-enabled consultant who built their own proprietary software stack.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2.5">
                    <span className="text-[10px] bg-slate-800 text-slate-400 font-mono font-bold px-2 py-0.5 rounded">
                      UTILITY TOOL: Software Backend
                    </span>
                    <h5 className="text-xs font-bold text-slate-200">CapyStack AI (The Custom Infrastructure)</h5>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc pl-4 font-sans">
                      <li>Your low-tier recurring revenue engine ($29-$97/mo) to build a solid valuation floor.</li>
                      <li>Quietly sold inside your premium education platform as "the platform I built for my clients."</li>
                      <li>Use lead capture and outbound education campaigns to bring solopreneurs into your funnel.</li>
                    </ul>
                  </div>
                </div>

                {/* Interactive Checklist 1-3 */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Milestone Action Items:</span>
                  
                  <div className="space-y-2">
                    {/* Task 1 */}
                    <div 
                      onClick={() => toggleBlueprintTask("logo_shift")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("logo_shift")
                          ? "bg-slate-950/40 border-emerald-900/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("logo_shift")} 
                        onChange={() => {}} // handled by div click
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Establish Your Personal Authority Brand Core</span>
                          {completedBlueprints.includes("logo_shift") && (
                            <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Build high authority trust. Register your premium domain under your personal name. Position yourself as the tech-enabled founder of CapyStack AI.
                        </p>
                      </div>
                    </div>

                    {/* Task 2 */}
                    <div 
                      onClick={() => toggleBlueprintTask("instagram_reset")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("instagram_reset")
                          ? "bg-slate-950/40 border-emerald-900/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("instagram_reset")} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Launch Fresh Clean Instagram & TikTok Matrix</span>
                          {completedBlueprints.includes("instagram_reset") && (
                            <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Abandon accounts filled with cheap low-engagement AI avatar slop that triggers suspension algorithms. Start fresh focusing on professional high-contrast aesthetics: aesthetic B-roll overlayed with authentic voice transcripts.
                        </p>
                      </div>
                    </div>

                    {/* Task 3 */}
                    <div 
                      onClick={() => toggleBlueprintTask("brand_profile")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("brand_profile")
                          ? "bg-slate-950/40 border-emerald-900/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("brand_profile")} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Synthesize Proprietary Core Brand Matrix in CapyStack</span>
                          {completedBlueprints.includes("brand_profile") && (
                            <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Navigate to the <strong>Brand Profile Configurator</strong> tab. Input your target demography and writing preferences. Save this matrix so CapyStack's AI Publisher always matches your tone perfectly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 10-HOUR ACTION CONTENT AUTOMATION */}
            {activePlaybookStep === "automation" && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-amber-400">
                    🤖 Assemble a streamlined 10-Hr content engine with AI Avatar-Clones
                  </h4>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans">
                    Automation is about removing humans from repetitive mechanical loops (recording, editing, transcript rendering). Combine <strong>ElevenLabs</strong> (Voice cloning), <strong>HeyGen</strong> (Custom real-face interactive avatar), and <strong>CapyStack AI</strong> API endpoints inside <strong>Make.com / n8n</strong> to automate daily shorts.
                  </p>
                </div>

                {/* Blueprint Diagram */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 font-mono">
                  <span className="block text-[9px] text-slate-500 uppercase font-black uppercase">The Automation Loop Diagram</span>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-center py-2 text-slate-300">
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg w-full sm:w-1/4">
                      <span className="block text-[10px] text-amber-400 font-bold mb-1">CapyStack API</span>
                      Writes high-converting script blueprint content
                    </div>
                    <span className="text-slate-650 rotate-90 sm:rotate-0">➔</span>
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg w-full sm:w-1/4">
                      <span className="block text-[10px] text-cyan-400 font-bold mb-1">Elevenlabs API</span>
                      Generates authentic voice clone audio file
                    </div>
                    <span className="text-slate-650 rotate-90 sm:rotate-0">➔</span>
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg w-full sm:w-1/4">
                      <span className="block text-[10px] text-indigo-400 font-bold mb-1">HeyGen Video Core</span>
                      Lip-syncs your custom interactive video twin
                    </div>
                    <span className="text-slate-650 rotate-90 sm:rotate-0">➔</span>
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg w-full sm:w-1/4">
                      <span className="block text-[10px] text-emerald-400 font-bold mb-1">Social Channels</span>
                      Postiz automatons push reel to multiple tubes
                    </div>
                  </div>
                  <span className="block text-[10px] text-slate-450 italic text-center font-sans">
                    By piping these assets automatically via webhook, you bypass rendering software completely, saving 15 hours a week of manual editing.
                  </span>
                </div>

                {/* Interactive Checklist 4-7 */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Milestone Action Items:</span>
                  
                  <div className="space-y-2">
                    {/* Task 4 */}
                    <div 
                      onClick={() => toggleBlueprintTask("heygen_clone")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("heygen_clone")
                          ? "bg-slate-950/40 border-emerald-900/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("heygen_clone")} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Assemble HeyGen Professional Video Avatar Clone</span>
                          {completedBlueprints.includes("heygen_clone") && (
                            <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Record a pristine 3-minute video of yourself addressing a camera with standard, clear voice delivery. Upload to HeyGen's studio with explicit verbal release permission to obtain your high-performance custom-cloned avatar.
                        </p>
                      </div>
                    </div>

                    {/* Task 5 */}
                    <div 
                      onClick={() => toggleBlueprintTask("elevenlabs_clone")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("elevenlabs_clone")
                          ? "bg-slate-950/40 border-emerald-900/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("elevenlabs_clone")} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Initialize High Fidelity voice Model in ElevenLabs</span>
                          {completedBlueprints.includes("elevenlabs_clone") && (
                            <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Record or compile 10 to 15 minutes of pristine, background-noise-free talking clips representing your custom voice profile. Train ElevenLabs Professional Cloned Engine to achieve a dynamic voiceover match.
                        </p>
                      </div>
                    </div>

                    {/* Task 6 */}
                    <div 
                      onClick={() => toggleBlueprintTask("make_webhook")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("make_webhook")
                          ? "bg-slate-950/40 border-emerald-900/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("make_webhook")} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Anchor Developer API Pipes via CapyStack REST</span>
                          {completedBlueprints.includes("make_webhook") && (
                            <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Head over to the <strong>Developer API Center</strong> tab inside this dashboard. Integrate the custom POST webhooks into your Make.com / n8n or Activepieces workflows to pull generated copy briefs programmatically.
                        </p>
                      </div>
                    </div>

                    {/* Task 7 */}
                    <div 
                      onClick={() => toggleBlueprintTask("remotion_render")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("remotion_render")
                          ? "bg-slate-950/40 border-emerald-900/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("remotion_render")} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Set Up Automatic subtitle Overlays & rendering</span>
                          {completedBlueprints.includes("remotion_render") && (
                            <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Configure a template inside <strong>Remotion</strong> or your favorite social automator tool. Anchor subtitles, ambient background tracks, and automatically overlay your avatar video to render a highly addictive, finished campaign daily.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: STRIPE SETUP & MARKET GO-LIVE */}
            {activePlaybookStep === "stripe_launch" && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-amber-400">
                    💳 Launching your SaaS: Connecting Stripe & Going Live
                  </h4>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans">
                    With CapyStack, Stripe integration is completely self-contained and pre-engineered. No complicated coding is required. Follow these exact instructions to process real subscription payments.
                  </p>
                </div>

                {/* Step Card instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 font-mono">
                    <span className="text-[10px] text-amber-400 font-bold">1. SECURE STRIPE MERCHANT CREDENTIALS</span>
                    <ul className="text-[11px] text-slate-400 space-y-2 font-sans list-decimal pl-4">
                      <li>Create a merchant profile at <a href="https://stripe.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">stripe.com</a> (immediate approval).</li>
                      <li>Go to <strong>Developers &gt; API Keys</strong>.</li>
                      <li>Find the <strong>Secret Key</strong> (begins with <code className="bg-slate-900 px-1 py-0.5 rounded border border-slate-800 text-amber-400 text-[10px]">sk_live_...</code>).</li>
                    </ul>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 font-mono">
                    <span className="text-[10px] text-emerald-400 font-bold">2. CONFIGURE CAPYSTACK ENVIRONMENT</span>
                    <ul className="text-[11px] text-slate-400 space-y-2 font-sans list-decimal pl-4">
                      <li>Open your server container dashboard.</li>
                      <li>Add the environment variable name: <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-emerald-400 text-[11px]">STRIPE_SECRET_KEY</code>.</li>
                      <li>Input your Stripe Secret Key as the value. Save & compile. CapyStack handles the checkout redirections automatically!</li>
                    </ul>
                  </div>
                </div>

                {/* Interactive Checklist 8-10 */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Milestone Action Items:</span>
                  
                  <div className="space-y-2">
                    {/* Task 8 */}
                    <div 
                      onClick={() => toggleBlueprintTask("stripe_sign")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("stripe_sign")
                          ? "bg-slate-950/40 border-emerald-900/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("stripe_sign")} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Register Active Stripe Developer Account</span>
                          {completedBlueprints.includes("stripe_sign") && (
                            <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Confirm that your payment processing country matches Stripe's supported footprint. Ensure you enable standard Credit Card payment method types in Checkout settings.
                        </p>
                      </div>
                    </div>

                    {/* Task 9 */}
                    <div 
                      onClick={() => toggleBlueprintTask("get_api_keys")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("get_api_keys")
                          ? "bg-slate-950/40 border-emerald-900/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("get_api_keys")} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Bind sk_live_... Secret Token to CapyStack Container</span>
                          {completedBlueprints.includes("get_api_keys") && (
                            <span className="text-[9px] bg-emerald-950/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Declare STRIPE_SECRET_KEY in server secrets configuration. Once added, the applet instantly swaps out local checkout simulations for verified secure direct payments.
                        </p>
                      </div>
                    </div>

                    {/* Task 10 */}
                    <div 
                      onClick={() => toggleBlueprintTask("launch_funnel")}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                        completedBlueprints.includes("launch_funnel")
                          ? "bg-slate-950/40 border-emerald-950/50"
                          : "bg-slate-950 border-slate-850 hover:bg-slate-900/40"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={completedBlueprints.includes("launch_funnel")} 
                        onChange={() => {}} 
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 accent-amber-500 pointer-events-none" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Go Live & Recruit First Beta-Testing Cohort</span>
                          {completedBlueprints.includes("launch_funnel") && (
                            <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">Cleared</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed font-sans">
                          Create a high-converting announcement post on your fresh personal brand channels. Offer 20 early adopters lifelong access to your CapyStack AI engine at the Starter pricing rate ($29/mo) in exchange for deep case study testimonials!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ==================== STRIPE SIMULATED CHECKOUT MODAL OVERLAY ==================== */}
      {showSimulatedModal && checkoutSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between my-8 animate-fade-in">
            
            {/* Header / Brand visual block */}
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="logo" className="h-10 w-10 rounded-full border border-slate-950" />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">CapyStack Pay</h4>
                  <span className="text-[10px] font-bold font-mono tracking-widest bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded">
                    SECURE STACK GATEWAY
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowSimulatedModal(false)}
                className="text-slate-950 hover:opacity-70 text-xs font-black bg-white/20 px-2.5 py-1 rounded-lg"
              >
                Cancel
              </button>
            </div>

            {/* Checkout Main content */}
            <div className="p-6 space-y-5 flex-1 select-none">
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 space-y-2">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Subscribing to:</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-white">{checkoutSession.planName}</span>
                  <span className="text-base font-black text-amber-400 font-mono">${checkoutSession.priceAmount}/mo</span>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Collapses separate tools, including unlimited copy modeling and high-GPU credits ({checkoutSession.planName === "7-Day Free Trial" ? "60" : checkoutSession.planName === "Starter Plan" ? "1,250" : checkoutSession.planName === "Creator Plan" ? "5,000" : "28,000"} monthly credits).
                </p>
                {checkoutSession.simulated && (
                  <span className="block text-[9px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900/40 px-2 py-0.5 rounded text-center">
                    ℹ️ Real Stripe is lazy-initialized. Testing simulated secure checkout.
                  </span>
                )}
              </div>

              {paymentSuccess ? (
                <div className="py-8 text-center space-y-3 animate-fade-in">
                  <div className="mx-auto h-12 w-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/35">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="text-base font-black text-white">Payment Authorized!</h5>
                    <p className="text-xs text-slate-400 mt-1">
                      Your CapyStack workspace has been promoted to the premium tier! Your credits have been credited.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={() => setShowSimulatedModal(false)}
                      className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl"
                    >
                      Enter Onboarded Workspace
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSimulatedPaymentSubmit} className="space-y-4">
                  <div className="space-y-3">
                    {/* Simulated card field */}
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242 (Stripe Standard Test)"
                          className="w-full text-xs font-mono bg-slate-950 border border-slate-850 p-3 rounded-xl pl-10 pr-4 text-slate-200 placeholder-slate-650 focus:border-amber-500 focus:outline-none"
                        />
                        <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-650" />
                      </div>
                    </div>

                    {/* Expiry and CVC */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Expiry Date</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full text-xs text-center font-mono bg-slate-950 border border-slate-850 p-3 rounded-xl text-slate-200 placeholder-slate-650 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">CVC Code</label>
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="123"
                          className="w-full text-xs text-center font-mono bg-slate-950 border border-slate-850 p-3 rounded-xl text-slate-200 placeholder-slate-650 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sandbox warning */}
                  <p className="text-[10px] text-slate-550 leading-relaxed flex items-start gap-1.5 font-sans">
                    <Lock className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>Your personal card is never processed under sandbox test checkout. Please review our terms if utilizing in production environments.</span>
                  </p>

                  <button
                    type="submit"
                    disabled={payingSimulated}
                    className="w-full py-3.5 rounded-xl bg-amber-450 hover:bg-amber-400 font-black text-slate-950 text-xs transition flex items-center justify-center gap-2"
                  >
                    {payingSimulated ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Authenticating Secure Token...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        <span>Authorize Payment via Stripe Sim</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-950 p-4 border-t border-slate-850 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <Lock className="h-3 w-3 text-slate-600" />
              <span>TLS 1.3 Encryption • ISO Secure 27001 Gateway</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
