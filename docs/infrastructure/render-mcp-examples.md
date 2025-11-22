# Render MCP Server - Use Case Examples

**Last Updated**: 2025-11-22  
**Purpose**: Comprehensive examples for using Render MCP server for infrastructure management

---

## Table of Contents

1. [Database Queries](#database-queries)
2. [Service Management](#service-management)
3. [Monitoring & Metrics](#monitoring--metrics)
4. [Log Analysis](#log-analysis)
5. [Deployment Management](#deployment-management)

---

## Database Queries

### User Analytics

**Daily Signups (Last 30 Days)**
```
Query my database for daily signup counts for the last 30 days
```

**Expected SQL** (MCP will generate):
```sql
SELECT DATE(created_at) as signup_date, COUNT(*) as signups
FROM users
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;
```

---

**User Growth Trends**
```
Show me user growth trends by month from my database
```

**Active Users**
```
How many active users do I have in the last 7 days?
```

---

### Deal Pipeline Analysis

**Deals by Stage**
```
Show me deals by stage from my database
```

**Expected SQL**:
```sql
SELECT stage, COUNT(*) as deal_count
FROM deals
WHERE organization_id = '[org_id]'
GROUP BY stage
ORDER BY deal_count DESC;
```

---

**Deal Value Analysis**
```
Which organizations have the highest deal values?
```

**Deal Pipeline Health**
```
Show me the average time deals spend in each stage
```

---

### Financial Data Queries

**Subscription Tier Distribution**
```
What's the distribution of subscription tiers across organizations?
```

**Expected SQL**:
```sql
SELECT subscription_tier, COUNT(*) as org_count
FROM organizations
GROUP BY subscription_tier
ORDER BY org_count DESC;
```

---

**Revenue Analysis**
```
Show me monthly recurring revenue by subscription tier
```

**Financial Statement Analysis**
```
Query my database for organizations with the highest revenue in the last quarter
```

---

### Custom SQL Execution

**Read-Only Queries**
```
Execute this SQL query on my database: SELECT COUNT(*) FROM deals WHERE stage = 'closing';
```

**Note**: MCP only supports read-only queries for safety. Write operations must be done via API or dashboard.

---

## Service Management

### Environment Variable Updates

**Update Single Variable**
```
Update VITE_API_URL in ma-saas-platform service to https://ma-saas-backend.onrender.com
```

**Update Multiple Variables**
```
Set these environment variables in ma-saas-backend:
- DEBUG=false
- LOG_LEVEL=info
- ENVIRONMENT=production
```

**Check Current Variables**
```
Show me all environment variables for ma-saas-backend service
```

---

### Service Status & Health

**Service Status Check**
```
What's the current status of my backend service?
```

**Service Health**
```
Is ma-saas-backend healthy? Show me the health check status
```

**Service Details**
```
Get me detailed information about ma-saas-platform service
```

---

### Service Creation

**Create New Database**
```
Create a new database named staging-db with 5 GB storage
```

**Create Web Service**
```
Deploy a new web service named api-staging using https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver
```

**Create Static Site**
```
Create a new static site for marketing-staging
```

---

### Deployment Management

**Trigger Deployment**
```
Trigger a new deployment for ma-saas-backend
```

**Deployment Status**
```
What's the status of the latest deployment for ma-saas-platform?
```

**Deployment History**
```
Show me the last 5 deployments for ma-saas-backend
```

**Deployment Logs**
```
Show me the logs from the last deployment of ma-saas-backend
```

---

## Monitoring & Metrics

### Performance Metrics

**Traffic Analysis**
```
What was the busiest traffic day for my backend this month?
```

**Response Times**
```
What are the average response times for my API endpoints?
```

**Request Volume**
```
Show me request volume for ma-saas-backend over the last week
```

---

### Resource Usage

**CPU Usage**
```
Show me CPU usage for ma-saas-backend over the last 24 hours
```

**Memory Usage**
```
What's the memory consumption for ma-saas-backend?
```

**Resource Trends**
```
Show me CPU and memory usage trends for ma-saas-backend over the last week
```

---

### Autoscaling Behavior

**Scaling Activity**
```
Show me autoscaling activity for ma-saas-backend yesterday
```

**Instance Count**
```
How many instances is ma-saas-backend running?
```

**Scaling Events**
```
When did ma-saas-backend scale up or down in the last 24 hours?
```

---

### Database Metrics

**Connection Counts**
```
How many database connections is ma-saas-backend using?
```

**Database Performance**
```
Show me database query performance metrics for the last hour
```

**Storage Usage**
```
What's the current database storage usage?
```

---

## Log Analysis

### Error Logs

**Recent Errors**
```
Pull the most recent error-level logs for my API service
```

**Error Patterns**
```
Show me all errors from ma-saas-backend in the last hour
```

**Error Summary**
```
Summarize the types of errors occurring in ma-saas-backend today
```

---

### Deployment Logs

**Latest Deployment**
```
Show me the logs from the last deployment of ma-saas-platform
```

**Deployment Errors**
```
Were there any errors during the last deployment?
```

**Build Logs**
```
Show me the build logs for the current deployment
```

---

### Filtered Logs

**Search by Keyword**
```
Show me all logs containing 'database connection' from the last hour
```

**Filter by Time**
```
Show me logs from ma-saas-backend between 2pm and 4pm today
```

**Filter by Level**
```
Show me all warning-level logs for ma-saas-backend today
```

---

### Service Diagnostics

**Service Not Working**
```
Why isn't my site at ma-saas-platform.onrender.com working?
```

**Performance Issues**
```
Why is ma-saas-backend responding slowly?
```

**Connection Problems**
```
Check if there are database connection issues in the logs
```

---

## Deployment Management

### Pre-Deployment Checks

**Service Health**
```
Check if ma-saas-backend is healthy before deployment
```

**Database Status**
```
Verify database is accessible before deploying
```

**Environment Variables**
```
Verify all required environment variables are set for ma-saas-backend
```

---

### Post-Deployment Verification

**Deployment Success**
```
Did the latest deployment succeed?
```

**Service Status**
```
Is ma-saas-backend running correctly after deployment?
```

**Health Check**
```
Run a health check on ma-saas-backend after deployment
```

---

### Rollback Support

**Failed Deployment**
```
The deployment failed. Show me what went wrong
```

**Previous Deployment**
```
What was the status of the previous deployment?
```

**Rollback Decision**
```
Should I rollback? Show me the errors from the current deployment
```

---

## Advanced Use Cases

### Multi-Service Operations

**Compare Services**
```
Compare CPU usage between ma-saas-backend and ma-saas-platform
```

**Service Dependencies**
```
Check if ma-saas-platform can reach ma-saas-backend
```

---

### Analytics & Reporting

**Daily Report**
```
Generate a daily report with:
- Service status
- Request counts
- Error counts
- Database connections
```

**Weekly Summary**
```
Show me a weekly summary of:
- Total requests
- Average response time
- Error rate
- Uptime percentage
```

---

### Troubleshooting Workflows

**Complete Diagnostic**
```
Run a complete diagnostic on ma-saas-backend:
1. Check service status
2. Review recent errors
3. Check resource usage
4. Verify database connectivity
```

**Performance Investigation**
```
Investigate performance issues:
- Show me slow requests
- Check resource usage
- Review error logs
- Analyze response times
```

---

## Best Practices

### Query Optimization

1. **Be Specific**: "Show me errors from the last hour" vs "Show me all logs"
2. **Use Filters**: Filter by service, time range, log level
3. **Limit Results**: Ask for "last 10" or "top 5" when appropriate

### Service Management

1. **Verify Before Changes**: Check current state before updating
2. **Test in Staging**: Test changes in staging before production
3. **Monitor After Changes**: Watch metrics after environment variable updates

### Log Analysis

1. **Start Broad**: Begin with recent logs, then narrow down
2. **Use Keywords**: Search for specific error messages or patterns
3. **Check Time Ranges**: Errors might be time-specific

---

## Tips & Tricks

### Natural Language Variations

MCP understands various phrasings:
- "Show me" = "Display" = "List" = "Get"
- "Last hour" = "Past hour" = "Previous hour"
- "Errors" = "Error logs" = "Error messages"

### Combining Queries

You can combine multiple requests:
```
Check ma-saas-backend status and show me recent errors
```

### Follow-up Questions

MCP maintains context, so you can ask:
```
What about the frontend service?
```
After querying the backend.

---

## Next Steps

- [Quick Reference Cheatsheet](./render-mcp-cheatsheet.md) - Command quick reference
- [User Guide](./render-mcp-user-guide.md) - Comprehensive usage guide
- [Migration Guide](./mcp-migration-guide.md) - Transition from scripts

---

**Ready to use Render MCP!** Start with simple queries and gradually explore advanced features.

