#!/usr/bin/env python3
"""
Add STATUS markers to story files that don't have them.
Preserves existing content while adding standardized STATUS headers.
"""

import os
import re
from pathlib import Path

# Define stories that need STATUS headers with their completion status
STORIES_TO_UPDATE = {
    # Complete stories
    "DEV-002-COMPLETION-SUMMARY.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-frontend-auth-complete.txt",
        "completion": "100% - Frontend authentication fully integrated with Clerk",
    },
    "DEV-003-PROGRESS-SUMMARY.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-protected-routing-complete.txt",
        "completion": "100% - Protected routing and layout system complete",
    },
    "DEV-003-protected-routing.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-protected-routing-complete.txt",
        "completion": "100% - All protected routes working with Clerk",
    },
    "DEV-005-rbac-implementation.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-rbac-complete.txt",
        "completion": "100% - Role-based access control fully implemented",
    },
    "DEV-006-BACKEND-COMPLETION.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-backend-admin-complete.txt",
        "completion": "100% - Master Admin Portal backend complete (50/50 tests)",
    },
    "DEV-006-COMPLETION-SUMMARY.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-backend-admin-complete.txt",
        "completion": "100% - Master Admin Portal backend and frontend complete",
    },
    "DEV-006-master-admin-portal.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-master-admin-portal-complete.txt",
        "completion": "100% - Master Admin Portal fully functional",
    },
    "DEV-007-COMPLETION-SUMMARY.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-deal-pipeline-complete.txt",
        "completion": "100% - Deal Pipeline CRUD operations complete",
    },
    "DEV-008-COMPLETION-SUMMARY.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-25-document-room-complete.txt",
        "completion": "100% - Secure Document & Data Room complete",
    },
    "DEV-008-document-room-gap-analysis.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-25-document-room-gap-analysis.txt",
        "completion": "100% - Gap analysis complete, all features implemented",
    },
    "DEV-008-secure-document-data-room.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-25-document-room-complete.txt",
        "completion": "100% - Document room with Cloudflare R2 integration complete",
    },
    "DEV-009-subscription-billing.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-26-subscription-billing-complete.txt",
        "completion": "100% - Stripe subscription & billing fully integrated (111 backend + 139 frontend tests)",
    },
    "DEV-011-subscription-billing.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-26-subscription-billing-complete.txt",
        "completion": "100% - Duplicate of DEV-009, fully complete",
    },
    "DEV-011-valuation-suite-gap-analysis.md": {
        "status": "🔄 IN PROGRESS",
        "evidence": "docs/tests/2025-11-11-valuation-suite-backend-complete.txt",
        "completion": "95% - Backend complete, frontend polish needed (export, charts, scenarios)",
    },
    "DEV-012-task-automation-audit.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-11-11-task-automation-complete.txt",
        "completion": "100% - Audit complete, all features verified",
    },
    "DEV-016-podcast-studio-audit.md": {
        "status": "🔄 IN PROGRESS",
        "evidence": "docs/tests/2025-11-12-podcast-studio-routing-tests.txt",
        "completion": "90% - Backend complete, 4 frontend gating tests failing",
    },
    "DEV-018-deal-matching-audit.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-11-11-deal-matching-complete.txt",
        "completion": "100% - Intelligent deal matching fully verified",
    },
    "DEV-019-blog-api-500-fix.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-11-12-blog-api-fix-complete.txt",
        "completion": "100% - Blog API 500 errors fixed",
    },
    "OPS-004-platform-status-check.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-11-12-platform-status-complete.txt",
        "completion": "100% - Platform status check complete",
    },
    "OPS-005-platform-status-audit.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-11-12-platform-status-audit-complete.txt",
        "completion": "100% - Comprehensive platform audit complete",
    },
    "master-admin/MAP-001-foundation.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-master-admin-backend-complete.txt",
        "completion": "100% - Master Admin Portal foundation complete",
    },
    "master-admin/MAP-002-activity-tracker-ui.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/tests/2025-10-24-master-admin-ui-complete.txt",
        "completion": "100% - Activity tracker UI complete",
    },
    "MARK-002-marketing-audit-2025-11-12.md": {
        "status": "✅ COMPLETE",
        "evidence": "docs/marketing/audits/2025-11-12/audit-summary.md",
        "completion": "100% - Marketing audit complete, all accessibility and performance metrics verified",
    },
}


def has_status_header(content: str) -> bool:
    """Check if file already has a STATUS header."""
    lines = content.split('\n')[:20]  # Check first 20 lines
    for line in lines:
        if line.strip().startswith('**STATUS'):
            return True
    return False


def add_status_header(filepath: Path, info: dict) -> None:
    """Add STATUS header to a file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if has_status_header(content):
        print(f"[SKIP] {filepath.name} already has STATUS header")
        return

    # Find the first markdown header
    lines = content.split('\n')
    header_index = 0
    for i, line in enumerate(lines):
        if line.startswith('#'):
            header_index = i
            break

    # Insert STATUS header after the main title
    status_lines = [
        "",
        f"**STATUS**: {info['status']}",
        f"**Evidence**: {info['evidence']}",
        f"**Last Updated**: 2025-11-13",
        f"**Completion**: {info['completion']}",
        ""
    ]

    new_lines = (
        lines[:header_index + 1] +
        status_lines +
        lines[header_index + 1:]
    )

    new_content = '\n'.join(new_lines)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"[DONE] Added STATUS header to {filepath.name}")


def main():
    """Add STATUS headers to all story files that need them."""
    stories_dir = Path(__file__).parent.parent / "docs" / "bmad" / "stories"

    if not stories_dir.exists():
        print(f"❌ Stories directory not found: {stories_dir}")
        return

    updated_count = 0
    skipped_count = 0

    for filename, info in STORIES_TO_UPDATE.items():
        filepath = stories_dir / filename

        if not filepath.exists():
            print(f"[WARN] File not found: {filename}")
            continue

        try:
            add_status_header(filepath, info)
            updated_count += 1
        except Exception as e:
            print(f"[ERROR] Error processing {filename}: {e}")

    print(f"\n[SUMMARY]")
    print(f"   Updated: {updated_count} files")
    print(f"   Skipped: {skipped_count} files (already have STATUS)")


if __name__ == "__main__":
    main()
