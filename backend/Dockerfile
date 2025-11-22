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

# Normalize line endings for shell scripts (CRLF -> LF) and make executable
RUN python3 -c "import sys; [open(f, 'wb').write(open(f, 'rb').read().replace(b'\r\n', b'\n').replace(b'\r', b'\n')) for f in ['entrypoint.sh', 'prestart.sh']]" && \
    chmod +x entrypoint.sh prestart.sh

# Expose port (Render will override with $PORT)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Run the application via entrypoint script
# This handles migrations before starting uvicorn
ENTRYPOINT ["/app/entrypoint.sh"]

