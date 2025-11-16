#!/usr/bin/env python3
"""Analyze coverage.json and identify files needing tests."""
import json
import sys
from pathlib import Path

def analyze_coverage():
    """Analyze coverage.json and print files needing coverage."""
    coverage_file = Path("coverage.json")
    if not coverage_file.exists():
        print("coverage.json not found. Run: pytest tests --cov=app --cov-report=json")
        sys.exit(1)
    
    with open(coverage_file) as f:
        data = json.load(f)
    
    files = []
    for filepath, file_data in data["files"].items():
        if filepath.startswith("app/"):
            summary = file_data["summary"]
            if summary["percent_covered"] < 100:
                files.append({
                    "file": filepath.replace("\\", "/"),
                    "coverage": summary["percent_covered"],
                    "missing": summary["missing_lines"],
                    "statements": summary["num_statements"],
                })
    
    # Sort by coverage (lowest first), then by missing lines (most first)
    files.sort(key=lambda x: (x["coverage"], -x["missing"]))
    
    print("\n" + "=" * 80)
    print("FILES NEEDING COVERAGE (sorted by coverage %, then missing lines)")
    print("=" * 80)
    print(f"\n{'Coverage':<10} {'Missing':<10} {'Statements':<12} {'File'}")
    print("-" * 80)
    
    total_missing = 0
    for f in files[:50]:  # Top 50
        print(f"{f['coverage']:6.1f}%     {f['missing']:6d}     {f['statements']:6d}       {f['file']}")
        total_missing += f['missing']
    
    print("-" * 80)
    print(f"\nTop 50 files: {total_missing:,} missing lines")
    print(f"Total files with <100% coverage: {len(files)}")
    
    # Group by priority
    critical = [f for f in files if f["coverage"] < 50 and f["missing"] > 20]
    high = [f for f in files if 50 <= f["coverage"] < 80 and f["missing"] > 10]
    medium = [f for f in files if 80 <= f["coverage"] < 100]
    
    print("\n" + "=" * 80)
    print("PRIORITY BREAKDOWN")
    print("=" * 80)
    print(f"\nCRITICAL (<50% coverage, >20 missing lines): {len(critical)} files")
    for f in critical[:10]:
        print(f"  {f['coverage']:6.1f}% ({f['missing']:3d} missing) - {f['file']}")
    
    print(f"\nHIGH (50-80% coverage, >10 missing lines): {len(high)} files")
    for f in high[:10]:
        print(f"  {f['coverage']:6.1f}% ({f['missing']:3d} missing) - {f['file']}")
    
    print(f"\nMEDIUM (80-99% coverage): {len(medium)} files")
    for f in medium[:15]:
        print(f"  {f['coverage']:6.1f}% ({f['missing']:3d} missing) - {f['file']}")

if __name__ == "__main__":
    analyze_coverage()

