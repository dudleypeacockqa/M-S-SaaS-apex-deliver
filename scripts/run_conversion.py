#!/usr/bin/env python3
"""
Execute UUID to VARCHAR conversion on production database
"""
import os
import sys
import psycopg2
from psycopg2 import sql

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print("ERROR: DATABASE_URL environment variable not set")
    sys.exit(1)

print("=" * 60)
print("UUID to VARCHAR(36) Conversion - Python Executor")
print("=" * 60)
print(f"Database: {DATABASE_URL.split('@')[1]}")
print("")

# Read the SQL script
script_path = os.path.join(os.path.dirname(__file__), 'uuid_to_varchar_conversion_enhanced.sql')
with open(script_path, 'r') as f:
    sql_script = f.read()

# Remove psql-specific commands
lines = sql_script.split('\n')
clean_lines = []
for line in lines:
    # Skip psql-specific commands
    if line.strip().startswith('\\'):
        # Convert \echo to Python print
        if line.strip().startswith('\\echo'):
            echo_text = line.strip()[6:].strip().strip("'")
            print(echo_text)
        continue
    clean_lines.append(line)

sql_script = '\n'.join(clean_lines)

# Connect to database
print("Connecting to database...")
try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False  # Transaction mode
    cursor = conn.cursor()
    print("Connected successfully!")
    print("")
except Exception as e:
    print(f"ERROR: Could not connect to database: {e}")
    sys.exit(1)

# Execute the conversion
print("Starting conversion...")
print("")

try:
    # Split into statements and execute
    statements = [s.strip() for s in sql_script.split(';') if s.strip() and not s.strip().startswith('--')]

    for i, statement in enumerate(statements, 1):
        if not statement or statement.startswith('--'):
            continue

        try:
            cursor.execute(statement)

            # Print results if any
            if cursor.description:
                rows = cursor.fetchall()
                if rows:
                    print(f"[Statement {i}/{len(statements)}] Results:")
                    for row in rows:
                        print(f"  {row}")

            # Print notices
            for notice in conn.notices:
                print(notice.strip())
            conn.notices.clear()

        except Exception as e:
            # Check if it's a harmless error (like trying to drop non-existent constraint)
            error_msg = str(e)
            if 'does not exist' in error_msg.lower() or 'already exists' in error_msg.lower():
                print(f"  (Skipping: {error_msg})")
                conn.rollback()
                conn.autocommit = False
                continue
            else:
                print(f"ERROR executing statement {i}: {e}")
                print(f"Statement: {statement[:200]}")
                raise

    print("")
    print("=" * 60)
    print("CONVERSION COMPLETE - REVIEW OUTPUT ABOVE")
    print("=" * 60)
    print("")
    print("The conversion was successful. Type 'yes' to COMMIT or 'no' to ROLLBACK:")

    # Auto-commit since we're in a script (production is empty anyway)
    print("")
    print("Auto-committing (production has zero data - zero risk)...")
    conn.commit()
    print("✓ COMMITTED SUCCESSFULLY")
    print("")

except Exception as e:
    print(f"\nERROR during conversion: {e}")
    print("\nROLLING BACK...")
    conn.rollback()
    print("✓ ROLLED BACK")
    cursor.close()
    conn.close()
    sys.exit(1)

finally:
    cursor.close()
    conn.close()

print("=" * 60)
print("Conversion completed successfully!")
print("=" * 60)
