#!/usr/bin/env python3
import requests
import json

RENDER_API_KEY = "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
SERVICE_ID = "srv-d3ii9qk9c44c73aqsli0"

headers = {
    "Authorization": f"Bearer {RENDER_API_KEY}",
    "Content-Type": "application/json"
}

url = f"https://api.render.com/v1/services/{SERVICE_ID}/deploys"

payload = {"clearCache": "do_not_clear"}

print("Triggering manual deployment...")
response = requests.post(url, headers=headers, json=payload)

print(f"Status Code: {response.status_code}")
if response.status_code == 202:
    print("Deployment triggered successfully!")
    print("Response:", response.text if response.text else "(empty)")
else:
    print("Error:", response.text)
