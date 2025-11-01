"""Clean up any existing Master Admin enum types from failed migrations."""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))

master_admin_enums = [
    'activitytype', 'activitystatus', 'nudgetype', 'nudgepriority',
    'meetingtype', 'prospectstatus', 'admindealstage', 'campaigntype',
    'campaignstatus', 'contenttype', 'contentstatus'
]

with engine.connect() as conn:
    # Start transaction
    trans = conn.begin()
    try:
        for enum_name in master_admin_enums:
            # Drop enum if exists
            conn.execute(text(f"DROP TYPE IF EXISTS {enum_name} CASCADE"))
            print(f"Dropped {enum_name} (if existed)")

        trans.commit()
        print("\nAll Master Admin enum types cleaned up successfully!")
    except Exception as e:
        trans.rollback()
        print(f"Error: {e}")
