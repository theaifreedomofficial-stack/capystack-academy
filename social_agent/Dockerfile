FROM python:3.11-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App source
COPY *.py .

# Data dirs (mounted as volume in production)
RUN mkdir -p /app/data/images /app/data/exports

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
    CMD curl -f http://localhost:5001/api/social/health || exit 1

CMD ["python", "-m", "uvicorn", "api:app", "--host", "0.0.0.0", "--port", "5001", "--workers", "1"]
