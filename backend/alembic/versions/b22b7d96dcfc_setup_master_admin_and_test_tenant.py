"""setup_master_admin_and_test_tenant

Revision ID: b22b7d96dcfc
Revises: 7bd26aab8934
Create Date: 2025-11-18 11:11:12.401101

"""
from typing import Sequence, Union
import uuid
from datetime import datetime, timezone

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision: str = 'b22b7d96dcfc'
down_revision: Union[str, None] = '7bd26aab8934'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Set up master admin user and test tenant.
    
    This migration:
    1. Updates dudley@qamarketing.com to master_admin role (if user exists)
    2. Creates test organization for dudley.peacock@icloud.com
    3. Creates/updates dudley.peacock@icloud.com as admin in test org
    """
    conn = op.get_bind()
    
    # 1. Update dudley@qamarketing.com to master_admin role
    # Note: User must exist in database (created via Clerk webhook)
    # This will update the role if the user exists, otherwise do nothing
    conn.execute(text("""
        UPDATE users 
        SET role = 'master_admin', 
            is_active = true,
            updated_at = :now
        WHERE email = 'dudley@qamarketing.com'
    """), {"now": datetime.now(timezone.utc)})
    
    # 2. Create test organization for dudley.peacock@icloud.com
    # Generate a UUID for the organization
    test_org_id = str(uuid.uuid4())
    test_org_slug = 'test-tenant-org'
    
    # Check if organization already exists (by slug)
    org_exists = conn.execute(text("""
        SELECT id FROM organizations WHERE slug = :slug
    """), {"slug": test_org_slug}).fetchone()
    
    if not org_exists:
        conn.execute(text("""
            INSERT INTO organizations (id, name, slug, subscription_tier, is_active, created_at, updated_at)
            VALUES (:id, :name, :slug, :tier, true, :now, :now)
        """), {
            "id": test_org_id,
            "name": "Test Tenant Organization",
            "slug": test_org_slug,
            "tier": "enterprise",
            "now": datetime.now(timezone.utc)
        })
        print(f"✅ Created test organization: Test Tenant Organization")
    else:
        test_org_id = org_exists[0]
        print(f"✅ Test organization already exists")
    
    # 3. Create/update dudley.peacock@icloud.com as admin in test org
    # First check if user exists
    user_exists = conn.execute(text("""
        SELECT id, clerk_user_id FROM users WHERE email = 'dudley.peacock@icloud.com'
    """)).fetchone()
    
    if user_exists:
        # Update existing user
        conn.execute(text("""
            UPDATE users 
            SET role = 'admin',
                organization_id = :org_id,
                is_active = true,
                updated_at = :now
            WHERE email = 'dudley.peacock@icloud.com'
        """), {
            "org_id": test_org_id,
            "now": datetime.now(timezone.utc)
        })
        print(f"✅ Updated dudley.peacock@icloud.com to admin role in test organization")
    else:
        # Create new user (will need Clerk user ID - using placeholder)
        # Note: In production, user should be created via Clerk webhook first
        # This is a fallback for development/testing
        user_id = str(uuid.uuid4())
        clerk_user_id = f"clerk_test_{user_id[:8]}"
        
        conn.execute(text("""
            INSERT INTO users (
                id, clerk_user_id, email, role, organization_id, 
                is_active, created_at, updated_at
            )
            VALUES (:id, :clerk_id, :email, 'admin', :org_id, true, :now, :now)
        """), {
            "id": user_id,
            "clerk_id": clerk_user_id,
            "email": "dudley.peacock@icloud.com",
            "org_id": test_org_id,
            "now": datetime.now(timezone.utc)
        })
        print(f"⚠️  Created placeholder user for dudley.peacock@icloud.com - update with real Clerk ID")


def downgrade() -> None:
    """
    Revert master admin and test tenant setup.
    
    Note: This will reset roles but not delete users or organizations.
    """
    conn = op.get_bind()
    
    # Reset dudley@qamarketing.com role (set to admin instead of master_admin)
    conn.execute(text("""
        UPDATE users 
        SET role = 'admin',
            updated_at = :now
        WHERE email = 'dudley@qamarketing.com' AND role = 'master_admin'
    """), {"now": datetime.now(timezone.utc)})
    
    # Reset dudley.peacock@icloud.com role (set to solo instead of admin)
    conn.execute(text("""
        UPDATE users 
        SET role = 'solo',
            updated_at = :now
        WHERE email = 'dudley.peacock@icloud.com' AND role = 'admin'
    """), {"now": datetime.now(timezone.utc)})
    
    # Note: We don't delete the test organization as it may have data
    # If needed, it can be deactivated:
    # conn.execute(text("""
    #     UPDATE organizations 
    #     SET is_active = false 
    #     WHERE slug = 'test-tenant-org'
    # """))
