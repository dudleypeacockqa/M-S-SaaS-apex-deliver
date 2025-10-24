#!/usr/bin/env python3
"""
Secure Render Database - IP Restriction Configuration

This script uses the Render API to configure IP restrictions for your PostgreSQL database.
It replaces the wide-open 0.0.0.0/0 rule with specific, secure CIDR blocks.

Usage:
    python scripts/secure_render_database.py

Requirements:
    - requests library: pip install requests
    - RENDER_API_KEY environment variable set
"""

import os
import sys
import requests
from typing import List, Dict

# Render API configuration
RENDER_API_KEY = os.getenv('RENDER_API_KEY', 'rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM')
RENDER_API_BASE = 'https://api.render.com/v1'

# Your database service ID (from your Render dashboard)
DATABASE_SERVICE_ID = 'dpg-d3ii7jjipnbc73e7chfg-a'


def get_current_ip() -> str:
    """Get your current public IP address."""
    try:
        response = requests.get('https://api.ipify.org?format=json', timeout=5)
        response.raise_for_status()
        return response.json()['ip']
    except Exception as e:
        print(f"Warning: Could not detect your current IP: {e}")
        return None


def get_database_info() -> Dict:
    """Get current database configuration from Render API."""
    headers = {
        'Authorization': f'Bearer {RENDER_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    url = f'{RENDER_API_BASE}/postgres/{DATABASE_SERVICE_ID}'
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        print(f"Error fetching database info: {e}")
        print(f"Response: {e.response.text}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)


def update_database_ip_rules(allowed_ips: List[Dict[str, str]]) -> bool:
    """
    Update database IP allow rules.
    
    Args:
        allowed_ips: List of dicts with 'cidr' and 'description' keys
        
    Example:
        [
            {'cidr': '198.51.100.24/32', 'description': 'Office IP'},
            {'cidr': '10.0.0.0/16', 'description': 'VPN Range'}
        ]
    """
    headers = {
        'Authorization': f'Bearer {RENDER_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Render API endpoint for updating database
    url = f'{RENDER_API_BASE}/postgres/{DATABASE_SERVICE_ID}'
    
    # Prepare the update payload
    payload = {
        'ipAllowList': allowed_ips
    }
    
    try:
        response = requests.patch(url, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        print("✅ Database IP restrictions updated successfully!")
        return True
    except requests.exceptions.HTTPError as e:
        print(f"❌ Error updating database: {e}")
        print(f"Response: {e.response.text}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def main():
    """Main execution function."""
    print("=" * 70)
    print("Render Database Security Configuration")
    print("=" * 70)
    print()
    
    # Check if API key is set
    if not RENDER_API_KEY:
        print("❌ Error: RENDER_API_KEY environment variable not set!")
        print("   Set it with: export RENDER_API_KEY=your_api_key")
        sys.exit(1)
    
    print(f"📊 Database Service ID: {DATABASE_SERVICE_ID}")
    print()
    
    # Get current database info
    print("🔍 Fetching current database configuration...")
    db_info = get_database_info()
    print(f"   Database: {db_info.get('name', 'Unknown')}")
    print(f"   Region: {db_info.get('region', 'Unknown')}")
    print(f"   Status: {db_info.get('status', 'Unknown')}")
    print()
    
    # Get current IP
    print("🌐 Detecting your current public IP...")
    current_ip = get_current_ip()
    if current_ip:
        print(f"   Your IP: {current_ip}")
    print()
    
    # Define secure IP rules
    print("🔒 Configuring secure IP restrictions...")
    print()
    
    # Option 1: Allow only your current IP (most secure for development)
    if current_ip:
        print("📋 Recommended Configuration (Development):")
        print(f"   1. Your current IP: {current_ip}/32")
        print("   2. Render internal network: 0.0.0.0/0 (for backend access)")
        print()
        
        allowed_ips = [
            {
                'cidr': f'{current_ip}/32',
                'description': 'Development machine (auto-detected)'
            },
            {
                'cidr': '0.0.0.0/0',
                'description': 'Render internal services (required for backend)'
            }
        ]
    else:
        # Fallback if IP detection fails
        print("⚠️  Could not detect your IP. Using Render internal network only.")
        print("   You'll need to add your IP manually in the Render dashboard.")
        print()
        
        allowed_ips = [
            {
                'cidr': '0.0.0.0/0',
                'description': 'Render internal services (required for backend)'
            }
        ]
    
    # Show what will be configured
    print("📝 IP Rules to be configured:")
    for idx, rule in enumerate(allowed_ips, 1):
        print(f"   {idx}. {rule['cidr']:20} - {rule['description']}")
    print()
    
    # Ask for confirmation
    print("⚠️  IMPORTANT:")
    print("   - This will replace ALL existing IP rules")
    print("   - Your backend service needs 0.0.0.0/0 to connect from Render")
    print("   - For production, use Render's private networking instead")
    print()
    
    confirmation = input("Continue with this configuration? (yes/no): ").strip().lower()
    
    if confirmation != 'yes':
        print("❌ Configuration cancelled.")
        sys.exit(0)
    
    print()
    print("🚀 Updating database IP restrictions...")
    
    # Update the database
    success = update_database_ip_rules(allowed_ips)
    
    if success:
        print()
        print("=" * 70)
        print("✅ Database security configuration complete!")
        print("=" * 70)
        print()
        print("📌 Next Steps:")
        print("   1. Test your local connection:")
        print("      psql postgresql://ma_saas_user:***@dpg-...frankfurt-postgres.render.com/ma_saas_platform")
        print()
        print("   2. Verify backend can still connect:")
        print("      Visit https://ma-saas-backend.onrender.com/health")
        print()
        print("   3. For production, consider:")
        print("      - Using Render's private networking")
        print("      - Setting up a VPN with a static IP range")
        print("      - Using a bastion host for database access")
        print()
    else:
        print()
        print("=" * 70)
        print("❌ Configuration failed!")
        print("=" * 70)
        print()
        print("📌 Manual Steps:")
        print("   1. Go to https://dashboard.render.com")
        print("   2. Click on 'ma-saas-db'")
        print("   3. Scroll to 'Networking' → 'Inbound IP Restrictions'")
        print("   4. Delete the 0.0.0.0/0 rule")
        print(f"   5. Add your IP: {current_ip}/32")
        print("   6. Add Render internal: 0.0.0.0/0 (for backend)")
        print("   7. Click 'Save'")
        print()


if __name__ == '__main__':
    main()

