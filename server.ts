import express from "express";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config({ path: ".env.local" });

const app = express();
app.use(express.json());

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "hermes3:latest";

app.get("/api/health", async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    const data = await response.json();
    res.json({ status: "ok", ollama: "connected", models: data.models?.map((m: any) => m.name) || [] });
  } catch (error) {
    res.status(500).json({ status: "error", ollama: "unreachable" });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message, systemPrompt, module } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  const systemPrompts: Record<string, string> = {
    "lead-scraper": "You are a lead qualification AI. Analyze business data and return structured JSON with: business_name, address, phone, website, category, lead_score (1-10), reasoning.",
    "seo-scorecard": "You are an SEO and GEO analyst. Analyze a URL or business and return JSON with: overall_score (1-100), categories array with name/score/issues/recommendations, top_3_actions, competitor_gaps.",
    "social-prospector": "You are a social media lead prospector. Analyze profiles and return JSON with: platform, handle, engagement_level, content_themes, outreach_angle, priority (1-10).",
    "omni-publisher": "You are a content strategist. Generate platform-optimized variations from a topic. Return JSON with posts array: platform, content, hashtags, best_time, content_type.",
    "competitor-nav": "You are an AI citation analysis engine. Analyze brand presence in AI search results. Return JSON with: brand_mentions, citation_contexts, competitor_citations, gap_opportunities, authority_score."
  };

  const activeSystemPrompt = systemPrompt || systemPrompts[module] || systemPrompts["seo-scorecard"];

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: activeSystemPrompt },
          { role: "user", content: message }
        ],
        stream: false,
        options: { temperature: 0.7, num_ctx: 8192 }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: "Ollama error: " + error });
    }

    const data = await response.json();
    res.json({ response: data.message?.content || "", model: data.model, module: module || "default" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to reach Ollama", hint: "Check OLLAMA_BASE_URL" });
  }
});

async function startServer() {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
  app.use(vite.middlewares);
  const PORT = parseInt(process.env.PORT || "3000");
  app.listen(PORT, () => {
    console.log("\n🚀 CapyStack AI running at http://localhost:" + PORT);
    console.log("🦙 Ollama backend: " + OLLAMA_BASE_URL);
    console.log("🧠 Model: " + OLLAMA_MODEL + "\n");
  });
}

startServer();

app.post("/api/scrape-maps-leads", async (req, res) => {
  const { keyword, city, state, limit } = req.body;
  if (!keyword || !city) return res.status(400).json({ error: "keyword and city required" });

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: "You are a lead generation AI. Return ONLY a valid JSON array, no markdown, no explanation. Each object must have exactly these fields: id (string like lead_1), name (string), phone (string), email (string), website (string), address (string), stars (number 1-5), reviewsCount (number), latitude (number), longitude (number)." },
          { role: "user", content: `Generate ${limit || 5} realistic business leads for "${keyword}" in "${city}, ${state || 'US'}". Return ONLY the JSON array.` }
        ],
        stream: false,
        options: { temperature: 0.8, num_ctx: 4096 }
      })
    });

    const data = await response.json();
    const content = data.message?.content || "[]";
    
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const leads = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      res.json(leads);
    } catch {
      res.json([]);
    }
  } catch (error: any) {
    res.status(500).json({ error: "Ollama unreachable" });
  }
});

app.post("/api/score-geo-seo", async (req, res) => {
  const { contentToAnalyze } = req.body;
  if (!contentToAnalyze) return res.status(400).json({ error: "contentToAnalyze required" });

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: `You are a GEO and SEO scoring engine. Analyze content and return ONLY valid JSON matching this exact structure, no markdown, no explanation:
{
  "urlOrContent": "the input text",
  "traditionalSeoScore": 0-100,
  "geoScore": 0-100,
  "overallGrade": "A/B/C/D/F",
  "metrics": {
    "authoritySignals": 0-100,
    "citationDirectness": 0-100,
    "entityAlignment": 0-100,
    "readabilityAndFlow": 0-100,
    "structuredDataScore": 0-100
  },
  "aiPlatformsScore": [
    {"platform":"ChatGPT","citationProbability":0-100,"viabilityStatus":"Strong Citation"},
    {"platform":"Perplexity","citationProbability":0-100,"viabilityStatus":"Moderate Citation"},
    {"platform":"Claude","citationProbability":0-100,"viabilityStatus":"Low Citation"},
    {"platform":"Gemini","citationProbability":0-100,"viabilityStatus":"Moderate Citation"}
  ],
  "geoBoostActions": [
    {"category":"Structured Data","action":"Add FAQ schema markup","impact":"Critical"},
    {"category":"Authoritativeness","action":"Add author bio with credentials","impact":"High"},
    {"category":"Entity optimization","action":"Include entity-rich descriptions","impact":"Medium"},
    {"category":"Citation proofing","action":"Add inline citations to claims","impact":"High"}
  ]
}` },
          { role: "user", content: `Analyze this content for SEO and AI citation readiness:\n\n${contentToAnalyze}` }
        ],
        stream: false,
        options: { temperature: 0.7, num_ctx: 4096 }
      })
    });

    const data = await response.json();
    const content = data.message?.content || "{}";
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      res.json(result);
    } catch {
      res.status(500).json({ error: "Failed to parse AI response" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Ollama unreachable" });
  }
});

// =============================================
// ENDPOINT 5: Competitor Analysis
// =============================================
app.post("/api/analyze-competitor", async (req, res) => {
  const { contentToAnalyze } = req.body;
  if (!contentToAnalyze) return res.status(400).json({ error: "contentToAnalyze required" });

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: "You are an AI citation and competitor analysis engine. Analyze the given brand or topic for AI search presence and traditional SEO. Return ONLY valid JSON, no markdown, no explanation: {\"competitor\":\"name\",\"industry\":\"detected\",\"seoScore\":0-100,\"geoScore\":0-100,\"brandMentions\":[{\"platform\":\"ChatGPT\",\"mentioned\":true,\"context\":\"how they appear\"}],\"citationContexts\":[\"context1\"],\"competitorCitations\":[{\"competitor\":\"name\",\"citationCount\":5,\"strength\":\"strong\"}],\"gapOpportunities\":[\"gap1\",\"gap2\"],\"authorityScore\":0-100,\"recommendations\":[\"action1\",\"action2\"]}" },
          { role: "user", content: `Analyze this for AI search presence and competitive positioning: "${contentToAnalyze}". Return ONLY the JSON object.` }
        ],
        stream: false,
        options: { temperature: 0.7, num_ctx: 8192 }
      })
    });
    if (!response.ok) { const error = await response.text(); return res.status(500).json({ error: "Ollama error: " + error }); }
    const data = await response.json();
    const content = data.message?.content || "{}";
    try { const jsonMatch = content.match(/\{[\s\S]*\}/); const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {}; res.json(result); } catch { res.json({}); }
  } catch (error: any) { res.status(500).json({ error: "Ollama unreachable" }); }
});

// =============================================
// ENDPOINT 6: Content Repurpose (Publisher)
// =============================================
app.post("/api/repurpose-content", async (req, res) => {
  const { originalText, coreTopic, brandProfile } = req.body;
  if (!originalText) return res.status(400).json({ error: "originalText required" });

  const brandCtx = brandProfile ? `Brand: ${brandProfile.brandName || ""}. Voice: ${brandProfile.brandVoice || "professional"}. Audience: ${brandProfile.targetAudience || "general"}.` : "Use a professional, engaging tone.";

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: `You are a content strategist who repurposes content for multiple platforms. ${brandCtx} Return ONLY valid JSON, no markdown, no explanation: {"coreTopic":"topic","posts":[{"platform":"Twitter/X","content":"post text","hashtags":["tag1","tag2"],"bestTime":"9:00 AM EST","contentType":"thread","characterCount":280},{"platform":"LinkedIn","content":"post text","hashtags":["tag1"],"bestTime":"8:00 AM EST","contentType":"post","characterCount":1300},{"platform":"Instagram","content":"caption","hashtags":["tag1","tag2","tag3"],"bestTime":"12:00 PM EST","contentType":"carousel","characterCount":2200},{"platform":"TikTok","content":"hook + script","hashtags":["tag1"],"bestTime":"7:00 PM EST","contentType":"video script","characterCount":300},{"platform":"Email Newsletter","content":"subject + body","hashtags":[],"bestTime":"Tuesday 10 AM","contentType":"newsletter","characterCount":500}]}` },
          { role: "user", content: `Repurpose this content for all major platforms. Core topic: "${coreTopic || "general"}". Original content: "${originalText}". Return ONLY the JSON object.` }
        ],
        stream: false,
        options: { temperature: 0.8, num_ctx: 8192 }
      })
    });
    if (!response.ok) { const error = await response.text(); return res.status(500).json({ error: "Ollama error: " + error }); }
    const data = await response.json();
    const content = data.message?.content || "{}";
    try { const jsonMatch = content.match(/\{[\s\S]*\}/); const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {}; res.json(result); } catch { res.json({}); }
  } catch (error: any) { res.status(500).json({ error: "Ollama unreachable" }); }
});

// =============================================
// ENDPOINT 7: AI Website Generator (Builder)
// =============================================
app.post("/api/generate-website", async (req, res) => {
  const { brandProfile, niche } = req.body;
  if (!niche && !brandProfile) return res.status(400).json({ error: "niche or brandProfile required" });

  const brandCtx = brandProfile ? `Brand: ${brandProfile.brandName || ""}. Voice: ${brandProfile.brandVoice || "professional"}. Colors: ${brandProfile.brandColors || "modern blue"}.` : "";

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: `You are an AI website architect. ${brandCtx} Generate a complete website template. Return ONLY valid JSON, no markdown, no explanation: {"siteName":"name","niche":"niche","tagline":"tagline","colorScheme":{"primary":"#hex","secondary":"#hex","accent":"#hex","background":"#hex","text":"#hex"},"pages":[{"name":"Home","slug":"/","sections":[{"type":"hero","headline":"text","subheadline":"text","ctaText":"Get Started","ctaLink":"#contact"},{"type":"features","headline":"Why Choose Us","items":[{"title":"F1","description":"desc","icon":"star"},{"title":"F2","description":"desc","icon":"shield"},{"title":"F3","description":"desc","icon":"zap"}]},{"type":"testimonials","headline":"What Clients Say","items":[{"name":"Client","role":"Title","quote":"text","rating":5}]},{"type":"cta","headline":"Ready?","subheadline":"Contact us","ctaText":"Book a Call","ctaLink":"#contact"}]}],"seoMeta":{"title":"SEO title","description":"meta desc","keywords":["kw1","kw2"]}}` },
          { role: "user", content: `Generate a complete website template for the "${niche || "consulting"}" niche. Make it conversion-optimized. Return ONLY the JSON object.` }
        ],
        stream: false,
        options: { temperature: 0.8, num_ctx: 8192 }
      })
    });
    if (!response.ok) { const error = await response.text(); return res.status(500).json({ error: "Ollama error: " + error }); }
    const data = await response.json();
    const content = data.message?.content || "{}";
    try { const jsonMatch = content.match(/\{[\s\S]*\}/); const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {}; res.json(result); } catch { res.json({}); }
  } catch (error: any) { res.status(500).json({ error: "Ollama unreachable" }); }
});

// =============================================
// ENDPOINT 8: Social Lead Prospector
// =============================================
app.post("/api/scrape-leads", async (req, res) => {
  const { keywords, platformFilter } = req.body;
  if (!keywords) return res.status(400).json({ error: "keywords required" });

  const platInst = platformFilter ? `Focus on "${platformFilter}" platform.` : "Cover LinkedIn, Twitter/X, Instagram, TikTok, and YouTube.";

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: `You are a social media lead prospector. ${platInst} Return ONLY a valid JSON array, no markdown, no explanation. Each object must have exactly these fields: platform (string), handle (string), displayName (string), bio (string), followers (number), engagementLevel (string: high/medium/low), contentThemes (array of strings), outreachAngle (string), priority (number 1-10), profileUrl (string).` },
          { role: "user", content: `Find 8 social media lead prospects for: "${keywords}". ${platInst} Return ONLY the JSON array.` }
        ],
        stream: false,
        options: { temperature: 0.8, num_ctx: 4096 }
      })
    });
    if (!response.ok) { const error = await response.text(); return res.status(500).json({ error: "Ollama error: " + error }); }
    const data = await response.json();
    const content = data.message?.content || "[]";
    try { const jsonMatch = content.match(/\[[\s\S]*\]/); const leads = jsonMatch ? JSON.parse(jsonMatch[0]) : []; res.json(leads); } catch { res.json([]); }
  } catch (error: any) { res.status(500).json({ error: "Ollama unreachable" }); }
});

// Stripe Checkout Session
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-11-20.acacia" });

app.post("/api/stripe/create-checkout-session", async (req: any, res: any) => {
  const { planName, priceAmount, billingPeriod } = req.body;
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "") {
    return res.json({ simulated: true, checkoutUrl: "", planName, priceAmount });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: planName },
          unit_amount: priceAmount * 100,
          recurring: { interval: billingPeriod === "yearly" ? "year" : "month" }
        },
        quantity: 1
      }],
      success_url: `${process.env.APP_URL}?payment=success`,
      cancel_url: `${process.env.APP_URL}?payment=cancelled`
    });
    res.json({ simulated: false, checkoutUrl: session.url, planName, priceAmount });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    res.json({ simulated: true, checkoutUrl: "", planName, priceAmount });
  }
});
