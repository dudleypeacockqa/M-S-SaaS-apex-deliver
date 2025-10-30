# Deployment Troubleshooting Guide

**Last Updated**: 2025-10-30
**Purpose**: Diagnose and fix common deployment issues for 100daysandbeyond.com

---

## Quick Diagnostics

Run the verification scripts to identify issues:

```bash
# Bash version
bash scripts/verify_deployment.sh

# Python version (requires requests library)
python scripts/verify_deployment.py
```

---

## Common Issues & Solutions

### Issue 1: Blog API Returns 500 Error

**Symptoms**:
- `GET /api/blog` returns HTTP 500
- Error message: "Internal Server Error"
- Frontend blog page shows "No posts yet"

**Root Cause**: Database migration not applied in production

**Diagnosis**:
```bash
# Check if blog_posts table exists
curl -s https://ma-saas-backend.onrender.com/api/blog
# If 500 error, table likely missing
```

**Solution A: Manual Migration (Immediate - 5 minutes)**:

1. Open [Render Dashboard](https://dashboard.render.com)
2. Navigate to `ma-saas-backend` service
3. Click **"Shell"** tab
4. Run these commands:
   ```bash
   cd backend
   alembic upgrade head
   python scripts/seed_blog_posts.py
   ```
5. Verify:
   ```bash
   curl https://ma-saas-backend.onrender.com/api/blog
   ```

**Solution B: Auto-Migration (Long-term fix)**:

1. In Render dashboard, go to `ma-saas-backend` → **Settings**
2. Find **"Pre-Deploy Command"** field
3. Add: `cd backend && alembic upgrade head`
4. Click **"Save Changes"**
5. Trigger manual redeploy or wait for next push

**Solution C: Environment-Based Migration**:

Add to `backend/main.py` (startup event):
```python
import os
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations on startup if enabled
    if os.getenv("AUTO_MIGRATE", "false").lower() == "true":
        from alembic import command
        from alembic.config import Config
        alembic_cfg = Config("backend/alembic.ini")
        command.upgrade(alembic_cfg, "head")
    yield

app = FastAPI(lifespan=lifespan)
```

Then set `AUTO_MIGRATE=true` in Render environment variables.

---

### Issue 2: Contact Form Submissions Not Working

**Symptoms**:
- Contact form shows error: "Failed to send message"
- Browser console shows 404 or CORS errors
- Backend logs show no POST requests

**Root Cause**: Frontend calling wrong API URL or backend route not registered

**Diagnosis**:
```bash
# Test contact endpoint directly
curl -X POST https://ma-saas-backend.onrender.com/api/marketing/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'

# Should return 200 with success message
```

**Solution**:

1. **Verify Frontend ENV**: Check Render frontend environment variables
   - `VITE_API_URL` should be `https://ma-saas-backend.onrender.com`

2. **Verify Backend Route**: Check `backend/app/api/__init__.py`
   ```python
   from app.api.routes import marketing
   api_router.include_router(marketing.router)
   ```

3. **Check CORS**: Ensure `backend/app/main.py` allows frontend domain
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://100daysandbeyond.com"],
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

---

### Issue 3: Newsletter Subscription Fails Silently

**Symptoms**:
- OptInPopup shows "Failed to subscribe"
- No error in backend logs
- Database has no new subscribers

**Root Cause**: Same as Issue 2 - route or CORS misconfiguration

**Solution**: Follow same steps as Issue 2, but test `/api/marketing/subscribe` endpoint

---

### Issue 4: Blog Images Not Displaying

**Symptoms**:
- Blog posts load but images are broken (404)
- `featured_image_url` field is null or points to wrong location

**Root Cause**: Blog images not uploaded to CDN

**Solution**:

1. **Check Image URLs** in database:
   ```bash
   # In Render shell
   psql $DATABASE_URL -c "SELECT slug, featured_image_url FROM blog_posts LIMIT 5;"
   ```

2. **Upload Images** to CDN:
   - Extract `blog_images.zip` (50 PNG files)
   - Upload to Cloudflare R2, AWS S3, or Render static files
   - Update database with new URLs:
   ```sql
   UPDATE blog_posts
   SET featured_image_url = 'https://cdn.100daysandbeyond.com/blog/' || slug || '.png'
   WHERE featured_image_url IS NULL;
   ```

3. **Alternative**: Serve locally from `frontend/public/blog-images/`
   - Move images to `frontend/public/blog-images/`
   - Update URLs in database:
   ```sql
   UPDATE blog_posts
   SET featured_image_url = 'https://100daysandbeyond.com/blog-images/' || slug || '.png';
   ```

---

### Issue 5: Migrations Applied Locally But Not In Production

**Symptoms**:
- Local database has `blog_posts` and `contact_messages` tables
- Production database missing these tables
- Alembic shows migrations exist but not applied

**Root Cause**: Render doesn't auto-run Alembic migrations

**Solution**: Implement Solution B from Issue 1 (Pre-Deploy Command)

**Verify Migration Status**:
```bash
# In Render shell
cd backend
alembic current
# Should show: 5c9c13500fb2 (latest)

alembic history
# Should show migration chain
```

---

## Environment Variable Checklist

### Backend (ma-saas-backend)
```env
DATABASE_URL=<Render PostgreSQL URL>
CLERK_SECRET_KEY=<from Clerk dashboard>
CLERK_WEBHOOK_SECRET=<from Clerk dashboard>
OPENAI_API_KEY=<optional - for AI features>
STRIPE_API_KEY=<for billing>
STRIPE_WEBHOOK_SECRET=<for webhook verification>
AUTO_MIGRATE=true  # Enable auto-migration
```

### Frontend (ma-saas-platform)
```env
VITE_API_URL=https://ma-saas-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=<from Clerk dashboard>
VITE_STRIPE_PUBLISHABLE_KEY=<from Stripe dashboard>
```

---

## Database Schema Verification

**Check if all tables exist**:
```bash
# In Render shell or local psql
psql $DATABASE_URL -c "\dt"

# Should show:
# - blog_posts
# - contact_messages
# - users
# - organizations
# - deals
# - documents
# - ...
```

**Check blog posts count**:
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM blog_posts;"
# Should be 12+ posts
```

**Check migrations applied**:
```bash
psql $DATABASE_URL -c "SELECT * FROM alembic_version;"
# Should show: 5c9c13500fb2 (latest revision)
```

---

## Smoke Test Checklist

After deployment, manually verify:

- [ ] Backend health check returns `{"status": "healthy"}`
- [ ] Blog listing shows 12 posts
- [ ] Blog post by slug loads correctly
- [ ] Contact form submission succeeds (check backend logs)
- [ ] Newsletter subscription succeeds
- [ ] Frontend pages load:
  - [ ] Home page (/)
  - [ ] Pricing (/pricing)
  - [ ] Features (/features)
  - [ ] Contact (/contact)
  - [ ] Blog (/blog)
  - [ ] About (/about)
- [ ] 404 page renders for invalid routes
- [ ] Mobile responsive layout works

---

## Rollback Procedure

If deployment breaks production:

1. **Identify Last Working Commit**:
   ```bash
   git log --oneline -10
   ```

2. **Revert to Previous Commit**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **Or Force Rollback** (use with caution):
   ```bash
   git reset --hard <last-working-commit>
   git push origin main --force
   ```

4. **Render Auto-Deploys** - will trigger within 2-3 minutes

5. **Verify Rollback**:
   ```bash
   bash scripts/verify_deployment.sh
   ```

---

## Contact & Escalation

If issues persist:
1. Check Render service logs (Dashboard → Service → Logs tab)
2. Review `backend/logs/` and `frontend/logs/` if file logging enabled
3. Contact Render support: https://render.com/support
4. Review this repository's GitHub Issues

---

## Monitoring & Alerts

**Recommended Setup**:
- **Uptime Monitor**: UptimeRobot, Pingdom, or Render's built-in monitoring
- **Error Tracking**: Sentry.io integrated in backend
- **Log Aggregation**: Render logs or external service (Logtail, Papertrail)

**Alert Conditions**:
- Blog API returns 500 for 3+ consecutive requests
- Contact form 500 errors
- Database connection failures
- High response times (>5s)

---

**End of Troubleshooting Guide**
