#!/usr/bin/env python3
"""
One-off migration helpers to move legacy 100daysandbeyond tenant records
to the FinanceFlo naming/slug/email conventions.
"""
from __future__ import annotations

import sys
from typing import Sequence

from sqlalchemy import select

from app.core.database import SessionLocal, init_engine
from app.models.organization import Organization
from app.models.user import User

OLD_ORG_NAME = "100 Days & Beyond"
OLD_ORG_SLUG = "100daysandbeyond"
NEW_ORG_NAME = "FinanceFlo"
NEW_ORG_SLUG = "financeflo"
OLD_EMAIL_DOMAIN = "@100daysandbeyond.com"
NEW_EMAIL_DOMAIN = "@financeflo.ai"


def _ensure_session():
    init_engine()
    if SessionLocal is None:
        raise RuntimeError("SessionLocal is not initialized")
    return SessionLocal()


def _migrate_orgs(session) -> int:
    stmt = select(Organization).where(Organization.slug == OLD_ORG_SLUG)
    orgs: Sequence[Organization] = session.execute(stmt).scalars().all()
    for org in orgs:
        org.name = NEW_ORG_NAME
        org.slug = NEW_ORG_SLUG
    return len(orgs)


def _migrate_user_emails(session) -> int:
    stmt = select(User).where(User.email.ilike(f"%{OLD_EMAIL_DOMAIN}"))
    users: Sequence[User] = session.execute(stmt).scalars().all()
    for user in users:
        user.email = user.email.replace(OLD_EMAIL_DOMAIN, NEW_EMAIL_DOMAIN)
    return len(users)


def main() -> None:
    session = _ensure_session()
    try:
        updated_orgs = _migrate_orgs(session)
        updated_users = _migrate_user_emails(session)
        if updated_orgs or updated_users:
            session.commit()
        else:
            session.rollback()
        print(f"✅ Organizations updated: {updated_orgs}")
        print(f"✅ User emails updated: {updated_users}")
    except Exception as exc:  # pragma: no cover - logging helper
        session.rollback()
        print(f"❌ Migration failed: {exc}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    sys.exit(main())

