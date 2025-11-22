#!/usr/bin/env python3
"""
MCP Metrics Retrieval Helper Script

This script provides a fallback method for metrics retrieval when MCP is not available.
For best results, use Render MCP server directly in Cursor with natural language queries.

Usage:
    python scripts/mcp-get-metrics.py --service ma-saas-backend --metric cpu
    python scripts/mcp-get-metrics.py --service ma-saas-backend --metric memory --hours 24
"""

import os
import sys
import requests
import json
import argparse
from datetime import datetime, timedelta

RENDER_API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM")

def get_service_metrics(service_id: str, metric_type: str, start_time: datetime, end_time: datetime) -> dict:
    """
    Get metrics for a service.
    
    Note: This is a placeholder - actual Render API metrics endpoint may differ.
    Check Render API docs for exact endpoint structure.
    """
    # Render metrics API endpoint (example - verify actual endpoint)
    url = f"https://api.render.com/v1/services/{service_id}/metrics"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    params = {
        "type": metric_type,
        "start": start_time.isoformat(),
        "end": end_time.isoformat()
    }
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

def find_service_by_name(name: str) -> Optional[str]:
    """Find service ID by name."""
    url = "https://api.render.com/v1/services"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    services = response.json()
    
    for service in services:
        svc = service.get("service", {})
        if svc.get("name") == name:
            return svc.get("id")
    return None

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Render Metrics Retrieval Helper (MCP Fallback)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Get CPU usage for last hour
  python scripts/mcp-get-metrics.py --service ma-saas-backend --metric cpu --hours 1

  # Get memory usage for last 24 hours
  python scripts/mcp-get-metrics.py --service ma-saas-backend --metric memory --hours 24

Note: For best results, use Render MCP server in Cursor:
  "Show me CPU usage for ma-saas-backend over the last 24 hours"
  "What's the memory consumption for ma-saas-backend?"
        """
    )
    
    parser.add_argument("--service", type=str, required=True, help="Service name")
    parser.add_argument("--service-id", type=str, help="Service ID (optional, overrides --service)")
    parser.add_argument("--metric", type=str, choices=["cpu", "memory", "requests", "response_time"], 
                       required=True, help="Metric type to retrieve")
    parser.add_argument("--hours", type=int, default=1, help="Hours of history to retrieve")
    
    args = parser.parse_args()
    
    print("=" * 80)
    print("Render Metrics Retrieval Helper")
    print("=" * 80)
    print()
    print("💡 Tip: Use Render MCP server in Cursor for natural language queries")
    print()
    
    try:
        # Find service ID
        service_id = args.service_id or find_service_by_name(args.service)
        if not service_id:
            print(f"❌ Service '{args.service}' not found")
            sys.exit(1)
        
        # Calculate time range
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=args.hours)
        
        print(f"Service: {args.service}")
        print(f"Metric: {args.metric}")
        print(f"Time Range: {start_time.isoformat()} to {end_time.isoformat()}")
        print()
        
        # Note: Actual implementation would call Render metrics API
        # This is a placeholder showing the structure
        print("⚠️  NOTE: Metrics API endpoint structure may vary.")
        print("   Use Render MCP server in Cursor for reliable metrics:")
        print(f"   'Show me {args.metric} usage for {args.service} over the last {args.hours} hours'")
        print()
        print("MCP can provide:")
        print("  - CPU usage")
        print("  - Memory consumption")
        print("  - Request volume")
        print("  - Response times")
        print("  - Autoscaling activity")
        print("  - Database connection counts")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Status: {e.response.status_code}")
            print(f"   Response: {e.response.text}")
        sys.exit(1)

if __name__ == "__main__":
    from typing import Optional
    main()

