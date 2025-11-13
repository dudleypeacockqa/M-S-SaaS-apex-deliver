#!/usr/bin/env python3
"""
Simple test verification script
Runs the new error path tests and reports results
"""
import subprocess
import sys
from pathlib import Path

def main():
    """Run tests and report results"""
    backend_dir = Path(__file__).parent
    
    print("="*60)
    print("Verifying Document Service Error Path Tests")
    print("="*60)
    
    # Run the tests
    result = subprocess.run(
        [sys.executable, "-m", "pytest", 
         "tests/test_document_service_error_paths.py", 
         "-v", "--tb=short"],
        cwd=backend_dir,
        capture_output=True,
        text=True
    )
    
    print("\nSTDOUT:")
    print(result.stdout)
    
    if result.stderr:
        print("\nSTDERR:")
        print(result.stderr)
    
    print("\n" + "="*60)
    print(f"Exit Code: {result.returncode}")
    if result.returncode == 0:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed")
    print("="*60)
    
    return result.returncode

if __name__ == "__main__":
    sys.exit(main())

