const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' });
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function ollamaChat(prompt) {
  const r = await axios.post('http://localhost:11434/api/generate', {
    model: 'qwen2.5:1.5b', prompt, stream: false
  });
  const match = r.data.response.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  return JSON.parse(match[0]);
}

app.post('/api/analyze-competitor', async (req, res) => {
  const { urlOrTopic, industry } = req.body;
  try {
    const data = await ollamaChat(`You are a GEO/SEO analyst. Analyze: "${urlOrTopic}" in "${industry}". Return ONLY valid JSON: {"competitor":"${urlOrTopic}","industry":"${industry}","seoScore":75,"geoScore":60,"aiCitations":["cited in ChatGPT results"],"keywordGaps":["keyword gap 1"],"geoOpportunities":[{"topic":"topic","priority":"High","strategy":"strategy"}],"recommendations":["recommendation 1"]}`);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/score-geo-seo', async (req, res) => {
  const { url, industry } = req.body;
  try {
    const data = await ollamaChat(`You are a GEO/SEO scorer. Score: "${url}" in "${industry}". Return ONLY valid JSON: {"url":"${url}","seoScore":70,"geoScore":55,"strengths":["strength 1"],"weaknesses":["weakness 1"],"recommendations":["rec 1"]}`);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/repurpose-content', async (req, res) => {
  const { content, formats } = req.body;
  try {
    const data = await ollamaChat(`Repurpose: "${content}" into ${JSON.stringify(formats)}. Return ONLY valid JSON: {"original":"${content}","repurposed":[{"format":"twitter","content":"repurposed version"}]}`);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/stripe/create-checkout-session', async (req, res) => {
  const { planName, priceAmount, billingPeriod } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], mode: 'subscription',
      line_items: [{ price_data: { currency: 'usd', product_data: { name: planName }, unit_amount: priceAmount * 100, recurring: { interval: billingPeriod === 'yearly' ? 'year' : 'month' } }, quantity: 1 }],
      success_url: process.env.APP_URL + '?payment=success',
      cancel_url: process.env.APP_URL + '?payment=cancelled'
    });
    res.json({ simulated: false, checkoutUrl: session.url });
  } catch (err) { res.json({ simulated: true, checkoutUrl: '', error: err.message }); }
});

// ── Social Media Agent proxy ─────────────────────────────────────────────────
// Forwards /api/social/* to the Python FastAPI service on port 5001
const SOCIAL_AGENT_URL = process.env.SOCIAL_AGENT_URL || 'http://localhost:5001';

app.all('/api/social/*', async (req, res) => {
  const targetPath = req.originalUrl; // keeps query params
  const targetUrl = SOCIAL_AGENT_URL + targetPath;
  try {
    const fetchResp = await axios({
      method: req.method,
      url: targetUrl,
      data: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      headers: { 'Content-Type': 'application/json' },
      timeout: 300000,
      responseType: 'arraybuffer',
      validateStatus: () => true,
    });
    res.status(fetchResp.status);
    const ct = fetchResp.headers['content-type'] || 'application/json';
    res.setHeader('Content-Type', ct);
    res.send(fetchResp.data);
  } catch (err) {
    res.status(502).json({ error: 'Social agent unavailable', detail: err.message });
  }
});

app.listen(3005, () => console.log('API on 3005'));
