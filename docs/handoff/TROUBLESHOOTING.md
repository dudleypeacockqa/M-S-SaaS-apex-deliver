# Troubleshooting Guide - M&A Intelligence Platform

**Date**: 2025-11-22
**Version**: v1.0.0-rc2

---

## Common Issues & Solutions

### Authentication Issues

#### Issue: Can't sign in
**Symptoms**: 
- Redirect loops
- "Invalid token" errors
- Clerk authentication fails

**Solutions**:
1. Clear browser cookies and cache
2. Verify `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
3. Check Clerk dashboard for service status
4. Verify backend `CLERK_SECRET_KEY` matches
5. Check CORS settings allow frontend domain

**Error Codes**:
- `AUTH_ERROR_001`: Invalid Clerk key
- `AUTH_ERROR_002`: Token expired
- `AUTH_ERROR_003`: CORS blocked

---

#### Issue: Can't access protected routes
**Symptoms**:
- Redirected to sign-in page
- "Unauthorized" errors
- Role-based access denied

**Solutions**:
1. Verify user is signed in
2. Check user has correct role
3. Verify organization membership
4. Check `ProtectedRoute` component logic
5. Review role assignments in Clerk dashboard

---

### Database Issues

#### Issue: Database connection errors
**Symptoms**:
- "Database connection failed"
- 500 errors on API calls
- Health check shows `database_configured: false`

**Solutions**:
1. Verify `DATABASE_URL` environment variable
2. Check database service is running in Render
3. Verify connection string format
4. Check database credentials
5. Review database logs in Render

**Connection String Format**:
```
postgresql://user:password@host:port/database
```

---

#### Issue: Migration failures
**Symptoms**:
- "Migration failed" errors
- Schema conflicts
- Table doesn't exist errors

**Solutions**:
1. Check migration files are valid
2. Verify database is accessible
3. Review migration history: `alembic history`
4. Check for conflicting migrations
5. Rollback if needed: `alembic downgrade -1`

---

### API Issues

#### Issue: API returns 500 errors
**Symptoms**:
- Internal server errors
- "Something went wrong" messages
- Error tracking shows exceptions

**Solutions**:
1. Check backend logs in Render
2. Verify environment variables are set
3. Check database connectivity
4. Review error tracking (Sentry)
5. Verify API keys are valid

**Common Causes**:
- Missing environment variables
- Database connection issues
- Invalid API keys
- Code errors in handlers

---

#### Issue: CORS errors
**Symptoms**:
- "CORS policy" errors in browser
- API calls blocked
- Preflight requests fail

**Solutions**:
1. Verify `CORS_ORIGINS` includes frontend domain
2. Check backend CORS configuration
3. Verify frontend `VITE_API_URL` is correct
4. Check for typos in domain names

**CORS Configuration**:
```python
# backend/app/core/config.py
CORS_ORIGINS = [
    "https://financeflo.ai",
    "https://ma-saas-platform.onrender.com",
    "http://localhost:5173"  # Development
]
```

---

### Frontend Issues

#### Issue: Page won't load
**Symptoms**:
- Blank page
- "Failed to fetch" errors
- Network errors

**Solutions**:
1. Check browser console for errors
2. Verify API URL is correct
3. Check network connectivity
4. Verify frontend service is running
5. Check for JavaScript errors

---

#### Issue: Assets not loading
**Symptoms**:
- Missing images
- CSS not applied
- 404 errors for assets

**Solutions**:
1. Verify build completed successfully
2. Check asset paths are correct
3. Verify `public/` directory contents
4. Check CDN configuration
5. Clear browser cache

---

### Payment & Billing Issues

#### Issue: Stripe payment fails
**Symptoms**:
- Checkout errors
- Payment not processing
- Webhook errors

**Solutions**:
1. Verify `STRIPE_SECRET_KEY` is set
2. Check `STRIPE_WEBHOOK_SECRET` matches
3. Verify Stripe keys are production keys
4. Check webhook endpoint is accessible
5. Review Stripe dashboard for errors

---

#### Issue: Subscription not updating
**Symptoms**:
- Tier not changing after payment
- Features still gated
- Billing portal shows wrong tier

**Solutions**:
1. Check webhook received successfully
2. Verify webhook handler processed event
3. Check Clerk metadata updated
4. Review subscription service logs
5. Manually sync if needed

---

### Feature-Specific Issues

#### Issue: Financial ratios not calculating
**Symptoms**:
- Ratios show "N/A"
- Calculation errors
- Missing data

**Solutions**:
1. Verify accounting platform connected
2. Check financial data imported
3. Verify data format is correct
4. Check ratio calculation service
5. Review financial connection logs

---

#### Issue: Valuations not generating
**Symptoms**:
- Valuation fails to create
- "Missing assumptions" errors
- Calculation errors

**Solutions**:
1. Verify all required assumptions entered
2. Check cash flow projections are valid
3. Verify discount rate is reasonable
4. Check valuation service is running
5. Review valuation logs

---

#### Issue: Documents not uploading
**Symptoms**:
- Upload fails
- File size errors
- Permission denied

**Solutions**:
1. Check file size limits
2. Verify user has permission
3. Check storage path is writable
4. Verify file type is allowed
5. Review document service logs

---

## Error Codes Reference

### Authentication Errors
- `AUTH_001`: Invalid Clerk key
- `AUTH_002`: Token expired
- `AUTH_003`: CORS blocked
- `AUTH_004`: User not found
- `AUTH_005`: Role insufficient

### Database Errors
- `DB_001`: Connection failed
- `DB_002`: Migration failed
- `DB_003`: Query timeout
- `DB_004`: Constraint violation
- `DB_005`: Transaction failed

### API Errors
- `API_001`: Invalid request
- `API_002`: Missing parameter
- `API_003`: Validation error
- `API_004`: Rate limit exceeded
- `API_005`: Service unavailable

### Payment Errors
- `PAY_001`: Stripe error
- `PAY_002`: Webhook failed
- `PAY_003`: Subscription error
- `PAY_004`: Payment method invalid
- `PAY_005`: Refund failed

---

## Debugging Steps

### 1. Check Logs

**Frontend**:
- Browser DevTools Console
- Network tab for API calls
- Application tab for storage

**Backend**:
- Render service logs
- Application logs
- Error tracking (Sentry)

### 2. Verify Configuration

**Environment Variables**:
- Check all required variables are set
- Verify values are correct
- Check for typos

**Service Status**:
- Verify all services are running
- Check health endpoints
- Review service metrics

### 3. Test Components

**Isolate the Issue**:
- Test API directly (Postman/curl)
- Test frontend in isolation
- Check database directly

**Reproduce**:
- Document steps to reproduce
- Check if issue is consistent
- Verify environment

---

## Getting Help

### Support Channels

- **Email**: helpdesk@financeflo.ai
- **Phone**: +44 7360 539147
- **Support Hours**: Monday - Friday, 9:00 AM - 6:00 PM GMT

### Information to Provide

When reporting issues, include:
1. Error message or code
2. Steps to reproduce
3. Browser/OS information
4. Screenshots if applicable
5. Relevant logs
6. User role and organization

---

## Prevention

### Best Practices

1. **Regular Monitoring**
   - Check health endpoints daily
   - Review error logs weekly
   - Monitor performance metrics

2. **Testing**
   - Test changes in staging first
   - Run test suite before deployment
   - Verify after deployment

3. **Documentation**
   - Keep runbooks updated
   - Document configuration changes
   - Maintain change log

---

**Last Updated**: 2025-11-22

