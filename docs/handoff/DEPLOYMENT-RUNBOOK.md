# Deployment Runbook - M&A Intelligence Platform

**Date**: 2025-11-22
**Version**: v1.0.0-rc2
**Environment**: Production (Render)

---

## Overview

This runbook provides step-by-step instructions for deploying the M&A Intelligence Platform to production on Render.

---

## Prerequisites

- Render account with access to services
- GitHub repository access
- Environment variables configured
- Database and Redis services running

---

## Architecture

### Services

1. **Frontend** (Static Site)
   - Service: `ma-saas-platform`
   - Type: Static Site
   - URL: https://financeflo.ai
   - Render URL: https://ma-saas-platform.onrender.com

2. **Backend** (Web Service)
   - Service: `ma-saas-backend`
   - Type: Web Service
   - URL: https://ma-saas-backend.onrender.com
   - Framework: FastAPI + Gunicorn

3. **Database** (PostgreSQL)
   - Service: `ma-saas-db`
   - Type: PostgreSQL
   - Version: 15+

4. **Redis** (Optional)
   - Service: `ma-saas-redis`
   - Type: Redis
   - Purpose: Caching and task queue

---

## Deployment Process

### Automatic Deployment (Recommended)

**Trigger**: Push to `main` branch on GitHub

**Process**:
1. GitHub push triggers Render webhook
2. Render clones repository
3. Builds frontend/backend
4. Runs migrations (backend)
5. Deploys to production
6. Health checks verify deployment

**No manual steps required** - fully automated

---

### Manual Deployment

#### Frontend Deployment

1. **Navigate to Render Dashboard**
   - Go to https://dashboard.render.com
   - Select `ma-saas-platform` service

2. **Trigger Manual Deploy**
   - Click "Manual Deploy"
   - Select branch: `main`
   - Click "Deploy"

3. **Monitor Build**
   - Watch build logs
   - Verify build succeeds
   - Check deployment status

4. **Verify Deployment**
   - Visit https://financeflo.ai
   - Check for errors in browser console
   - Verify all pages load

#### Backend Deployment

1. **Navigate to Render Dashboard**
   - Go to https://dashboard.render.com
   - Select `ma-saas-backend` service

2. **Trigger Manual Deploy**
   - Click "Manual Deploy"
   - Select branch: `main`
   - Click "Deploy"

3. **Monitor Build**
   - Watch build logs
   - Verify migrations run
   - Check deployment status

4. **Verify Deployment**
   - Visit https://ma-saas-backend.onrender.com/health
   - Should return `{"status": "healthy"}`
   - Check API docs: https://ma-saas-backend.onrender.com/api/docs

---

## Environment Variables

### Frontend Environment Variables

**Required**:
- `VITE_API_URL` = `https://ma-saas-backend.onrender.com`
- `VITE_CLERK_PUBLISHABLE_KEY` = Production key (pk_live_...)
- `NODE_ENV` = `production`

**Optional**:
- `VITE_ENABLE_MASTER_ADMIN` = `true` (default: enabled)
- `VITE_GTM_ID` = Google Tag Manager ID (if using GTM)
- `VITE_MARKETING_BRAND` = `apexdeliver` or `financeflo`

### Backend Environment Variables

**Required**:
- `PYTHON_ENV` = `production`
- `DEBUG` = `false`
- `DATABASE_URL` = Internal Render connection string
- `CLERK_SECRET_KEY` = Production key (sk_live_...)
- `CORS_ORIGINS` = Includes frontend domain

**API Keys**:
- `OPENAI_API_KEY` = OpenAI API key
- `ANTHROPIC_API_KEY` = Anthropic API key
- `STRIPE_SECRET_KEY` = Stripe secret key
- `STRIPE_WEBHOOK_SECRET` = Stripe webhook secret
- `SENDGRID_API_KEY` = SendGrid API key

**Optional**:
- `REDIS_URL` = Redis connection string (if using Redis)
- `GOHIGHLEVEL_API_KEY` = GoHighLevel API key (if using)
- `GOHIGHLEVEL_LOCATION_ID` = GoHighLevel location ID

---

## Database Migrations

### Automatic Migrations

Migrations run automatically during backend deployment via `backend/prestart.sh`:

```bash
# Prestart script runs:
alembic upgrade head
```

### Manual Migration

If needed, run migrations manually:

```bash
# Connect to backend service
cd backend
alembic upgrade head
```

### Rollback

To rollback a migration:

```bash
alembic downgrade -1
```

---

## Health Checks

### Frontend Health Check

**URL**: https://financeflo.ai
**Expected**: 200 OK, HTML content

### Backend Health Check

**URL**: https://ma-saas-backend.onrender.com/health
**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-22T...",
  "clerk_configured": true,
  "database_configured": true,
  "webhook_configured": true,
  "stripe_configured": true
}
```

---

## Rollback Procedure

### Frontend Rollback

1. **Navigate to Render Dashboard**
   - Select `ma-saas-platform` service
   - Go to "Deploys" tab

2. **Select Previous Deployment**
   - Find last known good deployment
   - Click "Redeploy"

3. **Verify Rollback**
   - Check site loads correctly
   - Verify no errors

### Backend Rollback

1. **Navigate to Render Dashboard**
   - Select `ma-saas-backend` service
   - Go to "Deploys" tab

2. **Select Previous Deployment**
   - Find last known good deployment
   - Click "Redeploy"

3. **Verify Rollback**
   - Check health endpoint
   - Verify API responds correctly

### Database Rollback

**Warning**: Only rollback if absolutely necessary

1. **Identify Migration to Rollback**
   ```bash
   alembic history
   ```

2. **Rollback Migration**
   ```bash
   alembic downgrade <revision>
   ```

3. **Verify Data Integrity**
   - Check critical tables
   - Verify no data loss

---

## Monitoring

### Render Dashboard

- **Service Status**: Check service health in dashboard
- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory, and request metrics

### Application Monitoring

- **Health Endpoints**: `/health` for backend
- **Error Tracking**: Sentry (if configured)
- **Analytics**: Google Tag Manager (if configured)

---

## Troubleshooting

### Build Failures

**Issue**: Frontend build fails
**Solutions**:
- Check Node.js version compatibility
- Verify all dependencies in `package.json`
- Check for syntax errors in code
- Review build logs for specific errors

**Issue**: Backend build fails
**Solutions**:
- Check Python version (3.11+)
- Verify all dependencies in `requirements.txt`
- Check for import errors
- Review build logs

### Deployment Failures

**Issue**: Service won't start
**Solutions**:
- Check environment variables are set
- Verify database connection
- Check for port conflicts
- Review startup logs

**Issue**: Migrations fail
**Solutions**:
- Check database connectivity
- Verify migration files are valid
- Check for schema conflicts
- Review migration logs

### Runtime Issues

**Issue**: 500 errors
**Solutions**:
- Check application logs
- Verify database is accessible
- Check API keys are valid
- Review error tracking (Sentry)

**Issue**: Slow performance
**Solutions**:
- Check database query performance
- Verify Redis is working (if used)
- Review application metrics
- Check for resource limits

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Backend health check returns healthy
- [ ] API docs accessible
- [ ] Authentication works
- [ ] Database migrations completed
- [ ] No critical errors in logs
- [ ] Custom domain resolves correctly
- [ ] SSL certificates valid
- [ ] Environment variables correct
- [ ] Monitoring active

---

## Emergency Contacts

- **Support Email**: helpdesk@financeflo.ai
- **Support Phone**: +44 7360 539147
- **Render Support**: https://render.com/docs/support

---

**Last Updated**: 2025-11-22

