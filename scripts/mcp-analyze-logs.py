#!/usr/bin/env python3
"""
MCP Log Analysis Helper Script

This script provides a fallback method for log analysis when MCP is not available.
For best results, use Render MCP server directly in Cursor with natural language queries.

Usage:
    python scripts/mcp-analyze-logs.py --service ma-saas-backend --count 50
    python scripts/mcp-analyze-logs.py --service ma-saas-backend --filter "error" --hours 2
"""

import os
import sys
import requests
import json
import argparse
from datetime import datetime, timedelta

RENDER_API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM")

def get_service_logs(service_id: str, limit: int = 100, filter_text: Optional[str] = None) -> list:
    """
    Get logs for a service.
    
    Note: This is a placeholder - actual Render API logs endpoint may differ.
    Check Render API docs for exact endpoint structure.
    """
    # Render logs API endpoint (example - verify actual endpoint)
    url = f"https://api.render.com/v1/services/{service_id}/logs"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    params = {
        "limit": limit
    }
    
    if filter_text:
        params["filter"] = filter_text
    
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
        description="Render Log Analysis Helper (MCP Fallback)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Get last 50 log entries
  python scripts/mcp-analyze-logs.py --service ma-saas-backend --count 50

  # Filter logs for errors in last 2 hours
  python scripts/mcp-analyze-logs.py --service ma-saas-backend --filter "error" --hours 2

Note: For best results, use Render MCP server in Cursor:
  "Pull the most recent error-level logs for ma-saas-backend"
  "Show me logs containing 'database connection' from the last hour"
        """
    )
    
    parser.add_argument("--service", type=str, required=True, help="Service name")
    parser.add_argument("--service-id", type=str, help="Service ID (optional, overrides --service)")
    parser.add_argument("--count", type=int, default=50, help="Number of log entries to retrieve")
    parser.add_argument("--filter", type=str, help="Filter logs by text")
    parser.add_argument("--hours", type=int, help="Hours of history to retrieve")
    parser.add_argument("--level", type=str, choices=["error", "warning", "info"], help="Filter by log level")
    
    args = parser.parse_args()
    
    print("=" * 80)
    print("Render Log Analysis Helper")
    print("=" * 80)
    print()
    print("💡 Tip: Use Render MCP server in Cursor for natural language log queries")
    print()
    
    try:
        # Find service ID
        service_id = args.service_id or find_service_by_name(args.service)
        if not service_id:
            print(f"❌ Service '{args.service}' not found")
            sys.exit(1)
        
        print(f"Service: {args.service}")
        print(f"Count: {args.count}")
        if args.filter:
            print(f"Filter: {args.filter}")
        if args.level:
            print(f"Level: {args.level}")
        print()
        
        # Note: Actual implementation would call Render logs API
        # This is a placeholder showing the structure
        print("⚠️  NOTE: Logs API endpoint structure may vary.")
        print("   Use Render MCP server in Cursor for reliable log analysis:")
        
        query_parts = [f"Show me logs for {args.service}"]
        if args.level:
            query_parts.append(f"at {args.level} level")
        if args.filter:
            query_parts.append(f"containing '{args.filter}'")
        if args.hours:
            query_parts.append(f"from the last {args.hours} hours")
        else:
            query_parts.append(f"(last {args.count} entries)")
        
        print(f"   '{' '.join(query_parts)}'")
        print()
        print("MCP can provide:")
        print("  - Recent log entries")
        print("  - Error-level logs")
        print("  - Filtered logs by keyword")
        print("  - Time-range filtered logs")
        print("  - Deployment logs")
        print("  - Build logs")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Status: {e.response.status_code}")
            print(f"   Response: {e.response.text}")
        sys.exit(1)

if __name__ == "__main__":
    from typing import Optional
    main()

