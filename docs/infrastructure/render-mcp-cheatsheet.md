# Render MCP Server - Quick Reference Cheatsheet

**Last Updated**: 2025-11-22  
**Purpose**: Quick reference for common Render MCP commands

---

## Setup

```bash
# Configuration file location (Windows)
%APPDATA%\Cursor\mcp.json

# Set workspace (first time)
Set my Render workspace to [WORKSPACE_NAME]
```

---

## Database Queries

| Task | Command |
|------|---------|
| Daily signups | `Query my database for daily signup counts for the last 30 days` |
| Deals by stage | `Show me deals by stage from my database` |
| User count | `How many users do I have?` |
| Custom SQL | `Execute this SQL: SELECT COUNT(*) FROM users;` |
| Top organizations | `Which organizations have the highest deal values?` |

---

## Service Management

| Task | Command |
|------|---------|
| List services | `List my Render services` |
| Service status | `What's the status of ma-saas-backend?` |
| Update env var | `Update VITE_API_URL in ma-saas-platform to https://...` |
| Service details | `Get details about ma-saas-backend` |
| Create database | `Create a new database named staging-db with 5 GB` |

---

## Monitoring & Metrics

| Task | Command |
|------|---------|
| CPU usage | `Show me CPU usage for ma-saas-backend over the last 24 hours` |
| Memory usage | `What's the memory consumption for ma-saas-backend?` |
| Traffic analysis | `What was the busiest traffic day this month?` |
| Response times | `What are the average response times?` |
| Request volume | `Show me request volume over the last week` |
| Autoscaling | `Show me autoscaling activity for yesterday` |

---

## Log Analysis

| Task | Command |
|------|---------|
| Recent errors | `Pull the most recent error-level logs for ma-saas-backend` |
| Search logs | `Show me logs containing 'database connection' from the last hour` |
| Deployment logs | `Show me the logs from the last deployment` |
| Last 10 logs | `Show me the last 10 log entries for ma-saas-backend` |
| Error summary | `Summarize errors occurring today` |

---

## Deployment

| Task | Command |
|------|---------|
| Trigger deploy | `Trigger a new deployment for ma-saas-backend` |
| Deploy status | `What's the status of the latest deployment?` |
| Deploy history | `Show me the last 5 deployments` |
| Build logs | `Show me the build logs for current deployment` |
| Pre-deploy check | `Check if ma-saas-backend is healthy before deployment` |

---

## Troubleshooting

| Task | Command |
|------|---------|
| Service not working | `Why isn't my site at ma-saas-platform.onrender.com working?` |
| Performance issues | `Why is ma-saas-backend responding slowly?` |
| Database issues | `Check if there are database connection issues` |
| Complete diagnostic | `Run a complete diagnostic on ma-saas-backend` |

---

## Common Patterns

### Time Ranges
- `last hour` / `past hour` / `previous hour`
- `last 24 hours` / `yesterday` / `today`
- `last week` / `last month`
- `between 2pm and 4pm today`

### Service Names
- `ma-saas-backend` (backend API)
- `ma-saas-platform` (frontend)

### Log Levels
- `error-level` / `errors`
- `warning-level` / `warnings`
- `info-level` / `info`

---

## Tips

1. **Be specific**: Include service names and time ranges
2. **Use filters**: Filter by log level, time, or keywords
3. **Combine queries**: Ask multiple things in one prompt
4. **Follow-up**: MCP maintains context for follow-up questions

---

## Quick Diagnostics

```
Run a complete diagnostic on ma-saas-backend:
1. Check service status
2. Review recent errors  
3. Check resource usage
4. Verify database connectivity
```

---

**Print this cheatsheet** and keep it handy for quick reference!

