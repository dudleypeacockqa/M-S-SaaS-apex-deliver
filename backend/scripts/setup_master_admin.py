#!/usr/bin/env python3
"""
Setup script for master admin and test tenant users.

This script configures:
- dudley@qamarketing.com as master_admin
- dudley.peacock@icloud.com as admin in test tenant organization

Usage:
    python backend/scripts/setup_master_admin.py

Requirements:
    - Database connection configured in environment
    - Users must exist in Clerk first (will be synced to database via webhook)
    - Run after database migrations are applied
"""
from __future__ import annotations

import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.models.organization import Organization
from app.services.user_service import get_user_by_email


def setup_master_admin(db: Session) -> bool:
    """Set up dudley@qamarketing.com as master admin."""
    email = "dudley@qamarketing.com"
    user = get_user_by_email(db, email)
    
    if not user:
        print(f"⚠️  User {email} not found in database.")
        print("   Please ensure the user exists in Clerk and has been synced via webhook.")
        return False
    
    if user.role == UserRole.master_admin:
        print(f"✅ User {email} is already master_admin")
        return True
    
    user.role = UserRole.master_admin
    user.is_active = True
    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    
    print(f"✅ Updated {email} to master_admin role")
    return True


def setup_test_tenant(db: Session) -> bool:
    """Set up test tenant organization and admin user."""
    email = "dudley.peacock@icloud.com"
    
    # Create or get test organization
    org_slug = "test-tenant-org"
    org = db.query(Organization).filter(Organization.slug == org_slug).first()
    
    if not org:
        import uuid
        org = Organization(
            id=str(uuid.uuid4()),
            name="Test Tenant Organization",
            slug=org_slug,
            subscription_tier="enterprise",
            is_active=True,
        )
        db.add(org)
        db.commit()
        db.refresh(org)
        print(f"✅ Created test organization: {org.name}")
    else:
        print(f"✅ Test organization already exists: {org.name}")
    
    # Create or update test tenant admin user
    user = get_user_by_email(db, email)
    
    if not user:
        print(f"⚠️  User {email} not found in database.")
        print("   Please ensure the user exists in Clerk and has been synced via webhook.")
        print(f"   Once created, assign to organization: {org.id}")
        return False
    
    user.role = UserRole.admin
    user.organization_id = org.id
    user.is_active = True
    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    
    print(f"✅ Updated {email} to admin role in test organization")
    return True


def main():
    """Main setup function."""
    print("=" * 60)
    print("Master Admin and Test Tenant Setup")
    print("=" * 60)
    print()
    
    db: Session = SessionLocal()
    try:
        # Setup master admin
        print("Setting up master admin...")
        master_admin_success = setup_master_admin(db)
        print()
        
        # Setup test tenant
        print("Setting up test tenant...")
        test_tenant_success = setup_test_tenant(db)
        print()
        
        # Summary
        print("=" * 60)
        if master_admin_success and test_tenant_success:
            print("✅ Setup completed successfully!")
        else:
            print("⚠️  Setup completed with warnings.")
            print("   Some users may need to be created in Clerk first.")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()

