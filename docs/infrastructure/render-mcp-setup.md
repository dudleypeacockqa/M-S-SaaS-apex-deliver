# Render MCP Server Setup Guide

**Last Updated**: 2025-11-22  
**Status**: Production Ready  
**Purpose**: Configure Render MCP server for AI-powered infrastructure management in Cursor

---

## Overview

The Render MCP (Model Context Protocol) server enables you to manage your Render infrastructure directly from Cursor using natural language commands. This eliminates the need for manual scripts and dashboard navigation for common tasks.

**Benefits:**
- Natural language infrastructure management
- Database queries without SQL knowledge
- Real-time metrics and log analysis
- Service management via chat interface
- Reduced context switching between tools

---

## Prerequisites

Before starting, ensure you have:

- [x] Render account with API key
- [x] Cursor IDE installed
- [x] Access to Render services: `ma-saas-backend`, `ma-saas-platform`
- [x] Render API key: `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM` (or your own)

---

## Step 1: Create Cursor MCP Configuration

### Windows Configuration

1. **Locate Cursor Config Directory**
   - Press `Win + R` and type: `%APPDATA%\Cursor`
   - Or navigate to: `C:\Users\<YourUsername>\AppData\Roaming\Cursor`

2. **Create/Edit MCP Configuration File**
   - Create or edit file: `mcp.json`
   - Add the following configuration:

```json
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM"
      }
    }
  }
}
```

**Important Security Note**: Replace `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM` with your own Render API key. You can find/create API keys at: https://dashboard.render.com/settings#api-keys

### Alternative: Use Environment Variable (Recommended)

For better security, use an environment variable for the API key:

1. **Set Environment Variable** (PowerShell):
   ```powershell
   [System.Environment]::SetEnvironmentVariable('RENDER_API_KEY', 'rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM', 'User')
   ```

2. **Update MCP Config** to reference the environment variable:
   ```json
   {
     "mcpServers": {
       "render": {
         "url": "https://mcp.render.com/mcp",
         "headers": {
           "Authorization": "Bearer ${RENDER_API_KEY}"
         }
       }
     }
   }
   ```

**Note**: Cursor may require restart after setting environment variables.

---

## Step 2: Verify MCP Connection

1. **Restart Cursor** to load the new MCP configuration

2. **Test Connection** with a simple prompt:
   ```
   List my Render services
   ```

3. **Set Workspace** (first time only):
   ```
   Set my Render workspace to [WORKSPACE_NAME]
   ```
   
   The workspace name is typically visible in your Render Dashboard URL or service list. Common names:
   - "100 Days and Beyond"
   - "ma-saas-platform"
   - Your organization/account name

4. **Verify Services Are Listed**:
   - You should see `ma-saas-backend` and `ma-saas-platform` in the response

---

## Step 3: Test Basic Functionality

Try these test queries to verify everything works:

### Service Management
```
What's the current status of my backend service?
```

### Database Query
```
List all databases in my Render workspace
```

### Metrics
```
Show me the CPU usage for ma-saas-backend over the last 24 hours
```

---

## Troubleshooting

### MCP Server Not Responding

**Issue**: Cursor doesn't recognize Render MCP commands

**Solutions**:
1. Verify `mcp.json` is in the correct location (`%APPDATA%\Cursor\mcp.json`)
2. Check JSON syntax is valid (use a JSON validator)
3. Restart Cursor completely
4. Verify API key is correct and has proper permissions

### Workspace Not Set

**Issue**: MCP prompts you to set workspace repeatedly

**Solutions**:
1. Explicitly set workspace: `Set my Render workspace to [NAME]`
2. Check workspace name matches exactly (case-sensitive)
3. Verify API key has access to the workspace

### API Key Authentication Failed

**Issue**: 401 Unauthorized errors

**Solutions**:
1. Verify API key is correct in `mcp.json`
2. Check API key hasn't been rotated/revoked
3. Create a new API key from Render Dashboard if needed
4. Ensure API key has access to all required workspaces

### Environment Variable Not Working

**Issue**: `${RENDER_API_KEY}` not resolving

**Solutions**:
1. Use absolute API key value instead (less secure but works)
2. Verify environment variable is set system-wide (not just in current shell)
3. Restart Cursor after setting environment variable
4. Check Cursor documentation for environment variable support

---

## Security Best Practices

1. **Never Commit API Keys**: The `mcp.json` file should be in `.gitignore` if stored in project directory
2. **Use Environment Variables**: Prefer `${RENDER_API_KEY}` over hardcoded keys
3. **Rotate Keys Regularly**: Update API keys every 90 days
4. **Limit Key Scope**: Use workspace-specific keys if possible
5. **Monitor Usage**: Check Render Dashboard for unusual API activity

---

## Next Steps

After setup is complete:

1. Read [Use Case Examples](./render-mcp-examples.md) for common workflows
2. Review [Quick Reference Cheatsheet](./render-mcp-cheatsheet.md)
3. Check [Migration Guide](./mcp-migration-guide.md) to transition from scripts
4. Explore [Advanced Use Cases](./mcp-analytics-queries.md)

---

## Additional Resources

- [Render MCP Server Documentation](https://render.com/docs/mcp-server)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/introduction)
- [Cursor MCP Documentation](https://docs.cursor.com/context/mcp)
- [Render API Documentation](https://render.com/docs/api)

---

## Configuration Reference

### Current Setup

- **MCP Server URL**: `https://mcp.render.com/mcp`
- **Authentication**: Bearer token (API key)
- **Services**: 
  - `ma-saas-backend` (Web Service)
  - `ma-saas-platform` (Static Site)
- **Database**: Managed PostgreSQL (via Render)
- **Region**: Frankfurt

### API Key Management

- **Location**: https://dashboard.render.com/settings#api-keys
- **Permissions**: Full workspace access (all services)
- **Rotation**: Recommended every 90 days

---

**Setup Complete!** You're now ready to use Render MCP server for AI-powered infrastructure management.

