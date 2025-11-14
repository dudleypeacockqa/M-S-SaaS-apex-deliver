# Alembic Migration Best Practices

**Created**: 2025-11-14
**Last Updated**: 2025-11-14
**Status**: Active
**Part of**: Incident Prevention Measures (INC-2025-11-14-001)

---

## Overview

This document outlines best practices for writing safe, reliable Alembic migrations to prevent production deployment failures and data integrity issues.

**Key Principle**: Migrations should be defensive, idempotent, and tested against production-like database states.

---

## Table of Contents

1. [Before Writing a Migration](#before-writing-a-migration)
2. [Foreign Key Type Consistency](#foreign-key-type-consistency)
3. [Defensive ALTER TABLE Operations](#defensive-alter-table-operations)
4. [Safe DROP Operations](#safe-drop-operations)
5. [Error Handling](#error-handling)
6. [Downgrade Implementation](#downgrade-implementation)
7. [Testing Migrations](#testing-migrations)
8. [Code Review Checklist](#code-review-checklist)
9. [Common Patterns](#common-patterns)
10. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Before Writing a Migration

### 1. Understand the Current Schema

Always verify the current production schema before writing a migration:

```sql
-- Check table existence
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'your_table_name';

-- Check column types
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'your_table_name';

-- Check existing foreign keys
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'your_table_name';
```

### 2. Plan for Idempotency

Migrations should be safe to run multiple times. Use:
- `IF EXISTS` clauses for DROP operations
- Table/column existence checks before ALTER operations
- Try-except blocks for error handling

### 3. Consider Data Migration

If your migration changes data (not just schema):
- Test with production-like data volumes
- Consider performance impact
- Plan for rollback

---

## Foreign Key Type Consistency

### Problem

The most common migration failure is foreign key type mismatch:

```python
# ❌ BAD: FK type doesn't match referenced column
sa.Column('document_id', sa.String(length=36))  # VARCHAR
sa.ForeignKeyConstraint(['document_id'], ['documents.id'])  # documents.id is UUID
```

### Solution

Always ensure FK column type matches the referenced column:

```python
# ✅ GOOD: Check referenced column type first
# If documents.id is UUID:
sa.Column('document_id', postgresql.UUID(as_uuid=True))
sa.ForeignKeyConstraint(['document_id'], ['documents.id'])

# If documents.id is VARCHAR(36):
sa.Column('document_id', sa.String(length=36))
sa.ForeignKeyConstraint(['document_id'], ['documents.id'])
```

### Verification Query

Before creating FK, verify referenced column type:

```python
def upgrade() -> None:
    # Add this comment in migration for documentation
    # Verified in production: documents.id is VARCHAR(36)
    # Query used:
    # SELECT data_type, character_maximum_length
    # FROM information_schema.columns
    # WHERE table_name = 'documents' AND column_name = 'id';

    op.create_table(
        'document_share_links',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('document_id', sa.String(length=36), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'])
    )
```

---

## Defensive ALTER TABLE Operations

### Problem

ALTER TABLE fails if the table doesn't exist:

```python
# ❌ BAD: Assumes table exists
op.alter_column('admin_activities', 'amount',
           existing_type=sa.INTEGER(),
           server_default=None)
# Fails with: relation "admin_activities" does not exist
```

### Solution

Always check table existence before ALTER operations:

```python
from sqlalchemy import inspect

def _table_exists(table_name: str, schema: str = 'public') -> bool:
    """Check if a table exists in the database"""
    bind = op.get_bind()
    inspector = inspect(bind)
    return inspector.has_table(table_name, schema=schema)

def upgrade() -> None:
    # ✅ GOOD: Check existence first
    if _table_exists('admin_activities'):
        op.alter_column('admin_activities', 'amount',
                   existing_type=sa.INTEGER(),
                   server_default=None)
```

### Column Existence Check

For column-specific operations:

```python
def _column_exists(table_name: str, column_name: str) -> bool:
    """Check if a column exists in a table"""
    bind = op.get_bind()
    inspector = inspect(bind)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns

def upgrade() -> None:
    if _table_exists('documents') and not _column_exists('documents', 'ai_summary'):
        op.add_column('documents', sa.Column('ai_summary', sa.Text()))
```

---

## Safe DROP Operations

### Problem

DROP operations fail if the object doesn't exist:

```python
# ❌ BAD: Fails if constraint doesn't exist
op.drop_constraint('document_questions_document_id_fkey', 'document_questions')
```

### Solution

Use `if_exists=True` parameter:

```python
# ✅ GOOD: Safe DROP operations
op.drop_constraint('document_questions_document_id_fkey', 'document_questions',
                  type_='foreignkey', if_exists=True)

op.drop_table('temp_table', if_exists=True)

op.drop_index('ix_documents_created_at', table_name='documents', if_exists=True)

op.drop_column('documents', 'deprecated_field', if_exists=True)
```

### Manual DROP with IF EXISTS

For operations that don't support `if_exists`:

```python
def upgrade() -> None:
    # Use raw SQL with IF EXISTS
    op.execute('DROP TABLE IF EXISTS temp_table CASCADE')
    op.execute('DROP INDEX IF EXISTS ix_old_index')
```

---

## Error Handling

### Problem

Migrations fail with cryptic errors when assumptions are violated.

### Solution

Wrap risky operations in try-except blocks:

```python
from sqlalchemy.exc import ProgrammingError, NoSuchTableError

def upgrade() -> None:
    # ✅ GOOD: Defensive error handling
    if _table_exists('admin_activities'):
        try:
            op.alter_column('admin_activities', 'amount',
                       existing_type=sa.INTEGER(),
                       server_default=None)
            op.alter_column('admin_activities', 'created_at',
                       existing_type=postgresql.TIMESTAMP(),
                       server_default=None)
            op.create_index('ix_admin_activities_id', 'admin_activities', ['id'])
        except ProgrammingError as e:
            # Log error but don't fail migration
            # This handles cases where table exists but columns/indexes don't
            print(f"Warning: ALTER on admin_activities failed: {e}")
            pass
```

### When to Use Try-Except

Use try-except when:
1. Altering columns that may or may not exist
2. Creating indexes that might already exist
3. Performing operations on tables with uncertain state
4. Handling environment-specific differences

**Don't** use try-except to:
- Hide real errors
- Avoid fixing the root cause
- Skip validation checks

---

## Downgrade Implementation

### Problem

Many migrations have empty downgrade functions:

```python
# ❌ BAD: Empty downgrade
def downgrade() -> None:
    pass
```

### Solution

Implement proper rollback logic:

```python
# ✅ GOOD: Proper downgrade
def upgrade() -> None:
    op.create_table(
        'documents',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False)
    )

def downgrade() -> None:
    op.drop_table('documents', if_exists=True)
```

### Complex Downgrades

For data migrations or complex schema changes:

```python
def upgrade() -> None:
    # Add new column with default
    op.add_column('documents', sa.Column('status', sa.String(20), server_default='draft'))

    # Migrate data
    op.execute("UPDATE documents SET status = 'published' WHERE is_published = true")

    # Drop old column
    op.drop_column('documents', 'is_published')

def downgrade() -> None:
    # Re-add old column
    op.add_column('documents', sa.Column('is_published', sa.Boolean(), server_default=False))

    # Reverse data migration
    op.execute("UPDATE documents SET is_published = true WHERE status = 'published'")

    # Drop new column
    op.drop_column('documents', 'status')
```

### When Downgrade is Not Possible

If downgrade would lose data:

```python
def downgrade() -> None:
    raise NotImplementedError(
        "Downgrade not supported: would lose data from document_ai_suggestions table. "
        "To rollback, restore from database backup."
    )
```

---

## Testing Migrations

### Local Testing

Always test migrations locally before deployment:

```bash
# 1. Run migration
cd backend
alembic upgrade head

# 2. Verify schema
psql $DATABASE_URL -c "\d documents"

# 3. Test downgrade
alembic downgrade -1

# 4. Re-upgrade
alembic upgrade head
```

### Docker-Based Testing

Test against fresh PostgreSQL instance:

```bash
# Use provided testing script
python scripts/test_migrations.py
```

### CI/CD Testing

Migrations are automatically tested in GitHub Actions:
- Validates migration file patterns
- Runs migrations against PostgreSQL
- Checks schema consistency
- Tests upgrade/downgrade cycles

---

## Code Review Checklist

Before merging a migration PR, verify:

- [ ] **Foreign Key Types**: All FK columns match referenced column types
- [ ] **Table Existence**: ALTER operations check table existence
- [ ] **Column Existence**: Column operations check column existence
- [ ] **Safe DROP**: All DROP operations use `if_exists=True`
- [ ] **Error Handling**: Risky operations wrapped in try-except
- [ ] **Downgrade Implementation**: Proper rollback logic implemented
- [ ] **Comments**: Migration includes comments explaining schema changes
- [ ] **Testing**: Migration tested locally against production-like database
- [ ] **CI/CD Passed**: All automated migration tests pass

---

## Common Patterns

### Pattern 1: Safe Table Creation with Foreign Keys

```python
def upgrade() -> None:
    # Create table with FK
    op.create_table(
        'document_share_links',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('document_id', sa.String(36), nullable=False),  # Match documents.id type
        sa.Column('shared_by_user_id', sa.String(36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['shared_by_user_id'], ['users.id'], ondelete='CASCADE')
    )

    # Create indexes
    op.create_index('ix_document_share_links_document_id', 'document_share_links', ['document_id'])
    op.create_index('ix_document_share_links_shared_by_user_id', 'document_share_links', ['shared_by_user_id'])

def downgrade() -> None:
    op.drop_table('document_share_links', if_exists=True)
```

### Pattern 2: Adding Column with Data Migration

```python
def upgrade() -> None:
    # Add new column with default
    op.add_column('documents',
        sa.Column('slug', sa.String(255), server_default='', nullable=False)
    )

    # Populate data
    connection = op.get_bind()
    connection.execute(
        sa.text("UPDATE documents SET slug = LOWER(REPLACE(name, ' ', '-'))")
    )

    # Add unique constraint
    op.create_unique_constraint('uq_documents_slug', 'documents', ['slug'])

def downgrade() -> None:
    op.drop_constraint('uq_documents_slug', 'documents', type_='unique')
    op.drop_column('documents', 'slug')
```

### Pattern 3: Modifying Column Type Safely

```python
def upgrade() -> None:
    # Convert column type with USING clause
    op.execute(
        "ALTER TABLE documents ALTER COLUMN id TYPE VARCHAR(36) USING id::text"
    )

def downgrade() -> None:
    # Reverse conversion
    op.execute(
        "ALTER TABLE documents ALTER COLUMN id TYPE UUID USING id::uuid"
    )
```

### Pattern 4: Conditional Operations

```python
from sqlalchemy import inspect

def _table_exists(table_name: str) -> bool:
    bind = op.get_bind()
    inspector = inspect(bind)
    return inspector.has_table(table_name)

def upgrade() -> None:
    # Only run if table exists
    if _table_exists('admin_activities'):
        try:
            op.alter_column('admin_activities', 'amount',
                       server_default=None)
        except ProgrammingError:
            pass

    # Create table if it doesn't exist
    if not _table_exists('new_feature_table'):
        op.create_table(
            'new_feature_table',
            sa.Column('id', sa.String(36), primary_key=True),
            sa.Column('name', sa.String(255), nullable=False)
        )
```

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Assuming Table Order

```python
# BAD: Assumes admin_activities was created earlier
def upgrade() -> None:
    op.alter_column('admin_activities', 'amount', ...)
    # Fails if admin_activities doesn't exist yet
```

**Fix**: Check table existence or create dependencies explicitly.

### ❌ Anti-Pattern 2: Hardcoded Foreign Key Types

```python
# BAD: Hardcoded UUID without verifying referenced column
def upgrade() -> None:
    op.create_table(
        'table_a',
        sa.Column('document_id', postgresql.UUID(as_uuid=True)),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'])
    )
    # Fails if documents.id is actually VARCHAR
```

**Fix**: Verify referenced column type first.

### ❌ Anti-Pattern 3: No Error Handling

```python
# BAD: No error handling
def upgrade() -> None:
    op.drop_constraint('fk_name', 'table_name')
    # Fails if constraint doesn't exist
```

**Fix**: Use `if_exists=True` or try-except.

### ❌ Anti-Pattern 4: Complex Logic in Migrations

```python
# BAD: Complex business logic in migration
def upgrade() -> None:
    connection = op.get_bind()
    documents = connection.execute("SELECT * FROM documents")
    for doc in documents:
        # 100+ lines of complex processing
        ...
```

**Fix**: Keep migrations simple. Move complex logic to separate data migration scripts.

### ❌ Anti-Pattern 5: No Downgrade

```python
# BAD: Empty downgrade
def downgrade() -> None:
    pass
```

**Fix**: Implement proper rollback or document why downgrade is not possible.

---

## Emergency Hotfix Procedures

If a migration fails in production:

### 1. Assess Impact

- Check deployment logs for exact error
- Verify database state (which tables/columns exist)
- Determine if data was lost or corrupted

### 2. Prepare Hotfix

- Create surgical SQL script to fix database state
- Document each step with verification queries
- Test against local database first

### 3. Execute Hotfix

- Take database backup before execution
- Connect to production database
- Execute SQL commands step by step
- Verify each step completes successfully

### 4. Fix Migration File

- Update migration file with defensive patterns
- Add table existence checks
- Add error handling
- Test locally before pushing

### 5. Redeploy

- Push migration fix to GitHub
- Trigger deployment
- Monitor deployment logs
- Verify application health

### 6. Document Incident

- Create incident postmortem
- Document root cause and resolution
- Update best practices documentation
- Share lessons learned with team

**Reference**: [2025-11-14-INCIDENT-POSTMORTEM.md](./2025-11-14-INCIDENT-POSTMORTEM.md)

---

## Resources

### Documentation
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)

### Internal Tools
- [scripts/validate_migrations.py](../../scripts/validate_migrations.py) - Validation script
- [scripts/test_migrations.py](../../scripts/test_migrations.py) - Testing framework
- [.github/workflows/validate-migrations.yml](../../.github/workflows/validate-migrations.yml) - CI/CD workflow

### Related Documents
- [2025-11-14-INCIDENT-POSTMORTEM.md](./2025-11-14-INCIDENT-POSTMORTEM.md) - Migration incident postmortem
- [2025-11-14-MIGRATION-HOTFIX-SUCCESS.md](./2025-11-14-MIGRATION-HOTFIX-SUCCESS.md) - Hotfix success report

---

## Changelog

| Date | Changes | Author |
|------|---------|--------|
| 2025-11-14 | Initial version created from incident learnings | Development Team |

---

**Remember**: Migrations are permanent changes to production data. Take time to:
1. Understand the current state
2. Write defensive code
3. Test thoroughly
4. Document your changes

**When in doubt, ask for a code review!**
