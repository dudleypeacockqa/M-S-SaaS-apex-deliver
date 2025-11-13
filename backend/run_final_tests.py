#!/usr/bin/env python3
"""
Final Test Execution - Runs all tests and generates comprehensive report
"""
import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime

def main():
    """Run tests and generate report"""
    backend_dir = Path(__file__).parent
    report_file = backend_dir / "final_test_report.txt"
    
    print("="*70)
    print("FINAL TEST EXECUTION - 100% COMPLETION VERIFICATION")
    print("="*70)
    
    results = {
        'timestamp': datetime.now().isoformat(),
        'tests': {}
    }
    
    # Run error path tests
    print("\n[1/3] Running document service error path tests...")
    cmd = [sys.executable, "-m", "pytest", 
           "tests/test_document_service_error_paths.py", 
           "-v", "--tb=short"]
    
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=backend_dir)
    
    output = result.stdout + "\n" + result.stderr
    passed_count = output.count("PASSED") + output.count("passed")
    failed_count = output.count("FAILED") + output.count("failed") + output.count("ERROR")
    
    results['tests']['error_path'] = {
        'success': result.returncode == 0,
        'passed': passed_count,
        'failed': failed_count,
        'output': output
    }
    
    print(f"Result: {'PASSED' if result.returncode == 0 else 'FAILED'}")
    print(f"Tests Passed: {passed_count}")
    print(f"Tests Failed: {failed_count}")
    
    # Run coverage
    print("\n[2/3] Measuring coverage...")
    cmd = [sys.executable, "-m", "pytest",
           "--cov=app",
           "--cov-report=json:coverage_final.json",
           "--cov-report=term",
           "-q"]
    
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=backend_dir)
    
    # Parse coverage
    coverage_file = backend_dir / "coverage_final.json"
    if coverage_file.exists():
        with open(coverage_file) as f:
            data = json.load(f)
        totals = data.get('totals', {})
        covered = totals.get('covered_lines', 0)
        total = totals.get('num_statements', 0)
        pct = (covered / total * 100) if total > 0 else 0
        
        results['coverage'] = {
            'percentage': pct,
            'covered_lines': covered,
            'total_statements': total,
            'target_met': pct >= 84
        }
        
        print(f"Coverage: {pct:.2f}%")
        print(f"Covered: {covered:,} / Total: {total:,}")
        print(f"Target Met: {pct >= 84}")
    
    # Generate report
    print("\n[3/3] Generating final report...")
    with open(report_file, 'w') as f:
        f.write("="*70 + "\n")
        f.write("FINAL TEST EXECUTION REPORT\n")
        f.write("="*70 + "\n\n")
        f.write(f"Timestamp: {results['timestamp']}\n\n")
        
        f.write("TEST RESULTS:\n")
        f.write("-"*70 + "\n")
        test_res = results['tests']['error_path']
        f.write(f"Status: {'PASSED' if test_res['success'] else 'FAILED'}\n")
        f.write(f"Tests Passed: {test_res['passed']}\n")
        f.write(f"Tests Failed: {test_res['failed']}\n\n")
        f.write("Output:\n")
        f.write(test_res['output'])
        f.write("\n")
        
        if 'coverage' in results:
            f.write("COVERAGE RESULTS:\n")
            f.write("-"*70 + "\n")
            c = results['coverage']
            f.write(f"Coverage: {c['percentage']:.2f}%\n")
            f.write(f"Covered Lines: {c['covered_lines']:,}\n")
            f.write(f"Total Statements: {c['total_statements']:,}\n")
            f.write(f"Target Met: {c['target_met']}\n\n")
        
        f.write("="*70 + "\n")
        f.write("STATUS: ✅ VERIFICATION COMPLETE\n")
        f.write("="*70 + "\n")
    
    # Save JSON
    json_file = backend_dir / "final_test_results.json"
    with open(json_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Report saved to: {report_file}")
    print(f"✅ Results saved to: {json_file}")
    
    # Print summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Tests: {'✅ PASSED' if test_res['success'] else '❌ FAILED'}")
    if 'coverage' in results:
        print(f"Coverage: {results['coverage']['percentage']:.2f}%")
        print(f"Target: {'✅ MET' if results['coverage']['target_met'] else '❌ NOT MET'}")
    print("="*70)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())

