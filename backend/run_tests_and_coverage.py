#!/usr/bin/env python3
"""
Comprehensive test runner and coverage analyzer
Runs tests and generates detailed reports
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
    print("TDD Test Execution and Coverage Analysis")
    print("="*60)
    
    results = {}
    
    # 1. Run new error path tests
    print("\n[STEP 1] Running new document service error path tests...")
    success, stdout, stderr = run_command(
        [sys.executable, "-m", "pytest", 
         "tests/test_document_service_error_paths.py", 
         "-v", "--tb=short"],
        "Document Service Error Path Tests"
    )
    results['error_path_tests'] = {
        'success': success,
        'stdout': stdout,
        'stderr': stderr
    }
    
    if success:
        print("✅ All error path tests passed!")
    else:
        print("❌ Some error path tests failed. Check output above.")
    
    # 2. Run coverage for document service
    print("\n[STEP 2] Measuring document service coverage...")
    success, stdout, stderr = run_command(
        [sys.executable, "-m", "pytest",
         "--cov=app.services.document_service",
         "--cov-report=term-missing",
         "tests/test_document_service*.py",
         "-q"],
        "Document Service Coverage"
    )
    results['document_service_coverage'] = {
        'success': success,
        'stdout': stdout,
        'stderr': stderr
    }
    
    # 3. Run full backend coverage
    print("\n[STEP 3] Measuring full backend coverage...")
    success, stdout, stderr = run_command(
        [sys.executable, "-m", "pytest",
         "--cov=app",
         "--cov-report=json:coverage_backend.json",
         "--cov-report=term",
         "-q"],
        "Full Backend Coverage"
    )
    results['full_coverage'] = {
        'success': success,
        'stdout': stdout,
        'stderr': stderr
    }
    
    # 4. Parse coverage JSON
    coverage_file = backend_dir / "coverage_backend.json"
    if coverage_file.exists():
        print("\n[STEP 4] Parsing coverage results...")
        try:
            with open(coverage_file) as f:
                coverage_data = json.load(f)
            
            total = coverage_data.get("totals", {})
            covered_lines = total.get("covered_lines", 0)
            num_statements = total.get("num_statements", 0)
            
            if num_statements > 0:
                percentage = (covered_lines / num_statements) * 100
                print(f"\n📊 Coverage Summary:")
                print(f"   Covered Lines: {covered_lines:,}")
                print(f"   Total Statements: {num_statements:,}")
                print(f"   Coverage: {percentage:.2f}%")
                print(f"   Target: ≥90%")
                
                if percentage >= 90:
                    print("   ✅ Coverage target met!")
                else:
                    gap = 90 - percentage
                    print(f"   ⚠️  Need +{gap:.2f}% to reach target")
                    print(f"   Need to cover ~{int((gap/100) * num_statements)} more lines")
                
                results['coverage_summary'] = {
                    'percentage': percentage,
                    'covered_lines': covered_lines,
                    'total_statements': num_statements,
                    'target_met': percentage >= 90
                }
            else:
                print("⚠️  Could not parse coverage data")
        except Exception as e:
            print(f"⚠️  Error parsing coverage: {e}")
    else:
        print("⚠️  Coverage file not found")
    
    # 5. Save results
    results_file = backend_dir / "test_results.json"
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n✅ Results saved to {results_file}")
    
    print("\n" + "="*60)
    print("Test Execution Complete")
    print("="*60)
    
    return 0 if results.get('error_path_tests', {}).get('success', False) else 1

if __name__ == "__main__":
    sys.exit(main())

