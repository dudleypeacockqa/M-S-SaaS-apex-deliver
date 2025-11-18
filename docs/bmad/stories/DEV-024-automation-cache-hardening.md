# DEV-024: Automation Email Delivery & Caching Hardening

**STATUS:** ⏳ PLANNED  
**Story ID:** DEV-024  
**Epic:** F-005 Automation & Workflow  
**Priority:** Medium-High  
**Sprint Target:** V1.2 Backend Wave  
**Created:** 2025-11-18

---

## Story
As a **Growth Ops Lead**, I need automated campaigns to actually send emails and caching layers to be fully verified, so that **marketing and task reminders operate reliably at scale**.

### Acceptance Criteria
1. `campaign_tasks.enqueue_campaign_emails` calls the chosen email provider (SendGrid/Resend) instead of leaving a TODO.  
2. Email payloads include org scoping, user personalization, and are retried with exponential backoff on transient errors.  
3. `backend/tests/test_caching.py` gains coverage for cache HIT, MISS, bypass headers, and POST handling.  
4. Caching layer ensures POST/PUT/PATCH/DELETE are never cached, and `Cache-Control: no-store` bypasses the layer.  
5. Observability logs (structured) emitted for cache hits/misses and email send outcomes.

---

## References
- `backend/app/tasks/campaign_tasks.py` line ~88.  
- `backend/tests/test_caching.py` lines 152-172 contain TODOs.  
- `backend/app/core/cache.py` (or equivalent) for instrumentation hooks.

---

## TDD Plan
1. **Red:** Add failing tests covering the missing scenarios in `test_caching.py` plus Celery/email integration tests using `resend_mock` or `sendgrid_mock`.  
2. **Green:** Implement email sending logic with provider SDK (re-use `app.services.email_service`). Guard with feature flag/testing mode.  
3. **Refactor:** Extract common caching assertions, add logging helper, ensure linting passes.

### Test Cases
- `test_cache_hit_returns_cached_response`  
- `test_cache_miss_populates_store`  
- `test_cache_bypass_header_disables_cache`  
- `test_post_requests_are_not_cached`  
- `test_campaign_email_task_calls_provider`

---

## Deliverables
- Updated campaign tasks module.  
- Expanded caching tests + possible new fixtures.  
- Documentation note in `docs/architecture.md` (Implementation Patterns / Consistency rules).  
- Logging spec update if needed.

---

## Dependencies
- Requires valid email provider credentials in settings (mock in tests).  
- Works alongside DEV-022/023 for shared audit/logging utilities.

---

_Owner: Backend Engineer / DevOps._

