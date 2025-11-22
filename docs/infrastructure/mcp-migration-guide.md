# Render MCP Migration Guide

**Last Updated**: 2025-11-22  
**Purpose**: Guide for transitioning from manual scripts to Render MCP server

---

## Overview

This guide helps you migrate from manual Python scripts to using Render MCP server for infrastructure management. MCP provides natural language interface, reducing the need for script maintenance and improving developer experience.

---

## Migration Strategy

### When to Use MCP vs Scripts

**Use MCP When:**
- ✅ Ad-hoc queries and troubleshooting
- ✅ Quick service status checks
- ✅ Database queries and analytics
- ✅ Log analysis and debugging
- ✅ Metrics monitoring
- ✅ Environment variable updates (one-off)

**Keep Scripts When:**
- ✅ Automated CI/CD pipelines
- ✅ Scheduled tasks and cron jobs
- ✅ Bulk operations requiring loops
- ✅ Complex multi-step workflows
- ✅ Operations requiring error handling/retries

---

## Script-to-MCP Mapping

### Database Queries

#### Old: `scripts/run_sql_commands.py`
```python
python scripts/run_sql_commands.py "SELECT COUNT(*) FROM users;"
```

#### New: MCP Command
```
Query my database: SELECT COUNT(*) FROM users;
```

**Benefits:**
- No script to maintain
- Natural language queries
- Immediate results in chat

---

### Service Status Checks

#### Old: `scripts/check_render_deploy.py`
```python
python scripts/check_render_deploy.py --service ma-saas-backend
```

#### New: MCP Command
```
What's the current status of ma-saas-backend?
```

**Additional MCP Capabilities:**
```
Is ma-saas-backend healthy? Show me the health check status
Get detailed information about ma-saas-backend
```

---

### Environment Variable Management

#### Old: `set_render_env_vars.py`
```python
python set_render_env_vars.py
```

#### New: MCP Commands
```
Update VITE_API_URL in ma-saas-platform to https://ma-saas-backend.onrender.com
Show me all environment variables for ma-saas-backend
```

**Benefits:**
- No need to edit Python scripts
- Natural language updates
- Immediate verification

---

### Deployment Management

#### Old: `trigger_deploy.py`
```python
python trigger_deploy.py --service ma-saas-backend
```

#### New: MCP Command
```
Trigger a new deployment for ma-saas-backend
```

**Additional MCP Capabilities:**
```
What's the status of the latest deployment?
Show me the last 5 deployments for ma-saas-backend
Show me the logs from the last deployment
```

---

### Log Analysis

#### Old: `scripts/get_deploy_logs.py`
```python
python scripts/get_deploy_logs.py --service ma-saas-backend --count 50
```

#### New: MCP Commands
```
Show me the last 50 log entries for ma-saas-backend
Pull the most recent error-level logs for ma-saas-backend
Show me logs containing 'database connection' from the last hour
```

**Benefits:**
- Filter by keyword, time range, log level
- Natural language queries
- No script parameters to remember

---

### Metrics Retrieval

#### Old: Manual Dashboard Navigation
1. Open Render Dashboard
2. Navigate to service
3. Click Metrics tab
4. Select time range
5. View charts

#### New: MCP Commands
```
Show me CPU usage for ma-saas-backend over the last 24 hours
What's the memory consumption for ma-saas-backend?
What was the busiest traffic day for my backend this month?
```

**Benefits:**
- Stay in Cursor IDE
- Quick queries without dashboard navigation
- Natural language time ranges

---

## Migration Checklist

### Phase 1: Setup (Week 1)
- [ ] Configure Render MCP server in Cursor
- [ ] Test basic connection: "List my Render services"
- [ ] Set workspace: "Set my Render workspace to [NAME]"
- [ ] Verify service listing works

### Phase 2: Common Tasks (Week 2)
- [ ] Replace service status checks with MCP
- [ ] Use MCP for environment variable updates
- [ ] Try MCP for log analysis
- [ ] Test database queries via MCP

### Phase 3: Advanced Usage (Week 3)
- [ ] Use MCP for metrics monitoring
- [ ] Try troubleshooting workflows
- [ ] Explore deployment management
- [ ] Build custom query templates

### Phase 4: Script Cleanup (Week 4)
- [ ] Identify scripts that can be fully replaced
- [ ] Keep scripts needed for automation
- [ ] Document when to use each approach
- [ ] Update team documentation

---

## Common Workflow Migrations

### Daily Health Check

#### Old Script-Based Workflow
```bash
python scripts/check_render_deploy.py --service ma-saas-backend
python scripts/check_render_deploy.py --service ma-saas-platform
python scripts/monitor_deployment.py
```

#### New MCP Workflow
```
Generate a daily report with:
- Service status for ma-saas-backend and ma-saas-platform
- Request counts
- Error counts
- Database connections
```

---

### Troubleshooting Deployment Issues

#### Old Script-Based Workflow
1. Check service status script
2. Get deployment logs script
3. Analyze logs manually
4. Check metrics in dashboard

#### New MCP Workflow
```
Run a complete diagnostic on ma-saas-backend:
1. Check service status
2. Review recent errors
3. Check resource usage
4. Verify database connectivity
```

---

### Database Analytics

#### Old Script-Based Workflow
```python
python scripts/run_sql_commands.py "SELECT COUNT(*) FROM users;"
python scripts/run_sql_commands.py "SELECT stage, COUNT(*) FROM deals GROUP BY stage;"
```

#### New MCP Workflow
```
Query my database for daily signup counts for the last 30 days
Show me deals by stage from my database
```

---

## Scripts to Keep

These scripts should remain for automation:

### `scripts/verify_deployment.py`
- Used in CI/CD pipelines
- Automated testing scenarios
- Keep for scheduled checks

### `scripts/secure_render_database.py`
- Automated IP whitelist updates
- Scheduled security tasks
- Keep for automation

### `scripts/update_render_predeploy.py`
- Pre-deployment automation
- CI/CD integration
- Keep for pipelines

---

## Scripts to Deprecate

These can be replaced with MCP:

### `scripts/mcp-query-database.py`
- **Status**: Helper/fallback only
- **Replacement**: Use MCP directly
- **Action**: Keep as fallback, document MCP as primary

### `scripts/mcp-service-management.py`
- **Status**: Helper/fallback only
- **Replacement**: Use MCP directly
- **Action**: Keep as fallback, document MCP as primary

### `scripts/mcp-get-metrics.py`
- **Status**: Helper/fallback only
- **Replacement**: Use MCP directly
- **Action**: Keep as fallback, document MCP as primary

### `scripts/mcp-analyze-logs.py`
- **Status**: Helper/fallback only
- **Replacement**: Use MCP directly
- **Action**: Keep as fallback, document MCP as primary

---

## Best Practices

### 1. Start Small
- Begin with simple queries
- Gradually replace common workflows
- Keep scripts as backup initially

### 2. Document MCP Usage
- Create team knowledge base
- Share successful query patterns
- Document troubleshooting workflows

### 3. Combine Approaches
- Use MCP for ad-hoc tasks
- Keep scripts for automation
- Don't force everything into MCP

### 4. Train Team
- Share MCP examples
- Create quick reference guide
- Encourage experimentation

---

## Troubleshooting Migration

### Issue: MCP Not Available
**Solution**: Fall back to scripts, check MCP configuration

### Issue: Complex Queries Don't Work
**Solution**: Break into smaller queries, use scripts for complex logic

### Issue: Team Prefers Scripts
**Solution**: Show MCP benefits, provide training, keep both options

---

## Next Steps

1. **Complete Setup**: Follow [MCP Setup Guide](./render-mcp-setup.md)
2. **Learn Examples**: Review [MCP Examples](./render-mcp-examples.md)
3. **Quick Reference**: Use [MCP Cheatsheet](./render-mcp-cheatsheet.md)
4. **Full Guide**: Read [MCP User Guide](./render-mcp-user-guide.md)

---

**Migration Complete!** You're now using Render MCP for infrastructure management.

