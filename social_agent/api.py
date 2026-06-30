"""
Social Media Agent API — FastAPI server.

Campaigns:
  POST   /api/social/campaigns            Create campaign + trigger first run
  GET    /api/social/campaigns            List all campaigns
  GET    /api/social/campaigns/{id}       Get single campaign
  PATCH  /api/social/campaigns/{id}       Pause / resume / update frequency
  DELETE /api/social/campaigns/{id}       Delete campaign + all associated data
  POST   /api/social/campaigns/{id}/run   Trigger immediate content run

Jobs:
  GET    /api/social/jobs                 List jobs (filter by campaign/status)
  GET    /api/social/jobs/{id}            Get single job with full content
  POST   /api/social/jobs/{id}/approve    Human approval gate (approve/reject/regenerate)
  POST   /api/social/jobs/{id}/retry      Retry a failed (error-status) job
  POST   /api/social/jobs/{id}/images     Trigger ComfyUI image generation
  GET    /api/social/jobs/{id}/logs       Agent run logs for a job

Monitoring:
  GET    /api/social/openwebui/summary    Status summary for Open WebUI function calling
  GET    /api/social/images/{filename}    Serve generated images
  GET    /api/social/health               Health + scheduler status
"""
import json
import os
import threading
import uuid
from datetime import datetime
from typing import Optional

import httpx
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

import database as db
import scheduler as sched
from config import ACTIVEPIECES_WEBHOOK, IMAGES_DIR, logger
from crew import build_social_crew
from comfyui_client import generate_images_for_job
from qdrant_memory import store_trend, get_recent_trends

# ── App setup ─────────────────────────────────────────────────────────────────

app = FastAPI(title="Social Media Agent API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    db.init_db()
    sched.start()
    logger.info("Social Media Agent API started")


@app.on_event("shutdown")
def shutdown():
    sched.shutdown()


# ── Pydantic models ───────────────────────────────────────────────────────────

class CampaignCreate(BaseModel):
    name: str = Field(..., description="Friendly campaign name")
    niche: str = Field(..., description="Topic/niche e.g. 'AI for small businesses'")
    platforms: list[str] = Field(..., description="['linkedin','twitter','instagram']")
    brand_voice: str = Field("professional and engaging", description="Voice/tone descriptor")
    frequency: str = Field("daily", description="daily|2x-daily|weekly|test-5min")


class CampaignPatch(BaseModel):
    status: Optional[str] = None       # active|paused
    frequency: Optional[str] = None
    brand_voice: Optional[str] = None


class ApprovalBody(BaseModel):
    action: str = Field(..., description="approve|reject|regenerate")
    approved_by: str = "admin"
    notes: Optional[str] = None


# ── Background helpers ────────────────────────────────────────────────────────

def _run_generation(job_id: str, campaign_id: str, niche: str,
                    platforms: list, brand_voice: str):
    """Background thread: run crew, store results."""
    try:
        past_trends = get_recent_trends(niche, limit=3)
        result = build_social_crew(niche, platforms, brand_voice, past_trends)

        content = result.get("content", {})
        image_prompts = result.get("image_prompts", [])
        research = result.get("research_summary", "")

        db.update_job_completed(
            job_id,
            json.dumps(content),
            json.dumps(image_prompts),
            research,
        )
        store_trend(niche, research)
        logger.info(f"Job {job_id} generation complete")

    except Exception as e:
        logger.error(f"Job {job_id} error: {e}")
        db.update_job_error(job_id, str(e))


def _run_images(job_id: str):
    """Background thread: generate images via ComfyUI."""
    job = db.get_job(job_id)
    if not job:
        return
    try:
        prompts = json.loads(job.get("image_prompts") or "[]")
        if not prompts:
            return
        paths = generate_images_for_job(prompts)
        db.update_job_images(job_id, paths)
        logger.info(f"Generated {len(paths)} images for job {job_id}")
    except Exception as e:
        logger.error(f"Image generation error for {job_id}: {e}")


def _notify_activepieces(job: dict, campaign: dict):
    """Fire-and-forget webhook to Activepieces when content is approved."""
    if not ACTIVEPIECES_WEBHOOK:
        return
    try:
        payload = {
            "event": "content.approved",
            "job_id": job["id"],
            "campaign_name": campaign.get("name", ""),
            "niche": campaign.get("niche", ""),
            "platforms": json.loads(campaign.get("platforms", "[]")),
            "content": json.loads(job.get("content_json") or "{}"),
            "approved_by": job.get("approved_by", "admin"),
            "approved_at": datetime.utcnow().isoformat(),
            "image_files": json.loads(job.get("image_files") or "[]"),
        }
        httpx.post(ACTIVEPIECES_WEBHOOK, json=payload, timeout=10)
        db.mark_activepieces_sent(job["id"])
        logger.info(f"Notified Activepieces for job {job['id']}")
    except Exception as e:
        logger.warning(f"Activepieces notification failed: {e}")


# ── Campaign routes ───────────────────────────────────────────────────────────

@app.post("/api/social/campaigns", status_code=201)
def create_campaign(body: CampaignCreate, background_tasks: BackgroundTasks):
    campaign_id = str(uuid.uuid4())
    job_id = str(uuid.uuid4())

    campaign = db.create_campaign(
        campaign_id, body.name, body.niche,
        body.platforms, body.brand_voice, body.frequency
    )
    db.create_job(job_id, campaign_id)
    sched.schedule_campaign(campaign_id, body.frequency)

    # Kick off first generation immediately
    background_tasks.add_task(
        _run_generation, job_id, campaign_id,
        body.niche, body.platforms, body.brand_voice
    )

    return {**campaign, "first_job_id": job_id}


@app.get("/api/social/campaigns")
def list_campaigns():
    return db.list_campaigns()


@app.get("/api/social/campaigns/{campaign_id}")
def get_campaign(campaign_id: str):
    c = db.get_campaign(campaign_id)
    if not c:
        raise HTTPException(404, "Campaign not found")
    return c


@app.delete("/api/social/campaigns/{campaign_id}")
def delete_campaign(campaign_id: str):
    c = db.get_campaign(campaign_id)
    if not c:
        raise HTTPException(404, "Campaign not found")
    sched.unschedule_campaign(campaign_id)
    db.delete_campaign(campaign_id)
    return {"deleted": campaign_id}


@app.patch("/api/social/campaigns/{campaign_id}")
def patch_campaign(campaign_id: str, body: CampaignPatch):
    c = db.get_campaign(campaign_id)
    if not c:
        raise HTTPException(404, "Campaign not found")

    if body.status is not None:
        db.update_campaign_status(campaign_id, body.status)
        if body.status == "paused":
            sched.unschedule_campaign(campaign_id)
        elif body.status == "active":
            freq = body.frequency or c["frequency"]
            sched.schedule_campaign(campaign_id, freq)

    if body.frequency is not None and body.status != "paused":
        sched.schedule_campaign(campaign_id, body.frequency)

    return db.get_campaign(campaign_id)


@app.post("/api/social/campaigns/{campaign_id}/run")
def run_now(campaign_id: str, background_tasks: BackgroundTasks):
    """Trigger an immediate content generation run."""
    c = db.get_campaign(campaign_id)
    if not c:
        raise HTTPException(404, "Campaign not found")

    job_id = str(uuid.uuid4())
    db.create_job(job_id, campaign_id)

    platforms = json.loads(c["platforms"])
    background_tasks.add_task(
        _run_generation, job_id, campaign_id,
        c["niche"], platforms, c["brand_voice"]
    )
    return {"job_id": job_id, "status": "running"}


# ── Job routes ────────────────────────────────────────────────────────────────

@app.get("/api/social/jobs")
def list_jobs(campaign_id: Optional[str] = None,
              approval_status: Optional[str] = None,
              limit: int = 50):
    return db.list_jobs(campaign_id, approval_status, limit)


@app.get("/api/social/jobs/{job_id}")
def get_job(job_id: str):
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job


@app.post("/api/social/jobs/{job_id}/approve")
def approve_job(job_id: str, body: ApprovalBody):
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(404, "Job not found")

    if body.action == "approve":
        db.update_job_approval(job_id, "approved", body.approved_by, body.notes or "")
        # Notify Activepieces
        campaign = db.get_campaign(job["campaign_id"])
        if campaign:
            threading.Thread(
                target=_notify_activepieces,
                args=(db.get_job(job_id), campaign),
                daemon=True,
            ).start()
        return {"status": "approved", "job_id": job_id}

    elif body.action == "reject":
        db.update_job_approval(job_id, "rejected", body.approved_by, body.notes or "")
        return {"status": "rejected", "job_id": job_id}

    elif body.action == "regenerate":
        db.update_job_approval(job_id, "superseded")
        campaign = db.get_campaign(job["campaign_id"])
        if not campaign:
            raise HTTPException(404, "Campaign not found")

        new_job_id = str(uuid.uuid4())
        db.create_job(new_job_id, job["campaign_id"])
        platforms = json.loads(campaign["platforms"])

        t = threading.Thread(
            target=_run_generation,
            args=(new_job_id, job["campaign_id"],
                  campaign["niche"], platforms, campaign["brand_voice"]),
            daemon=True,
        )
        t.start()
        return {"status": "regenerating", "new_job_id": new_job_id}

    raise HTTPException(400, f"Invalid action: {body.action}")


@app.post("/api/social/jobs/{job_id}/images")
def trigger_image_generation(job_id: str, background_tasks: BackgroundTasks):
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    if job["job_status"] != "completed":
        raise HTTPException(400, "Job must be completed before generating images")

    background_tasks.add_task(_run_images, job_id)
    return {"status": "generating_images", "job_id": job_id}


@app.get("/api/social/jobs/{job_id}/logs")
def get_logs(job_id: str):
    return db.get_job_logs(job_id)


# ── Retry a failed job ────────────────────────────────────────────────────────

@app.post("/api/social/jobs/{job_id}/retry")
def retry_job(job_id: str, background_tasks: BackgroundTasks):
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    if job["job_status"] != "error":
        raise HTTPException(400, "Only errored jobs can be retried")

    campaign = db.get_campaign(job["campaign_id"])
    if not campaign:
        raise HTTPException(404, "Campaign not found")

    new_job_id = str(uuid.uuid4())
    db.create_job(new_job_id, job["campaign_id"])
    platforms = json.loads(campaign["platforms"])

    background_tasks.add_task(
        _run_generation, new_job_id, job["campaign_id"],
        campaign["niche"], platforms, campaign["brand_voice"]
    )
    return {"status": "retrying", "new_job_id": new_job_id}


# ── Open WebUI monitoring endpoint ────────────────────────────────────────────

@app.get("/api/social/openwebui/summary")
def openwebui_summary():
    """
    Monitoring endpoint for Open WebUI function calling.
    Returns a human-readable summary plus structured data.
    """
    stats = db.get_stats()
    campaigns = db.list_campaigns()
    recent_jobs = db.list_jobs(limit=10)

    pending_list = [
        {"id": j["id"][:8], "campaign": j.get("campaign_name", "?"), "created": j["created_at"][:16]}
        for j in recent_jobs if j["approval_status"] == "pending" and j["job_status"] == "completed"
    ]
    running_list = [
        {"id": j["id"][:8], "campaign": j.get("campaign_name", "?")}
        for j in recent_jobs if j["job_status"] == "running"
    ]
    campaign_list = [
        {"name": c["name"], "niche": c["niche"], "status": c["status"],
         "frequency": c["frequency"], "last_run": (c.get("last_run") or "never")[:16]}
        for c in campaigns
    ]

    text_summary = (
        f"Social Media Agent Status:\n"
        f"- {stats['active_campaigns']}/{stats['total_campaigns']} campaigns active\n"
        f"- {stats['pending_approval']} post(s) waiting for human approval\n"
        f"- {stats['currently_running']} generation(s) running now\n"
        f"- {stats['total_approved']} posts approved all-time\n"
    )
    if pending_list:
        text_summary += "\nPending approval:\n" + "\n".join(
            f"  • [{j['id']}] {j['campaign']} ({j['created']})" for j in pending_list
        )
    if running_list:
        text_summary += "\nCurrently generating:\n" + "\n".join(
            f"  • [{j['id']}] {j['campaign']}" for j in running_list
        )

    return {
        "summary_text": text_summary,
        "stats": stats,
        "campaigns": campaign_list,
        "pending_jobs": pending_list,
        "running_jobs": running_list,
    }


# ── Static image serving ──────────────────────────────────────────────────────

@app.get("/api/social/images/{filename}")
def serve_image(filename: str):
    path = os.path.join(IMAGES_DIR, filename)
    if not os.path.exists(path) or ".." in filename:
        raise HTTPException(404, "Image not found")
    return FileResponse(path)


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/api/social/health")
def health():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "scheduler_running": sched.scheduler.running,
        "scheduled_jobs": len(sched.scheduler.get_jobs()),
    }


# ── Dev entrypoint ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    from config import API_HOST, API_PORT
    uvicorn.run("api:app", host=API_HOST, port=API_PORT, reload=False)
