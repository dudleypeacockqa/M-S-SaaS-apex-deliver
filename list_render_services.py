#!/usr/bin/env python3
"""List all Render services to find service IDs."""

import os
import requests

RENDER_API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM")

def list_services():
    headers = {
        'Authorization': f'Bearer {RENDER_API_KEY}',
        'Accept': 'application/json'
    }

    response = requests.get('https://api.render.com/v1/services', headers=headers)
    response.raise_for_status()
    services = response.json()

    print('Available Render Services:')
    print('=' * 80)
    for service_data in services:
        svc = service_data.get('service', {})
        print(f"Name: {svc.get('name')}")
        print(f"ID: {svc.get('id')}")
        print(f"Type: {svc.get('type')}")
        print(f"URL: {svc.get('serviceDetails', {}).get('url', 'N/A')}")
        print('-' * 80)

if __name__ == "__main__":
    list_services()
