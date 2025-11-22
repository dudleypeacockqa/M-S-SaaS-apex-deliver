#!/usr/bin/env python3
"""Scrub exposed database credentials from repository files."""

import re
import sys
from pathlib import Path

# Configure stdout for UTF-8 on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# Exposed password to scrub
EXPOSED_PASSWORD = "[REDACTED-ROTATED-2025-11-11]"
PLACEHOLDER = "[REDACTED-ROTATED-2025-11-11]"

# Files to scrub
FILES_TO_SCRUB = [
    "docs/DATABASE_RECOVERY_INDEX.md",
    "docs/DATABASE_RECOVERY_PROCEDURE.md",
    "docs/DEPLOYMENT-COMPLETE-RECORD.md",
    "docs/DEPLOYMENT-SESSION-SUMMARY.md",
    "docs/NEXT_STEPS_FOR_USER.md",
    "docs/PRODUCTION_DATABASE_ANALYSIS.md",
    "docs/SECURITY_INCIDENT_2025-11-10.md",
    "docs/SESSION_SUMMARY_2025-11-10.md",
    "docs/bmad/BMAD_PROGRESS_TRACKER.md",
    "scripts/generate_sitemap.py",
    "scripts/import_blog_production.py",
    "FinanceFlo Environment Variables - Master Reference.md",
    "ENV-CONFIGURATION-STRATEGY.md",
    "RENDER-BACKEND-ENV-UPDATES.md",
]


def scrub_file(file_path: Path) -> tuple[bool, int]:
    """
    Scrub credentials from a single file.

    Returns:
        (modified: bool, replacement_count: int)
    """
    if not file_path.exists():
        print(f"⚠️  File not found: {file_path}")
        return False, 0

    try:
        content = file_path.read_text(encoding="utf-8")
        original_content = content

        # Count occurrences
        count = content.count(EXPOSED_PASSWORD)

        if count == 0:
            print(f"✅ Clean: {file_path} (no credentials found)")
            return False, 0

        # Replace all occurrences
        content = content.replace(EXPOSED_PASSWORD, PLACEHOLDER)

        # Write back
        file_path.write_text(content, encoding="utf-8")

        print(f"🔒 Scrubbed: {file_path} ({count} replacements)")
        return True, count

    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False, 0


def main():
    """Execute credential scrubbing."""
    print("=" * 70)
    print("CREDENTIAL SCRUBBING - P0 Security Hygiene")
    print("=" * 70)
    print()

    root = Path(__file__).parent.parent
    total_files_modified = 0
    total_replacements = 0

    for file_rel_path in FILES_TO_SCRUB:
        file_path = root / file_rel_path
        modified, count = scrub_file(file_path)

        if modified:
            total_files_modified += 1
            total_replacements += count

    print()
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Files scanned:   {len(FILES_TO_SCRUB)}")
    print(f"Files modified:  {total_files_modified}")
    print(f"Total replacements: {total_replacements}")
    print()
    print("✅ Credential scrubbing complete")
    print()
    print("NEXT STEPS:")
    print("1. Review changes: git diff")
    print("2. Commit changes: git add . && git commit -m 'security(credentials): scrub exposed database password'")
    print("3. Push to remote: git push origin main")
    print("4. Rotate database credentials in Render Dashboard")
    print("=" * 70)


if __name__ == "__main__":
    main()
