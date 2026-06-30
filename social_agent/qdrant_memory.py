"""
Qdrant-based trend memory.
Stores past research summaries so future runs build on prior findings.
"""
import json
import uuid
from datetime import datetime
from typing import Optional

from config import QDRANT_URL, QDRANT_COLLECTION, logger

try:
    from qdrant_client import QdrantClient
    from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
    import ollama as ollama_sdk
    _qdrant_available = True
except ImportError:
    _qdrant_available = False
    logger.warning("qdrant_client or ollama not installed — trend memory disabled")

EMBED_MODEL = "nomic-embed-text"
VECTOR_DIM = 768


def _get_client() -> Optional["QdrantClient"]:
    if not _qdrant_available:
        return None
    try:
        client = QdrantClient(url=QDRANT_URL, timeout=5)
        # Ensure collection exists
        existing = [c.name for c in client.get_collections().collections]
        if QDRANT_COLLECTION not in existing:
            client.create_collection(
                collection_name=QDRANT_COLLECTION,
                vectors_config=VectorParams(size=VECTOR_DIM, distance=Distance.COSINE),
            )
        return client
    except Exception as e:
        logger.warning(f"Qdrant unavailable: {e}")
        return None


def _embed(text: str) -> list[float]:
    """Embed text using Ollama nomic-embed-text."""
    resp = ollama_sdk.embeddings(model=EMBED_MODEL, prompt=text[:2000])
    return resp["embedding"]


def store_trend(niche: str, research_summary: str):
    """Store a research summary in Qdrant for future reference."""
    client = _get_client()
    if not client:
        return

    try:
        vec = _embed(f"{niche}: {research_summary[:500]}")
        client.upsert(
            collection_name=QDRANT_COLLECTION,
            points=[PointStruct(
                id=str(uuid.uuid4()),
                vector=vec,
                payload={
                    "niche": niche,
                    "summary": research_summary[:1000],
                    "stored_at": datetime.utcnow().isoformat(),
                }
            )]
        )
        logger.info(f"Stored trend for niche: {niche}")
    except Exception as e:
        logger.warning(f"Failed to store trend: {e}")


def get_recent_trends(niche: str, limit: int = 5) -> str:
    """Retrieve past research summaries relevant to this niche."""
    client = _get_client()
    if not client:
        return ""

    try:
        vec = _embed(niche)
        results = client.search(
            collection_name=QDRANT_COLLECTION,
            query_vector=vec,
            limit=limit,
            score_threshold=0.6,
        )
        if not results:
            return ""

        summaries = []
        for r in results:
            stored_at = r.payload.get("stored_at", "unknown date")
            summary = r.payload.get("summary", "")
            summaries.append(f"[{stored_at[:10]}] {summary[:300]}")

        return "\n---\n".join(summaries)
    except Exception as e:
        logger.warning(f"Failed to retrieve trends: {e}")
        return ""
