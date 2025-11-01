"""Check for Master Admin specific enums."""
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
    for enum_name in master_admin_enums:
        result = conn.execute(text(f"SELECT EXISTS(SELECT 1 FROM pg_type WHERE typname = :enum_name)"), {"enum_name": enum_name})
        exists = result.scalar()
        status = "EXISTS" if exists else "NOT FOUND"
        print(f"{enum_name:20} {status}")
