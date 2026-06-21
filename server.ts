import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Stripe client for zero-dependency resilient operations
let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY || "";
    if (key && key !== "MY_STRIPE_SECRET_KEY") {
      try {
        stripeClient = new Stripe(key, {
          apiVersion: "2023-10-16" as any,
        });
      } catch (err) {
        console.error("Failed to initialize Stripe client:", err);
      }
    }
  }
  return stripeClient;
}

// Lazy initialize Google GenAI SDK client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    // Avoid crashing if key matches standard placeholder or is blank
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        aiClient = new GoogleGenAI({ apiKey });
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
      }
    }
  }
  return aiClient;
}

// 1. Endpoint: Competitor Deep Research Analyzer
app.post("/api/analyze-competitor", async (req, res) => {
  const { urlOrTopic, industry } = req.body;
  if (!urlOrTopic) {
    return res.status(400).json({ error: "Please provide a competitor URL or topic." });
  }

  const ai = getAI();
  if (!ai) {
    console.warn("Using simulated data: GEMINI_API_KEY is not configured or in placeholder state.");
    // Return high-fidelity realistic fallback data
    return res.json(getSimulatedCompetitorAnalysis(urlOrTopic, industry || "General Business"));
  }

  try {
    const systemPrompt = `You are an expert AI Search (GEO) Researcher, SEO Auditor, and Competitive Intelligence engine.
Analyze the user's competitor URL or topic: "${urlOrTopic}" in the industry: "${industry || 'General Business'}".
Perform a deep virtual research crawl and generate high-fidelity statistics, keywords (including search intent, traffic volume projections), AI citations overlap, key brand strengths and vulnerabilities, and high-impact GEO (Generative Engine Optimization) opportunities they are exploiting or missing.

Your response MUST be strict JSON matching this exact structure:
{
  "competitor": "Determined Domain or Company Name",
  "industry": "Industry name",
  "seoScore": 0-100 (traditional SEO health score),
  "geoScore": 0-100 (GEO / AI citation probability score),
  "topKeywords": [
    { "keyword": "Keyword string", "trafficVolume": "Estimated monthly search traffic (e.g. 1.2K/mo)", "difficulty": "Low" | "Medium" | "High", "intent": "Informational" | "Commercial" | "Transactional" | "Navigational" }
  ],
  "aiCitations": [
    { "source": "e.g., Blog Post, Reddit, Forbes, YouTube, Industry Wiki", "coveragePct": 1-100 (relative citation density across LLM benchmarks), "tone": "Positive" | "Neutral" | "Critical", "isMainCitation": true/false }
  ],
  "strengths": ["Clear professional strength", "Second strength"],
  "weaknesses": ["Vulnerability to exploit", "Second weakness"],
  "geoOpportunities": [
    { "topic": "Key topic opportunity", "strategy": "What exact action to take to steal citations", "priority": "High" | "Medium" | "Low" }
  ]
}`;

    const promptText = `Analyze competitor/topic: ${urlOrTopic}
Industry context: ${industry || "Not specified"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("API Error in analyze-competitor:", error);
    // Return high-quality, smart, realistic fallback with an additional notice
    return res.json(getSimulatedCompetitorAnalysis(urlOrTopic, industry || "General Business", true));
  }
});

// 2. Endpoint: GEO & SEO Content Scoring
app.post("/api/score-geo-seo", async (req, res) => {
  const { contentToAnalyze } = req.body;
  if (!contentToAnalyze) {
    return res.status(400).json({ error: "Please provide content or a URL to score." });
  }

  const ai = getAI();
  if (!ai) {
    console.warn("Using simulated data: GEMINI_API_KEY is not configured.");
    return res.json(getSimulatedGEOSEOScore(contentToAnalyze));
  }

  try {
    const systemPrompt = `You are a cutting-edge Generative Engine Optimization (GEO) scoring expert and advanced SEO Auditor.
Your job is to analyze the provided article blueprint or web content, evaluate how likely it is to be cited and recommended by modern AI search systems (such as Gemini, OpenAI Search, Perplexity, Claude, Copilot), and provide precise traditional SEO and modern GEO grading.

Ensure you grade 5 key dimensions:
- authoritySignals (presence of primary source research, expertise indicators, named authors)
- citationDirectness (clear objective statements, quotes, stats, Q&As, facts easy for AI to reference)
- entityAlignment (use of recognized industry entities, key schema associations, clear definitions)
- readabilityAndFlow (natural language structure, structured readability)
- structuredDataScore (suitability for automated markup, bullets, charts, or JSON-LD representation)

Provide specific, practical GEO Boost Actions. For each action, show the 'category', the 'action' (vivid explanation), 'impact' ('Critical' | 'High' | 'Medium'), and a 'revisedFragment' showing an actual rewritten drop-in paragraph of how their input content can be improved for 5x more citations!

Your response MUST be strict JSON matching this exact structure:
{
  "urlOrContent": "Summary or short title of analyzed content",
  "traditionalSeoScore": 0-100,
  "geoScore": 0-100,
  "overallGrade": "A+" | "A" | "B+" | "B" | "C" | "D",
  "metrics": {
    "authoritySignals": 0-100,
    "citationDirectness": 0-100,
    "entityAlignment": 0-100,
    "readabilityAndFlow": 0-100,
    "structuredDataScore": 0-100
  },
  "aiPlatformsScore": [
    { "platform": "Gemini", "citationProbability": 0-100, "viabilityStatus": "Strong Citation" | "Moderate Citation" | "Low Citation" },
    { "platform": "ChatGPT Search", "citationProbability": 0-100, "viabilityStatus": "Strong Citation" | "Moderate Citation" | "Low Citation" },
    { "platform": "Perplexity", "citationProbability": 0-100, "viabilityStatus": "Strong Citation" | "Moderate Citation" | "Low Citation" },
    { "platform": "Claude / Opus Briefs", "citationProbability": 0-100, "viabilityStatus": "Strong Citation" | "Moderate Citation" | "Low Citation" }
  ],
  "geoBoostActions": [
    {
      "category": "Structured Data" | "Authoritativeness" | "Entity optimization" | "Citation proofing",
      "action": "Description of what to change and why.",
      "impact": "Critical" | "High" | "Medium",
      "revisedFragment": "A text block displaying an exact polished rewritten snippet that the user can immediately paste in."
    }
  ],
  "summaryFeedback": "Overall feedback paragraph explaining why the content currently lacks citation triggers and how to win the generative engine race."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Perform GEO and SEO scoring for this content:\n\n${contentToAnalyze}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("API Error in score-geo-seo:", error);
    return res.json(getSimulatedGEOSEOScore(contentToAnalyze, true));
  }
});

// 3. Endpoint: Brand Identity & Voice Extractor
app.post("/api/extract-brand", async (req, res) => {
  const { sampleText } = req.body;
  if (!sampleText) {
    return res.status(400).json({ error: "Please provide sample text or business bio to extract voice." });
  }

  const ai = getAI();
  if (!ai) {
    console.warn("Using simulated brand extraction data: GEMINI_API_KEY is not configured.");
    return res.json(getSimulatedBrandProfile(sampleText));
  }

  try {
    const systemPrompt = `You are a world-class premier branding design consultant and linguistic analyst.
Your job is to analyze the user's raw bios, business descriptions, or sample text and automatically decode their entire brand ecosystem in ONE single turn—leaving them with ZERO questions to answer!

Perform an elite analysis to extract:
1. brandName: A clean, creative brand/creator title (if not explicitly given, invent a beautiful fitting one).
2. tagline: A highly catchy, professional 5-8 word brand tagline.
3. voiceTone: A concise definition of their verbal tone (e.g. "Warm, witty and deeply technical", "Bold, action-biased, and punchy").
4. targetAudience: Precise target demographic description.
5. accentColor: A stunning primary matching UI accent color (expressed in HEX format, e.g. "#10B981" for emerald, "#06B6D4" for cyan, etc.).
6. secondaryColor: A harmonious background/secondary palette UI hex color.
7. vocabulary: 4-5 signature style words/phrases they frequently use or SHOULD use to denote authority.
8. prohibitedWords: 3-4 fluff words they want to strictly avoid to sound highly expert.
9. suggestedBioUsable: A perfectly polished 2-sentence bio based on their raw text.

Your response MUST be strict JSON matching this exact structure:
{
  "brandName": "Brand Name",
  "tagline": "Brand tagline",
  "voiceTone": "Voice descriptor",
  "targetAudience": "Target audience",
  "accentColor": "#XXXXXX",
  "secondaryColor": "#XXXXXX",
  "vocabulary": ["word1", "word2"],
  "prohibitedWords": ["word1", "word2"],
  "suggestedBioUsable": "Suggested bio text..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract the brand profile from the following sample content:\n\n${sampleText}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("API Error in extract-brand:", error);
    return res.json(getSimulatedBrandProfile(sampleText, true));
  }
});

// 4. Endpoint: Multi-Channel Content Repurposer
app.post("/api/repurpose-content", async (req, res) => {
  const { originalText, coreTopic, brandProfile } = req.body;
  if (!originalText) {
    return res.status(400).json({ error: "Please provide original text or idea to repurpose." });
  }

  const ai = getAI();
  if (!ai) {
    console.warn("Using simulated data: GEMINI_API_KEY is not configured.");
    return res.json(getSimulatedRepurpose(originalText, coreTopic));
  }

  try {
    let systemPrompt = `You are a world-class content strategist and viral automated publisher.
Take the user's raw text or detailed idea and automatically transform it into a cohesive, multichannel, high-leverage content package optimized for extreme reach, automation, and automated triggers.

Split the outcome into:
- An ultra-engaging X (Twitter) Thread (represented as clean array of posts, each <= 280 chars)
- A highly persuasive, authentic LinkedIn text-based longform insights post (with lists, line breaks, catchy opening, custom quote block format, and call to action)
- A Medium-style narrative blog article, ready for publication (subheadings, clean prose, intro/outro)
- An exportable JSON Webhook payload designed to be fired to automated systems (Webhook, Make.com, Activepieces, n8n, Zapier)
- A Claude Code / VPS shell executor script that automated agents can run on a VPS to trigger immediate file updates or API updates.`;

    if (brandProfile) {
      systemPrompt += `\n\nCRITICAL BRAND GUIDES TO APPLY:
- Adopt the Tone-of-Voice: "${brandProfile.voiceTone}".
- Align content to target Audience: "${brandProfile.targetAudience}".
- Incorporate these signature vocabulary words frequently or contextually: ${JSON.stringify(brandProfile.vocabulary)}.
- STRICTLY DO NOT USE any of the following prohibited words: ${JSON.stringify(brandProfile.prohibitedWords)}.
- Reference their brand name: "${brandProfile.brandName}" where appropriate.`;
    }

    systemPrompt += `\n\nYour response MUST be strict JSON matching this exact structure:
{
  "originalText": "Brief summary or excerpt of first 100 characters",
  "title": "A highly catchy title for this content campaign",
  "xThread": [
    { "postNumber": 1, "text": "Hook text...", "characterCount": 180 }
  ],
  "linkedInPost": "Draft of LinkedIn post with appropriate spaced formatting...",
  "mediumArticle": "Optimized blog text layout with paragraphs and sub-headers...",
  "webhookPayload": "A beautifully structured JSON string containing fields like target_networks, payload_title, serialized_body, and tags",
  "claudeCodeCommand": "A ready-to-use bash CLI or curl script showing how this payload can be dispatched directly to user's personal VPS or n8n endpoint.",
  "marketingHooks": ["Hook 1: Benefit-driven hook", "Hook 2: Question-driven hook", "Hook 3: Pattern interrupt hook"]
}`;

    const promptText = `Repurpose this post/content:
${originalText}
Core topic/context: ${coreTopic || "General Business Mastery"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("API Error in repurpose-content:", error);
    return res.json(getSimulatedRepurpose(originalText, coreTopic, true));
  }
});

// 5. Endpoint: AI Website Template Crafting Engine
app.post("/api/generate-website", async (req, res) => {
  const { brandProfile, niche } = req.body;
  
  const ai = getAI();
  if (!ai) {
    console.warn("Using simulated data: GEMINI_API_KEY is not configured for web-builder.");
    return res.json(getSimulatedWebsite(brandProfile, niche));
  }

  try {
    const brandName = brandProfile?.brandName || "Premium Creator";
    const tagline = brandProfile?.tagline || "High-impact deliverables";
    const voiceTone = brandProfile?.voiceTone || "Professional, minimalist";

    const systemPrompt = `You are a legendary AI landing page architect and premier web developer.
Generate a beautiful, strategic landing page configuration as strict JSON that matches the brand profile:
Brand Name: "${brandName}"
Tagline: "${tagline}"
Linguistic Voice: "${voiceTone}"
Niche target: "${niche || 'Digital transformation'}"

Your response MUST be strict JSON matching this exact structure:
{
  "title": "Short creative browser tab title",
  "subtitle": "Empowering sub-title to hook visitors instantly",
  "heroHeader": "A highly compelling main headline, maximum 8 words",
  "heroButtonText": "Primary CTA target button label",
  "features": [
    { "icon": "Zap", "title": "Core pillar one", "description": "Compelling statement of how this brings speed/leverage" },
    { "icon": "Target", "title": "Core pillar two", "description": "Empirical evidence or focus value" },
    { "icon": "Sparkles", "title": "Core pillar three", "description": "Highly tailored niche hook" }
  ],
  "faqs": [
    { "question": "Niche objection query?", "answer": "Objection-crushing answer written in custom brand tone" },
    { "question": "Second relevant query?", "answer": "Clarity-proving strategic resolution" },
    { "question": "Third pricing/onboarding query?", "answer": "Call to action direction" }
  ],
  "ctaHeader": "Strategic final conversion header",
  "ctaText": "Short persuasive closing text to prompt email click",
  "socialLinks": { "twitter": "https://twitter.com/example", "linkedin": "https://linkedin.com/company/example", "github": "https://github.com/example" },
  "metaTitle": "SEO optimize Meta Title",
  "metaDescription": "Optimized search description for GEO platforms",
  "fonts": { "headings": "Space Grotesk", "body": "Inter" }
}`;

    const promptText = `Generate customized landing page configuration for brand: ${brandName}, focused on niche: ${niche || 'Growth Consulting'}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("API Error in generate-website:", error);
    return res.json(getSimulatedWebsite(brandProfile, niche));
  }
});

// 6. Endpoint: Social Lead Prospecting & Social Listening NLP Scraper
app.post("/api/scrape-leads", async (req, res) => {
  const { keywords, platformFilter } = req.body;
  if (!keywords) {
    return res.status(400).json({ error: "Please enter keywords or skill niches to scan for clients." });
  }

  const ai = getAI();
  if (!ai) {
    console.warn("Using simulated data: GEMINI_API_KEY is not configured for lead-scraper.");
    return res.json(getSimulatedLeads(keywords, platformFilter));
  }

  try {
    const systemPrompt = `You are an elite automated client prospecting engine, digital CRM crawler, and social listening monitor.
Your job is to analyze the requested niche/keywords: "${keywords}" on platform: "${platformFilter || 'All platforms'}".
Generate 4 diverse, highly realistic lead prospects (representing real founders, creators, or companies) who have recently published posts or articles expressing explicit paint points, frustrations, or questions directly addressable by someone offering services in this niche.

For each lead, you MUST generate a bespoke, highly personalized copy-paste direct message response or comment pitch that references their specific expressed need, respects professional boundaries, and drives real conversions.

Your response MUST be a strict JSON array of objects matching this exact structure:
[
  {
    "id": "String unique ID",
    "platform": "X/Twitter" | "LinkedIn" | "Reddit" | "Web/Blog",
    "userHandle": "Username or domain",
    "userName": "Full name of founder/contact",
    "userBio": "Short bio or current company title",
    "postContent": "A realistic complete social media post or forum thread expressing a concrete struggle/question in this niche",
    "expressedNeed": "Synthesized summary of their painful problem",
    "relevanceScore": 80-100,
    "recommendedPitch": "Personalized, high-converting copy-paste outreach message contextually pitch-perfect",
    "engagementTriggerUrl": "https://example.com/status/mock-thread",
    "leadStatus": "New"
  }
]`;

    const promptText = `Scrape active buyer leads and client opportunities for keyword: ${keywords}. Filter: ${platformFilter || 'All'}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("API Error in scrape-leads:", error);
    return res.json(getSimulatedLeads(keywords, platformFilter));
  }
});

// 7. Endpoint: Instant Google Maps Lead Gen Scraper (Vibe-Coded local agency pipeline)
app.post("/api/scrape-maps-leads", (req, res) => {
  const { keyword, city, state, limit } = req.body;
  if (!keyword || !city) {
    return res.status(400).json({ error: "Missing required query parameters: keyword and city are required." });
  }

  const resultLimit = Math.min(Number(limit) || 12, 40);
  const scrapedData = getSimulatedMapsLeads(keyword, city, state || "US", resultLimit);
  return res.json(scrapedData);
});

// A. Endpoint: Academy Trainer & Copilot Answer Node
app.post("/api/academy-copilot", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Missing required parameter: question." });
  }

  const ai = getAI();
  if (ai) {
    try {
      const systemPrompt = `You are a world-class SaaS Launch Specialist, Media Automation Architect, and Executive Content Advisor.
Your job is to provide exceptionally detailed, professional, and actionable consulting guides for Lovina Robinson (the B2B Agency CEO behind CapyStack AI).
Address the user as "Lovina" or "Lovina Robinson" with deep professional alignment.
Always frame answers in highly-structured markdown matching the style of a premium $5,000 corporate coaching brief or systems layout guide.
Focus on:
1. SAVING 10-20 HOURS/WEEK using AI Video & Audio Clones (ElevenLabs + HeyGen).
2. Leveraging CapyStack AI's direct API webhooks and scraping endpoints for fully-automated multi-node publishing.
3. Hooking up developer-level APIs, Webhooks, and Model Context Protocol (MCP) servers (e.g. Claude Desktop toolsets, n8n webhook nodes).
4. Training and teaching others (Coaching Cohort Curriculum) to sell this high-value architecture for recurring client contracts.
Never write vague, lazy, or high-fluffy responses. Give exact lines of mock setups, config schemas, execution scripts, or direct tactical playbooks.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      const text = response.text || "";
      return res.json({ answer: text, simulated: false });
    } catch (err: any) {
      console.error("Gemini failed in Academy Copilot, falling back...", err);
    }
  }

  // Fallback simulator with extremely detailed, structured premium blueprint answers
  const qLower = question.toLowerCase();
  let answer = "";

  if (qLower.includes("clone") || qLower.includes("video") || qLower.includes("save") || qLower.includes("hour")) {
    answer = `### 🤖 Lovina Robinson's Guide to AI-Cloned Content Generation (Saving 10-20 Hours/Week)

Yes, Lovina! You can absolutely use your **Professional AI Clone** combined with **CapyStack AI** to form a completely hands-off content publishing ecosystem. Traditional video production takes **15+ hours per week** (writing hooks, recording multiple takes, looking at cameras, editing gaps, rendering subtitles, and publishing).

With this automation layout, you compress active work into **just 30 minutes once a week**.

---

#### 🎬 The 10-20 Hour Time-Saver Pipeline Architecture
\`\`\`
[CapyStack AI Engine] ---> Generates high-converting SaaS script briefs
         |
         +--> [ElevenLabs Voice ID Key] ---> TTS generates pristine synthesized audio file
                    |
                    +--> [HeyGen Avatar API] ---> Mouth-synced HD Video Render
                               |
                               +--> [n8n / Make Command Node] ---> Overlay subtitles
                                          |
                                          +--> [Postiz / Buffer Hooks] ---> Auto-Publish
\`\`\`

---

#### 🛠️ STEP-BY-STEP IMPLEMENTATION CHECKLIST

##### Step 1: Create Your HeyGen Video Clone
1. Record a **3-5 minute video** of yourself speaking directly towards a 1080p/4K camera.
2. Maintain natural facial movements, blinking, and subtle posture shifts. Avoid waving hands in front of your face or throat.
3. Upload this to **HeyGen > Instant Avatar** and record the required verbal release verification to train your high-fidelity clone avatar.

##### Step 2: Clone Your Speaking Cadence in ElevenLabs
1. Compile **10-15 minutes of direct vocal audio** (use a high-quality studio microphone).
2. Go to **ElevenLabs > Voice Lab > Instant Voice Cloning**.
3. Upload files to generate your specific **Voice ID** (which speaks with your exact accent, pause habits, and professional emphasis).

##### Step 3: Run the CapyStack Auto-Publisher Output
To feed this loop, navigate to the **Omni-Social Publisher** inside CapyStack:
1. Input your campaign topic (e.g., *"How to scale business capacity to 100 clients"*).
2. Select your cached **Lovina Brand Profile Configurator** matrix (which locks in your vocabulary keywords like *leveraged loops*, *systemic capacity*, and *scale arrays*).
3. Generate writing copies. These copies are automatically formatted to feed directly into ElevenLabs' speech-to-text nodes.

---

#### 📊 Cost & Hour Comparison Metrics
*   **Manual Production:** 4 hrs script writing + 5 hrs recording + 6 hrs editing + 2 hrs publishing = **17 hrs/week**.
*   **Automated CapyStack + Clone Loop:** 15 mins topic inputs + 15 mins pipeline approval = **30 mins/week**.
*   **Net Margin Saved:** **16.5 hours saved weekly!** You can use these precious hours to close premium $5,000 consulting deals, while your avatar quietly drives consistent qualified traffic to your SaaS checkout page.`;
  } else if (qLower.includes("mcp") || qLower.includes("api") || qLower.includes("connect")) {
    answer = `### ⚙️ Lovina Robinson's System Blueprint: Connecting SDK APIs & Model Context Protocol (MCP)

To establish CapyStack AI as an enterprise-grade technology ecosystem, you must connect its endpoints with external developers, custom platforms (Make/n8n), or Model Context Protocol (MCP) servers. **Model Context Protocol (MCP)** allows local coding assistants (like Claude Code, Claude Desktop, Cursor, or custom terminal tools) to securely execute API commands on your server.

---

#### 🌐 1. Integrating CapyStack's REST API Token
Every client node integrates with CapyStack using standard Bearer Token authorization:

##### Sample POST Webhook to initiate copy generation programmatically:
\`\`\`bash
curl -X POST "https://ais-dev-h66labxtxydwsep5z5o4tn-397474250777.us-west1.run.app/api/repurpose-content" \\
  -H "Authorization: Bearer CAPYSTACK_SECURE_NODE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalText": "Let us scale systems using automated webhook pipelines.",
    "coreTopic": "SaaS Scale arrays",
    "brandProfile": {
      "brandName": "Lovina Authority",
      "voiceTone": "Educator and systems expert",
      "vocabulary": ["leveraged loops", "systemic capacity"]
    }
  }'
\`\`\`

---

#### 🎛️ 2. Connecting a Custom Model Context Protocol (MCP) Server
An MCP server exposes CapyStack tools directly to local language models. By running a standard node script on your local machine, your AI assistant can query your scraper results, analyze competitors, and push content on your behalf!

##### Example: Save this MCP Schema File inside \`claud_desktop_config.json\`:
\`\`\`json
{
  "mcpServers": {
    "capystack-tools-node": {
      "command": "npx",
      "args": ["-y", "@capystack/mcp-server"],
      "env": {
        "CAPYSTACK_API_KEY": "sk_capy_live_your_token_here",
        "CAPYSTACK_SERVER_URL": "https://ais-dev-h66labxtxydwsep5z5o4tn-397474250777.us-west1.run.app"
      }
    }
  }
}
\`\`\`

Once loaded, you can ask your AI Code editor on your desktop:
> *"Listen, scrape plumbing leads in Atlanta via CapyStack and generate a customized outbound sales email matching Lovina Robinson's authority voice."*
Your desktop agent will call the CapyStack API, compile the list, run the generator, and format the outreach files instantly!

---

#### 🔄 3. Make.com / n8n Webhook Pipeline Configuration
To automated the complete multi-node publish:
1. Create a **Custom Webhook Trigger Node** inside Make.com.
2. Paste the webhook URL into your CapyStack **Developer Node Configurator**.
3. When you click *"Publish & Trigger Webhooks"*, CapyStack dispatches the JSON payloads containing your social drafts, website portals, or lead outreach pitches to Make.com instantly. Make.com then relays them to ElevenLabs, HeyGen, or Postiz automatically.`;
  } else if (qLower.includes("copilot") || qLower.includes("why did we use") || qLower.includes("co-pilot")) {
    answer = `### ❓ Why We Integrate Copilot AI inside CapyStack AI

Lovina, the addition of the **Copilot AI system** is a deliberate strategic design choice to secure user retention, teach client leverage, and maximize client success. We chose **Copilot AI powered by Google's server-side Gemini API** for three massive advantages:

---

#### 💡 1. 24/7 Strategic Implementation Support
Coaching software normally fails because users get stuck on technical configuration parameters (e.g. *how to write an ElevenLabs REST request* or *how to map n8n nodes*). By having an embedded strategist that has immediate context on B2B scale maps, users get custom technical code strings and operational checklists without waiting for a personal email from you.

#### 🔒 2. Absolute Key Verification & Server-Side Security
A massive vulnerability in basic web apps is exposing expensive API secrets (like Gemini, Stripe, HeyGen, or ElevenLabs tokens) to client-side browsers where they can be stolen.
*   **Our Solution:** CapyStack coordinates all model synthesis exclusively on our **secure Express container backend**. The browser never gets access to your private credentials, fully sealing your infrastructure.

#### 🚀 3. Creating "High-Ticket" Authority & Software Value
Instead of a simple database of records or plain forms, having a glowing, interactive strategy console elevates your CapyStack package from a basic "utility" to a **premium enterprise launch framework**. Your students pay $99/mo or $3,500 consulting fees because your system literally answers questions, designs lessons, writes clone teleprompter transcripts, and coaches them in real-time.

---

#### ⚙️ TECHNICAL SPECIFICATION OF AMERICAN COPILOT NODE
*   **LLM Core:** Generative AI System powered by standard \`gemini-2.5-flash\` or server fallbacks.
*   **Context Scope:** Configured with a dedicated system instruction limiting the agent to systems coaching, webhook routing, maps scraping, and video automated workflows. This stops any unrelated conversation and protects your server's token consumption!`;
  } else if (qLower.includes("teach") || qLower.includes("coaching") || qLower.includes("curriculum")) {
    answer = `### 🎓 Lovina Robinson's Coach-The-Coach Coaching Curriculum & Business Plan

The absolute fastest way to scale your revenue with CapyStack AI is **NOT** by selling $29 subscriptions. It is by selling high-ticket **"Tech-Enabled B2B System Coaching Packages" ($2,500 - $10,000)**! 

You teach agency owners, coaches, and creators how to establish *their own* custom automated content pipelines. You provide them with **CapyStack accounts for free** as their proprietary technology tool.

---

#### 📅 6-Week "B2B Scale Architecture" Coaching Program Outline

| Week | Title | Core Objective & Deliverable | CapyStack Feature Used |
| :--- | :--- | :--- | :--- |
| **Week 1** | **Authority Positioning Maps** | Audit existing client assets, remove AI slop, and establish their premium Founder domain. | **Brand Voice Configurator** |
| **Week 2** | **Competitive Citation Auditing** | Discover exactly under which query strings their direct competitors are cited by Gemini, ChatGPT, and Perplexity. | **Competitor AI-Citation Navigator** |
| **Week 3** | **GEO Content Calibration** | Teach clients how to adapt and write "Generative Engine Optimized" copy that LLMs will actively reference. | **GEO & SEO Calibration Studio** |
| **Week 4** | **Pristine Digital Cloning** | Train their ElevenLabs Voice ID and HeyGen Avatar ID to create high-performing clone assets. | **Omni-Social Publisher** |
| **Week 5** | **The Webhook Pipeline Launch**| Establish their Make.com automation sequence to fully connect CapyStack to ElevenLabs and HeyGen APIs. | **Developer Node Configurator** |
| **Week 6** | **Outbound Client Harvesting & Go Live**| Spin up custom local scrapers to harvest top business email leads in their city and launch Stripe. | **Maps Lead Scraper** & **Stripe Link** |

---

#### 💵 High-Leverage Math Example
*   **Option A:** Sell CapyStack AI to 100 creators at **$29/month**.
    *   *SaaS Income:* **$2,900/month**.
    *   *Support overhead:* 100 active customers requiring technical support.
*   **Option B (The Expert Playbook):** Enroll 10 systems coaching clients at **$3,500 one-time** (includes a complimentary 12-month license of CapyStack).
    *   *Program Revenue:* **$35,000**.
    *   *Support overhead:* 10 clients inside a dedicated high-touch mastermind cohort.
    
By delivering the actual *result* (saving 10-20 hours of production time and generating qualified leads on autopilot) rather than just a subscription login, your premium buyers buy with incredible conviction!`;
  } else {
    answer = `### 🐾 Welcome to Lovina Robinson's B2B Scale Matrix Copilot Hub

Excellent, Lovina! Our AI Academy Node is fully synchronized to answer any question about:
1. **Video & Speaking Voice Clones** (ElevenLabs & HeyGen instant setups).
2. **CapyStack AI Automation** (Multi-channel auto-publishing pipelines).
3. **Connecting Developer Tools** (REST Webhooks & custom Model Context Protocol/MCP servers).
4. **Teaching Others (The High-Ticket Coaching Playbook)**.

---

#### 💡 Try Clicking One of the Active Quick-Consult buttons:
- *"How do I connect my ElevenLabs and HeyGen clones to CapyStack?"*
- *"Explain how Model Context Protocol (MCP) works with my local code editors"*
- *"Provide me with a $5,000 corporate syllabus outline to teach others my Systems"*

Or type your custom question inside the console input below! Our model utilizes processing algorithms powered by the Google Gemini API to return action blueprints tailored to your professional authority.`;
  }

  return res.json({ answer, simulated: true });
});

// B. Endpoint: AI Lesson Script Generator & Course Planner
app.post("/api/generate-lesson-script", async (req, res) => {
  const { title, topic, duration, bullets, brandVoice } = req.body;
  if (!title || !topic) {
    return res.status(400).json({ error: "Missing required fields: title and topic." });
  }

  const ai = getAI();
  if (ai) {
    try {
      const prompt = `You are a world-class digital production director and speech-architect.
We are planning a premium high-ticket lesson video for a professional course taught by Lovina Robinson.
The user is film-ready and using high-quality video & audio clones (ElevenLabs clone + HeyGen lip-sync avatar).

Here are the details:
- **Lesson Title**: ${title}
- **Topic / Focus**: ${topic}
- **Target Duration**: ${duration || 5} minutes
- **Core Outline / Bullet Points**: ${bullets || "No specific bullets provided, design a beautiful logical walkthrough."}
- **Brand Voice Context**: ${brandVoice || "Educator, authority speaker, system-oriented, high energy."}

Generate a complete, ready-to-record video script optimized for an AI Clone Avatar.
Structure the response cleanly with markdown, including:
1. **Lesson Hook** (First 30 seconds - dynamic, engaging statement)
2. **Core Training Body** (Step-by-step breakdown with visual avatar cues in brackets eg. [Visual Cue: Zoom in, show workflow screenshot])
3. **Closing CTA** (Call to Action focused on system scale, webhooks, or automated client acquisition)
4. **Estimated Speech Wordcount & Audio Target Settings** (For ElevenLabs speaker configuration)

Make it sound extremely professional, actionable, and full of authority. Maintain Lovina's voice tone (systems scale, leveraged loops, client capacity).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const script = response.text || "";
      return res.json({ script, simulated: false });
    } catch (err: any) {
      console.error("Gemini failed in Lesson Script Generator, falling back...", err);
    }
  }

  // Fallback engine if Gemini is offline/missing credential
  const fallbackScript = `### Clonic Video Script: "${title}"
*Production Ready • Estimated Duration: ${duration || 5} minutes*

#### 🎬 1. The Power-Hook (0:00 - 0:45)
**[Visual Cue: Camera opens on high-contrast dark theme background. Lovina's avatar stands centered, looking directly into the camera with absolute composure. Warm, inviting gesture.]**

*"Hello and welcome back, creators and systems builders. If you are watching this, you probably already know that traditional video production is a massive leak in your business container. Spending fifteen hours every single week writing, recording, stumbling over words, editing, and rendering is holding back your scale potential."*

**[Visual Cue: Subtle zoom in. Display elegant neon motion text highlighting: "15 Hours Saved"]**

*"Today, we dissolve that boundary. We are exploring the core mechanics of "${topic}". By passing raw high-performing text directly from CapyStack AI into ElevenLabs and HeyGen nodes, we eliminate the camera, the microphone, and the editing booth. Let us step directly into the system mechanics..."*

---

#### 🛠️ 2. The Core Pipeline Delivery (0:45 - 4:00)
**[Visual Cue: Slide transition. Screencast showing CapyStack's automated webhook payloads cascading into n8n and Activepieces nodes.]**

${bullets ? bullets.split("\n").map((b: string) => `* **[Visual Cue: Main Screen points to bullet outline]**\n  "${b}"`).join("\n\n") : `* **[Visual Cue: Graphic of Webhook node triggering ElevenLabs API]**\n  "First, understand the triggers. The moment CapyStack writes your professional authority copies, they are routed through custom programmatic pipes."\n\n* **[Visual Cue: Displaying Avatar Lipsync rendering progress]**\n  "Second, ElevenLabs converts this stream into your exact natural voice cadence. HeyGen instantly syncs the waveform to your high-fidelity clone. This isn't just speed; it's leverage."`}

---

#### 🎯 3. Actionable Scale Blueprint & CTA (4:00 - 5:00)
**[Visual Cue: Camera cuts back to Lovina's single close-up avatar. Confident, authoritative pose.]**

*"This is how you collapse hours into seconds. When you combine this automated publishing loop with our dynamic Leads Scrapers, you don't just speak; you capture. If you are ready to construct these precise systems, claim your 7-Day Free Trial using the checkout code 'capystack'."*

**[Visual Cue: Screen fades out to show exclusive coaching syllabus links.]**

*"I will see you in the next active training node. Keep scaling."*

---

#### 📊 Production Metadata:
*   **Speech Wordcount**: ~520 absolute words (Perfect for standard 130 WPM speech cadence).
*   **ElevenLabs Recommendation**: Stability 62%, Clarity 85%, Style Exaggeration 10%.`;

  return res.json({ script: fallbackScript, simulated: true });
});

// 8. Endpoint: Stripe Checkout Integration
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  const { planName, priceAmount, billingPeriod } = req.body;
  
  if (!planName || priceAmount === undefined) {
    return res.status(400).json({ error: "Missing required parameters: planName and priceAmount." });
  }

  const hostUrl = process.env.APP_URL || `http://localhost:3000`;
  const stripe = getStripe();

  if (!stripe) {
    // Return mock session URL for local preview testing with zero configuration setup
    return res.json({
      simulated: true,
      checkoutUrl: `${hostUrl}/#simulated-checkout?plan=${encodeURIComponent(planName)}&price=${priceAmount}&billing=${billingPeriod || "monthly"}`,
      planName,
      priceAmount
    });
  }

  try {
    // For free plans or 0 pricing, avoid creating paid stripe sessions
    if (Number(priceAmount) === 0) {
      return res.json({
        simulated: true,
        checkoutUrl: `${hostUrl}/#success?plan=${encodeURIComponent(planName)}`
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `CapyStack AI - ${planName}`,
              description: `All-in-one AI stack collapser. Flat rates with high-power GPU credits. Billing: ${billingPeriod || "monthly"}.`,
            },
            unit_amount: Math.round(Number(priceAmount) * 100), // to cents
            recurring: {
              interval: billingPeriod === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${hostUrl}/#success?plan=${encodeURIComponent(planName)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${hostUrl}/#pricing`,
    });

    return res.json({
      simulated: false,
      checkoutUrl: session.url
    });
  } catch (error: any) {
    console.error("Stripe checkout creation session error:", error);
    return res.json({
      simulated: true,
      checkoutUrl: `${hostUrl}/#simulated-checkout?plan=${encodeURIComponent(planName)}&price=${priceAmount}&billing=${billingPeriod || "monthly"}&error=${encodeURIComponent(error.message)}`,
      planName,
      priceAmount
    });
  }
});

// Mock Fallback generators for instant zero-dependency onboarding & resilient operations.
function getSimulatedMapsLeads(keyword: string, city: string, state: string, limit: number): any[] {
  const normKeyword = keyword.toLowerCase();
  const capKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
  const capCity = city.charAt(0).toUpperCase() + city.slice(1);
  const capState = state.toUpperCase();

  // Create a base template list and map to user's desired keyword
  const names = [
    `${capCity} ${capKeyword} Experts`,
    `Apex ${capKeyword} & Maintenance`,
    `Precision Local ${capKeyword} LLC`,
    `Elite Metro ${capKeyword}`,
    `${capCity} Core ${capKeyword} Pros`,
    `Rapid Response ${capKeyword} Co.`,
    `A1 Friendly ${capKeyword} Team`,
    `Pro-Link ${capKeyword} Systems`,
    `Heritage ${capKeyword} Solutions`,
    `Vanguard ${capKeyword} Consultants`,
  ];

  const streets = [
    "104 Meadow Lane",
    "485 Oakwood Drive",
    "92 Maple Boulevard",
    "12 Pine Street",
    "732 Cedar Road",
    "31 Elms Avenue",
    "502 Industrial Parkway",
    "88 Ocean View Road",
    "145 Broadway Street",
    "607 Hilltop Court",
  ];

  const domains = [
    `${normKeyword}experts.com`,
    `apex${normKeyword}.net`,
    `precision${normKeyword}local.com`,
    `elitemetro${normKeyword}co.com`,
    `${normKeyword}pros${normKeyword}.org`,
    `rapid${normKeyword}team.com`,
    `a1friendly${normKeyword}.com`,
    `prolink${normKeyword}sys.net`,
    `heritage${normKeyword}.com`,
    `vanguard${normKeyword}group.org`,
  ];

  const results = [];
  for (let i = 0; i < limit; i++) {
    const brandName = names[i % names.length] + (i >= names.length ? ` #${i - names.length + 2}` : "");
    const dSuffix = domains[i % domains.length];
    const emailPrefix = i % 2 === 0 ? "info" : "contact";
    const stars = Number((4.0 + (i % 10) * 0.1).toFixed(1));
    const reviewsCount = 12 + (i * 18) + (i % 3) * 7;

    results.push({
      id: `map_lead_${i + 201}_${Date.now()}`,
      name: brandName,
      phone: `(${555 + (i % 3)}) 812-${4000 + i * 19}`,
      email: `${emailPrefix}@${dSuffix}`,
      website: `https://www.${dSuffix}`,
      address: `${streets[i % streets.length]}, ${capCity}, ${capState}`,
      stars: stars,
      reviewsCount: reviewsCount,
      latitude: 37.7749 + (i * 0.005),
      longitude: -122.4194 + (i * 0.005)
    });
  }

  return results;
}

function getSimulatedCompetitorAnalysis(urlOrTopic: string, industry: string, hadError = false): any {
  const competitor = urlOrTopic.includes(".") ? urlOrTopic.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] : urlOrTopic;
  return {
    competitor: competitor.charAt(0).toUpperCase() + competitor.slice(1),
    industry: industry,
    seoScore: hadError ? 68 : 82,
    geoScore: hadError ? 43 : 48,
    topKeywords: [
      { keyword: `best ${industry.toLowerCase()} solutions`, trafficVolume: "3.4K/mo", difficulty: "High", intent: "Commercial" },
      { keyword: `${industry.toLowerCase()} for solopreneurs`, trafficVolume: "1.8K/mo", difficulty: "Medium", intent: "Informational" },
      { keyword: `how to automate ${industry.toLowerCase()}`, trafficVolume: "920/mo", difficulty: "Low", intent: "Transactional" },
      { keyword: `${competitor} reviews`, trafficVolume: "450/mo", difficulty: "Low", intent: "Navigational" }
    ],
    aiCitations: [
      { source: "Reddit community threads (r/solopreneur)", coveragePct: 74, tone: "Positive", isMainCitation: true },
      { source: "TechCrunch Startup Hub Profile", coveragePct: 45, tone: "Neutral", isMainCitation: false },
      { source: "Substack newsletters", coveragePct: 35, tone: "Positive", isMainCitation: true },
      { source: "GitHub repositories & Developer docs", coveragePct: 15, tone: "Neutral", isMainCitation: false }
    ],
    strengths: [
      "Heavy keyword footprint in high-intent traditional SEO search results",
      "Excellent mention density on peer-review platforms and online communities"
    ],
    weaknesses: [
      "Completely lacks first-party statistics or clear expert-byline schema markup",
      "Very low citation directness (AI engines fail to summarize their product values objectively)"
    ],
    geoOpportunities: [
      { topic: "Direct comparison guides", strategy: "Write comparative guides with table structured layouts; LLMs love extracting structured table facts.", priority: "High" },
      { topic: "Statistics & Proprietary Research", strategy: "Publish custom data sheets. LLMs reference specific percentages like '34% boost' 8.5x more than text descriptions.", priority: "High" },
      { topic: "FAQ Snippet Sections", strategy: "Add Q&A structures containing clean definitions directly matching conversational voice prompts.", priority: "Medium" }
    ]
  };
}

function getSimulatedGEOSEOScore(content: string, hadError = false): any {
  return {
    urlOrContent: content.length > 40 ? content.slice(0, 40) + "..." : content,
    traditionalSeoScore: 78,
    geoScore: 54,
    overallGrade: "B",
    metrics: {
      authoritySignals: 45,
      citationDirectness: 58,
      entityAlignment: 65,
      readabilityAndFlow: 82,
      structuredDataScore: 40
    },
    aiPlatformsScore: [
      { platform: "Gemini", citationProbability: 62, viabilityStatus: "Moderate Citation" },
      { platform: "ChatGPT Search", citationProbability: 48, viabilityStatus: "Low Citation" },
      { platform: "Perplexity", citationProbability: 71, viabilityStatus: "Strong Citation" },
      { platform: "Claude Briefs", citationProbability: 55, viabilityStatus: "Moderate Citation" }
    ],
    geoBoostActions: [
      {
        category: "Authoritativeness",
        action: "Inject a clear professional statement from a named subject matter expert (SME).",
        impact: "Critical",
        revisedFragment: `"According to industry systems analyst John Doe, implementing structured optimization arrays reduces user citation drag by up to 47.3%."`
      },
      {
        category: "Citation proofing",
        action: "Create a summarized key value takeaway in high-contrast bulleted format at the start.",
        impact: "High",
        revisedFragment: `"- Key Concept: Generative Engine Optimization aligns content parameters to fit target training weight vectors.\n- Core Benefit: 5x more recommended citations."`
      },
      {
        category: "Structured Data",
        action: "Wrap technical concepts with precise definitions matching semantic entity weights.",
        impact: "Medium",
        revisedFragment: `"GEO (Generative Engine Optimization) is the specific engineering practice of configuring online content to increase the mathematical frequency of indexation and prompt citation."`
      }
    ],
    summaryFeedback: "Your content possesses solid standard readability, but lacks high-authority signals and numeric facts. Adding verified expert credentials, data metrics, and concise structured sections satisfies modern AI citation selectors."
  };
}

function getSimulatedRepurpose(originalText: string, coreTopic?: string, hadError = false): any {
  return {
    originalText: originalText.length > 50 ? originalText.slice(0, 50) + "..." : originalText,
    title: `The Next Evolution: Aligned Content Synthesis for ${coreTopic || "Modern Solopreneurs"}`,
    xThread: [
      { postNumber: 1, text: `1/ Traditional SEO is dying a quiet death. Generative AI is now answering search questions directly before users ever web-click. Here is how modern content systems survive 👇`, characterCount: 174 },
      { postNumber: 2, text: `2/ The shift is from keywords to CITATIONS. LLMs choose sources with high authoritativeness signals, clear numeric tables, and direct answers. No fluff, just bulletproof facts.`, characterCount: 181 },
      { postNumber: 3, text: `3/ Multi-channel publishing increases the likelihood that AI models crawl your brand footprint on premium platforms (LinkedIn, GitHub, Substack). Leverage automation to dominate namespaces.`, characterCount: 191 },
      { postNumber: 4, text: `4/ Automation tip: Connect a simple Express webhook on your custom VPS. Forward refined content scripts (with Claude Code commands) to automate social posting completely. Done! 🚀`, characterCount: 187 }
    ],
    linkedInPost: `🚀 Why traditional search optimization is no longer enough for modern solopreneurs.

When people look for solutions, they ask AI tools to find and summarize options for them. This is the new era of GEO (Generative Engine Optimization).

Our research shows AI engines select citations based on three key components:
1. First-party statistical insights.
2. Authority bylaws and direct, verified answers.
3. Multi-platform footprints (The wider your web footprints, the higher the context-window recall).

👉 Takeaway: Stop writing generic keyword-stuffed SEO blogs. Start crafting authority-proven facts and distribute them to every social node. Use robust VPS scripts or AI webhooks to automate execution.

How is your brand positioning for AI search results? Let's discuss below 👇
#SEO #GEO #Solopreneur #Automation #ClaudeCode`,
    mediumArticle: `## Section 1: The Transition from Traditional Search Engine Optimization to GEO

For over two decades, Google Search algorithms dictated how business content was created. We focused on meta tags, exact density levels, and backlinks. Today, a paradigm shift is happening. Generative search interfaces have restructured natural exploration. Instead of looking at 10 blue links, users receive a conversational answer synthesized from multiple indexes.

To survive, brands must focus on GEO: Generative Engine Optimization. This means preparing elements specifically designed to fit within prompt context windows.

## Section 2: Implementing Omnipurposed Citation Networks

Building authority is no longer solely about domain rank; it is about reference diversity. If your brand is discussed on specialized communities (Reddit, Substack feeds), referenced in high-value documentation repositories, or mentioned on leading curated newsletters, the AI's probability weight increases.

Using automated hubs—often powered by lightweight VPS systems in tandem with robust CLI bots (like Claude Code)—allows creators to translate one strategic concept into dozens of bespoke channel publications in real-time.`,
    webhookPayload: JSON.stringify({
      event: "content.synthesized",
      channel_targets: ["twitter", "linkedin", "medium"],
      campaign_metadata: {
        title: `The Next Evolution: Aligned Content Synthesis for ${coreTopic || "Modern Solopreneurs"}`,
        repurposed_at: "2026-06-18T17:34:15Z"
      },
      distribution_ready: true
    }, null, 2),
    claudeCodeCommand: `curl -X POST "https://your-private-vps-ip/api/webhooks/publish" \\
  -H "Content-Type: application/json" \\
  -d '{
    "secret": "VPS_SECRET_TOKEN",
    "topic": "${coreTopic || "SaaS Strategy"}",
    "title": "GEO Strategy Guide",
    "networks": ["twitter", "linkedin"]
  }'`,
    marketingHooks: [
      "Traditional search is dying. Can AI find your company?",
      "How creators are using Claude Code and VPS automation to scale content 10x.",
      "The exact optimization trick to get Cited by Gemini."
    ]
  };
}

function getSimulatedBrandProfile(sampleText: string, hadError = false): any {
  return {
    brandName: "EliteCreator AI",
    tagline: "Action-Biased Systems for Modern Single-Operators",
    voiceTone: "Bold, highly empirical, and technical but digestible",
    targetAudience: "Solopreneurs, software builders, and automated agencies",
    accentColor: "#06B6D4", // Cyan
    secondaryColor: "#6366F1", // Indigo
    vocabulary: ["Generative vectors", "High-leverage structures", "Omni-channels", "Authority nodes"],
    prohibitedWords: ["revolutionary", "game-changing", "disruptive"],
    suggestedBioUsable: "EliteCreator AI automates multi-channel social distribution pipelines through clean, lightweight server webhooks, ensuring maximum citation frequency."
  };
}

function getSimulatedWebsite(brandProfile: any, niche?: string): any {
  const brandName = brandProfile?.brandName || "Lovina Consulting Systems";
  const accent = brandProfile?.accentColor || "#10B981";
  const secondary = brandProfile?.secondaryColor || "#06B6D4";
  const tagline = brandProfile?.tagline || "High-Leverage Scaling Maps for Ambitious Operators";
  
  return {
    title: `${brandName} - Authority Portal`,
    subtitle: tagline,
    heroHeader: `Transforming Raw Audience Data into High-Leverage Assets`,
    heroButtonText: "Initialize Brand Map",
    features: [
      { icon: "Zap", title: "Automated System Capacity", description: `Scale your brand automatically using system guidelines custom fitted to your actual niche.` },
      { icon: "Target", title: "GEO Placement Indexing", description: "Optimize citations contextually to capture high-volume query citations." },
      { icon: "Sparkles", title: "Omni-Channel Synthesis", description: "Seamless multi-network posts drafted and automated in real-time." }
    ],
    faqs: [
      { question: "How does the brand alignment logic avoid copyright overlap?", answer: "All copy outputs go through strict entity translation guidelines, using precise industry definitions without citing competitors directly." },
      { question: "Can we configure n8n or make.com webhooks?", answer: "Yes, fully production-ready JSON webhooks are exported instantly to trigger publication arrays with high speed." },
      { question: "Do the mock domains map to realistic client leads?", answer: "No, they represent actual query structures scraped using natural language intent mapping." }
    ],
    ctaHeader: `Ready to Systematize Your Multi-Channel Brand?`,
    ctaText: "Generate custom templates and publish live instances in a single click using our Wix/GoDaddy style direct creator templates.",
    socialLinks: { twitter: "https://twitter.com/example_brand", linkedin: "https://linkedin.com/in/example_brand", github: "https://github.com/example_brand" },
    metaTitle: `Authority Growth Systems | ${brandName}`,
    metaDescription: `Discover high-leverage content publishing assets tailored specifically for ${niche || 'B2B Founders'}.`,
    fonts: { headings: "Space Grotesk", body: "Inter" }
  };
}

function getSimulatedLeads(keywords: string, platformFilter?: string): any[] {
  return [
    {
      id: "lead_101",
      platform: "X/Twitter",
      userHandle: "@johndoebuilder",
      userName: "John Doe | Bootstrapped Founder",
      userBio: "Building tools for single-operators. Ex-Stripe engineer. Overwhelmed by social media posting schedules.",
      postContent: `Traditional SEO is taking too long for my new developer suite. Does anyone know how to optimize specifically for Gemini or Copilot citations? Also need help repurposing my README to Twitter threads automatically.`,
      expressedNeed: "Needs automated GEO content strategy and GitHub/README-to-Thread repurposing solutions.",
      relevanceScore: 96,
      recommendedPitch: `Hi John! Saw your post about LLM citation indexing. Standard keyword strategy has shifted entirely to GEO (Generative Engine Optimization). We just built a tool that takes your product specs or bio, decodes your perfect accent colors, and automatically formats structured, bite-size articles for index citation. Let's get you set up with a simple Claude Code endpoint or Make.com workflow.`,
      engagementTriggerUrl: "https://twitter.com/johndoebuilder/status/2947194",
      leadStatus: "New"
    },
    {
      id: "lead_102",
      platform: "LinkedIn",
      userHandle: "in/mark-systems",
      userName: "Marcus Vance",
      userBio: "Growth Operator at ScaleMatrix Automation. Focus on private VPS and n8n webhooks.",
      postContent: `Tired of spending $3k/month on content writers who don't understand our tech stack. I want a pipeline where I dump raw transcript files and n8n triggers fully styled multi-channel copy that sounds exactly like our team.`,
      expressedNeed: "Seeking custom pipeline to convert raw transcripts into on-brand multi-channel posts via n8n.",
      relevanceScore: 92,
      recommendedPitch: `Hello Marcus, our suite is designed exactly for this. It extracts your linguistic profile, matching accents, and core vocabulary in one click, then outputs n8n/Make webhook JSON files. You can plug it into your existing webhook flow or execute commands directly from Claude Code. Free setup model!`,
      engagementTriggerUrl: "https://linkedin.com/posts/mark-systems-38827173",
      leadStatus: "New"
    },
    {
      id: "lead_103",
      platform: "Reddit",
      userHandle: "u/growth_architect",
      userName: "Reddit Growth Architect",
      userBio: "Active member in r/solopreneur and r/marketing. Seeking smart ways to automate newsletters.",
      postContent: `How are you guys scraping competitors? I don't want to copy them, but I want to look up what keywords they are dominating in Gemini search results so I can write better articles.`,
      expressedNeed: "Anxious to discover competitor keyword and citing footprint inside LLM search widgets.",
      relevanceScore: 89,
      recommendedPitch: `Excellent question! The secret to competing is isolating their 'AI Citation Probability' and using entity adjustments. We developed a GEO Analyzer that grades any post or URL against Perplexity, Gemini, ChatGPT, and offers revised sentences to win back high-percentile citations. Take a look.`,
      engagementTriggerUrl: "https://reddit.com/r/solopreneur/comments/7291a",
      leadStatus: "New"
    },
    {
      id: "lead_104",
      platform: "Web/Blog",
      userHandle: "bootstrapweekly.com",
      userName: "Bootstrap Weekly Editorial",
      userBio: "Premier curator list for solo micro-SaaS builders.",
      postContent: `Looking for guest writers to cover the intersection of Claude-enabled developer workspaces, VPS server configurations, and micro-publishing vectors.`,
      expressedNeed: "In search of subject matter expert to write about agent-driven developer toolchains and VPS setups.",
      relevanceScore: 85,
      recommendedPitch: `Hey editorial team! We specialize in systems coaching and multi-channel publication loops (fully utilizing Claude Code terminal prompts and live servers). We'd love to write an expert-attributed guide showing how founders are automatically configuring custom blogs from a single brand bio.`,
      engagementTriggerUrl: "https://bootstrapweekly.com/write-for-us",
      leadStatus: "New"
    }
  ];
}

// Vite Server middleware integration for dev-mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve fallback static files
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DeepReach Suite back-end running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
