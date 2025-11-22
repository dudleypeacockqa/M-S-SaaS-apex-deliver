# Render MCP Server Verification Guide

**Last Updated**: 2025-11-22  
**Purpose**: Verify Render MCP server is correctly configured and functional

---

## Quick Verification Checklist

- [ ] MCP configuration file exists at correct location
- [ ] API key is valid and has proper permissions
- [ ] Workspace is set and accessible
- [ ] Services can be listed
- [ ] Database queries work
- [ ] Service management commands work
- [ ] Metrics retrieval works
- [ ] Log analysis works

---

## Step-by-Step Verification

### 1. Configuration File Check

**Windows**: Verify `%APPDATA%\Cursor\mcp.json` exists and contains:

```json
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

**Verification Command** (PowerShell):
```powershell
Test-Path "$env:APPDATA\Cursor\mcp.json"
Get-Content "$env:APPDATA\Cursor\mcp.json" | ConvertFrom-Json
```

---

### 2. Test Basic Connection

**Prompt**: `List my Render services`

**Expected Response**: Should list `ma-saas-backend` and `ma-saas-platform` (or your actual service names)

**If it fails**: Check API key, restart Cursor, verify JSON syntax

---

### 3. Workspace Selection

**Prompt**: `Set my Render workspace to [YOUR_WORKSPACE_NAME]`

**Expected Response**: Confirmation that workspace is set

**Common Workspace Names**:
- Check Render Dashboard URL: `https://dashboard.render.com/[workspace-name]`
- Or ask: `What workspaces do I have access to?`

---

### 4. Service Status Check

**Prompt**: `What's the current status of ma-saas-backend?`

**Expected Response**: Service status (live, building, paused, etc.) with details

---

### 5. Database Query Test

**Prompt**: `List all databases in my Render workspace`

**Expected Response**: List of PostgreSQL databases (should include your production database)

**Advanced Test**:
```
Query my database: SELECT COUNT(*) FROM users;
```

**Note**: MCP only supports read-only queries for safety

---

### 6. Metrics Retrieval

**Prompt**: `Show me CPU usage for ma-saas-backend over the last hour`

**Expected Response**: CPU usage metrics with timestamps

---

### 7. Log Analysis

**Prompt**: `Show me the last 10 log entries for ma-saas-backend`

**Expected Response**: Recent log entries from the service

**Error Log Test**:
```
Pull the most recent error-level logs for ma-saas-backend
```

---

## Verification Test Script

You can use this Python script to verify API key access (independent of MCP):

```python
import os
import requests

API_KEY = os.environ.get("RENDER_API_KEY", "rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "application/json"
}

# Test 1: List workspaces
response = requests.get("https://api.render.com/v1/owners", headers=headers)
print(f"Workspaces: {response.status_code}")
if response.status_code == 200:
    print("✅ API key is valid")
    print(response.json())
else:
    print(f"❌ API key issue: {response.text}")

# Test 2: List services
response = requests.get("https://api.render.com/v1/services", headers=headers)
print(f"\nServices: {response.status_code}")
if response.status_code == 200:
    services = response.json()
    print(f"✅ Found {len(services)} services")
    for service in services[:5]:  # Show first 5
        print(f"  - {service.get('service', {}).get('name', 'Unknown')}")
```

Save as `scripts/verify_render_api.py` and run:
```bash
python scripts/verify_render_api.py
```

---

## Common Issues & Solutions

### Issue: "MCP server not found"

**Solution**: 
1. Verify `mcp.json` location is correct
2. Restart Cursor completely
3. Check Cursor version supports MCP (latest version required)

### Issue: "Workspace not set"

**Solution**:
1. Explicitly set workspace with exact name
2. List workspaces first: `What workspaces do I have access to?`
3. Use workspace name from Render Dashboard URL

### Issue: "401 Unauthorized"

**Solution**:
1. Verify API key is correct
2. Check API key hasn't expired
3. Create new API key from Render Dashboard
4. Update `mcp.json` with new key

### Issue: "No services found"

**Solution**:
1. Verify workspace is set correctly
2. Check API key has access to workspace
3. List workspaces to verify access

---

## Success Criteria

✅ **Configuration Verified** if:
- MCP config file exists and is valid JSON
- API key authentication works
- Workspace can be set
- Services are listed correctly
- At least one database query succeeds
- Metrics can be retrieved
- Logs can be accessed

---

## Next Steps After Verification

Once verified, proceed to:
1. [Use Case Examples](./render-mcp-examples.md) - Learn common workflows
2. [Quick Reference](./render-mcp-cheatsheet.md) - Quick command reference
3. [User Guide](./render-mcp-user-guide.md) - Comprehensive guide

---

**Verification Complete!** Your Render MCP server is ready to use.

