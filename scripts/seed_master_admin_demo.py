"""CLI helper to seed Master Admin demo data."""
from __future__ import annotations

import json
import os
import sys
import dataclasses
from pathlib import Path

possible_backend_dirs = [
    Path(__file__).parent.parent / "backend",
    Path("/app/backend"),
    Path.cwd() / "backend",
]
for candidate in possible_backend_dirs:
    if candidate.exists():
        sys.path.insert(0, str(candidate))
        break

from app.core.database import init_engine  # type: ignore  # noqa: E402
import app.core.database as db_core  # type: ignore  # noqa: E402
from app.models.user import User  # type: ignore  # noqa: E402
from app.services.master_admin_seed_service import (  # type: ignore  # noqa: E402
    MasterAdminSeedResult,
    seed_master_admin_demo,
)


def main() -> None:
    user_id = os.getenv("MASTER_ADMIN_USER_ID")
    output_path = os.getenv("MASTER_ADMIN_SEED_OUTPUT")

    if not user_id:
        raise SystemExit("MASTER_ADMIN_USER_ID is required")

    session_factory = db_core.SessionLocal
    if session_factory is None:
        init_engine()
        session_factory = db_core.SessionLocal
    if session_factory is None:
        raise SystemExit("Database session factory is not configured. Set DATABASE_URL.")

    db = session_factory()
    try:
        user = db.get(User, user_id)
        if not user:
            raise SystemExit(f"User {user_id} not found. Seed/create the user first.")
        summary = seed_master_admin_demo(db, user_id=user_id)
    finally:
        db.close()

    print("Master Admin demo data ready:")
    payload = dataclasses.asdict(summary)
    print(json.dumps(payload, indent=2))

    if output_path:
        out_file = Path(output_path)
        out_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(f"Summary written to {out_file}")


if __name__ == "__main__":
    main()
