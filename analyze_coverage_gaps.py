#!/usr/bin/env python3
"""
Analyze coverage gaps and generate test plan to reach 100% coverage.

Reads the coverage report and identifies:
1. Files with <90% coverage
2. Specific uncovered lines
3. Recommended tests to add
"""

import subprocess
import re
import json
from pathlib import Path

def run_coverage_report():
    """Run pytest coverage and capture output."""
    print("Running coverage analysis...")
    result = subprocess.run(
        ["python", "-m", "pytest", "--cov=app", "--cov-report=term-missing", "-q"],
        cwd="backend",
        capture_output=True,
        text=True,
        timeout=600
    )
    return result.stdout + result.stderr

def parse_coverage_output(output):
    """Parse coverage output to extract file-level coverage."""
    files = []

    # Find the coverage table
    lines = output.split('\n')
    in_table = False

    for line in lines:
        # Look for coverage lines like: app/services/deal_service.py    100    20    80%    10-15, 20-25
        match = re.match(r'^(app/[^\s]+\.py)\s+(\d+)\s+(\d+)\s+(\d+)%(?:\s+(.+))?$', line.strip())
        if match:
            filepath, statements, missing, coverage, missing_lines = match.groups()
            files.append({
                'path': filepath,
                'statements': int(statements),
                'missing': int(missing),
                'coverage': int(coverage),
                'missing_lines': missing_lines or ''
            })

    return files

def identify_priority_files(files, threshold=90):
    """Identify files below coverage threshold."""
    low_coverage = [f for f in files if f['coverage'] < threshold]
    low_coverage.sort(key=lambda x: (x['coverage'], -x['statements']))
    return low_coverage

def generate_test_plan(priority_files):
    """Generate actionable test plan."""
    plan = {
        'total_files': len(priority_files),
        'total_missing_statements': sum(f['missing'] for f in priority_files),
        'categories': {}
    }

    # Categorize by module
    for file in priority_files:
        parts = file['path'].split('/')
        if len(parts) >= 2:
            category = parts[1]  # e.g., 'services', 'api', 'models'
        else:
            category = 'core'

        if category not in plan['categories']:
            plan['categories'][category] = []

        plan['categories'][category].append(file)

    return plan

def print_test_plan(plan):
    """Print human-readable test plan."""
    print("\n" + "=" * 80)
    print("COVERAGE GAP ANALYSIS - Path to 100%")
    print("=" * 80)
    print()

    print(f"Total files below 90% coverage: {plan['total_files']}")
    print(f"Total missing statements: {plan['total_missing_statements']}")
    print()

    for category, files in sorted(plan['categories'].items()):
        print(f"\n### {category.upper()} ({len(files)} files)")
        print("-" * 80)

        for file in files[:10]:  # Show top 10 per category
            print(f"{file['coverage']:3d}% | {file['missing']:4d} missing | {file['path']}")
            if file['missing_lines']:
                lines_preview = file['missing_lines'][:60]
                print(f"       Lines: {lines_preview}{'...' if len(file['missing_lines']) > 60 else ''}")

        if len(files) > 10:
            print(f"       ... and {len(files) - 10} more files")

def main():
    print("Coverage Gap Analysis Tool")
    print("=" * 80)
    print()

    # Run coverage
    output = run_coverage_report()

    # Parse results
    files = parse_coverage_output(output)

    if not files:
        print("ERROR: Could not parse coverage output")
        print("\nRaw output:")
        print(output[-2000:])  # Last 2000 chars
        return 1

    print(f"\nAnalyzed {len(files)} source files")

    # Find overall coverage
    total_statements = sum(f['statements'] for f in files)
    total_missing = sum(f['missing'] for f in files)
    overall_coverage = (total_statements - total_missing) / total_statements * 100 if total_statements > 0 else 0

    print(f"Overall coverage: {overall_coverage:.2f}%")
    print(f"Statements: {total_statements:,} total, {total_missing:,} missing")
    print()

    # Identify priority files
    priority_files = identify_priority_files(files, threshold=90)

    # Generate and print plan
    plan = generate_test_plan(priority_files)
    print_test_plan(plan)

    # Save detailed report
    report_path = Path("docs/tests/2025-11-17-coverage-gaps.json")
    report_path.parent.mkdir(parents=True, exist_ok=True)

    with open(report_path, 'w') as f:
        json.dump({
            'overall_coverage': overall_coverage,
            'total_statements': total_statements,
            'total_missing': total_missing,
            'files': files,
            'priority_files': priority_files,
            'plan': plan
        }, f, indent=2)

    print(f"\n\nDetailed report saved to: {report_path}")

    return 0

if __name__ == "__main__":
    import sys
    sys.exit(main())
