"""
# Audit Event Telemetry Runbook

## Purpose
Document how `resource_scope_violation` audit events flow from API helpers to the monitoring stack so SOC 2 reviewers and SREs can trace cross-tenant probes in near real time.

## Event Sources
- `require_document_access` (deal documents) – emits whenever a request references a document that doesn’t belong to the scoped deal/org.
- `DocumentGenerationService.get_generated_document` – emits when generated-doc APIs receive an id outside the scoped tenant.
- Any future `log_resource_scope_violation` invocation.

## Schema
```json
{
  "action": "resource_scope_violation",
  "actor_user_id": "user-uuid",
  "organization_id": "org-uuid",
  "detail": "document(doc-id) scope violation: expected deal ...",
  "metadata": {
    "resource_type": "document|generated_document",
    "resource_id": "uuid"
  },
  "timestamp": "2025-11-20T10:22:02.123456+00:00"
}
```

## Default Sink
- `backend/app/services/audit_event_sink.py` logs `audit_event` JSON lines via the `audit.events` logger. Setting `AUDIT_EVENT_WEBHOOK_URL` posts JSON to an external webhook (fallback = log on failure).
- Ship these logs to the central ELK/Splunk stack by tailing `backend/logs/app.log`.

### Example promtail snippet
```
scrape_configs:
  - job_name: audit_events
    static_configs:
      - targets: ['localhost']
        labels:
          __path__: /var/log/app.log
          app: apexdeliver-backend
```

## Alerts
- Create a Grafana Loki rule that counts `action="resource_scope_violation"` grouped by `organization_id` per 5m and alert when >3 to detect brute-force attempts.

## Future Work
- Push events to a queue (e.g., SNS) if regulators require out-of-band storage.
- Join with Clerk metadata to enrich `actor_user_email`.
"""
