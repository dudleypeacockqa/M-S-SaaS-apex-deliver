#!/usr/bin/env python3
"""
Completion Status Verification Script
Verifies actual implementation status vs documented status
"""
import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

def check_file_exists(filepath: str) -> bool:
    """Check if a file exists"""
    return Path(filepath).exists()

def check_test_file(test_file: str) -> bool:
    """Check if test file exists"""
    backend_tests = backend_path / "tests" / test_file
    frontend_tests = Path(__file__).parent.parent / "frontend" / "src" / test_file
    return backend_tests.exists() or frontend_tests.exists()

def main():
    """Main verification function"""
    print("=" * 80)
    print("COMPLETION STATUS VERIFICATION")
    print("=" * 80)
    print()
    
    # Event Hub (DEV-020)
    print("EVENT HUB (DEV-020):")
    print("-" * 40)
    event_files = [
        "backend/app/models/event.py",
        "backend/app/services/event_service.py",
        "backend/app/api/routes/events.py",
        "backend/tests/api/test_event_api.py",
        "frontend/src/pages/events/EventDashboard.tsx",
        "frontend/src/services/api/events.ts",
    ]
    event_complete = all(check_file_exists(f) for f in event_files)
    print(f"  Backend models: {check_file_exists('backend/app/models/event.py')}")
    print(f"  Backend service: {check_file_exists('backend/app/services/event_service.py')}")
    print(f"  Backend API: {check_file_exists('backend/app/api/routes/events.py')}")
    print(f"  Backend tests: {check_file_exists('backend/tests/api/test_event_api.py')}")
    print(f"  Frontend dashboard: {check_file_exists('frontend/src/pages/events/EventDashboard.tsx')}")
    print(f"  Frontend API client: {check_file_exists('frontend/src/services/api/events.ts')}")
    
    # Check for export functionality
    events_route = backend_path / "app" / "api" / "routes" / "events.py"
    has_export = False
    if events_route.exists():
        content = events_route.read_text()
        has_export = "export_registrations" in content or "export" in content.lower()
    print(f"  Attendee export: {has_export}")
    print(f"  Overall: {'✅ COMPLETE' if event_complete and has_export else '⚠️ PARTIAL'}")
    print()
    
    # Community Platform (DEV-021)
    print("COMMUNITY PLATFORM (DEV-021):")
    print("-" * 40)
    community_files = [
        "backend/app/models/community.py",
        "backend/app/services/community_service.py",
        "backend/app/api/routes/community.py",
        "backend/tests/test_community_models.py",
        "backend/tests/test_community_service.py",
        "frontend/src/pages/community/CommunityFeed.tsx",
        "frontend/src/services/api/community.ts",
    ]
    community_complete = all(check_file_exists(f) for f in community_files)
    for f in community_files:
        exists = check_file_exists(f)
        name = Path(f).name
        print(f"  {name}: {exists}")
    print(f"  Overall: {'✅ COMPLETE' if community_complete else '⚠️ PARTIAL'}")
    print()
    
    # Document Generation (DEV-014/F-009)
    print("DOCUMENT GENERATION (DEV-014/F-009):")
    print("-" * 40)
    doc_gen_files = [
        "backend/app/models/document_generation.py",
        "backend/app/services/document_generation_service.py",
        "backend/app/api/routes/document_generation.py",
        "frontend/src/pages/documents/DocumentEditor.tsx",
    ]
    doc_gen_complete = all(check_file_exists(f) for f in doc_gen_files)
    for f in doc_gen_files:
        exists = check_file_exists(f)
        name = Path(f).name
        print(f"  {name}: {exists}")
    print(f"  Overall: {'✅ COMPLETE' if doc_gen_complete else '⚠️ PARTIAL'}")
    print()
    
    print("=" * 80)
    print("VERIFICATION COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    main()

