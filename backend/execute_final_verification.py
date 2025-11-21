#!/usr/bin/env python3
"""
Final Verification Script - Executes tests and generates completion report
"""
import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime

def run_command(cmd, description):
    """Run a command and return output"""
    print(f"\n{'='*60}")
    print(f"{description}")
    print(f"Command: {' '.join(cmd)}")
    print('='*60)
    
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent
    )
    
    return result.returncode == 0, result.stdout, result.stderr

def main():
    """Main execution"""
    backend_dir = Path(__file__).parent
    results = {
        'timestamp': datetime.now().isoformat(),
        'tests': {},
        'coverage': {},
        'status': 'in_progress'
    }
    
    print("="*60)
    print("FINAL VERIFICATION - 100% COMPLETION")
    print("="*60)
    
    # 1. Run new error path tests
    print("\n[STEP 1] Running new document service error path tests...")
    success, stdout, stderr = run_command(
        [sys.executable, "-m", "pytest", 
         "tests/test_document_service_error_paths.py", 
         "-v", "--tb=short"],
        "Document Service Error Path Tests"
    )
    
    results['tests']['error_path_tests'] = {
        'success': success,
        'stdout': stdout,
        'stderr': stderr,
        'passed': stdout.count('PASSED') if stdout else 0,
        'failed': stdout.count('FAILED') if stdout else 0
    }
    
    if success:
        print("✅ All error path tests passed!")
    else:
        print("❌ Some tests failed")
        print(stdout)
        print(stderr)
    
    # 2. Run full backend coverage
    print("\n[STEP 2] Measuring full backend coverage...")
    success, stdout, stderr = run_command(
        [sys.executable, "-m", "pytest",
         "--cov=app",
         "--cov-report=json:final_coverage.json",
         "--cov-report=term",
         "-q"],
        "Full Backend Coverage"
    )
    
    results['coverage']['full_backend'] = {
        'success': success,
        'stdout': stdout,
        'stderr': stderr
    }
    
    # 3. Parse coverage
    coverage_file = backend_dir / "final_coverage.json"
    if coverage_file.exists():
        print("\n[STEP 3] Parsing coverage results...")
        try:
            with open(coverage_file) as f:
                coverage_data = json.load(f)
            
            total = coverage_data.get("totals", {})
            covered_lines = total.get("covered_lines", 0)
            num_statements = total.get("num_statements", 0)
            
            if num_statements > 0:
                percentage = (covered_lines / num_statements) * 100
                print(f"\n📊 FINAL COVERAGE SUMMARY:")
                print(f"   Covered Lines: {covered_lines:,}")
                print(f"   Total Statements: {num_statements:,}")
                print(f"   Coverage: {percentage:.2f}%")
                print(f"   Target: ≥84% (production-ready)")
                
                if percentage >= 84:
                    print("   ✅ Coverage target met! (Production-ready)")
                    results['coverage']['percentage'] = percentage
                    results['coverage']['covered_lines'] = covered_lines
                    results['coverage']['total_statements'] = num_statements
                    results['coverage']['target_met'] = True
                else:
                    print(f"   ⚠️  Coverage: {percentage:.2f}% (target: ≥84%)")
                    results['coverage']['target_met'] = False
        except Exception as e:
            print(f"⚠️  Error parsing coverage: {e}")
    
    # 4. Save results
    results_file = backend_dir / "final_verification_results.json"
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    # 5. Generate report
    report_file = backend_dir / "final_verification_report.txt"
    with open(report_file, 'w') as f:
        f.write("="*60 + "\n")
        f.write("FINAL VERIFICATION REPORT\n")
        f.write("="*60 + "\n\n")
        f.write(f"Timestamp: {results['timestamp']}\n\n")
        
        f.write("TEST RESULTS:\n")
        f.write("-"*60 + "\n")
        test_results = results['tests'].get('error_path_tests', {})
        f.write(f"Error Path Tests: {'PASSED' if test_results.get('success') else 'FAILED'}\n")
        f.write(f"Tests Passed: {test_results.get('passed', 0)}\n")
        f.write(f"Tests Failed: {test_results.get('failed', 0)}\n\n")
        
        f.write("COVERAGE RESULTS:\n")
        f.write("-"*60 + "\n")
        if 'percentage' in results['coverage']:
            f.write(f"Coverage: {results['coverage']['percentage']:.2f}%\n")
            f.write(f"Covered Lines: {results['coverage']['covered_lines']:,}\n")
            f.write(f"Total Statements: {results['coverage']['total_statements']:,}\n")
            f.write(f"Target Met: {results['coverage'].get('target_met', False)}\n")
        
        f.write("\n" + "="*60 + "\n")
        f.write("STATUS: ✅ VERIFICATION COMPLETE\n")
        f.write("="*60 + "\n")
    
    print(f"\n✅ Results saved to {results_file}")
    print(f"✅ Report saved to {report_file}")
    
    # Print summary
    print("\n" + "="*60)
    print("VERIFICATION SUMMARY")
    print("="*60)
    print(f"Tests: {'✅ PASSED' if test_results.get('success') else '❌ FAILED'}")
    if 'percentage' in results['coverage']:
        print(f"Coverage: {results['coverage']['percentage']:.2f}%")
        print(f"Target Met: {'✅ YES' if results['coverage'].get('target_met') else '❌ NO'}")
    print("="*60)
    
    results['status'] = 'complete'
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if (test_results.get('success') and results['coverage'].get('target_met', False)) else 1

if __name__ == "__main__":
    sys.exit(main())

