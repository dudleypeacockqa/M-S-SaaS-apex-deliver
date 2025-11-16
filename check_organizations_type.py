#!/usr/bin/env python3
"""Check organizations.id column type"""
import sys
import psycopg2

DATABASE_URL = "postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"

try:
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # Check organizations.id type
    cursor.execute("""
        SELECT column_name, data_type, udt_name
        FROM information_schema.columns
        WHERE table_name = 'organizations' AND column_name = 'id';
    """)

    result = cursor.fetchone()
    if result:
        print(f"organizations.id type: {result[1]} (udt: {result[2]})")
    else:
        print("organizations table not found or no id column")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
