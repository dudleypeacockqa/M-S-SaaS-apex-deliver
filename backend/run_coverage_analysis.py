#!/usr/bin/env python3
"""
Coverage Analysis Script for TDD Execution
Runs tests and generates coverage reports to identify gaps
"""
import subprocess
import sys
import json
from pathlib import Path

def run_command(cmd, description):
    """Run a command and return output"""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(cmd)}")
    print('='*60)
    
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent
    )
    
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr, file=sys.stderr)
    
    return result.returncode == 0, result.stdout, result.stderr

def main():
    """Main execution"""
    backend_dir = Path(__file__).parent
    
    print("="*60)
    print("TDD Coverage Analysis - Backend Test Suite")
    print("="*60)
    
    # 1. Run new document service error path tests
    print("\n[STEP 1] Running new document service error path tests...")
    success, stdout, stderr = run_command(
        ["python", "-m", "pytest", "tests/test_document_service_error_paths.py", "-v", "--tb=short"],
        "Document Service Error Path Tests"
    )
    
    if not success:
        print("⚠️  Some tests failed. Check output above.")
    else:
        print("✅ All document service error path tests passed!")
    
    # 2. Run full test suite with coverage
    print("\n[STEP 2] Running full test suite with coverage...")
    success, stdout, stderr = run_command(
        ["python", "-m", "pytest", "--cov=app", "--cov-report=term", "--cov-report=json:coverage_full.json", "-q"],
        "Full Test Suite with Coverage"
    )
    
    # 3. Parse coverage JSON if it exists
    coverage_file = backend_dir / "coverage_full.json"
    if coverage_file.exists():
        print("\n[STEP 3] Parsing coverage results...")
        with open(coverage_file) as f:
            coverage_data = json.load(f)
        
        total = coverage_data.get("totals", {})
        covered_lines = total.get("covered_lines", 0)
        num_statements = total.get("num_statements", 0)
        
        if num_statements > 0:
            percentage = (covered_lines / num_statements) * 100
            print(f"\n📊 Coverage Summary:")
            print(f"   Covered Lines: {covered_lines}")
            print(f"   Total Statements: {num_statements}")
            print(f"   Coverage: {percentage:.2f}%")
            print(f"   Target: ≥90%")
            
            if percentage >= 90:
                print("   ✅ Coverage target met!")
            else:
                gap = 90 - percentage
                print(f"   ⚠️  Need +{gap:.2f}% to reach target")
        else:
            print("⚠️  Could not parse coverage data")
    else:
        print("⚠️  Coverage file not found")
    
    # 4. Generate detailed coverage report for document service
    print("\n[STEP 4] Generating detailed document service coverage...")
    run_command(
        ["python", "-m", "pytest", "--cov=app.services.document_service", "--cov-report=term-missing", "tests/test_document_service*.py", "-q"],
        "Document Service Detailed Coverage"
    )
    
    print("\n" + "="*60)
    print("Coverage Analysis Complete")
    print("="*60)
    print("\nNext Steps:")
    print("1. Review coverage gaps above")
    print("2. Write TDD tests for uncovered paths")
    print("3. Re-run coverage analysis to verify improvement")
    print("4. Update BMAD documentation with results")

if __name__ == "__main__":
    main()

