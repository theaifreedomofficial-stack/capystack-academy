"""Central configuration — all values read from environment variables."""
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("social_agent")

# ── LLM ──────────────────────────────────────────────────────────────────────
LITELLM_URL = os.getenv("LITELLM_URL", "http://litellm:4000")
LITELLM_KEY = os.getenv("LITELLM_KEY", "your-litellm-master-key")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen3-14b")
LLM_FAST_MODEL = os.getenv("LLM_FAST_MODEL", "qwen3-7b")

# ── Vector memory ─────────────────────────────────────────────────────────────
QDRANT_URL = os.getenv("QDRANT_URL", "http://qdrant:6333")
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "social_trends")

# ── ComfyUI ───────────────────────────────────────────────────────────────────
COMFYUI_URL = os.getenv("COMFYUI_URL", "http://comfyui:8188")
COMFYUI_ENABLED = os.getenv("COMFYUI_ENABLED", "true").lower() == "true"
# Model checkpoint filename as it appears in ComfyUI's models/checkpoints/ folder
COMFYUI_CHECKPOINT = os.getenv("COMFYUI_CHECKPOINT", "sd_xl_base_1.0.safetensors")

# ── Activepieces ──────────────────────────────────────────────────────────────
ACTIVEPIECES_WEBHOOK = os.getenv("ACTIVEPIECES_SOCIAL_WEBHOOK", "")

# ── Database / storage ────────────────────────────────────────────────────────
DATA_DIR = os.getenv("DATA_DIR", "/app/data")
DB_PATH = os.path.join(DATA_DIR, "social_agent.db")
IMAGES_DIR = os.path.join(DATA_DIR, "images")
EXPORTS_DIR = os.path.join(DATA_DIR, "exports")

# ── API server ────────────────────────────────────────────────────────────────
API_PORT = int(os.getenv("API_PORT", "5001"))
API_HOST = os.getenv("API_HOST", "0.0.0.0")

# ── Scheduler defaults ────────────────────────────────────────────────────────
SCHEDULE_HOUR = int(os.getenv("SCHEDULE_HOUR", "8"))  # 8am daily default
