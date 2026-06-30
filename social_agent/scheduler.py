"""
APScheduler integration.
Schedules recurring content generation runs per campaign.
Called from api.py on startup and when campaigns are created/updated.
"""
import json
import uuid
from datetime import datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.events import EVENT_JOB_ERROR, EVENT_JOB_EXECUTED

from config import logger
import database as db

# Global scheduler instance
scheduler = BackgroundScheduler(timezone="UTC")


def _frequency_to_trigger(frequency: str) -> CronTrigger | IntervalTrigger:
    """Convert human-readable frequency to APScheduler trigger."""
    freq = frequency.lower().strip()
    if freq == "daily":
        return CronTrigger(hour=8, minute=0)
    elif freq == "2x-daily":
        return CronTrigger(hour="8,20", minute=0)
    elif freq == "3x-daily":
        return CronTrigger(hour="8,13,19", minute=0)
    elif freq == "weekly":
        return CronTrigger(day_of_week="mon", hour=8, minute=0)
    elif freq == "hourly":
        return IntervalTrigger(hours=1)
    elif freq == "test-5min":  # for quick testing
        return IntervalTrigger(minutes=5)
    else:
        return CronTrigger(hour=8, minute=0)  # default: daily 8am


def _next_run_for_frequency(frequency: str) -> str:
    """Return a human-readable next run time string."""
    freq = frequency.lower()
    now = datetime.utcnow()
    if freq == "daily":
        nxt = now.replace(hour=8, minute=0, second=0) + timedelta(days=1)
    elif freq == "weekly":
        days_ahead = (7 - now.weekday()) % 7 or 7
        nxt = (now + timedelta(days=days_ahead)).replace(hour=8, minute=0, second=0)
    else:
        nxt = now + timedelta(hours=1)
    return nxt.strftime("%Y-%m-%dT%H:%M:%SZ")


def run_campaign_job(campaign_id: str):
    """Execute a content generation run for a campaign."""
    # Import here to avoid circular imports with api.py
    from crew import build_social_crew
    from qdrant_memory import store_trend, get_recent_trends

    campaign = db.get_campaign(campaign_id)
    if not campaign or campaign["status"] != "active":
        logger.info(f"Campaign {campaign_id} not active — skipping scheduled run")
        return

    job_id = str(uuid.uuid4())
    platforms = json.loads(campaign["platforms"])

    logger.info(f"Starting scheduled run for campaign '{campaign['name']}' (job {job_id})")
    db.create_job(job_id, campaign_id)

    try:
        past_trends = get_recent_trends(campaign["niche"], limit=3)
        result = build_social_crew(
            niche=campaign["niche"],
            platforms=platforms,
            brand_voice=campaign["brand_voice"],
            past_trends=past_trends,
        )

        content_json = json.dumps(result.get("content", {}))
        image_prompts = json.dumps(result.get("image_prompts", []))
        research_notes = result.get("research_summary", "")

        db.update_job_completed(job_id, content_json, image_prompts, research_notes)
        store_trend(campaign["niche"], research_notes)

        next_run = _next_run_for_frequency(campaign["frequency"])
        db.update_campaign_run_times(
            campaign_id,
            last_run=datetime.utcnow().isoformat(),
            next_run=next_run,
        )
        logger.info(f"Job {job_id} completed. Next run: {next_run}")

    except Exception as e:
        logger.error(f"Job {job_id} failed: {e}")
        db.update_job_error(job_id, str(e))


def schedule_campaign(campaign_id: str, frequency: str):
    """Add or update a campaign in the scheduler."""
    job_id = f"campaign_{campaign_id}"
    trigger = _frequency_to_trigger(frequency)

    if scheduler.get_job(job_id):
        scheduler.reschedule_job(job_id, trigger=trigger)
        logger.info(f"Rescheduled campaign {campaign_id} as '{frequency}'")
    else:
        scheduler.add_job(
            run_campaign_job,
            trigger=trigger,
            id=job_id,
            args=[campaign_id],
            replace_existing=True,
            misfire_grace_time=300,
        )
        logger.info(f"Scheduled campaign {campaign_id} as '{frequency}'")


def unschedule_campaign(campaign_id: str):
    """Remove a campaign from the scheduler."""
    job_id = f"campaign_{campaign_id}"
    if scheduler.get_job(job_id):
        scheduler.remove_job(job_id)
        logger.info(f"Removed campaign {campaign_id} from scheduler")


def restore_schedules():
    """On startup, restore schedules for all active campaigns."""
    campaigns = db.list_campaigns()
    restored = 0
    for c in campaigns:
        if c["status"] == "active":
            schedule_campaign(c["id"], c["frequency"])
            restored += 1
    logger.info(f"Restored {restored} campaign schedules")


def _on_job_error(event):
    logger.error(f"Scheduler job error: {event.exception}")


def start():
    scheduler.add_listener(_on_job_error, EVENT_JOB_ERROR)
    scheduler.start()
    restore_schedules()
    logger.info("APScheduler started")


def shutdown():
    if scheduler.running:
        scheduler.shutdown(wait=False)
