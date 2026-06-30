"""
Social Media Content Crew — CrewAI agents powered by Ollama/Qwen via LiteLLM.

Four agents:
  1. TrendResearcher  — viral hooks, trending angles, timing
  2. ContentWriter    — platform-specific posts (LinkedIn, X, Instagram)
  3. VisualDirector   — ComfyUI image prompts for each platform
  4. QualityReviewer  — proofreads, scores, packages for approval

Output: structured JSON content package ready for human review.
"""
import json
import re
from typing import Optional

from config import LITELLM_URL, LITELLM_KEY, LLM_MODEL, LLM_FAST_MODEL, logger

try:
    from crewai import Agent, Task, Crew, Process
    from langchain_openai import ChatOpenAI
    _crewai_available = True
except ImportError:
    _crewai_available = False
    logger.warning("crewai or langchain_openai not installed")


def _llm(model: str = LLM_MODEL, temperature: float = 0.7):
    return ChatOpenAI(
        model=model,
        temperature=temperature,
        base_url=f"{LITELLM_URL}/v1",
        api_key=LITELLM_KEY,
        max_retries=2,
        timeout=300,
    )


# ─── JSON extraction helper ───────────────────────────────────────────────────

def _extract_json(text: str) -> Optional[dict]:
    """Best-effort extract of a JSON object from LLM output."""
    # Try direct parse first
    try:
        return json.loads(text.strip())
    except Exception:
        pass

    # Find JSON block between ```json ... ```
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except Exception:
            pass

    # Find the largest {...} block
    matches = re.findall(r"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", text, re.DOTALL)
    for m in sorted(matches, key=len, reverse=True):
        try:
            return json.loads(m)
        except Exception:
            continue

    return None


# ─── Fallback (no CrewAI) ────────────────────────────────────────────────────

def _ollama_fallback(niche: str, platforms: list, brand_voice: str) -> dict:
    """Single-shot Ollama call when CrewAI isn't installed."""
    import httpx
    platform_str = ", ".join(platforms)
    prompt = f"""
Write a complete social media content package for the niche: "{niche}".
Brand voice: {brand_voice}
Platforms: {platform_str}

Return ONLY valid JSON in this exact format:
{{
  "research_summary": "3 key trends for this niche right now",
  "content": {{
    "linkedin": "Full LinkedIn post 150-250 words with hook, bullets, CTA, hashtags",
    "twitter": ["Tweet 1 hook", "Tweet 2", "Tweet 3", "Tweet 4", "Tweet 5 CTA"],
    "instagram": "Instagram caption with emojis, 200 words, hashtags"
  }},
  "image_prompts": [
    {{"style": "photorealistic", "prompt": "detailed prompt", "negative_prompt": "blurry text", "width": 1024, "height": 1024}},
    {{"style": "infographic", "prompt": "detailed prompt", "negative_prompt": "ugly", "width": 1200, "height": 628}},
    {{"style": "bold type", "prompt": "detailed prompt", "negative_prompt": "faces people", "width": 1080, "height": 1080}}
  ],
  "best_post_times": {{"linkedin": "Tuesday 10am", "twitter": "12pm–1pm", "instagram": "7pm–9pm"}},
  "estimated_engagement": {{"linkedin": "High", "twitter": "Medium", "instagram": "High"}},
  "approval_notes": "Content ready. Review tone and update any brand-specific details."
}}
"""
    try:
        resp = httpx.post(
            f"{LITELLM_URL}/v1/chat/completions",
            headers={"Authorization": f"Bearer {LITELLM_KEY}", "Content-Type": "application/json"},
            json={"model": LLM_FAST_MODEL, "messages": [{"role": "user", "content": prompt}]},
            timeout=180,
        )
        raw = resp.json()["choices"][0]["message"]["content"]
        parsed = _extract_json(raw)
        if parsed:
            return parsed
        # Return raw wrapped
        return {"raw_output": raw, "error": "Could not parse JSON from LLM"}
    except Exception as e:
        return {"error": str(e)}


# ─── CrewAI crew builder ──────────────────────────────────────────────────────

def build_social_crew(
    niche: str,
    platforms: list[str],
    brand_voice: str = "professional and engaging",
    past_trends: str = "",
) -> dict:
    """
    Run the 4-agent social media content crew.
    Returns a structured content package dict.
    """
    if not _crewai_available:
        logger.warning("CrewAI not available — using fallback single-shot generation")
        return _ollama_fallback(niche, platforms, brand_voice)

    platform_list = ", ".join(platforms)
    has_linkedin = any("linkedin" in p.lower() for p in platforms)
    has_twitter = any(p.lower() in ["x", "twitter", "x/twitter"] for p in platforms)
    has_instagram = any("instagram" in p.lower() for p in platforms)

    llm_main = _llm(LLM_MODEL, temperature=0.65)
    llm_fast = _llm(LLM_FAST_MODEL, temperature=0.8)

    # ── Agent definitions ─────────────────────────────────────────────────────

    researcher = Agent(
        role="Social Media Trend Researcher",
        goal=(
            f"Identify the 5 most viral content angles and top trending hooks "
            f"for '{niche}' that will resonate on {platform_list}."
        ),
        backstory=(
            "You are a digital trend analyst who monitors Reddit, LinkedIn, and X daily. "
            "You have an instinct for what makes content go viral and can write irresistible hooks."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm_main,
    )

    writer = Agent(
        role="Social Media Content Writer",
        goal=(
            f"Write scroll-stopping, platform-native posts for: {platform_list}. "
            f"Match brand voice: {brand_voice}."
        ),
        backstory=(
            "You have 10 years crafting viral B2B and B2C social content. "
            "You know that LinkedIn needs line breaks and data, "
            "X needs punchy hooks under 280 chars, and Instagram needs energy and emojis."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm_main,
    )

    visual_director = Agent(
        role="AI Image Prompt Engineer",
        goal="Produce 3 distinct, detailed Stable Diffusion prompts for professional social media visuals.",
        backstory=(
            "You specialize in ComfyUI/SDXL prompting. You craft prompts that produce "
            "professional, brand-appropriate images without generic stock photo aesthetics."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm_fast,
    )

    reviewer = Agent(
        role="Content Strategy Reviewer",
        goal=(
            "Proofread, score, and package the final content into clean JSON "
            "for the human approval queue."
        ),
        backstory=(
            "You are a senior strategist who ensures every piece is on-brand, "
            "algorithm-optimized, and ready for client sign-off. "
            "You output ONLY valid JSON — no markdown fences, no explanation."
        ),
        verbose=True,
        allow_delegation=False,
        llm=_llm(LLM_FAST_MODEL, temperature=0.2),
    )

    # ── Task definitions ──────────────────────────────────────────────────────

    research_task = Task(
        description=f"""
Research trending content angles for niche: "{niche}" targeting {platform_list}.

Past trends you have already covered (avoid repeating):
{past_trends if past_trends else "None yet — this is the first run."}

Deliver:
1. Top 5 trending subtopics with audience pain points
2. 3 viral hook templates (fill-in-the-blank examples for {niche})
3. Best posting times for each platform: {platform_list}
4. 2-3 underserved content angles that competitors miss
5. One data point or statistic that supports the main angle
""",
        expected_output="Detailed research brief (markdown, 400–600 words) with 5 numbered sections.",
        agent=researcher,
    )

    content_task = Task(
        description=f"""
Using the research brief, write complete social media content for: {platform_list}.
Niche: "{niche}" | Brand voice: {brand_voice}

{"- LinkedIn: 180–280 word post. Hook on line 1. 3–4 bullet points. Data/stat included. CTA final line. 3-5 hashtags." if has_linkedin else ""}
{"- X/Twitter: Thread of 6–8 tweets. Tweet 1 = irresistible hook. Each max 278 chars. Tweet 7–8 = CTA + retweet ask." if has_twitter else ""}
{"- Instagram: 180–220 word caption. 3 emojis in first sentence. Storytelling arc. Strong CTA. 25 hashtags separated by newline." if has_instagram else ""}

Output as JSON:
{{
  "linkedin": "...",
  "twitter": ["tweet1", "tweet2", "tweet3", "tweet4", "tweet5", "tweet6", "tweet7"],
  "instagram": "..."
}}
Include only the platforms requested.
""",
        expected_output="JSON object with platform content keys.",
        agent=writer,
        context=[research_task],
    )

    visual_task = Task(
        description=f"""
Create 3 ComfyUI/Stable Diffusion image prompts for social media posts about "{niche}".

Each prompt must be distinct:
- Prompt 1: Photorealistic professional scene, natural lighting, 1024x1024
- Prompt 2: Clean infographic style, brand-color accents, 1200x628 (LinkedIn banner)
- Prompt 3: Bold graphic design, minimal text overlay, 1080x1080 (Instagram)

For each include: style, detailed positive prompt, negative_prompt, width, height.
Output as JSON array of 3 objects.
""",
        expected_output="JSON array of 3 image prompt objects with all required fields.",
        agent=visual_director,
        context=[research_task],
    )

    review_task = Task(
        description=f"""
Package the content into the final approval JSON.
Proofread for typos, fact-check tone, verify platform format rules, then output ONLY valid JSON:

{{
  "research_summary": "3-sentence summary of key findings",
  "content": {{ <platform content from writer — corrected if needed> }},
  "image_prompts": [ <3 image prompt objects from visual director> ],
  "best_post_times": {{ <platform: time string> }},
  "estimated_engagement": {{ <platform: "Low"|"Medium"|"High"> }},
  "hooks_used": ["hook 1", "hook 2"],
  "approval_notes": "Any flags or suggestions for the human reviewer"
}}

Output ONLY the JSON object — no markdown, no preamble.
""",
        expected_output="Valid JSON content package with all fields populated.",
        agent=reviewer,
        context=[research_task, content_task, visual_task],
    )

    # ── Execute crew ──────────────────────────────────────────────────────────

    crew = Crew(
        agents=[researcher, writer, visual_director, reviewer],
        tasks=[research_task, content_task, visual_task, review_task],
        process=Process.sequential,
        verbose=2,
    )

    try:
        raw_result = str(crew.kickoff())
        parsed = _extract_json(raw_result)

        if parsed:
            logger.info("Crew output parsed successfully as JSON")
            return parsed

        # Fallback: wrap raw output
        logger.warning("Could not parse crew output as JSON — storing raw")
        return {
            "research_summary": "Generated — see raw output",
            "content": {"raw": raw_result[:3000]},
            "image_prompts": [],
            "approval_notes": "JSON parsing failed — review raw content above.",
            "raw_output": raw_result[:5000],
        }

    except Exception as e:
        logger.error(f"Crew execution error: {e}")
        raise
