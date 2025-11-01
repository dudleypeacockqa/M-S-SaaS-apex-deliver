"""Check if Master Admin tables exist in database."""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))

with engine.connect() as conn:
    result = conn.execute(text(
        "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'admin_%' ORDER BY tablename"
    ))
    tables = [row[0] for row in result]

    print('Master Admin tables in database:')
    if tables:
        for t in tables:
            print(f'  - {t}')
    else:
        print('  (none found)')

    # Check enum types
    result = conn.execute(text(
        "SELECT typname FROM pg_type WHERE typname LIKE '%type' OR typname LIKE '%status' OR typname LIKE '%priority' OR typname LIKE '%stage' ORDER BY typname"
    ))
    enums = [row[0] for row in result]

    print('\nEnum types in database:')
    if enums:
        for e in enums:
            print(f'  - {e}')
    else:
        print('  (none found)')
