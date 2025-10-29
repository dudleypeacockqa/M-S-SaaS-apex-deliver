# Document Editor User Guide

The document editor combines collaborative rich text editing, reusable templates, and AI assistance to accelerate M&A document production.

## Getting Started
1. Navigate to **Deals › Documents** and open a document in the editor (URL pattern: `/deals/:dealId/documents/:documentId/editor`).
2. The title field auto-saves alongside the main editor when changes are made.
3. Begin editing inside the rich text surface; formatting controls are available in the toolbar.

## Templates
- Browse templates from the right-hand panel.
- Select **Use template {name}** to merge template content into the current document. Template metadata (category, industries, tags) is displayed to help pick the right starting point.

## AI Suggestions
- Provide optional context in the **AI context** field to steer recommendations.
- Click **Regenerate suggestions** to fetch new ideas at any time.
- Use **Accept** to insert the suggestion into the editor, or **Reject** to dismiss it. Accepted suggestions trigger an auto-save.

## Exporting
- Choose format (PDF, DOCX, HTML) and adjust margins, fonts, or cover-page inclusion.
- Press **Download document** to generate and download the file. Export requests reuse the latest saved content.

## Version History
- Review prior revisions in the **History** panel.
- Select **Restore version {label}** to load previous content into the editor. Restoring creates a fresh auto-save to persist the change.

## Collaboration & Shortcuts
- The **Active collaborators** list shows users currently viewing/editing (powered by the presence subscription endpoint).
- Keyboard shortcut reference is available via **Show keyboard shortcuts**, covering bold/italic toggles, snapshot saves, and history navigation.

## Auto-save & Retry
- Edits auto-save after each change (de-bounced). Status appears under the title.
- If a save fails, an inline **Retry save** control is provided; clicking it replays the latest content to the API.

## Troubleshooting
- Export errors: confirm API endpoint `/api/v1/documents/{id}/export` responds; retries use the same payload.
- Missing templates: Templates panel fetches `/api/v1/documents/templates`; ensure backend returns available items.
- Presence not updating: verify SSE endpoint `/api/v1/documents/{id}/presence` is reachable; the UI will gracefully degrade to the last known list.
