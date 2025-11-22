#!/usr/bin/env python3
"""
MCP Service Management Helper Script

This script provides a fallback method for service management when MCP is not available.
For best results, use Render MCP server directly in Cursor with natural language commands.

Usage:
    python scripts/mcp-service-management.py --status ma-saas-backend
    python scripts/mcp-service-management.py --list
    python scripts/mcp-service-management.py --env-vars ma-saas-backend
"""

import os
import sys
import requests
import json
import argparse

RENDER_API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM")

def get_services() -> list:
    """List all services in the Render workspace."""
    url = "https://api.render.com/v1/services"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def get_service_details(service_id: str) -> dict:
    """Get detailed information about a service."""
    url = f"https://api.render.com/v1/services/{service_id}"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def get_service_env_vars(service_id: str) -> list:
    """Get environment variables for a service."""
    url = f"https://api.render.com/v1/services/{service_id}/env-vars"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def find_service_by_name(name: str) -> Optional[str]:
    """Find service ID by name."""
    services = get_services()
    for service in services:
        svc = service.get("service", {})
        if svc.get("name") == name:
            return svc.get("id")
    return None

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Render Service Management Helper (MCP Fallback)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # List all services
  python scripts/mcp-service-management.py --list

  # Check service status
  python scripts/mcp-service-management.py --status ma-saas-backend

  # Show environment variables
  python scripts/mcp-service-management.py --env-vars ma-saas-backend

Note: For best results, use Render MCP server in Cursor:
  "What's the status of ma-saas-backend?"
  "Show me environment variables for ma-saas-backend"
        """
    )
    
    parser.add_argument("--list", action="store_true", help="List all services")
    parser.add_argument("--status", type=str, help="Get status of a service by name")
    parser.add_argument("--env-vars", type=str, help="Show environment variables for a service")
    parser.add_argument("--service-id", type=str, help="Use service ID instead of name")
    
    args = parser.parse_args()
    
    if not any([args.list, args.status, args.env_vars]):
        parser.print_help()
        sys.exit(0)
    
    print("=" * 80)
    print("Render Service Management Helper")
    print("=" * 80)
    print()
    print("💡 Tip: Use Render MCP server in Cursor for natural language commands")
    print()
    
    try:
        if args.list:
            services = get_services()
            print(f"✅ Found {len(services)} service(s):\n")
            for service in services:
                svc = service.get("service", {})
                status = svc.get("serviceDetails", {}).get("healthCheckStatus", "unknown")
                print(f"  • {svc.get('name', 'Unknown')}")
                print(f"    ID: {svc.get('id', 'Unknown')}")
                print(f"    Status: {status}")
                print(f"    URL: {svc.get('serviceDetails', {}).get('url', 'N/A')}")
                print()
        
        elif args.status:
            service_id = args.service_id or find_service_by_name(args.status)
            if not service_id:
                print(f"❌ Service '{args.status}' not found")
                sys.exit(1)
            
            details = get_service_details(service_id)
            svc = details.get("service", {})
            print(f"Service: {svc.get('name', 'Unknown')}")
            print(f"Status: {svc.get('serviceDetails', {}).get('healthCheckStatus', 'unknown')}")
            print(f"URL: {svc.get('serviceDetails', {}).get('url', 'N/A')}")
            print(f"Type: {svc.get('type', 'Unknown')}")
            print(f"Region: {svc.get('region', 'Unknown')}")
            print()
            print("💡 Use MCP for more details: 'Get details about ma-saas-backend'")
        
        elif args.env_vars:
            service_id = args.service_id or find_service_by_name(args.env_vars)
            if not service_id:
                print(f"❌ Service '{args.env_vars}' not found")
                sys.exit(1)
            
            env_vars = get_service_env_vars(service_id)
            print(f"Environment Variables for {args.env_vars}:\n")
            for var in env_vars:
                key = var.get("key", "Unknown")
                value = var.get("value", "")
                # Mask sensitive values
                if any(sensitive in key.lower() for sensitive in ["key", "secret", "password", "token"]):
                    value = "***REDACTED***" if value else "(not set)"
                print(f"  {key} = {value}")
            print()
            print("💡 Use MCP to update: 'Update VITE_API_URL in ma-saas-backend to https://...'")
    
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Status: {e.response.status_code}")
            print(f"   Response: {e.response.text}")
        sys.exit(1)

if __name__ == "__main__":
    from typing import Optional
    main()

