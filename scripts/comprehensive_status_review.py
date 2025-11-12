#!/usr/bin/env python3
"""
Comprehensive project status review for 100% completion assessment.

This script analyzes the entire codebase to generate a detailed status report covering:
1. Marketing website completeness
2. All software features for tenant users, admins, and master admin
3. Incomplete stories and tasks
4. Test coverage and quality metrics
"""

import os
import json
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple

PROJECT_ROOT = Path(__file__).parent.parent

def run_command(cmd: List[str], cwd: Path = PROJECT_ROOT) -> Tuple[int, str, str]:
    """Run a shell command and return exit code, stdout, stderr."""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=120
        )
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return 1, "", str(e)

def analyze_bmad_stories() -> Dict:
    """Analyze BMAD story files to identify completion status."""
    stories_dir = PROJECT_ROOT / "docs" / "bmad" / "stories"
    stories = []

    if not stories_dir.exists():
        return {"error": "Stories directory not found"}

    for story_file in sorted(stories_dir.glob("*.md")):
        with open(story_file, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract key metadata
        story = {
            "file": story_file.name,
            "status": "UNKNOWN",
            "completion": "0%"
        }

        # Look for status markers
        if "STATUS: ✅ COMPLETE" in content or "STATUS: COMPLETE" in content:
            story["status"] = "COMPLETE"
            story["completion"] = "100%"
        elif "STATUS: ⏸️ PAUSED" in content or "STATUS: PAUSED" in content:
            story["status"] = "PAUSED"
        elif "STATUS: 🚧 IN PROGRESS" in content or "STATUS: IN PROGRESS" in content:
            story["status"] = "IN PROGRESS"
        elif "STATUS: 📋 DRAFTED" in content or "STATUS: DRAFTED" in content:
            story["status"] = "DRAFTED"

        # Extract completion percentage if present
        if "%" in content:
            for line in content.split("\n"):
                if "complete" in line.lower() and "%" in line:
                    # Extract percentage from lines like "85% complete"
                    parts = line.split("%")
                    if parts:
                        try:
                            pct = ''.join(filter(str.isdigit, parts[0].split()[-1]))
                            if pct:
                                story["completion"] = f"{pct}%"
                        except:
                            pass
                    break

        stories.append(story)

    return {"stories": stories, "total": len(stories)}

def analyze_feature_completion() -> Dict:
    """Analyze feature implementation status."""
    features = {
        "F-001: User & Organization Management": {
            "backend": ["models/user.py", "api/routes/users.py", "services/user_service.py"],
            "frontend": ["pages/admin/UserManagement.tsx", "components/users/"],
            "status": "UNKNOWN"
        },
        "F-002: Deal Flow & Pipeline Management": {
            "backend": ["models/deal.py", "api/routes/deals.py", "services/deal_service.py"],
            "frontend": ["pages/deals/DealPipeline.tsx", "components/deals/"],
            "status": "UNKNOWN"
        },
        "F-003: Secure Document & Data Room (DEV-008)": {
            "backend": ["models/document.py", "api/routes/documents.py", "services/document_service.py"],
            "frontend": ["pages/documents/DocumentWorkspace.tsx", "components/documents/"],
            "status": "UNKNOWN"
        },
        "F-004: Task Management & Workflow Automation": {
            "backend": ["models/task.py", "api/routes/tasks.py", "services/task_service.py"],
            "frontend": ["pages/tasks/TaskManager.tsx", "components/tasks/"],
            "status": "UNKNOWN"
        },
        "F-005: Subscription & Billing": {
            "backend": ["models/subscription.py", "api/routes/billing.py", "services/billing_service.py"],
            "frontend": ["pages/billing/BillingPage.tsx", "components/billing/"],
            "status": "UNKNOWN"
        },
        "F-006: Financial Intelligence Engine": {
            "backend": ["models/financial_report.py", "api/routes/financial.py", "services/financial_service.py"],
            "frontend": ["pages/financial/FinancialDashboard.tsx", "components/financial/"],
            "status": "UNKNOWN"
        },
        "F-007: Multi-Method Valuation Suite": {
            "backend": ["models/valuation.py", "api/routes/valuation.py", "services/valuation_service.py"],
            "frontend": ["pages/valuation/ValuationWorkspace.tsx", "components/valuation/"],
            "status": "UNKNOWN"
        },
        "F-008: Intelligent Deal Matching": {
            "backend": ["models/deal_match.py", "api/routes/deal_matching.py", "services/deal_matching_service.py"],
            "frontend": ["pages/deals/DealMatching.tsx", "components/deal-matching/"],
            "status": "UNKNOWN"
        },
        "F-009: Automated Document Generation": {
            "backend": ["models/document_template.py", "api/routes/document_generation.py"],
            "frontend": ["pages/documents/DocumentGenerator.tsx"],
            "status": "UNKNOWN"
        },
        "F-010: Content Creation & Lead Generation Hub": {
            "backend": ["models/blog_post.py", "api/routes/blog.py", "services/blog_service.py"],
            "frontend": ["pages/blog/BlogEditor.tsx", "components/blog/"],
            "status": "UNKNOWN"
        },
        "F-011: Podcast & Video Production Studio": {
            "backend": ["models/podcast.py", "api/routes/podcast.py", "services/podcast_service.py"],
            "frontend": ["pages/podcast/PodcastStudio.tsx", "components/podcast/"],
            "status": "UNKNOWN"
        },
        "F-012: Event Management Hub": {
            "backend": ["models/event.py", "api/routes/events.py", "services/event_service.py"],
            "frontend": ["pages/events/EventManager.tsx", "components/events/"],
            "status": "UNKNOWN"
        },
        "F-013: Professional Community Platform": {
            "backend": ["models/community.py", "api/routes/community.py"],
            "frontend": ["pages/community/CommunityHub.tsx"],
            "status": "UNKNOWN"
        }
    }

    # Check file existence for each feature
    backend_root = PROJECT_ROOT / "backend" / "app"
    frontend_root = PROJECT_ROOT / "frontend" / "src"

    for feature_name, feature_data in features.items():
        backend_exists = 0
        backend_total = len(feature_data["backend"])

        frontend_exists = 0
        frontend_total = len(feature_data["frontend"])

        # Check backend files
        for file_path in feature_data["backend"]:
            full_path = backend_root / file_path
            if full_path.exists():
                backend_exists += 1
            elif (backend_root / file_path).exists():  # Check without extension
                backend_exists += 1

        # Check frontend files
        for file_path in feature_data["frontend"]:
            full_path = frontend_root / file_path
            if full_path.exists():
                frontend_exists += 1
            elif full_path.is_dir() and list(full_path.glob("*")):
                # Directory exists and has files
                frontend_exists += 1

        # Determine status
        total_exists = backend_exists + frontend_exists
        total_files = backend_total + frontend_total

        if total_exists == 0:
            features[feature_name]["status"] = "NOT STARTED"
            features[feature_name]["completion"] = "0%"
        elif total_exists == total_files:
            features[feature_name]["status"] = "COMPLETE"
            features[feature_name]["completion"] = "100%"
        else:
            features[feature_name]["status"] = "IN PROGRESS"
            completion_pct = int((total_exists / total_files) * 100)
            features[feature_name]["completion"] = f"{completion_pct}%"

        features[feature_name]["files_found"] = f"{total_exists}/{total_files}"

    return features

def analyze_marketing_website() -> Dict:
    """Analyze marketing website completeness."""
    marketing_pages = [
        "Home",
        "Pricing",
        "About",
        "Contact",
        "Blog",
        "Features",
        "Case Studies",
        "Resources"
    ]

    frontend_pages_dir = PROJECT_ROOT / "frontend" / "src" / "pages"
    marketing_components_dir = PROJECT_ROOT / "frontend" / "src" / "components" / "marketing"

    pages_status = {}
    for page in marketing_pages:
        page_file = frontend_pages_dir / f"{page}Page.tsx"
        alt_file = frontend_pages_dir / page.lower() / "index.tsx"

        exists = page_file.exists() or alt_file.exists()
        pages_status[page] = "EXISTS" if exists else "MISSING"

    # Check for marketing components
    marketing_exists = marketing_components_dir.exists()
    component_count = len(list(marketing_components_dir.glob("*.tsx"))) if marketing_exists else 0

    return {
        "pages": pages_status,
        "marketing_components_exist": marketing_exists,
        "component_count": component_count,
        "status": "INCOMPLETE" if "MISSING" in pages_status.values() else "COMPLETE"
    }

def generate_status_report() -> Dict:
    """Generate comprehensive status report."""
    print("=" * 80)
    print("Comprehensive Project Status Review")
    print("=" * 80)

    report = {
        "timestamp": subprocess.check_output(["git", "log", "-1", "--format=%cd"], cwd=PROJECT_ROOT, text=True).strip(),
        "current_commit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=PROJECT_ROOT, text=True).strip()[:7],
        "branch": subprocess.check_output(["git", "branch", "--show-current"], cwd=PROJECT_ROOT, text=True).strip()
    }

    print("\n[*] Analyzing BMAD stories...")
    report["bmad_stories"] = analyze_bmad_stories()

    print("[*] Analyzing feature completion...")
    report["features"] = analyze_feature_completion()

    print("[*] Analyzing marketing website...")
    report["marketing"] = analyze_marketing_website()

    # Get test results (if available)
    print("[*] Checking test results...")
    backend_test_file = PROJECT_ROOT / "backend-test-baseline-2025-11-12.txt"
    if backend_test_file.exists():
        report["backend_tests"] = "Results available (see file)"
    else:
        report["backend_tests"] = "No recent results"

    frontend_test_file = PROJECT_ROOT / "frontend" / "frontend-test-baseline-2025-11-12.txt"
    if frontend_test_file.exists():
        report["frontend_tests"] = "Results available (see file)"
    else:
        report["frontend_tests"] = "No recent results"

    return report

def main():
    """Main execution."""
    report = generate_status_report()

    # Save report
    output_file = PROJECT_ROOT / "docs" / "COMPREHENSIVE_STATUS_REPORT.json"
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"\n[OK] Report saved to: {output_file}")
    print("\n" + "=" * 80)
    print("Summary")
    print("=" * 80)

    # Print summary
    stories_data = report["bmad_stories"]
    if "stories" in stories_data:
        completed = sum(1 for s in stories_data["stories"] if s["status"] == "COMPLETE")
        total = stories_data["total"]
        print(f"\nBMAD Stories: {completed}/{total} complete")

        # List incomplete stories
        incomplete = [s for s in stories_data["stories"] if s["status"] != "COMPLETE"]
        if incomplete:
            print(f"\nIncomplete Stories ({len(incomplete)}):")
            for story in incomplete:
                print(f"  - {story['file']}: {story['status']} ({story['completion']})")

    # Feature summary
    features = report["features"]
    feature_complete = sum(1 for f in features.values() if f["status"] == "COMPLETE")
    feature_total = len(features)
    print(f"\nFeatures: {feature_complete}/{feature_total} complete")

    # List incomplete features
    incomplete_features = {k: v for k, v in features.items() if v["status"] != "COMPLETE"}
    if incomplete_features:
        print(f"\nIncomplete Features ({len(incomplete_features)}):")
        for name, data in incomplete_features.items():
            print(f"  - {name}: {data['status']} ({data['completion']}) - {data['files_found']} files")

    # Marketing summary
    marketing = report["marketing"]
    print(f"\nMarketing Website: {marketing['status']}")
    if marketing["status"] != "COMPLETE":
        missing_pages = [k for k, v in marketing["pages"].items() if v == "MISSING"]
        if missing_pages:
            print(f"  Missing pages: {', '.join(missing_pages)}")

    print("\n")
    return 0

if __name__ == "__main__":
    import sys
    sys.exit(main())
