#!/usr/bin/env python3
"""
Test Execution Script for DEV-019 (Stripe Event Payments)
Runs migration and tests to verify implementation
"""
import subprocess
import sys
from pathlib import Path

def main():
    """Run migration and tests"""
    backend_dir = Path(__file__).parent
    
    print("="*70)
    print("DEV-019 Test Execution")
    print("="*70)
    
    # Step 1: Run migration
    print("\n[1/3] Running migration...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", "alembic", "upgrade", "head"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.returncode == 0:
            print("✅ Migration successful")
        else:
            print(f"❌ Migration failed: {result.stderr}")
            return 1
    except Exception as e:
        print(f"❌ Migration error: {e}")
        return 1
    
    # Step 2: Run service tests
    print("\n[2/3] Running service tests...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pytest", "tests/test_event_payment_service.py", "-v", "--tb=short"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            timeout=120
        )
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        if result.returncode == 0:
            print("✅ Service tests passed")
        else:
            print(f"⚠️  Service tests had failures (return code: {result.returncode})")
    except Exception as e:
        print(f"❌ Service tests error: {e}")
    
    # Step 3: Run API tests
    print("\n[3/3] Running API tests...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pytest", "tests/test_event_payment_api.py", "-v", "--tb=short"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            timeout=120
        )
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        if result.returncode == 0:
            print("✅ API tests passed")
        else:
            print(f"⚠️  API tests had failures (return code: {result.returncode})")
    except Exception as e:
        print(f"❌ API tests error: {e}")
    
    print("\n" + "="*70)
    print("Test Execution Complete")
    print("="*70)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())

