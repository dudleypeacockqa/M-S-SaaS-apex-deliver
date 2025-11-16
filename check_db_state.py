#!/usr/bin/env python3
import psycopg2

DATABASE_URL = 'postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform'

conn = psycopg2.connect(DATABASE_URL, sslmode='require')
cur = conn.cursor()

print("=" * 70)
print("PRODUCTION DATABASE STATE CHECK")
print("=" * 70)

# Check current migration version
cur.execute('SELECT version_num FROM alembic_version')
version = cur.fetchone()[0]
print(f'\nCurrent migration version: {version}')

# Check if our target tables exist
print("\nTable existence check:")
tables_to_check = [
    'community_follows',
    'community_moderation_actions',
    'community_posts',
    'community_reactions',
    'community_comments',
    'events',
    'event_analytics',
    'event_sessions',
    'event_tickets',
    'event_registrations',
    'document_ai_suggestions',
    'document_versions',
    'document_share_links'
]

exists_count = 0
for table in tables_to_check:
    cur.execute(f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = %s)", (table,))
    exists = cur.fetchone()[0]
    status = 'EXISTS' if exists else 'MISSING'
    print(f'  {table}: {status}')
    if exists:
        exists_count += 1

print(f"\nSummary: {exists_count}/{len(tables_to_check)} tables exist")

# Check users.id type
print("\nKey column types:")
cur.execute("""
    SELECT t.typname
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_type t ON a.atttypid = t.oid
    WHERE c.relname = 'users'
    AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND a.attname = 'id'
""")
users_id_type = cur.fetchone()
if users_id_type:
    print(f'  users.id type: {users_id_type[0]}')
else:
    print('  users.id: TABLE NOT FOUND')

# Check organizations.id type
cur.execute("""
    SELECT t.typname
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_type t ON a.atttypid = t.oid
    WHERE c.relname = 'organizations'
    AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND a.attname = 'id'
""")
orgs_id_type = cur.fetchone()
if orgs_id_type:
    print(f'  organizations.id type: {orgs_id_type[0]}')
else:
    print('  organizations.id: TABLE NOT FOUND')

print("=" * 70)

cur.close()
conn.close()
