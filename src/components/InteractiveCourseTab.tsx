import React, { useState } from "react";
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Award, 
  Clock, 
  DollarSign, 
  Target, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Activity,
  Heart,
  Briefcase,
  Copy,
  Volume2
} from "lucide-react";

type NicheType = "wealth" | "health" | "relationships" | "agency";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

const MODULE_QUIZZES: Record<number, QuizQuestion[]> = {
  0: [
    {
      id: "q0_1",
      question: "What is the primary driver behind high monthly software bills ($300+/mo) for scaling creators?",
      options: [
        "A) Extreme cloud compute charges from AI model usage",
        "B) Paying for separate, disconnected monthly subscriptions (maps scrapers, SEO audits, social planners) instead of an integrated application platform",
        "C) Custom CRM installation and support consultant fees",
        "D) Domain registration and high-bandwidth DNS routing costs"
      ],
      correctIndex: 1,
      rationale: "Correct! Fractured subscription stacks silently bleed margins via multiple overlapping $49-$120/mo bills. Consolidating into CapyStack collapses this overhead immediately."
    },
    {
      id: "q0_2",
      question: "How does CapyStack's single-container architecture optimize coaching margins?",
      options: [
        "A) It permits processing anonymous payments with high transaction surcharges",
        "B) It completely replaces the necessity of human coaching involvement",
        "C) It collapses lead scraper, SEO audit, and social syndicator modules into a single lightweight platform configuration",
        "D) It dynamically purchases Google Search PPC placement click traffic"
      ],
      correctIndex: 2,
      rationale: "Correct! By integrating separate marketing pipelines, CapyStack replaces redundant, divided server products to protect net coach margins."
    },
    {
      id: "q0_3",
      question: "Which of the following describes the operational difference between API pulling vs. dynamic push Webhooks?",
      options: [
        "A) Webhooks push event data payload instantly when triggers convert, while APIs require slow, resource-heavy polling routines",
        "B) Standard REST APIs handle database records, whereas webhooks are restricted to video URL assets",
        "C) Webhooks are highly insecure legacy routes designed purely for internal local test benches",
        "D) Standard pulling APIs run camera-free, whereas webhooks demand manual video camera rigs"
      ],
      correctIndex: 0,
      rationale: "Correct! Webhooks use active event-driven push architectures, updating coordinates instantly on pay logs, saving heavy redundant polling requests."
    }
  ],
  1: [
    {
      id: "q1_1",
      question: "Why is traditional Search Engine Optimization (SEO) rapidly transitioning to GEO (Generative Engine Optimization)?",
      options: [
        "A) Search hyperlink addresses have been deprecated on modern networks",
        "B) High-intent buyers ask conversational AI models (Perplexity, ChatGPT Search, Gemini, Siri) for synthesized answers directly instead of searching blue link indexes",
        "C) Local maps crawlers only index metropolitan cities in North America",
        "D) Search engine providers charge local merchants to show organic locations"
      ],
      correctIndex: 1,
      rationale: "Correct! Today's buyers crave direct, clear local recommendations. If your citations and schema metadata are unoptimized, AI search engines cannot index your client."
    },
    {
      id: "q1_2",
      question: "What exact 'citations signals' must local brands establish to guarantee visibility in Perplexity & Gemini?",
      options: [
        "A) Constant publication of stock illustration layout files in header slots",
        "B) Highly structured JSON-LD local schema code, consistent NAP profiles on directories, and keyword-rich semantic citations",
        "C) High frequency of custom CSS animations on pricing pages",
        "D) Paid agency backlink cycles that repeatedly search their name in web browsers"
      ],
      correctIndex: 1,
      rationale: "Correct! AI crawlers query schema scripts, Yelp listings, maps addresses, and community answers to verify semantic authenticity. Schema tags act as core anchors."
    },
    {
      id: "q1_3",
      question: "Which outbound strategy is most effective to convert local business leads into secure high-ticket clients?",
      options: [
        "A) Bombarding their social media profiles with aggressive sales pitches demanding immediate retainer sign-ups",
        "B) Delivering an instant, complementary GEO audit report displaying their search invisibility, paired with a short screen-share offer to fix it",
        "C) Flooding local inboxes with automated synthetic avatar video spam",
        "D) Filing formal non-compliance complaints against regional trades for lacking structured schema structures"
      ],
      correctIndex: 1,
      rationale: "Correct! Leading with clear visual diagnostic value converts suspicion to respect, securing screen-share calls that turn into lucrative retainers."
    }
  ],
  2: [
    {
      id: "q2_1",
      question: "Which of the following contains typical 'AI-Slop' terms that signal robotic and insincere copywriting?",
      options: [
        "A) Structured bullet-points, direct quotes, precise numerical data, clean spacing",
        "B) Buzzwords like 'delve', 'tapestry', 'testament', 'demystify', 'moreover', 'beacon', or 'cutting-edge'",
        "C) Clinical step guides, literal configuration instructions, and precise ROI timestamps",
        "D) Actionable webhook payloads and specific server setup commands"
      ],
      correctIndex: 1,
      rationale: "Correct! Swiss-style direct copy demands simple, raw clarity. Eradicating robotic buzzwords makes copywriting sound clinically credible and premium."
    },
    {
      id: "q2_2",
      question: "Why should creators refrain from syndicating raw, unedited AI model outputs straight to social distribution channels?",
      options: [
        "A) Online social networks have set up native firewalls that block any incoming proxy texts",
        "B) Unedited outputs lack distinctive voice variables, sound generic, use clichés, and dilute brand authority",
        "C) Modern high-ticket buyers refuse to read single-paragraph social posts",
        "D) Basic model outputs require manual cryptographic signing from registered host providers"
      ],
      correctIndex: 1,
      rationale: "Correct! Authenticity builds trust. Restricting vocabulary limits and filtering 'Slop' protects your identity, converting readers into buyers."
    },
    {
      id: "q2_3",
      question: "How does CapyStack's Omni-Social Syndication platform help you scale distribution authority?",
      options: [
        "A) It manipulates active feed algorithms through continuous proxy accounts",
        "B) It converts your original newsletter files into fifteen spoken languages natively",
        "C) It allows you to input one raw article, cleans it using custom tone guards, and dispatches platform-specific formats straight via webhooks into active schedulers",
        "D) It scrapes rival profiles so you can copy and republish their exact material"
      ],
      correctIndex: 2,
      rationale: "Correct! A single, clean thought blueprint is repurposed programmatically with channels constraints and pushed natively, preserving your mindshare."
    }
  ],
  3: [
    {
      id: "q3_1",
      question: "How does 'Studio-Free Production' successfully reclaim 15+ hours of weekly filming time?",
      options: [
        "A) It mandates dropping video publishing to focus exclusively on local physical brochures",
        "B) The system relies on crowdsourced voice-over actors found online",
        "C) It replaces manual multi-take recordings, cameras, and long editing days with high-fidelity custom speech clones and lifelike visual avatars",
        "D) It allows you to rent regional filming trucks at high commercial discount tiers"
      ],
      correctIndex: 2,
      rationale: "Correct! Cloning your voice and generating speaker videos directly from script templates allows scaling tutorial libraries without any physical camera limits."
    },
    {
      id: "q3_2",
      question: "What is the correct programmatic workflow to build and render a synthetic video module?",
      options: [
        "A) Set up custom Stripe links, run webhook monitors, copy prompts, and dispatch text messages",
        "B) Submit written script to ElevenLabs TTS API to secure voice audio MP3, send MP3 link to HeyGen visual avatar generator, and download final Mp4",
        "C) Build a local canvas scene script, capture sound notes on phones, and merge using terminal scripts",
        "D) Download existing video channels, trim using command line tools, and publish to folders"
      ],
      correctIndex: 1,
      rationale: "Correct! Sending variable teleprompter scripts directly through linked TTS and video replication endpoints automates editing entirely in seconds."
    },
    {
      id: "q3_3",
      question: "Which copywriting architecture is scientifically proven to drive student retainer conversions in automated videos?",
      options: [
        "A) Technical system definitions outlining database port configurations or container specs",
        "B) The core Hook-Story-Offer formula (sub-14-word attention grabber, quick failure-to-solution narrative, and direct, clear call-to-action)",
        "C) High-density theoretical academic quizzes about database indexing structures",
        "D) Standard software documentation scripts with no direct conversion action requests"
      ],
      correctIndex: 1,
      rationale: "Correct! Staging a strong, crisp hook, followed by empathetic problem-solving stories and clear logical CTAs, commands consumer attention."
    }
  ]
};

export default function InteractiveCourseTab() {
  const [selectedNiche, setSelectedNiche] = useState<NicheType>("wealth");
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [activeIntegrationTab, setActiveIntegrationTab] = useState<"logic" | "media" | "ide" | "finance">("logic");

  // Dynamic Quiz & Practice States
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [lessonSubmitted, setLessonSubmitted] = useState<Record<number, boolean>>({});
  const [lessonPassed, setLessonPassed] = useState<Record<number, boolean>>({});
  const [lessonScore, setLessonScore] = useState<Record<number, number>>({});
  const [showRationale, setShowRationale] = useState<Record<string, boolean>>({});

  // Module 2 Simulator states
  const [targetUrl, setTargetUrl] = useState<string>("www.boulderchiropractic.com");
  const [targetIndustry, setTargetIndustry] = useState<string>("Chiropractor");
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(0);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  // Module 3 Simulator states
  const [selectedTopic, setSelectedTopic] = useState<string>("automation");
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  
  // Module 4 Simulator states
  const [selectedScriptType, setSelectedScriptType] = useState<string>("hook");
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesizeProgress, setSynthesizeProgress] = useState<number>(0);
  const [synthesizedVideo, setSynthesizedVideo] = useState<any | null>(null);
  const [teleprompterPlaying, setTeleprompterPlaying] = useState<boolean>(false);

  // VIP Bonus Prompt Vault states
  const [activePromptTab, setActivePromptTab] = useState<"hooks" | "automation" | "syndicator" | "local-outreach" | "stripe">("hooks");
  const [promptIndustry, setPromptIndustry] = useState<string>("B2B System Automation Coach");
  const [promptOffer, setPromptOffer] = useState<string>("$3,500 CapyStack Implementation Seat");
  const [promptPain, setPromptPain] = useState<string>("Wasting $300+/month on disorganized tools");
  const [customNicheTopic, setCustomNicheTopic] = useState<string>("The SaaS software overhead collapse");
  const [workflowTool, setWorkflowTool] = useState<"n8n.io" | "Make.com" | "Activepieces">("n8n.io");

  const handleCopyText = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(identifier);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const lessons = [
    {
      id: 0,
      title: "Module 1: The Modern Stack Collapse",
      duration: "6 mins audio class",
      badge: "Financial Leverage",
      description: "How high-ticket operators stop wasting $300+/month on disconnected legacy software and collapse their marketing tech stacks into high-speed, trending AI pipelines (Gemini, ChatGPT, and Claude).",
      takeaways: [
        "Consolidate separate monthly bills for databases, lead mining, and copy generation into one clean container.",
        "Integrate cutting-edge AI pipelines to automate your client outreach, scheduling, and strategic planning.",
        "Calculate the 10x ROI conversion from outdated monthly subscription overhead to modern unified systems."
      ],
      interactiveTool: "SaaS Expense Collapse Calculator",
      trendingTools: ["Gemini 1.5 Pro", "Claude 3.5 Sonnet", "n8n Workflows"],
      marketingTactics: ["SaaS Cost Optimization", "Clean Margin Protection", "Single-Container Deployment"],
      detailedOverview: "Modern coaching founders and software creators waste over $300/month maintaining separate databases, scraper accounts, SEO indexes, and social planners. This fractured tech stack slows team integration and ruins delivery velocity. CapyStack collapses this entire loop down to a single self-contained application, preserving your capital so you can scale high-ticket coaching with pristine operational margins.",
      howToApply: "Use the SaaS Expense Collapse Calculator to identify which subscriptions you can immediately cancel. Then, initialize a custom API webhook route on the 'Developer Node' tab to direct the data saving flow in one unified pipeline.",
      actionTab: "Developer Node & Pricing Strategy"
    },
    {
      id: 1,
      title: "Module 2: AI Maps Scraping & GEO Engine Optimization",
      duration: "8 mins visual class",
      badge: "Client Capture",
      description: "A step-by-step tactical playbook on using spatial map scrapers and Generative Engine Optimization (GEO) audits to target local businesses pre-qualified by low AI search engine visibility.",
      takeaways: [
        "Scrape physical map leads with high commercial intent across key cities in real time.",
        "Establish elite GEO scores showing client brand visibility across modern tools like Perplexity, ChatGPT Search, and Gemini.",
        "Formulate hyper-personalized audits in 90 seconds to secure strategic attention before any sales call is made."
      ],
      interactiveTool: "GEO Simulator & Audit report",
      trendingTools: ["Perplexity AI", "ChatGPT Search", "Siri & Gemini Local queries"],
      marketingTactics: ["Generative Engine Optimization (GEO)", "Local Map Mining", "Value-First Auditing Hooks"],
      detailedOverview: "Traditional SEO is transitioning into GEO (Generative Engine Optimization). Today, high-intent clients ask LLMs directly for hyper-local answers. If a business's Yelp citations, structured schema tags, and community mentions are missing or unoptimized, AI search agents cannot reference them. You can use CapyStack's live scraping tools to target local businesses, audit their search engine footprints, and deliver immediate value-based diagnostics that convert cold outreach to warm retainer calls instantly.",
      howToApply: "Navigate to the 'Maps Lead Scraper' to download local leads. Paste their assets into the 'GEO/SEO Scorecard' tab to score their real-time LLM recommendation viability, print action reports, and secure screen-share sales consulting slots.",
      actionTab: "Maps Lead Scraper & GEO Scorecard"
    },
    {
      id: 2,
      title: "Module 3: AI Social Media & Viral Hyper-Distribution",
      duration: "5 mins guide",
      badge: "Organic Traffic",
      description: "Master trending AI-driven organic reach. Learn social media marketing tactics to instantly slice, repurpose, and hyper-distribute one thought article across high-impact platforms.",
      takeaways: [
        "Craft high-reach LinkedIn carousels, Twitter/X viral threads, and high-conversion email newsletters with zero manual formatting.",
        "Program tone constraints into Gemini so your social posts read exactly like your authentic voice, free of robotic clichés.",
        "Set up instant webhook distribution pipelines to push optimized drafts to active scheduling platforms on auto-pilot."
      ],
      interactiveTool: "Instant Social Copy Builder",
      trendingTools: ["Gemini API", "Claude Artifacts", "Activepieces Webhooks"],
      marketingTactics: ["Semantic Content Syndication", "Anti-AI-Slop Styling Filter", "Omipresent Narrative Dispersion"],
      detailedOverview: "To capture massive search engine crawlers and build steady authority, you must maintain active social posting pipelines. However, manually adjusting copy structures for separate platforms drains your creative capacity. By feeding raw articles to an advanced LLM mapped to exact voice restrictions, you can turn a single thought blueprint into LinkedIn posts, Twitter/X threads, and newsletters that preserve your human essence and drive organic lead signups.",
      howToApply: "Use the 'AI Portal Builder' to lock in your unique brand voice constraints, then input any rough script or voice note inside the 'Omni-Social Publisher' tab to instantly output high-reach posts and dispatch direct webhooks to active schedule queues.",
      actionTab: "Omni-Social Publisher & Social Prospector"
    },
    {
      id: 3,
      title: "Module 4: Studio Free Production",
      duration: "10 mins video class",
      badge: "Virtual Scale",
      description: "Produce hyper-realistic video hooks and system assets without expensive camera gear or hours of custom editing. Generate high-fidelity audio voice clones and digital avatar renders.",
      takeaways: [
        "Develop high-fidelity persistent voice clones using ElevenLabs and trending synthetic audio platforms.",
        "Deploy lifelike video avatar presenters tailored to automated scripts programmatically.",
        "Collapse multi-day production schedules down into a 15-minute streamlined, studio-free production loop."
      ],
      interactiveTool: "Simulated Teleprompter & Video Synthesizer",
      trendingTools: ["ElevenLabs Synthesizer", "HeyGen Digital Avatars", "Remotion Video Layouts"],
      marketingTactics: ["Virtual Scalability", "Studio-Free Production Loops", "Asynchronous Course Delivery"],
      detailedOverview: "Publishing video assets and course modules classically demands days of voice work, camera setups, and studio time. Transitioning to ElevenLabs custom voice cloning and lifelike AI video replicas lets you write a script, hit submit, and receive export-ready video material in minutes of total desk time. This system completely decouples your physical presence and permits infinite, camera-free training delivery at absolute global scale.",
      howToApply: "Use the 'Authority Academy & Co-pilot' tab to generate customized teleprompter scripts, and tap the synthetic media connector to send your script variables straight to HeyGen or your custom ElevenLabs endpoint inside your Developer dashboard.",
      actionTab: "Authority Academy & Co-pilot"
    }
  ];

  // Detailed Playbook Data for Niche Customization
  const nicheData = {
    wealth: {
      title: "Wealth, Business, & High-Ticket Consultancy",
      targetProspects: "Agencies, eCommerce Brands, SaaS Founders, Financial Planners",
      impactPhrase: "Scale customer acquisition, cut customer acquisition costs (CAC), and prove immediate ROI.",
      timeSaved: "18 Hours/week",
      moneySaved: "$340/month of divided CRM and scraper tools",
      systemGuide: "Run the competitor analysis on rival consulting websites. Identify exactly what keywords your prospect is ranking for, and use the Omni-Social tab to generate client-winning LinkedIn threads mapping back to those topics daily.",
      copyPrompt: "Explore the vulnerability profile of a digital agency booking less than $20k/mo. Detail their friction points (overloaded calendars, complex software loops, poor sales preparation) and draft an absolute growth scale recommendation letter.",
      caseStudy: "A boutique business development coach used the GEO Scorecard to run live diagnostic screen shares with prospects. By demonstrating that their services were invisible to Gemini AI local queries, she converted three $4,000/mo retainer clients inside of 14 business days.",
      badgeColor: "border-emerald-500/25 bg-emerald-950/20 text-emerald-400"
    },
    health: {
      title: "Health, Fitness, & Clean Wellness Coaching",
      targetProspects: "Personal Trainers, Chiropractors, Yoga Studios, Holistic Care Medics",
      impactPhrase: "Deliver structured academy lessons, establish deep authority, and dominate high-intent local map rankings.",
      timeSaved: "14 Hours/week",
      moneySaved: "$280/month of disjointed membership & recording platforms",
      systemGuide: "Select physical chiropractors or gyms on the Map Scraper. Check their Local Reviews count. Run their details through the GEO Tab to verify search engine tags, then present them with a customized checklist on how they can double their monthly physical booking foot-traffic.",
      copyPrompt: "A professional physical rehabilitation fitness coach wants to target executive recovery programs. Draft a 5-part lesson module outline explaining the physical toll of 60-hour desk weeks and write script transcripts tailored for digital video avatars.",
      caseStudy: "An organic wellness consultant stopped spending 8 hours every weekend filming and editing instructional health routines. She moved to ElevenLabs voice synthesis and HeyGen digital avatars, allowing her to release bi-weekly masterclasses for health academies in 15 minutes of flat desk time.",
      badgeColor: "border-cyan-500/25 bg-cyan-950/10 text-cyan-400"
    },
    relationships: {
      title: "Relationships, Life, & Spiritual Purpose Coaching",
      targetProspects: "Scaling Life Coaches, Relationship Counselors, Executive Team-Builders",
      impactPhrase: "Scale organic messaging, transform raw thoughts into professional essays, and deliver structured systems coaching.",
      timeSaved: "16 Hours/week",
      moneySaved: "$250/month of content formatting and publishing apps",
      systemGuide: "Scrape community networks inside our 'Social Client Prospector' utilizing keywords like 'relationship struggles' or 'executive burnout'. Immediately identify pre-filtered active threads with public feedback issues and generate high-affinity responses instantly.",
      copyPrompt: "Analyze the core friction points of a modern high-power executive struggling with work-life integration. Draft a warm, high-contrast daily insights post suitable for a professional newsletter demonstrating real empathy and structured systems-scale resolution stages.",
      caseStudy: "A prominent career strategist utilized the 'Social Client Prospector' to find active community discussions regarding workplace burnout. The AI-generated high-value responses landed him 5 deep-dive consulting sessions, resulting in two high-ticket clients.",
      badgeColor: "border-pink-500/25 bg-pink-950/10 text-pink-400"
    },
    agency: {
      title: "Local Marketing & Systems Automation Agency",
      targetProspects: "Local Dentists, Roovers, Plumbers, General Contractors, Retail Venues",
      impactPhrase: "Audit regional maps, leverage webhook automated workflows, and charge $1,500/month setup retainers.",
      timeSaved: "22 Hours/week",
      moneySaved: "$450/month of multi-city maps scraping, SEO trackers and automation systems",
      systemGuide: "Navigate to the Developers Center. Create n8n workflows that connect target city maps scraping databases instantly to ElevenLabs teleprompters. Sell this complete 'Local Authority Autopilot system' directly to service businesses for premium installation fees.",
      copyPrompt: "Detail a localized maps strategy for a high-volume residential plumbing agency in Denver with less than 20 reviews. Map out custom review capture webhook structures, review auto-reply scripts, and direct sales talking points.",
      caseStudy: "A solo automation agency owner packaged CapyStack's maps scrapers and webhook templates as an 'Authority Autopilot' retainer. He sold this exact setup to 8 local electrical contractors in his state, generating over $9,000 in monthly recurring revenues without any full-time staff.",
      badgeColor: "border-amber-500/25 bg-amber-950/10 text-amber-400"
    }
  };

  const selectedPlaybook = nicheData[selectedNiche];

  return (
    <div className="space-y-8 select-text">
      
      {/* HEADER ACTION CENTER */}
      {(() => {
        const passedCount = Object.values(lessonPassed).filter(Boolean).length;
        const progressPercent = passedCount * 25;
        const isFullyCertified = passedCount === 4;

        return (
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <span className="text-3xl p-2 bg-slate-950 border border-slate-800 rounded-xl">📚</span>
                <div>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Interactive Training Academy
                  </div>
                  <h3 className="font-black text-lg text-white font-sans uppercase tracking-tight mt-0.5">
                    CAPYSTACK GROWTH COHORT
                  </h3>
                </div>
              </div>

              {/* Progress Counters */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto self-stretch sm:self-auto">
                <div className="bg-slate-950 p-2 px-3.5 rounded-xl border border-slate-850 text-center flex-1 sm:flex-initial min-w-[85px]">
                  <div className="text-[9px] text-slate-500 font-mono uppercase font-black">Modules</div>
                  <div className="font-black text-slate-100 text-sm mt-0.5">4</div>
                </div>
                <div className="bg-slate-950 p-2 px-3.5 rounded-xl border border-slate-850 text-center flex-1 sm:flex-initial min-w-[100px]">
                  <div className="text-[9px] text-slate-500 font-mono uppercase font-black">Certified</div>
                  <div className="font-black text-emerald-400 text-sm mt-0.5 flex items-center justify-center gap-1">
                    {passedCount} / 4
                    {isFullyCertified && <span>🏆</span>}
                  </div>
                </div>
                <div className="bg-slate-950 p-2 px-3.5 rounded-xl border border-slate-850 text-center flex-1 sm:flex-initial min-w-[90px]">
                  <div className="text-[9px] text-slate-500 font-mono uppercase font-black">Est. ROI</div>
                  <div className="font-black text-cyan-400 text-sm mt-0.5 animate-pulse">10x+</div>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive Progress Bar */}
            <div className="pt-2 border-t border-slate-850/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex-1 space-y-1.5 text-left">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400 font-bold uppercase">Academy Certification Progress:</span>
                  <span className="text-indigo-400 font-black">{progressPercent}% Completed</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent || 5}%` }} 
                  />
                </div>
              </div>

              {isFullyCertified ? (
                <div className="bg-emerald-950/40 border border-emerald-500/40 p-2 px-4 rounded-xl flex items-center gap-2 md:self-end animate-bounce">
                  <Award className="h-5 w-5 text-emerald-400" />
                  <div className="text-[10px] text-left">
                    <span className="font-bold text-white block uppercase font-mono">🏆 certified system guru</span>
                    <span className="text-emerald-400 block font-mono text-[8.5px]">You have passed all tactical examinations!</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-850 p-2 px-3.5 rounded-xl flex items-center gap-2 text-left shrink-0">
                  <BookOpen className="h-4 w-4 text-slate-550" />
                  <div className="text-[9.5px]">
                    <span className="text-slate-400 font-sans block leading-normal">
                      Pass all 4 quick Module Scenario Quizzes below to unlock your <strong className="text-white">CapyStack Mastery Badge</strong>!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE COURSE CURRICULUM SCREEN */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold">Comprehensive Audio / Class Curriculum</span>
              <h3 className="text-base font-black text-white uppercase tracking-tight font-sans">
                video modules
              </h3>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 font-extrabold pb-0.5">
              Click any module card to review lessons
            </span>
          </div>

          {/* LESSON ACCORDION CARDS */}
          <div className="space-y-3">
            {lessons.map((lesson, idx) => {
              const isPassed = lessonPassed[lesson.id];
              return (
                <div 
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                    activeLesson === idx 
                      ? "bg-slate-950 border-indigo-500/50 shadow-inner" 
                      : "bg-slate-905 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                          activeLesson === idx ? "bg-indigo-950 text-indigo-400 border border-indigo-900" : "bg-slate-950 text-slate-500"
                        }`}>
                          {lesson.badge}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">{lesson.duration}</span>
                        {isPassed && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-black uppercase bg-emerald-950/80 border border-emerald-900 text-emerald-400 flex items-center gap-1">
                            <span>✅</span> Certified
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-white uppercase tracking-normal mt-1">
                        {lesson.title}
                      </h4>
                    </div>
                    {isPassed ? (
                      <div className="h-6 w-6 rounded-lg bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs select-none">
                        ✓
                      </div>
                    ) : (
                      <div className={`h-6 w-6 rounded-lg flex items-center justify-center font-mono text-xs font-black transition ${
                        activeLesson === idx ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-500"
                      }`}>
                        {idx + 1}
                      </div>
                    )}
                  </div>

                {activeLesson === idx && (
                  <div className="mt-4 pt-4 border-t border-slate-850 space-y-3 animate-fadeIn">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {lesson.description}
                    </p>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850/60 space-y-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black block">Key Tactical Takeaways</span>
                      <ul className="text-[10px] text-slate-350 space-y-1.5 font-sans leading-relaxed">
                        {lesson.takeaways.map((tk, index) => (
                          <li key={index} className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <span>{tk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1.5 font-mono">
                      <span className="text-slate-500">Practice Tool: <strong className="text-slate-300 font-bold">{lesson.interactiveTool}</strong></span>
                      <span className="text-indigo-400 font-bold flex items-center gap-1">Module Active • Learn Now <ChevronRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>

          {/* DYNAMIC ACTIVE LESSON STUDIO & ACTION WORKSPACE */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-secondary pb-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-indigo-950/80 border border-indigo-850 rounded text-xs select-none">🎓</span>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                    Lesson Lab {activeLesson + 1} • Interactive Training
                  </span>
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight font-sans mt-1">
                  Practicing: {lessons[activeLesson].title}
                </h4>
              </div>
              <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full uppercase border border-slate-850 select-none">
                ACTIVE LAB SESSION
              </span>
            </div>

            {/* Core Lesson Detail Panel */}
            <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-2xl border border-slate-850/60 leading-relaxed text-left">
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {lessons[activeLesson].detailedOverview}
              </p>

              {/* Trending Tools & Marketing Tactics pill tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[10px]">
                <div className="space-y-1.5 p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                  <span className="text-[9px] font-mono text-indigo-350 font-black uppercase tracking-wider block text-left">🛠️ Trending AI Tools Taught</span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {lessons[activeLesson].trendingTools.map((t, idx) => (
                      <span key={idx} className="bg-indigo-950/40 text-indigo-300 text-[9px] font-mono px-2 py-0.5 rounded border border-indigo-900/40 font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                  <span className="text-[9px] font-mono text-emerald-350 font-black uppercase tracking-wider block text-left">📈 Strategic Tactics Trained</span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {lessons[activeLesson].marketingTactics.map((t, idx) => (
                      <span key={idx} className="bg-emerald-950/20 text-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded border border-emerald-900/40 font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Directional Connection to CapyStack Features */}
              <div className="p-3 bg-slate-950/80 border border-indigo-500/10 rounded-xl space-y-1.5 text-left">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                  ⭐ WHAT YOU CAN DO WITH THIS CAPYSTACK APP
                </span>
                <p className="text-[10px] text-slate-300 leading-normal font-sans">
                  {lessons[activeLesson].howToApply}
                </p>
                <div className="text-[9px] font-mono text-slate-500 pt-1">
                  🎯 Active Tab To Practice: <span className="text-white font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono">{lessons[activeLesson].actionTab}</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE WORKSPACE ELEMENT DEPENDING ON THE ACTIVE LESSON */}
            {activeLesson === 0 && (
              <div className="bg-slate-950/80 border border-indigo-500/20 p-4 rounded-2xl space-y-3.5">
                <div className="flex items-center gap-2 text-left">
                  <span className="text-md">⚡</span>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wide">
                      Practice Tool: SaaS Expense Collapse Calculator
                    </h4>
                    <p className="text-[10px] text-slate-400 font-sans leading-normal">
                      See how CapyStack collapses individual software expenses down to a single clean workflow.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono text-[10px]">
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-850">
                    <span className="block text-slate-500 font-bold">MAPS SCRAPERS</span>
                    <span className="block text-rose-450 font-black text-xs line-through">$90/mo</span>
                    <span className="text-[8px] text-slate-600 block mt-0.5">Unified inside App</span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-850">
                    <span className="block text-slate-500 font-bold">SEO CITATIONS</span>
                    <span className="block text-rose-450 font-black text-xs line-through">$49/mo</span>
                    <span className="text-[8px] text-slate-600 block mt-0.5">GEO Scorecard Tab</span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-850">
                    <span className="block text-slate-500 font-bold">SOCIAL PLANNERS</span>
                    <span className="block text-rose-450 font-black text-xs line-through">$49/mo</span>
                    <span className="text-[8px] text-slate-600 block mt-0.5">Omni-Publisher Tab</span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-850">
                    <span className="block text-slate-500 font-bold">VIDEO & CLONES</span>
                    <span className="block text-rose-450 font-black text-xs line-through">$124/mo</span>
                    <span className="text-[8px] text-slate-600 block mt-0.5">Academy teleprompter</span>
                  </div>
                </div>

                <div className="bg-slate-955 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-left">
                  <span className="text-slate-400 font-sans">Divided SaaS overhead: <strong className="text-rose-450 text-xs font-mono line-through font-bold">$312/mo</strong></span>
                  <span className="text-emerald-400 font-black font-mono animate-pulse uppercase tracking-wide">
                    CapyStack: $29/mo (Collapse 91% Expense)
                  </span>
                </div>
              </div>
            )}

            {activeLesson === 1 && (
              <div className="bg-slate-950/80 border border-cyan-500/20 p-4 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between text-left">
                  <div>
                    <h5 className="text-[11px] font-mono text-cyan-400 font-extrabold uppercase">
                      Practice Tool: GEO Simulator & Audit Report
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-sans">
                      Test any local business URL to diagnose their citations and LLM visibility gaps.
                    </p>
                  </div>
                  <span className="text-[8.5px] bg-cyan-950 text-cyan-400 border border-cyan-900 px-2.5 py-0.5 rounded uppercase font-mono font-black">
                    LOCAL AUDIT SYSTEM
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Target Brand Web URL</label>
                    <input 
                      type="text" 
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500 text-[11px] font-mono"
                      placeholder="e.g. www.dentistinboulder.com"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Business Category</label>
                    <select 
                      value={targetIndustry}
                      onChange={(e) => setTargetIndustry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500 text-[11px] font-sans"
                    >
                      <option value="Chiropractor">🌱 Chiropractor / Physical Rehab</option>
                      <option value="Dentist">🦷 General Dentistry / Medical</option>
                      <option value="Consulting">💼 Agency / Systems Coach</option>
                      <option value="Contracting">🛠️ HVAC / Residential Plumbing</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAuditing(true);
                    setAuditProgress(0);
                    setAuditResult(null);
                    
                    const interval = setInterval(() => {
                      setAuditProgress(prev => {
                        if (prev >= 100) {
                          clearInterval(interval);
                          setIsAuditing(false);
                          
                          const isGreatCategory = targetIndustry === "Consulting" ? 75 : 42;
                          setAuditResult({
                            perplexityScore: Math.floor(Math.random() * 20) + isGreatCategory,
                            chatGptSearchScore: Math.floor(Math.random() * 25) + isGreatCategory - 10,
                            geminiScore: Math.floor(Math.random() * 20) + isGreatCategory + 5,
                            missingSignals: [
                              "Missing structured LocalBusiness JSON-LD schema tags in script header",
                              `Poor local Yelp & Google Maps semantic reviews for ${targetIndustry}`,
                              "Lacks external high-domain authority mentions (LinkedIn, Medium, GitHub)"
                            ],
                            priorityAction: `Generate localized ${targetIndustry} citation posts on Omni-Social & sync maps webhook.`
                          });
                          return 100;
                        }
                        return prev + 25;
                      });
                    }, 250);
                  }}
                  disabled={isAuditing}
                  className="w-full bg-cyan-500 hover:bg-cyan-450 transition text-slate-950 font-bold py-2 rounded-xl text-[11px] uppercase tracking-wider font-mono flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isAuditing ? `Crawling Local Maps Engine... ${auditProgress}%` : "⚡ Simulate GEO Engine Scan"}
                </button>

                {/* Simulated Result outputs */}
                {auditResult && (
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-3 font-mono text-[10px] text-left animate-fade-in">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-905 border border-slate-850 p-2 rounded">
                        <span className="text-slate-500 block text-[8px] uppercase font-bold">Perplexity</span>
                        <span className={`text-xs font-black block mt-0.5 ${auditResult.perplexityScore > 60 ? "text-cyan-400" : "text-amber-400"}`}>
                          {auditResult.perplexityScore}% Visibility
                        </span>
                      </div>
                      <div className="bg-slate-905 border border-slate-850 p-2 rounded">
                        <span className="text-slate-500 block text-[8px] uppercase font-bold">ChatGPT Search</span>
                        <span className={`text-xs font-black block mt-0.5 ${auditResult.chatGptSearchScore > 60 ? "text-cyan-400" : "text-amber-400"}`}>
                          {auditResult.chatGptSearchScore}% Visibility
                        </span>
                      </div>
                      <div className="bg-slate-905 border border-slate-850 p-2 rounded">
                        <span className="text-slate-500 block text-[8px] uppercase font-bold">Gemini Engine</span>
                        <span className={`text-xs font-black block mt-0.5 ${auditResult.geminiScore > 60 ? "text-cyan-400" : "text-amber-400"}`}>
                          {auditResult.geminiScore}% Visibility
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 bg-slate-900/50 p-2.5 rounded border border-slate-850 text-left">
                      <span className="text-rose-400 font-extrabold uppercase text-[8px] block">⚠️ Identified Citation Gaps:</span>
                      <ul className="space-y-1 text-slate-400 text-[9px] list-disc pl-3 font-sans">
                        {auditResult.missingSignals.map((sig: string, sIdx: number) => (
                          <li key={sIdx}>{sig}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-cyan-950/20 border border-cyan-900/30 p-2.5 rounded-lg text-cyan-300 text-[10px] leading-normal font-sans">
                      <strong className="text-cyan-400 font-black block uppercase tracking-wide text-xs mb-1">🚀 RECOMMENDED CLIENT OUTREACH LINK:</strong>
                      "Hey, I ran an automated GEO diagnostic on {targetUrl}. You are currently invisible in Gemini and ChatGPT search queries. Let's schedule a screen-share. I will use CapyStack's citation scorecard to clear these 3 issues in under 10 minutes flat."
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeLesson === 2 && (
              <div className="bg-slate-950/80 border border-indigo-500/20 p-4 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between text-left">
                  <div>
                    <h5 className="text-[11px] font-mono text-indigo-400 font-extrabold uppercase">
                      Practice Tool: Instant Social Copy Builder
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-sans">
                      See how CapyStack formats and builds trending zero-fluff copy dynamically.
                    </p>
                  </div>
                  <span className="text-[8px] bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded uppercase font-mono font-bold select-none">
                    PRE-SET TONE PILOT
                  </span>
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Choose Seed Topic:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button 
                      type="button"
                      onClick={() => { setSelectedTopic("automation"); setCopiedStatus(false); }}
                      className={`p-2 rounded-xl border text-[9.5px] truncate transition cursor-pointer font-mono font-medium ${selectedTopic === "automation" ? "bg-indigo-950 border-indigo-500 text-indigo-300 font-black" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-white"}`}
                    >
                      🤖 Automating Stack
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setSelectedTopic("local-seo"); setCopiedStatus(false); }}
                      className={`p-2 rounded-xl border text-[9.5px] truncate transition cursor-pointer font-mono font-medium ${selectedTopic === "local-seo" ? "bg-indigo-950 border-indigo-500 text-indigo-300 font-black" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-white"}`}
                    >
                      📍 Maps Lead Conquest
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setSelectedTopic("scaling"); setCopiedStatus(false); }}
                      className={`p-2 rounded-xl border text-[9.5px] truncate transition cursor-pointer font-mono font-medium ${selectedTopic === "scaling" ? "bg-indigo-950 border-indigo-500 text-indigo-300 font-black" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-white"}`}
                    >
                      👑 High Ticket Retainers
                    </button>
                  </div>
                </div>

                {/* Post view text box */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl font-mono text-[10px] leading-relaxed text-slate-300 text-left relative overflow-hidden">
                  <div className="absolute right-2.5 top-2">
                    <button
                      type="button"
                      onClick={() => {
                        const copyTxt = selectedTopic === "automation" 
                          ? "Legacy tech stacks are the silent killers of consulting gross margins. I consolidated databases, outbound scrapers, and copy tools to collapse SaaS overhead by 91%. Running on auto-pilot via CapyStack containers. Stop paying divided bills."
                          : selectedTopic === "local-seo"
                            ? "AI Search (GEO) is eating standard SEO. If you represent regional dentists or trades but aren't cited in Gemini or ChatGPT searches, you're invisible. Use structured local JSON-LD indicators & targeted physical maps mentions to establish search authority."
                            : "Trading physical hours for custom service deliverables keeps your agency trapped in high-friction cycles. Shift raw notes to ElevenLabs synth voice replicas. Deploy digital academy loops to deliver coaching retainers camera-free.";
                        navigator.clipboard.writeText(copyTxt);
                        setCopiedStatus(true);
                        setTimeout(() => setCopiedStatus(false), 2000);
                      }}
                      className="text-[9px] bg-slate-950 hover:bg-slate-850 p-1 px-2.5 rounded-lg border border-slate-800 text-indigo-400 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-2.5 w-2.5" />
                      <span>{copiedStatus ? "Copied!" : "Copy Post"}</span>
                    </button>
                  </div>

                  <span className="text-[8px] font-bold text-slate-500 block uppercase mb-1.5 select-none">Generated Zero-Fluff Output:</span>
                  
                  {selectedTopic === "automation" && (
                    <p className="pr-16 text-[9.5px]">
                      📢 Legacy tech stacks are the silent killers of consulting gross margins.<br/><br/>
                      I consolidated databases, outbound scrapers, and copy generation tools to collapse SaaS overhead by 91%.<br/><br/>
                      All pipeline data runs on auto-pilot via unified containers. Stop paying divided software bills.<br/><br/>
                      <span className="text-indigo-400 font-bold font-mono">#OperationsModernization #SystemsCoaching #CapyStack</span>
                    </p>
                  )}

                  {selectedTopic === "local-seo" && (
                    <p className="pr-16 text-[9.5px]">
                      🎯 AI Search Optimization (GEO) is eating traditional SEO alive.<br/><br/>
                      If you manage dental, medical, or contraction brands but aren't citing them directly inside Perplexity or Siri search queries, they are completely invisible to high-intent leads.<br/><br/>
                      Start prioritizing structured JSON-LD schemas over raw meta keyword stuffing.<br/><br/>
                      <span className="text-indigo-400 font-bold font-mono">#GEO #LocalMapsScraping #LeadCitations</span>
                    </p>
                  )}

                  {selectedTopic === "scaling" && (
                    <p className="pr-16 text-[9.5px]">
                      👑 Trading premium human hours for low-leverage execution stops you from scaling capacity.<br/><br/>
                      The solution: Stop manually filming training videos. Render structured lessons on-demand with persistent voice replicas & camera-free digital video presenters.<br/><br/>
                      Deliver identical authority in 3% of the normal filming time.<br/><br/>
                      <span className="text-indigo-400 font-bold font-mono">#HighTicketCOA #InfiniteScale #VirtualPresenter</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeLesson === 3 && (
              <div className="bg-slate-950/80 border border-pink-500/20 p-4 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between text-left">
                  <div>
                    <h5 className="text-[11px] font-mono text-pink-400 font-extrabold uppercase">
                      Practice Tool: Teleprompter & Media Synthesizer
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-sans">
                      Build virtual vocal clones and lip-synced presenters programmatically.
                    </p>
                  </div>
                  <span className="text-[8px] bg-pink-950 text-pink-400 border border-pink-900 px-2 py-0.5 rounded uppercase font-mono font-bold select-none">
                    CAMERA FREE CONTROL
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] text-left">
                  <button
                    type="button"
                    onClick={() => { setSelectedScriptType("hook"); setSynthesizedVideo(null); }}
                    className={`p-2 rounded-xl border text-[9.5px] truncate transition cursor-pointer font-bold ${selectedScriptType === "hook" ? "bg-pink-950/40 border-pink-500 text-pink-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-white"}`}
                  >
                    🔥 The Hook Script
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedScriptType("deep-dive"); setSynthesizedVideo(null); }}
                    className={`p-2 rounded-xl border text-[9.5px] truncate transition cursor-pointer font-bold ${selectedScriptType === "deep-dive" ? "bg-pink-950/40 border-pink-500 text-pink-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-white"}`}
                  >
                    🧠 Detailed Tutorial
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedScriptType("closing"); setSynthesizedVideo(null); }}
                    className={`p-2 rounded-xl border text-[9.5px] truncate transition cursor-pointer font-bold ${selectedScriptType === "closing" ? "bg-pink-950/40 border-pink-500 text-pink-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-white"}`}
                  >
                    💸 Retainer CTA
                  </button>
                </div>

                {/* Script Display */}
                <div className="bg-slate-905 border border-slate-850 p-3 rounded-xl font-mono text-[9.5px] leading-relaxed text-slate-300 text-left relative overflow-hidden">
                  <span className="text-[8px] font-bold text-slate-500 block uppercase mb-1.5 select-none">Teleprompter Output Script:</span>
                  {selectedScriptType === "hook" && (
                    <div className={teleprompterPlaying ? "animate-pulse text-indigo-300" : "text-slate-300"}>
                      "Welcome back. If you are a scaling coach losing hours every week recording script takes and struggling with editing frames, today we collapse that limit entirely with synthetic clones."
                    </div>
                  )}
                  {selectedScriptType === "deep-dive" && (
                    <div className={teleprompterPlaying ? "animate-pulse text-indigo-300" : "text-slate-300"}>
                      "Let's trace the exact system blueprint. First, extract physical Maps records with citation faults. Next, feed those deficits to a structured tone script, and overlay them on synthetic media instantly."
                    </div>
                  )}
                  {selectedScriptType === "closing" && (
                    <div className={teleprompterPlaying ? "animate-pulse text-indigo-300" : "text-slate-300"}>
                      "Stop wasting time in low-leverage production locks. Grab our 7-Day Access Pass below, initialize your persistent digital twin, and capture regional map consulting deals today."
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTeleprompterPlaying(!teleprompterPlaying)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-mono uppercase font-bold transition flex items-center justify-center gap-1 cursor-pointer ${teleprompterPlaying ? "bg-amber-600 text-slate-950 hover:bg-amber-550" : "bg-slate-950 text-indigo-400 hover:bg-slate-900 border border-slate-850"}`}
                  >
                    <span>{teleprompterPlaying ? "⏸ Pause Prompter" : "▶ Scroll Prompter"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSynthesizing(true);
                      setSynthesizeProgress(0);
                      setSynthesizedVideo(null);
                      const interval = setInterval(() => {
                        setSynthesizeProgress(prev => {
                          if (prev >= 100) {
                            clearInterval(interval);
                            setIsSynthesizing(false);
                            setSynthesizedVideo({
                              syntheticVoiceId: "eleven_cloned_voice_v3.mp3",
                              avatarVideoUrl: "https://synthetic.media/outputs/rep_lovina_v2.mp4",
                              renderSeconds: "1.4s",
                              fileFormat: "FHD 1080p MP4 H.264"
                            });
                            return 100;
                          }
                          return prev + 20;
                        });
                      }, 250);
                    }}
                    disabled={isSynthesizing}
                    className="flex-1 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-950 text-slate-950 disabled:text-slate-500 font-bold py-2 rounded-xl text-[10px] uppercase font-mono tracking-wider flex items-center justify-center gap-1 border border-transparent disabled:border-slate-850 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSynthesizing ? `Rendering AV Clone... ${synthesizeProgress}%` : "⚡ Synthesize AI Video"}</span>
                  </button>
                </div>

                {synthesizedVideo && (
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 space-y-2.5 font-mono text-[10px] animate-fade-in text-left">
                    <span className="text-emerald-400 font-black uppercase text-[8px] block flex items-center gap-1.5 text-left">
                      <Volume2 className="h-3.5 w-3.5" /> ✅ SYNTHESIS COMPLETE (STUDIO FREE SUCCESS)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-slate-400">
                      <div>
                        <span className="text-slate-600 block text-[7.5px] uppercase">Audio Output Fact</span>
                        <span className="text-slate-200 block truncate">{synthesizedVideo.syntheticVoiceId}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[7.5px] uppercase font-medium">Synthetic Video Link</span>
                        <span className="text-slate-200 block truncate">{synthesizedVideo.avatarVideoUrl}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[7.5px] uppercase font-bold text-slate-400">Media Spec Format</span>
                        <span className="text-slate-200 block">{synthesizedVideo.fileFormat}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[7.5px] uppercase">Bypass Production Time</span>
                        <span className="text-emerald-400 font-bold">{synthesizedVideo.renderSeconds} (Instant Render)</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-850 text-slate-400 text-[8.5px]">
                      This high-fidelity clip is prepared to download or schedule directly onto social media accounts via our system!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* INTERACTIVE COMPREHENSIVE QUIZ SECTION FOR DEEP-DIVE INSTRUCTION */}
            {(() => {
              const quizQuestions = MODULE_QUIZZES[activeLesson];
              const isSubmitted = lessonSubmitted[activeLesson];
              const isPassed = lessonPassed[activeLesson];
              const currentScore = lessonScore[activeLesson] || 0;
              const [unanswered, setUnanswered] = useState<boolean>(false);

              return (
                <div className="mt-6 pt-6 border-t border-slate-800 space-y-5 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[9.5px] font-mono font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 select-none font-bold">
                        <span>📝</span> MODULE {activeLesson + 1} KNOWLEDGE CHECK &amp; SCENARIO SIMULATOR
                      </span>
                      <p className="text-[10px] text-slate-400 font-sans">
                        Apply lessons to real-world consultant scenarios to earn your module certification.
                      </p>
                    </div>
                    {isPassed && (
                      <span className="text-[9.5px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-900 px-2.5 py-0.5 rounded-full uppercase animate-pulse self-start sm:self-auto">
                        🎉 Module Passed!
                      </span>
                    )}
                  </div>

                  {isSubmitted ? (
                    <div className="space-y-5 animate-fade-in">
                      {/* Score display card */}
                      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                        isPassed 
                          ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" 
                          : "bg-rose-950/20 border-rose-500/30 text-rose-300"
                      }`}>
                        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                          <span className="text-2xl p-1 bg-slate-950/40 rounded border border-slate-800 select-none font-sans">
                            {isPassed ? "🏆" : "⚠️"}
                          </span>
                          <div>
                            <span className="text-[10.5px] font-mono font-black uppercase tracking-wider block font-bold">
                              {isPassed ? "Tactical Certification Approved!" : "Re-examination Required"}
                            </span>
                            <span className="text-[9.5px] text-slate-400 font-sans block mt-0.5 leading-relaxed">
                              {isPassed 
                                ? "Excellent precision. Lovina Robinson approves your command of these automation tactics." 
                                : "You missed a vital architectural safety boundary. Review the explanations below and try again!"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto">
                          <div className="bg-slate-950/80 p-2 px-3.5 rounded-lg border border-slate-850 text-center">
                            <span className="text-[8px] font-mono font-bold text-slate-500 block uppercase">Your Score</span>
                            <span className="font-extrabold text-white font-mono text-sm leading-none block mt-1">
                              {currentScore} / 3 Correct
                            </span>
                          </div>

                          {!isPassed && (
                            <button
                              type="button"
                              onClick={() => {
                                setLessonSubmitted(prev => ({ ...prev, [activeLesson]: false }));
                                setLessonPassed(prev => ({ ...prev, [activeLesson]: false }));
                                setUnanswered(false);
                              }}
                              className="bg-rose-600 hover:bg-rose-500 text-slate-950 font-black p-2 px-3 rounded-lg text-[10px] font-mono uppercase transition cursor-pointer"
                            >
                              🔄 Retry Quiz
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Rationale feedback list */}
                      <div className="space-y-4">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                          🔍 Rationale &amp; Strategic Coaching Feedback:
                        </span>

                        {quizQuestions.map((q, qIndex) => {
                          const selectedIdx = quizAnswers[q.id];
                          const isCorrect = selectedIdx === q.correctIndex;
                          return (
                            <div key={q.id} className="bg-slate-955 border border-slate-855 p-3.5 rounded-xl space-y-2.5 text-left relative">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-[11px] font-bold text-white font-sans leading-relaxed">
                                  {qIndex + 1}. {q.question}
                                </span>
                                <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded font-bold uppercase select-none ${
                                  isCorrect ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-rose-950 text-rose-400 border border-rose-900"
                                }`}>
                                  {isCorrect ? "Correct" : "Incorrect"}
                                </span>
                              </div>

                              <div className="text-[10px] font-sans pl-1.5 border-l border-slate-800 space-y-1">
                                <p className="text-slate-400">
                                  <strong className="text-slate-300">Your Answer:</strong> {q.options[selectedIdx] !== undefined ? q.options[selectedIdx] : "None selected"}
                                </p>
                                {!isCorrect && (
                                  <p className="text-emerald-400">
                                    <strong className="font-bold">Correct Answer:</strong> {q.options[q.correctIndex]}
                                  </p>
                                )}
                              </div>

                              <div className="bg-slate-900/60 p-2.5 px-3 rounded-xl border border-slate-855 text-[10px] text-slate-300 leading-normal font-sans italic">
                                <span className="font-mono font-black text-[8.5px] uppercase text-indigo-400 not-italic block mb-0.5">💡 LOVINA'S STRATEGIC INSIGHT:</span>
                                "{q.rationale}"
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {isPassed && (
                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-sans text-emerald-300">
                          <span>Complete other modules to unlock final certified VIP system status!</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (activeLesson < 3) {
                                setActiveLesson(activeLesson + 1);
                              }
                            }}
                            className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 p-1.5 px-3 rounded-lg text-[9px] font-mono font-black transition cursor-pointer w-full sm:w-auto"
                          >
                            Next Module ➔
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-5 animate-fade-in">
                      {quizQuestions.map((q, qIndex) => {
                        const selectedIdx = quizAnswers[q.id];
                        return (
                          <div key={q.id} className="space-y-2 text-left">
                            <span className="text-[11px] font-bold text-slate-200 block leading-normal font-sans">
                              {qIndex + 1}. {q.question}
                            </span>

                            <div className="grid grid-cols-1 gap-1.5 pl-2">
                              {q.options.map((opt, optIndex) => {
                                const isSelected = selectedIdx === optIndex;
                                return (
                                  <button
                                    key={optIndex}
                                    type="button"
                                    onClick={() => {
                                      setQuizAnswers(prev => ({ ...prev, [q.id]: optIndex }));
                                      setUnanswered(false);
                                    }}
                                    className={`w-full text-left p-2.5 rounded-xl border text-[10.5px] transition font-sans cursor-pointer ${
                                      isSelected
                                        ? "bg-indigo-950/45 border-indigo-500 text-white font-black shadow-inner shadow-indigo-500/5 animate-pulse"
                                        : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {unanswered && (
                        <div className="p-2.5 bg-rose-950/40 border border-rose-900/50 rounded-xl text-rose-400 text-[10px] text-center font-mono font-bold animate-pulse">
                          ⚠️ PLEASE CHOOSE AN ANSWER FOR ALL 3 SCENARIO QUESTIONS BEFORE SUBMITTING!
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            let score = 0;
                            let hasUnanswered = false;
                            quizQuestions.forEach(q => {
                              const ans = quizAnswers[q.id];
                              if (ans === undefined) {
                                hasUnanswered = true;
                              } else if (ans === q.correctIndex) {
                                score += 1;
                              }
                            });

                            if (hasUnanswered) {
                              setUnanswered(true);
                              return;
                            }

                            const passed = score === 3;
                            setLessonScore(prev => ({ ...prev, [activeLesson]: score }));
                            setLessonPassed(prev => ({ ...prev, [activeLesson]: passed }));
                            setLessonSubmitted(prev => ({ ...prev, [activeLesson]: true }));
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-505 hover:scale-[1.005] active:scale-[0.995] text-slate-950 font-black py-2.5 rounded-xl text-[10.5px] uppercase font-mono tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10"
                        >
                          <span>Submit Evaluation Answers</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* UNIFIED TECH CONNECTOR HUB */}
          <div className="bg-slate-955 border border-slate-850 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-extrabold">Unified Stack Integrator</span>
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-tight font-sans">
                When & How To Connect Your Core Stack
              </h4>
              <p className="text-[10px] text-slate-400 leading-normal font-sans">
                Master the step-by-step connectivity mechanics for APIs, MCPs, workflow routers, video clones, and transaction processors to activate your system.
              </p>
            </div>

            {/* SEGMENT PILLS */}
            <div className="grid grid-cols-4 gap-1 border-b border-slate-900 pb-2">
              <button
                onClick={() => setActiveIntegrationTab("logic")}
                type="button"
                className={`py-1.5 px-1.5 rounded-lg text-center font-mono text-[8.5px] font-bold transition-all ${
                  activeIntegrationTab === "logic" 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                🔀 Workflow
              </button>
              <button
                onClick={() => setActiveIntegrationTab("media")}
                type="button"
                className={`py-1.5 px-1.5 rounded-lg text-center font-mono text-[8.5px] font-bold transition-all ${
                  activeIntegrationTab === "media" 
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-600/15"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                🎬 AI Twins
              </button>
              <button
                onClick={() => setActiveIntegrationTab("ide")}
                type="button"
                className={`py-1.5 px-1.5 rounded-lg text-center font-mono text-[8.5px] font-bold transition-all ${
                  activeIntegrationTab === "ide" 
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/15"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                💻 Local IDE
              </button>
              <button
                onClick={() => setActiveIntegrationTab("finance")}
                type="button"
                className={`py-1.5 px-1.5 rounded-lg text-center font-mono text-[8.5px] font-bold transition-all ${
                  activeIntegrationTab === "finance" 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/15"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                💳 Checkout
              </button>
            </div>

            {/* TAB PANES */}
            <div className="space-y-3 pt-1">
              {activeIntegrationTab === "logic" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[9.5px] font-mono bg-indigo-950/20 p-2 rounded-lg border border-indigo-900/30">
                    <span className="text-indigo-400 font-bold">🔀 n8n • Make.com • Activepieces</span>
                    <span className="text-[8px] text-slate-500 uppercase">Logic webhook router</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[8.5px] font-mono text-indigo-300 uppercase font-black block">💡 WHEN TO CONFIGURE</span>
                      <p className="text-[10px] font-sans text-slate-350 leading-normal">
                        Wire this up immediately after running local lead scraping runs. It transfers identified Maps citations gaps straight into your outreach lists automatically.
                      </p>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-mono text-indigo-300 uppercase font-black block">🔗 CONNECTIVITY ACTIONS & APIS</span>
                      <p className="text-[10px] font-sans text-slate-350 leading-normal">
                        Generate a customized webbook webhook node inside <strong className="text-white">n8n</strong> (perfect for self-hosted and deep logic maps), <strong className="text-white">Make.com</strong> (best for instant pre-built social app sheets), or <strong className="text-white">Activepieces</strong> (premium, lightweight open-source logic alternatives).
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-lg font-mono text-[8.5px] space-y-1">
                      <span className="text-indigo-400 font-bold block"># Webhook Payload Outward JSON structure:</span>
                      <pre className="text-slate-450 overflow-x-auto">
{`{
  "citation_rating": "44%",
  "company_name": "Boulder Orthopedic Clinic",
  "missing_sources": ["Bing Place Guide", "Apple Maps Connect"],
  "prospect_phone": "+1-303-555-0144",
  "custom_coaching_offer": "$3,500/seat Consulting Plan"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {activeIntegrationTab === "media" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[9.5px] font-mono bg-pink-950/20 p-2 rounded-lg border border-pink-900/30">
                    <span className="text-pink-400 font-bold">🎬 HeyGen • ElevenLabs • Remotion</span>
                    <span className="text-[8px] text-slate-500 uppercase">Virtual Audio/Video Twin</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[8.5px] font-mono text-pink-300 uppercase font-black block">💡 WHEN TO CONFIGURE</span>
                      <p className="text-[10px] font-sans text-slate-350 leading-normal">
                        Whenever the Academy Teleprompter finishes spitting out text lesson scripts, trigger voice and video twin synthesis programmatic requests.
                      </p>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-mono text-pink-300 uppercase font-black block">🔗 CONNECTIVITY ACTIONS & APIS</span>
                      <p className="text-[10px] font-sans text-slate-350 leading-normal">
                        1. Capture lesson text scripts. 2. Post to <strong className="text-white">ElevenLabs v1 Text-to-Speech API</strong> using your Persistent Voice Clone ID to capture raw audio MP3 URLs. 3. Fire that audio URL directly to <strong className="text-white">HeyGen Video Dispatch API</strong> along with your custom digital avatar ID. 4. Programmatically overlay animated captions, borders, and progression ticks with code using <strong className="text-white">Remotion</strong>!
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-lg font-mono text-[8.5px] space-y-1">
                      <span className="text-pink-400 font-bold block"># HeyGen Twin Render Request Payload:</span>
                      <pre className="text-slate-450 overflow-x-auto">
{`POST https://api.heygen.com/v1/video/generate
Headers: { "X-Api-Key": "YOUR_KEY" }
{
  "video_setting": {
    "avatar_id": "your_avatar_replica_01",
    "voice_setting": { "voice_id": "elevenlabs_cloned_voice" }
  },
  "audio_src_url": "https://cdn.elevenlabs.io/outputs/voice_lesson.mp3"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {activeIntegrationTab === "ide" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[9.5px] font-mono bg-amber-950/20 p-2 rounded-lg border border-amber-900/30">
                    <span className="text-amber-400 font-bold">💻 VS Code • Claude Code • MCPs</span>
                    <span className="text-[8px] text-slate-500 uppercase">Coding Suite Integrator</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[8.5px] font-mono text-amber-300 uppercase font-black block">💡 WHEN TO CONFIGURE</span>
                      <p className="text-[10px] font-sans text-slate-350 leading-normal">
                        Set this up inside your local environment immediately to customize forms, build extra database structures, or automate system deployments.
                      </p>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-mono text-amber-300 uppercase font-black block">🔗 CONNECTIVITY ACTIONS & APIS</span>
                      <p className="text-[10px] font-sans text-slate-350 leading-normal">
                        Hook your git directory repository up to VS Code. Fire up the local terminal and invoke anthropic's <strong className="text-white">Claude Code</strong> assistant. Run custom Model Context Protocol (<strong className="text-white font-mono">MCP</strong>) configurations to synchronize your local file system, write to files, or execute direct SQLite schema updates safely.
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-lg font-mono text-[8.5px] space-y-1">
                      <span className="text-amber-400 font-bold block"># Initialize VS Code Terminal Claude Code:</span>
                      <pre className="text-slate-450 overflow-x-auto">
{`$ npm install -g @anthropic-ai/claude-code
# Open your CapyStack workspace on VS Code and call:
$ claude
# Claude Code will run locally & execute code updates natively.`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {activeIntegrationTab === "finance" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[9.5px] font-mono bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30">
                    <span className="text-emerald-400 font-bold">💳 Stripe Checkout • Hermes VSP</span>
                    <span className="text-[8px] text-slate-500 uppercase">Billing & messaging relays</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[8.5px] font-mono text-emerald-350 uppercase font-black block">💡 WHEN TO CONFIGURE</span>
                      <p className="text-[10px] font-sans text-slate-350 leading-normal">
                        When launching your high-ticket scaling group cohorts ($3,500/seat) and automating student digital onboarding pipelines.
                      </p>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-mono text-emerald-350 uppercase font-black block">🔗 CONNECTIVITY ACTIONS & APIS</span>
                      <p className="text-[10px] font-sans text-slate-350 leading-normal">
                        Link payments through standard Stripe payment forms or checkout cards. Listen to Stripe's webhooks for positive paid responses, then immediately route callbacks to <strong className="text-white">Hermes VSP</strong> (Virtual Service Provider relays) to send customized welcome SMS messages, dispatch access tokens, and send onboarding briefs.
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-lg font-mono text-[8.5px] space-y-1">
                      <span className="text-emerald-400 font-bold block"># Checkout Completed Webhook Routing payload:</span>
                      <pre className="text-slate-450 overflow-x-auto">
{`{
  "event_id": "evt_stripe_payment_success",
  "seat_fees": "$3,500.00 USD",
  "client_email": "lovinarobinsoncoaching@gmail.com",
  "deliver_playbook": "hermes_secure_sms_relay"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-900 text-[9.5px] leading-relaxed text-indigo-300 italic font-mono flex items-center justify-between">
              <span>💡 Combine these using the Prompt to the right to build your Doc master plan.</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTIVE NICHE PLAYBOOK IN-APP DEMO */}
        <div className="lg:col-span-5 space-y-6">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold">Active Niche Playbook Selector</span>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight font-sans">
                What Niche Are You Building In?
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Select your specific coaching or consultancy industry vertical to instantly view tailored time-saving models, real case studies, and exact diagnostic prompts.
              </p>
            </div>

            {/* NICHE SELECTOR PILLS */}
            <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
              <button
                onClick={() => setSelectedNiche("wealth")}
                className={`py-2 px-3 rounded-xl border transition flex items-center gap-1.5 justify-center ${
                  selectedNiche === "wealth" 
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-400 font-black" 
                    : "bg-slate-950 border-slate-850 text-slate-450 hover:text-white"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                💰 Wealth & Business
              </button>

              <button
                onClick={() => setSelectedNiche("health")}
                className={`py-2 px-3 rounded-xl border transition flex items-center gap-1.5 justify-center ${
                  selectedNiche === "health" 
                    ? "bg-cyan-950/80 border-cyan-500 text-cyan-400 font-black" 
                    : "bg-slate-950 border-slate-850 text-slate-450 hover:text-white"
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                🌱 Health & Fitness
              </button>

              <button
                onClick={() => setSelectedNiche("relationships")}
                className={`py-2 px-3 rounded-xl border transition flex items-center gap-1.5 justify-center ${
                  selectedNiche === "relationships" 
                    ? "bg-pink-950/80 border-pink-500 text-pink-400 font-black" 
                    : "bg-slate-955 border-slate-850 text-slate-455 hover:text-white"
                }`}
              >
                <Heart className="h-3.5 w-3.5" />
                ❤️ Relationships/Life
              </button>

              <button
                onClick={() => setSelectedNiche("agency")}
                className={`py-2 px-3 rounded-xl border transition flex items-center gap-1.5 justify-center ${
                  selectedNiche === "agency" 
                    ? "bg-amber-950/80 border-amber-500 text-amber-400 font-black" 
                    : "bg-slate-950 border-slate-850 text-slate-450 hover:text-white"
                }`}
              >
                <Target className="h-3.5 w-3.5" />
                🛠️ Local Agency
              </button>
            </div>

            {/* PLAYBOOK DISPLAY STATS */}
            <div className="space-y-4 pt-1">
              
              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-850 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${selectedNiche === "wealth" ? "bg-emerald-400" : selectedNiche === "health" ? "bg-cyan-400" : selectedNiche === "relationships" ? "bg-pink-400" : "bg-amber-400"}`} />
                  <span className="text-[11px] font-mono font-extrabold text-white uppercase tracking-tight">
                    {selectedPlaybook.title} Playbook
                  </span>
                </div>

                <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                  {selectedPlaybook.impactPhrase}
                </p>

                {/* Micro metrics */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-900 pt-3 text-[10px] font-mono">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 uppercase">Target Client Profile</span>
                    <span className="text-white block font-sans truncate">{selectedPlaybook.targetProspects}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 uppercase">Time Reclaimed Weekly</span>
                    <span className="text-emerald-400 block font-bold">{selectedPlaybook.timeSaved}</span>
                  </div>
                </div>
              </div>

              {/* Step By Step Guide details */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black block">Operating Sequence For This Niche</span>
                <p className="text-[11px] text-slate-405 font-sans leading-relaxed">
                  {selectedPlaybook.systemGuide}
                </p>
              </div>

              {/* Actionable Copy-Paste prompt sandbox */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black block">Custom Niche Setup prompt</span>
                  <button 
                    onClick={() => handleCopyText(selectedPlaybook.copyPrompt, "pro")}
                    className="text-[9.5px] font-mono text-indigo-400 hover:text-indigo-300 font-bold transition flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    {copiedPrompt === "pro" ? "Copied!" : "Copy Prompt"}
                  </button>
                </div>
                <div className="bg-slate-955 p-3 rounded-xl border border-slate-850 font-mono text-[9.5px] text-slate-300 leading-normal font-sans">
                  "{selectedPlaybook.copyPrompt}"
                </div>
              </div>

              {/* Real World Case Study */}
              <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-xl space-y-1.5">
                <span className="text-[9px] font-mono text-indigo-450 uppercase tracking-wide font-black block">🚀 REAL-WORLD STUDENT CASE STUDY</span>
                <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                  {selectedPlaybook.caseStudy}
                </p>
              </div>

              {/* Supercharged Gemini Prompt Container */}
              <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold">Your Private Document Engine</span>
                  </div>
                  <button
                    onClick={() => handleCopyText(`You are an expert High-Ticket Systems Architect & Business Coach. Help me generate a massive, A-to-Z masterplan blueprint document that I can paste directly into my private Google Doc to launch, market, teach, and scale my high-ticket coaching cohort ($3,500/seat).

I am using an innovative custom-built application called "CapyStack AI" featuring a GEO Search citation scorecard, physical Google Maps lead scraper, Omni-social multi-channel publisher, and an automated Academy system.

I need complete clarity on WHEN, WHY, and HOW to connect my entire tech suite together. Please flesh out this document with executive depth, including the following exact sections with step-by-step tactical workflows, configuration steps, and operational timelines:

1. EXECUTIVE SUMMARY & BLUEPRINT ARCHITECTURE
- Detail how coaches collapse up to $300/mo of fragmented CRM/scraping billings down to a unified CapyStack ecosystem saving 15-20 hours a week.

2. WORKFLOW ROUTING AUTOMATION (n8n, Make.com, Activepieces)
- Outline when to use what:
  * Use n8n for intensive, branching conditional tasks (e.g. self-hosted database routing).
  * Use Make.com for fast visual SaaS pipelines (e.g. syncing with high-tier CRMs).
  * Use Activepieces for lightweight, open-source localized system automation.
- Provide step-by-step instruction on using custom webhook integrations to dispatch scraped Maps leads automatically into subsequent pipeline stages.

3. AI TWINS & PROGRAMMATIC VIDEO (HeyGen, ElevenLabs, Remotion)
- Detail how to capture Academy Teleprompter script streams and:
  * Connect to the ElevenLabs API (/v1/text-to-speech) to render voice clones.
  * Connect to the HeyGen API (/v1/video/generate) to render human talking-head video avatars from scripts.
  * Use Remotion (React-based automated animation libraries) to programmatic overlay animated text captions and thumbnail slides with direct code.

4. LOCAL TERMINAL DEVELOPER SUITE (VS Code, Claude Code, Model Context Protocols)
- Detail how to connect VS Code locally to our codebase.
- Detail how to run "Claude Code" (anthropic's CLI-native agent) in the terminal to refactor and patch routes in 1 command.
- Explain how MCPs (Model Context Protocol Servers) allow Claude Code to safely read local SQLite systems, analyze directory metadata, and execute deep diagnostic audits.

5. COHORT CHECKOUT & DISPATCH GATEWAYS (Stripe, Hermes VSP)
- How to connect Stripe Payment links to process our $3,500 seat transaction fees.
- How to configure Webhooks (checkout.session.completed) to instantly alert Hermes (Virtual Service Provider messaging system) to dispatch custom SMS text briefs containing digital playbooks and PDF access credentials to students instantly.

6. SYLLABUS & PLAYBOOKS FOR THE TOP 4 NICHES
- Custom playbooks for Wealth & Consulting, Health & Fit-tech, Relationships & Spiritual Purpose, and B2B Marketing Agencies.

Produce this entire manual with maximum strategic clarity. Include realistic timelines, literal step guides, and actionable checklists so it serves as an authoritative consulting Bible in my Google Drive. Great!`, "master")}
                    className="text-[9.5px] font-mono text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    {copiedPrompt === "master" ? "Copied to Clipboard!" : "Copy Supercharged Prompt"}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-white uppercase font-sans">
                    Part 2: Supercharged Gemini Prompt (Private Document Engine)
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal">
                    Copy and run this exact, highly-optimized structured prompt inside <strong className="text-slate-200">Google Gemini</strong>. It will instantly spit out your private, comprehensive A-to-Z playbook that you can paste directly into your Google Docs workspace.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl max-h-40 overflow-y-auto font-mono text-[9px] text-slate-400 leading-relaxed max-w-full">
                  <span className="text-amber-400 font-bold block mb-1"># SYSTEM PROMPT INSTRUCTIONS FOR GOOGLE GEMINI:</span>
                  You are an expert High-Ticket Systems Architect & Business Coach. Help me generate a massive, A-to-Z masterplan blueprint document that I can paste directly into my private Google Doc to launch, market, teach, and scale my high-ticket coaching cohort ($3,500/seat)...
                  <span className="block mt-1 text-slate-500 italic">(Scroll to read more or click the Copy button to capture the full prompt instantly)</span>
                </div>
              </div>

            </div>

          </div>

          {/* Revised Informational Section */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">⚡</span> Operational Efficiency
            </h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              CapyStack is designed to centralize your essential business tools into a single, cohesive workflow. 
              Focus on execution and growth by managing your core assets in one high-performance container.
            </p>
          </div>

        </div>

      </div>

      {/* 🎁 EXCLUSIVE VIP BONUS: ELITE AI PROMPT VAULT */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        {/* Title block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-5">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <span className="bg-amber-955 border border-amber-900 text-amber-400 text-[9.5px] px-2.5 py-0.5 rounded-full font-mono font-black uppercase tracking-wider select-none animate-pulse">
                🎁 VIP Premium Bonus
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">CapyStack Super-Pack</span>
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight font-sans flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Elite AI Marketing & Automation Prompt Vault
            </h3>
            <p className="text-[11px] text-slate-400 font-sans max-w-2xl leading-normal">
              We scraped the top prompt libraries on the web to curate high-ticket growth recipes. Customize variables in real-time, instantly compile zero-fluff structures, and copy perfect prompt blueprints tailored specifically for your brand.
            </p>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-slate-950 border border-slate-850 px-3 py-1 rounded-full uppercase select-none font-bold shrink-0 self-start md:self-center">
            ACTIVE COHORT CURATION
          </span>
        </div>

        {/* Categories Tab Selector */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setActivePromptTab("hooks")}
            className={`py-2.5 px-3 rounded-xl border transition text-left md:text-center font-bold relative overflow-hidden cursor-pointer ${
              activePromptTab === "hooks"
                ? "bg-amber-950/40 border-amber-500 text-amber-300 font-black"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
            }`}
          >
            📢 Hook-Story-Offer
          </button>
          <button
            type="button"
            onClick={() => setActivePromptTab("automation")}
            className={`py-2.5 px-3 rounded-xl border transition text-left md:text-center font-bold relative overflow-hidden cursor-pointer ${
              activePromptTab === "automation"
                ? "bg-indigo-950/40 border-indigo-500 text-indigo-355 font-black"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
            }`}
          >
            ⚡ Workflow Builder
          </button>
          <button
            type="button"
            onClick={() => setActivePromptTab("syndicator")}
            className={`py-2.5 px-3 rounded-xl border transition text-left md:text-center font-bold relative overflow-hidden cursor-pointer ${
              activePromptTab === "syndicator"
                ? "bg-cyan-950/40 border-cyan-500 text-cyan-355 font-black"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
            }`}
          >
            ✍️ Anti-Slop Publisher
          </button>
          <button
            type="button"
            onClick={() => setActivePromptTab("local-outreach")}
            className={`py-2.5 px-3 rounded-xl border transition text-left md:text-center font-bold relative overflow-hidden cursor-pointer ${
              activePromptTab === "local-outreach"
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-355 font-black"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
            }`}
          >
            📍 GEO Citation Audit
          </button>
          <button
            type="button"
            onClick={() => setActivePromptTab("stripe")}
            className={`py-2.5 px-3 rounded-xl border transition text-left md:text-center font-bold relative overflow-hidden cursor-pointer ${
              activePromptTab === "stripe"
                ? "bg-pink-955 border-pink-500 text-pink-305 font-black animate-pulse"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
            }`}
          >
            🎓 API, Webhook &amp; MCP Academy
          </button>
        </div>

        {/* Dynamic Variable Customizer Workspace */}
        <div className="bg-slate-950 border border-slate-855 rounded-2xl p-4 md:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-[10px] font-mono text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <span>🔧</span> LIVE PROMPT PARAMETER INITIALIZER
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase italic">Updates the prompt template in real-time</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-mono text-slate-505 uppercase block font-bold">Target Industry</label>
              <input
                type="text"
                value={promptIndustry}
                onChange={(e) => setPromptIndustry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                placeholder="e.g. Chiropractic Orthodontist"
              />
            </div>
            
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-mono text-slate-505 uppercase block font-bold">Your Coaching / Offer</label>
              <input
                type="text"
                value={promptOffer}
                onChange={(e) => setPromptOffer(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                placeholder="e.g. $2,500 Local Citation Restructuring"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-mono text-slate-505 uppercase block font-bold">Primary Pain Point / Problem</label>
              <input
                type="text"
                value={promptPain}
                onChange={(e) => setPromptPain(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                placeholder="e.g. Invisible to Perplexity and ChatGPT search engine crawlers"
              />
            </div>
          </div>

          {/* Secondary row for specific tabs dependency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-mono text-slate-505 uppercase block font-bold">Custom Topic (Syndication & Automation)</label>
              <input
                type="text"
                value={customNicheTopic}
                onChange={(e) => setCustomNicheTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                placeholder="e.g. Stopping high-ticket coaching churn"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-mono text-slate-505 uppercase block font-bold">Automation Platform</label>
              <div className="flex gap-2">
                {(["n8n.io", "Make.com", "Activepieces"] as const).map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => setWorkflowTool(tool)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-mono font-bold transition border cursor-pointer ${
                      workflowTool === tool
                        ? "bg-slate-900 border-indigo-500 text-indigo-300"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compiled Prompt Output Container */}
        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4.5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-left">
              <span className="p-1 bg-slate-900 rounded text-xs select-none">📋</span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-slate-400 block font-bold">
                  COMPILED COMPREHENSIVE SCRIPT BLUEPRINT
                </span>
                <span className="text-[9px] font-sans text-slate-500 font-medium">
                  Ready to copy and execute directly inside Gemini, Claude, or ChatGPT
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                let textToCopy = "";
                if (activePromptTab === "hooks") {
                  textToCopy = `You are an elite, zero-fluff direct-response copywriter. I want to build a highly optimized Hook-Story-Offer content sequence for my target industry: ${promptIndustry}.
Our main service/product is ${promptOffer}. The primary pain point we solve is ${promptPain}.

Follow these absolute rules to avoid low-quality 'AI Slop':
1. DO NOT use words like: 'revolutionize', 'delve', 'testament', 'demystify', 'moreover', 'tapestry', 'beacon', or 'cutting-edge'.
2. Write with clinical confidence. Start direct. Keep the initial hook under 14 words.
3. The story should cover a relatable, single-sentence failure. Transition quickly into the structured system.
4. End with a raw, high-leverage offer that calls out the viewer with a logical choice.

Tone constraint: High-signal, intellectual, Swiss-modern style. Deliver 3 distinct content drafts.`;
                } else if (activePromptTab === "automation") {
                  textToCopy = `You are a Senior Systems Automation Architect. Design a detailed step-by-step workflow architecture for ${workflowTool} to automate the following task:
'Capture regional leads from our Maps Lead Scraper source, identify their target GEO rating, save records onto a centralized client database, and instantly dispatch a customized SMS brief.' or target topic: "${customNicheTopic}"

Provide a complete system specification including:
1. Webhook payload schemas for the incoming lead trigger.
2. Condition splits (e.g. check if the Reviews count is < 15).
3. API HTTP Request parameters (headers, Bearer token config) to push to external SMS gateways like Twilio or Hermes VSP.
4. Error retries, exponential backoffs, and error catch-nodes so our operational container never crashes or drops critical lead payloads.`;
                } else if (activePromptTab === "syndicator") {
                  textToCopy = `You are a Multi-Channel Content Syndicator. Take this seed raw idea: '${customNicheTopic}' and adapt it natively for three core channels under our strict 'Zero-Fluff Tone Guard' rules for the ${promptIndustry} market.

- Channel 1: LinkedIn (Single narrative thread, high line-breaks, strong horizontal spacing, visual text rhythm).
- Channel 2: X (A 4-post tactical thread. Post 1: Captivating visual proof. Post 2-3: Step-by-step execution details. Post 4: Soft CTA).
- Channel 3: Newsletter Edition (A descriptive, deep-dive tactical lesson under 120 words with an intellectual, informative style).

Ensure each post uses zero generic marketing fluff and focuses purely on high-signal workflows.`;
                } else if (activePromptTab === "local-outreach") {
                  textToCopy = `You are an outreach copywriter specializing in value-first cold conversions. I am targeting ${promptIndustry} brands who have poor search engine citation metrics.
Write a high-converting email, LinkedIn outreach, and Instagram DM series using this exact psychological bait:
- Mention that we ran an automated GEO (Generative Engine Optimization) diagnostic on their brand and noticed they are 100% invisible to Perplexity AI and ChatGPT Search local queries because of structured JSON-LD schema defects.
- Deliver the audit list as a friendly, diagnostic checklist. Do not pitch.
- Offer ${promptOffer} package details as a way to fix it, or secure a 10-minute screen-share slot where we will solve the schema issue live. Keep the tone humble, extremely specialized, and helpful.`;
                } else {
                  textToCopy = `You are an Elite Enterprise Integrations Architect teaching a solopreneur brand how to leverage webhooks, APIs, and the Model Context Protocol (MCP).
Provide an exhaustive, structured breakdown of:
1. WEBHOOKS VS APIs: Contrast event-driven Webhooks (push notifications from services) with REST APIs (request-response actions with Bearer tokens).
2. WEBHOOK CONTROLLER PATTERN: Document a secure Node.js Express webhook receiver code that verifies signature headers, parses custom variables (student_id, workspace_name) in database rows for "${promptOffer}", and processes immediate delivery solving "${promptPain}".
3. MODEL CONTEXT PROTOCOL (MCP): Explain Anthropic's new open standard that allows secure AI models like Claude & Gemini to interface with local system tools, data sources, and services.
4. AUTOMATION DISPATCH: Detail a step-by-step workflow blueprint mapping API telemetry directly with n8n, Make, or custom API endpoints.`;
                }
                handleCopyText(textToCopy, activePromptTab);
              }}
              className="text-white hover:text-indigo-305 font-bold bg-indigo-950 p-2 px-4 rounded-xl border border-indigo-900 flex items-center gap-1.5 text-xs transition cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              <span>{copiedPrompt === activePromptTab ? "Copied Vault!" : "Copy Active Prompt"}</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl font-mono text-[10.5px] text-slate-300 leading-relaxed text-left min-h-36 max-h-64 overflow-y-auto relative shadow-inner">
            {activePromptTab === "hooks" && (
              <pre className="whitespace-pre-wrap font-mono normal-case">
                <span className="text-amber-400 font-bold"># COHOTE COPYWRITING FORMULA SYSTEM (SWISS STYLE)</span>{"\n\n"}
                You are an elite, zero-fluff direct-response copywriter. I want to build a highly optimized Hook-Story-Offer content sequence for my target industry: <strong className="text-amber-300">{promptIndustry}</strong>.{"\n"}
                Our main service/product is: <strong className="text-amber-300">{promptOffer}</strong>.{"\n"}
                The primary pain point we solve is: <strong className="text-amber-300">{promptPain}</strong>.{"\n\n"}
                Follow these absolute rules to avoid low-quality 'AI Slop':{"\n"}
                1. DO NOT use words like: 'revolutionize', 'delve', 'testament', 'demystify', 'moreover', 'tapestry', 'beacon', or 'cutting-edge'.{"\n"}
                2. Write with clinical confidence. Start direct. Keep the initial hook under 14 words.{"\n"}
                3. The story should cover a relatable, single-sentence failure. Transition quickly into the structured system.{"\n"}
                4. End with a raw, high-leverage offer that calls out the viewer with a logical choice.{"\n\n"}
                Tone constraint: High-signal, intellectual, Swiss-modern style. Deliver 3 distinct content drafts.
              </pre>
            )}

            {activePromptTab === "automation" && (
              <pre className="whitespace-pre-wrap font-mono normal-case">
                <span className="text-indigo-400 font-bold"># PIPELINE WEBHOOK ORCHESTRATION SCHEMA</span>{"\n\n"}
                You are a Senior Systems Automation Architect. Design a detailed step-by-step workflow architecture for <strong className="text-indigo-300">{workflowTool}</strong> to automate the following task:{"\n"}
                'Capture regional leads from our Maps Lead Scraper source, identify their target GEO rating, save records onto a databases, and instantly dispatch a customized SMS brief.' or target topic: "<strong className="text-indigo-300">{customNicheTopic}</strong>"{"\n\n"}
                Provide a complete system specification including:{"\n"}
                1. Webhook payload schemas for the incoming lead trigger.{"\n"}
                2. Condition splits (e.g. check if the Reviews count is &lt; 15).{"\n"}
                3. API HTTP Request parameters (headers, Bearer token config) to push to external SMS gateways like Twilio or Hermes VSP.{"\n"}
                4. Error retries, exponential backoffs, and error catch-nodes so our operational container never crashes or drops critical lead payloads.
              </pre>
            )}

            {activePromptTab === "syndicator" && (
              <pre className="whitespace-pre-wrap font-mono normal-case">
                <span className="text-cyan-400 font-bold"># MULTI-CHANNEL OMNIPRESENT SYNDICATION SYSTEM</span>{"\n\n"}
                You are a Multi-Channel Content Syndicator. Take this seed raw idea: '<strong className="text-cyan-300">{customNicheTopic}</strong>' and adapt it natively for three core channels under our strict 'Zero-Fluff Tone Guard' rules for the <strong className="text-cyan-300">{promptIndustry}</strong> market.{"\n\n"}
                - Channel 1: LinkedIn (Single narrative thread, high line-breaks, strong horizontal spacing, visual text rhythm).{"\n"}
                - Channel 2: X (A 4-post tactical thread. Post 1: Captivating visual proof. Post 2-3: Step-by-step execution details. Post 4: Soft CTA).{"\n"}
                - Channel 3: Newsletter Edition (A descriptive, deep-dive tactical lesson under 120 words with an intellectual, informative style).{"\n\n"}
                Ensure each post uses zero generic marketing fluff and focuses purely on high-signal workflows.
              </pre>
            )}

            {activePromptTab === "local-outreach" && (
              <pre className="whitespace-pre-wrap font-mono normal-case">
                <span className="text-emerald-400 font-bold"># LOCAL MAPS GEO-AUDIT VALUE PROSPECTING SCRIPT</span>{"\n\n"}
                You are an outreach copywriter specializing in value-first cold conversions. I am targeting <strong className="text-emerald-300">{promptIndustry}</strong> brands who have poor search engine citation metrics.{"\n"}
                Write a high-converting email, LinkedIn outreach, and Instagram DM series using this exact psychological bait:{"\n"}
                - Mention that we ran an automated GEO (Generative Engine Optimization) diagnostic on their brand and noticed they are 100% invisible to Perplexity AI and ChatGPT Search local queries because of structured JSON-LD schema defects.{"\n"}
                - Deliver the audit list as a friendly, diagnostic checklist. Do not pitch.{"\n"}
                - Offer <strong className="text-emerald-300">{promptOffer}</strong> package details as a way to fix it, or secure a 10-minute screen-share slot where we will solve the schema issue live. Keep the tone humble, extremely specialized, and helpful.
              </pre>
            )}

            {activePromptTab === "stripe" && (
              <pre className="whitespace-pre-wrap font-mono normal-case text-slate-300">
                <span className="text-pink-405 font-bold"># THE ULTIMATE WEBHOOKS, API &amp; MODEL CONTEXT PROTOCOL (MCP) INTERACTIVE MASTERCLASS</span>{"\n\n"}
                <span className="text-pink-400 font-semibold uppercase font-mono tracking-wider">## PART A: CHILLEST CORE INTEGRATION THEORY</span>{"\n"}
                - <strong className="text-white">API (Application Programming Interface):</strong> A system enabling software servers to request data or trigger commands. It operates as a request-response relationship (polling or pulling).{"\n"}
                - <strong className="text-white">WEBHOOKS (Dynamic Event Hooks):</strong> A push model ("Don't call us, we'll notify you"). A webhook pushes structured JSON events instantly (e.g. delivering seats for <strong className="text-pink-300">{promptOffer}</strong> when a purchase converts) so servers never waste polling resources.{"\n"}
                - <strong className="text-white">MCP (Model Context Protocol):</strong> The revolutionary system that defines standard channels for secure LLMs (like Claude &amp; Gemini) to query custom databases, file suites, local networks, and browser environments.{"\n\n"}
                
                <span className="text-pink-400 font-semibold uppercase font-mono tracking-wider">## PART B: COMPILED PROMPT FOR ENTERPRISE AI INTEGRATIONS ARCHITECT</span>{"\n"}
                "You are an Elite Enterprise Integrations Architect teaching a solopreneur brand how to leverage webhooks, APIs, and the Model Context Protocol (MCP).{"\n"}
                Provide an exhaustive, structured breakdown of:{"\n"}
                1. WEBHOOKS VS APIs: Contrast webhooks (push) with REST APIs (request-response requests with Bearer tokens).{"\n"}
                2. WEBHOOK CONTROLLER PATTERN: Document a Node.js Express webhook receiver code that verifies signature headers, parses custom variables (student_id, workspace_name) in database rows for <strong className="text-pink-300">"{promptOffer}"</strong>, and processes immediate delivery solving <strong className="text-pink-300">"{promptPain}"</strong>.{"\n"}
                3. MODEL CONTEXT PROTOCOL (MCP): Explain Anthropic's new open standard that allows secure AI models like Claude &amp; Gemini to interface with local system tools, data sources, and services.{"\n"}
                4. AUTOMATION DISPATCH: Detail a step-by-step workflow blueprint mapping API telemetry directly with n8n, Make, or custom API endpoints."
              </pre>
            )}
          </div>

          {/* Prompt effectiveness guide */}
          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-left space-y-2 font-sans">
            <span className="text-[9.5px] font-mono font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
              💡 PROMPT MECHANICS (WHY THIS PROMPT IS ELITE)
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-400 pl-4 list-disc leading-normal">
              <li>
                <strong className="text-slate-300 font-medium font-mono">Anti-AI-Slop Guard rails:</strong> Explicit negative constraints block LLMs from using redundant generic verbs or metaphors, delivering clean visual copy immediately.
              </li>
              <li>
                <strong className="text-slate-300 font-medium font-mono">Structured output delimiters:</strong> Specifying exact channel requirements and itemized bullets prevents the prompt from generating lengthy, disorganized texts.
              </li>
              <li>
                <strong className="text-slate-300 font-medium font-mono">Explicit variable binding:</strong> Feeding actual business variables (industry, pain point, cost) trains the LLM directly on your niche constraints.
              </li>
              <li>
                <strong className="text-slate-300 font-medium font-mono">Role-Playing Frame injection:</strong> Establishing advanced specialist roles (e.g., "Senior Systems Architect", "Elite Response Copywriter") pre-configures high-caliber phrasing guidelines.
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
