"""SQLite persistence layer — campaigns, content jobs, approval queue."""
import json
import sqlite3
import os
from contextlib import contextmanager
from config import DB_PATH, DATA_DIR, IMAGES_DIR, EXPORTS_DIR

# Ensure data directories exist
for _dir in [DATA_DIR, IMAGES_DIR, EXPORTS_DIR]:
    os.makedirs(_dir, exist_ok=True)


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    with get_db() as db:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS campaigns (
                id          TEXT PRIMARY KEY,
                name        TEXT NOT NULL,
                niche       TEXT NOT NULL,
                platforms   TEXT NOT NULL,    -- JSON array
                brand_voice TEXT DEFAULT 'professional and engaging',
                frequency   TEXT DEFAULT 'daily',
                status      TEXT DEFAULT 'active',
                created_at  TEXT DEFAULT (datetime('now')),
                last_run    TEXT,
                next_run    TEXT
            );

            CREATE TABLE IF NOT EXISTS content_jobs (
                id              TEXT PRIMARY KEY,
                campaign_id     TEXT NOT NULL,
                run_number      INTEGER DEFAULT 1,
                job_status      TEXT DEFAULT 'running',   -- running|completed|error
                approval_status TEXT DEFAULT 'pending',   -- pending|approved|rejected|superseded
                content_json    TEXT,                     -- structured content per platform
                image_prompts   TEXT,                     -- JSON array of prompts
                image_files     TEXT,                     -- JSON array of local file paths
                research_notes  TEXT,
                approval_notes  TEXT,
                approved_by     TEXT,
                approved_at     TEXT,
                activepieces_sent INTEGER DEFAULT 0,
                error_msg       TEXT,
                created_at      TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
            );

            CREATE TABLE IF NOT EXISTS agent_logs (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id      TEXT,
                agent_name  TEXT,
                message     TEXT,
                level       TEXT DEFAULT 'info',
                created_at  TEXT DEFAULT (datetime('now'))
            );
        """)


# ── Campaign helpers ──────────────────────────────────────────────────────────

def create_campaign(campaign_id: str, name: str, niche: str, platforms: list,
                    brand_voice: str, frequency: str) -> dict:
    with get_db() as db:
        db.execute(
            """INSERT INTO campaigns (id, name, niche, platforms, brand_voice, frequency)
               VALUES (?,?,?,?,?,?)""",
            (campaign_id, name, niche, json.dumps(platforms), brand_voice, frequency)
        )
    return get_campaign(campaign_id)


def get_campaign(campaign_id: str) -> dict | None:
    with get_db() as db:
        row = db.execute("SELECT * FROM campaigns WHERE id=?", (campaign_id,)).fetchone()
        return dict(row) if row else None


def list_campaigns() -> list[dict]:
    with get_db() as db:
        rows = db.execute("SELECT * FROM campaigns ORDER BY created_at DESC").fetchall()
        return [dict(r) for r in rows]


def update_campaign_status(campaign_id: str, status: str):
    with get_db() as db:
        db.execute("UPDATE campaigns SET status=? WHERE id=?", (status, campaign_id))


def update_campaign_run_times(campaign_id: str, last_run: str, next_run: str):
    with get_db() as db:
        db.execute(
            "UPDATE campaigns SET last_run=?, next_run=? WHERE id=?",
            (last_run, next_run, campaign_id)
        )


# ── Content job helpers ───────────────────────────────────────────────────────

def create_job(job_id: str, campaign_id: str) -> dict:
    with get_db() as db:
        # Determine run number
        count = db.execute(
            "SELECT COUNT(*) as n FROM content_jobs WHERE campaign_id=?", (campaign_id,)
        ).fetchone()["n"]
        db.execute(
            """INSERT INTO content_jobs (id, campaign_id, run_number)
               VALUES (?,?,?)""",
            (job_id, campaign_id, count + 1)
        )
    return get_job(job_id)


def get_job(job_id: str) -> dict | None:
    with get_db() as db:
        row = db.execute("SELECT * FROM content_jobs WHERE id=?", (job_id,)).fetchone()
        return dict(row) if row else None


def list_jobs(campaign_id: str | None = None, approval_status: str | None = None,
              limit: int = 50) -> list[dict]:
    with get_db() as db:
        query = "SELECT cj.*, c.name as campaign_name, c.niche FROM content_jobs cj JOIN campaigns c ON cj.campaign_id=c.id WHERE 1=1"
        params = []
        if campaign_id:
            query += " AND cj.campaign_id=?"
            params.append(campaign_id)
        if approval_status:
            query += " AND cj.approval_status=?"
            params.append(approval_status)
        query += " ORDER BY cj.created_at DESC LIMIT ?"
        params.append(limit)
        return [dict(r) for r in db.execute(query, params).fetchall()]


def update_job_completed(job_id: str, content_json: str, image_prompts: str, research_notes: str):
    with get_db() as db:
        db.execute(
            """UPDATE content_jobs SET job_status='completed', content_json=?,
               image_prompts=?, research_notes=? WHERE id=?""",
            (content_json, image_prompts, research_notes, job_id)
        )


def update_job_error(job_id: str, error: str):
    with get_db() as db:
        db.execute(
            "UPDATE content_jobs SET job_status='error', error_msg=? WHERE id=?",
            (error, job_id)
        )


def update_job_approval(job_id: str, status: str, approved_by: str = "admin",
                         notes: str = ""):
    with get_db() as db:
        db.execute(
            """UPDATE content_jobs SET approval_status=?, approved_by=?,
               approved_at=datetime('now'), approval_notes=? WHERE id=?""",
            (status, approved_by, notes, job_id)
        )


def update_job_images(job_id: str, image_files: list):
    with get_db() as db:
        db.execute(
            "UPDATE content_jobs SET image_files=? WHERE id=?",
            (json.dumps(image_files), job_id)
        )


def mark_activepieces_sent(job_id: str):
    with get_db() as db:
        db.execute(
            "UPDATE content_jobs SET activepieces_sent=1 WHERE id=?", (job_id,)
        )


def log_agent(job_id: str, agent_name: str, message: str, level: str = "info"):
    with get_db() as db:
        db.execute(
            "INSERT INTO agent_logs (job_id, agent_name, message, level) VALUES (?,?,?,?)",
            (job_id, agent_name, message[:2000], level)
        )


def get_job_logs(job_id: str) -> list[dict]:
    with get_db() as db:
        rows = db.execute(
            "SELECT * FROM agent_logs WHERE job_id=? ORDER BY created_at", (job_id,)
        ).fetchall()
        return [dict(r) for r in rows]
