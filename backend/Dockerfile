# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    libpq-dev \
    # WeasyPrint dependencies
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libharfbuzz0b \
    libgobject-2.0-0 \
    libcairo2 \
    libffi-dev \
    shared-mime-info \
    libxml2-dev \
    libxslt1-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Normalize line endings for all shell scripts (CRLF -> LF)
RUN python3 - <<'PY'
from pathlib import Path

for path in Path(".").rglob("*.sh"):
    raw = path.read_bytes()
    cleaned = raw.replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    if cleaned != raw:
        path.write_bytes(cleaned)
PY

# Ensure critical scripts are executable
RUN for f in entrypoint.sh prestart.sh render-start.sh; do [ -f "$f" ] && chmod +x "$f"; done

# Expose port (Render will override with $PORT)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Run the application via entrypoint script
# This handles migrations before starting uvicorn
ENTRYPOINT ["/app/entrypoint.sh"]

