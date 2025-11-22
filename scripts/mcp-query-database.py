#!/usr/bin/env python3
"""
MCP Database Query Helper Script

This script provides a fallback method for database queries when MCP is not available.
For best results, use Render MCP server directly in Cursor with natural language queries.

Usage:
    python scripts/mcp-query-database.py "SELECT COUNT(*) FROM users;"
    python scripts/mcp-query-database.py --query "SELECT * FROM deals WHERE stage = 'closing' LIMIT 10;"
"""

import os
import sys
import requests
import json
from typing import Optional

RENDER_API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM")

def get_databases() -> list:
    """List all databases in the Render workspace."""
    url = "https://api.render.com/v1/databases"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def get_database_connection_string(database_id: str) -> Optional[str]:
    """Get connection string for a database (requires database ID)."""
    url = f"https://api.render.com/v1/databases/{database_id}"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    
    # Extract connection string from database details
    # Note: This is a simplified version - actual implementation would need
    # to parse the database response structure
    return data.get("database", {}).get("connectionString")

def print_usage():
    """Print usage information."""
    print(__doc__)
    print("\nNote: For direct database queries, use Render MCP server in Cursor:")
    print("  'Query my database: SELECT COUNT(*) FROM users;'")
    print("\nThis script is a fallback for automation scenarios.")

def main():
    """Main entry point."""
    if len(sys.argv) < 2 or "--help" in sys.argv or "-h" in sys.argv:
        print_usage()
        sys.exit(0)
    
    # Parse query argument
    query = None
    if "--query" in sys.argv:
        idx = sys.argv.index("--query")
        if idx + 1 < len(sys.argv):
            query = sys.argv[idx + 1]
    elif len(sys.argv) > 1:
        query = sys.argv[1]
    
    if not query:
        print("Error: No query provided")
        print_usage()
        sys.exit(1)
    
    print("=" * 80)
    print("Render Database Query Helper")
    print("=" * 80)
    print()
    print("⚠️  NOTE: This script cannot execute SQL queries directly.")
    print("   Use Render MCP server in Cursor for database queries:")
    print(f"   'Query my database: {query}'")
    print()
    print("This script can help you:")
    print("1. List available databases")
    print("2. Get database connection details")
    print()
    
    try:
        databases = get_databases()
        print(f"✅ Found {len(databases)} database(s):")
        for db in databases[:5]:  # Show first 5
            db_info = db.get("database", {})
            print(f"  - {db_info.get('name', 'Unknown')} ({db_info.get('databaseType', 'Unknown')})")
        
        print()
        print("To execute queries, use Render MCP in Cursor:")
        print(f"  Query my database: {query}")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Status: {e.response.status_code}")
            print(f"   Response: {e.response.text}")
        sys.exit(1)

if __name__ == "__main__":
    main()

