# Session 2025-11-13T11 – Phase 1 RED Specs (Event Hub & Community Platform)

**Owner**: Codex  
**Methodology**: BMAD v6-alpha – RED → GREEN → REFACTOR → DOCUMENT  
**Scope**: Define the initial RED test cases + implementation outline for the remaining Phase 1/2 workstreams before writing code.

---

## Event Management Hub (F-012)

### Backend RED Tests
1. `test_events_api.py::test_export_attendees_requires_active_ticket_tiers`
   - Given an event with no paid tiers, `GET /events/{event_id}/attendees/export` should return 400 with error `ticket_tier_required`.
2. `test_events_api.py::test_attendee_export_generates_signed_url`
   - Create event + registrations, trigger export; expect background job stub to create CSV blob + signed URL persisted in `EventExportJob`.
3. `test_event_service.py::test_capacity_enforced_across_sessions`
   - Register attendees concurrently across multiple sessions sharing capacity pool; ensure service raises `CapacityExceededError` once global limit reached.
4. `test_event_service.py::test_ticket_payment_webhook_updates_registration`
   - Simulate Stripe webhook payload; expect registration status to flip from `pending_payment` to `confirmed` and audit row recorded.
5. `test_event_sessions_api.py::test_session_feedback_requires_registration`
   - POST `/events/{event_id}/sessions/{session_id}/feedback` should 403 for users without confirmed registration.

### Backend Implementation Notes
- Models: `Event`, `EventSession`, `TicketTier`, `EventRegistration`, `EventExportJob` (Alembic migration + indexes on `organization_id`, `starts_at`).
- Services: extend `EventService` with `queue_attendee_export`, `process_ticket_payment`, `record_feedback`.
- Integrations: Stripe checkout session stub (existing `billing` module) reused for paid tiers; use Redis/async queue placeholder for export job.

### Frontend RED Specs
1. `frontend/src/pages/events/__tests__/EventDashboard.attendees.test.tsx`
   - When clicking “Export attendees”, expect API mock called and success toast once `export_status === 'ready'`.
2. `frontend/src/pages/events/__tests__/EventCreator.accessibility.test.tsx`
   - Ensure all form controls have accessible labels (fixing prior Axe failures) and that validation errors render `aria-live` updates.
3. `frontend/src/pages/events/__tests__/EventDetails.sessions.test.tsx`
   - Add scenario covering waitlisted attendee + capacity badge.
4. `frontend/src/pages/events/__tests__/TicketCheckout.test.tsx`
   - Mock Stripe checkout; ensure CTA disabled for users below Pro tier and shows upgrade modal.

### Frontend Implementation Notes
- `EventDashboard` to poll `/events/{id}/attendees/export` endpoint until `status=ready`, then download signed URL.
- `TicketCheckoutModal` integrates with `billingService.createEventCheckoutSession` (new API client).
- Add `useEventSocket` hook (stub) for live capacity updates (optional, behind feature flag).

---

## Community Platform (F-013)

### Backend RED Tests
1. `test_community_api.py::test_create_post_requires_entitlement`
   - Users without Community feature flag receive 403.
2. `test_community_api.py::test_feed_returns_followed_org_posts_first`
   - Feed should prioritize posts from followed organizations before global stream.
3. `test_community_api.py::test_threaded_comments_depth_limit`
   - Posting nested comment beyond depth 3 returns 400.
4. `test_community_api.py::test_reactions_increment_counters`
   - PATCH `/community/posts/{id}/react` increments `like` count and stores per-user reaction to prevent duplicates.
5. `test_community_notifications.py::test_follow_notification_enqueued`
   - Following an organization enqueues notification object (mock queue) and persists unread count for target user.

### Backend Implementation Notes
- Models: `CommunityPost`, `CommunityComment`, `CommunityReaction`, `CommunityFollow`, `CommunityNotification` with multi-tenant org scoping.
- Services: `CommunityService` handles feed query (pagination, filters), reaction toggles, follow/unfollow, notification fan-out.
- Router: `/community/posts`, `/community/comments`, `/community/reactions`, `/community/follows`, `/community/feed`, `/community/notifications`.
- Background jobs: placeholder queue interface for notifications (documented for future worker).

### Frontend RED Specs
1. `frontend/src/pages/community/__tests__/CommunityFeed.test.tsx`
   - Renders combined feed with pinned organization posts + global posts, ensures skeleton states while fetching.
2. `frontend/src/components/community/__tests__/CreatePostModal.test.tsx`
   - Validates markdown editor, image attachment limit, and entitlements (Pro+ only).
3. `frontend/src/components/community/__tests__/CommentThread.test.tsx`
   - Ensures nested comments collapse/expand and depth limit message appears.
4. `frontend/src/components/community/__tests__/ReactionBar.test.tsx`
   - Clicking reaction toggles optimistic count update and handles API failure rollback.
5. `frontend/src/pages/community/__tests__/ModerationDashboard.test.tsx`
   - Covers flagging workflow + bulk moderation actions per organization admin.

### Frontend Implementation Notes
- Routes: `/community`, `/community/:postId`, `/community/moderation`, `/community/profile/:username`.
- State: `useCommunityStore` (Zustand) caches feed, comments, reactions, and notifications.
- API: `frontend/src/services/api/community.ts` handles posts, comments, reactions, follows, notifications.
- Reuse `ActionDrawer` + `RichTextEditor` components for CreatePost modal.

---

## Sign-off Checklist
- [ ] RED tests checked in (failing) before implementation per BMAD policy.
- [ ] Update `docs/bmad/stories/DEV-020.md`, `DEV-021.md` with STATUS + new acceptance criteria referencing these specs.
- [ ] Reference this session doc in `docs/bmad/BMAD_PROGRESS_TRACKER.md` when GREEN commits land.
