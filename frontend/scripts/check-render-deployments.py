#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check Render Deployment Status
Query Render API for latest deployment information
"""

import sys
import requests
import json
from datetime import datetime

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

RENDER_API_KEY = 'rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM'
RENDER_API_BASE = 'https://api.render.com/v1'

def get_headers():
    return {
        'Authorization': f'Bearer {RENDER_API_KEY}',
        'Content-Type': 'application/json'
    }

def main():
    print("=" * 70)
    print("Render Deployment Status Check")
    print("=" * 70)
    print()

    # Get all services
    response = requests.get(
        f'{RENDER_API_BASE}/services',
        headers=get_headers(),
        params={'limit': 20}
    )

    if response.status_code != 200:
        print(f"Failed to fetch services: {response.status_code}")
        return

    services = response.json()

    # Filter for frontend and backend
    for service in services:
        service_data = service.get('service', service)
        name = service_data.get('name', '')
        service_id = service_data.get('id', '')
        service_type = service_data.get('type', '')

        if 'frontend' in name.lower() or 'backend' in name.lower():
            print(f"\nService: {name} ({service_type})")
            print(f"ID: {service_id}")

            # Get recent deploys
            deploys_response = requests.get(
                f'{RENDER_API_BASE}/services/{service_id}/deploys',
                headers=get_headers(),
                params={'limit': 5}
            )

            if deploys_response.status_code == 200:
                deploys = deploys_response.json()
                print("\nRecent Deploys:")

                for i, deploy in enumerate(deploys[:5]):
                    deploy_data = deploy.get('deploy', deploy)
                    deploy_id = deploy_data.get('id', 'unknown')
                    status = deploy_data.get('status', 'unknown')
                    commit_data = deploy_data.get('commit', {})
                    commit_id = commit_data.get('id', 'unknown')[:7] if commit_data else 'unknown'
                    created_at = deploy_data.get('createdAt', '')
                    finished_at = deploy_data.get('finishedAt', 'N/A')

                    status_emoji = {
                        'live': '✅',
                        'build_in_progress': '🔄',
                        'update_in_progress': '🔄',
                        'queued': '⏳',
                        'build_failed': '❌',
                        'update_failed': '❌',
                        'canceled': '⚠️'
                    }.get(status, '❓')

                    print(f"  {i+1}. {status_emoji} {deploy_id}")
                    print(f"     Status: {status}")
                    print(f"     Commit: {commit_id}")
                    print(f"     Created: {created_at}")
                    print(f"     Finished: {finished_at}")
                    print()
            else:
                print(f"  Failed to fetch deploys: {deploys_response.status_code}")

    print("=" * 70)
    print("Deployment status check complete")
    print("=" * 70)

if __name__ == '__main__':
    main()