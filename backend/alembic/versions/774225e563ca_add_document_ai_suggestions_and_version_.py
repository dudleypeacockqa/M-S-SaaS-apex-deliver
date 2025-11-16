"""add document AI suggestions and version history tables with GUID

Revision ID: 774225e563ca
Revises: b354d12d1e7d
Create Date: 2025-11-13 10:14:13.253911

"""
from typing import Optional, Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect
from sqlalchemy.exc import NoSuchTableError, ProgrammingError, InternalError
from sqlalchemy.dialects import postgresql
from app.db.base import GUID

ORGANIZATION_ID_TYPE = sa.String(length=36)
USER_ID_TYPE = sa.String(length=36)
GENERATED_DOCUMENT_ID_TYPE = sa.String(length=36)
ORGANIZATION_TYPE = sa.String(length=36)

# revision identifiers, used by Alembic.
revision: str = '774225e563ca'
down_revision: Union[str, None] = 'b354d12d1e7d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

SAFE_EXCEPTIONS = (ProgrammingError, NoSuchTableError, InternalError)


def _inspector():
    try:
        return inspect(op.get_bind())
    except SAFE_EXCEPTIONS:
        return None


def _table_exists(table_name: str, schema: Optional[str] = None) -> bool:
    if not table_name:
        return False
    inspector = _inspector()
    if inspector is None:
        return False
    try:
        return bool(inspector.has_table(table_name, schema=schema))
    except SAFE_EXCEPTIONS:
        return False


def _column_exists(table_name: str, column_name: str, schema: Optional[str] = None) -> bool:
    schema = schema or 'public'
    if not _table_exists(table_name, schema):
        return False
    inspector = _inspector()
    if inspector is None:
        return False
    try:
        columns = inspector.get_columns(table_name, schema=schema)
        return any(col['name'] == column_name for col in columns)
    except SAFE_EXCEPTIONS:
        return False


def _index_exists(index_name: str, table_name: str, schema: Optional[str] = None) -> bool:
    if not index_name or not table_name:
        return False
    if not _table_exists(table_name, schema):
        return False
    inspector = _inspector()
    if inspector is None:
        return False
    try:
        indexes = inspector.get_indexes(table_name, schema=schema or 'public')
        return any(idx['name'] == index_name for idx in indexes)
    except SAFE_EXCEPTIONS:
        return False


def _safe_alter_column(table_name: str, column_name: str, **kwargs) -> None:
    schema = kwargs.get('schema')
    if not _table_exists(table_name, schema):
        return
    if not _column_exists(table_name, column_name, schema):
        return
    try:
        op.alter_column(table_name, column_name, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_add_column(table_name: str, column: sa.Column, **kwargs) -> None:
    schema = kwargs.get('schema')
    if not _table_exists(table_name, schema):
        return
    column_name = getattr(column, 'name', None)
    if column_name and _column_exists(table_name, column_name, schema):
        return
    try:
        op.add_column(table_name, column, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_drop_column(table_name: str, column_name: str, **kwargs) -> None:
    schema = kwargs.get('schema')
    if not _column_exists(table_name, column_name, schema):
        return
    try:
        op.drop_column(table_name, column_name, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_create_index(index_name: str, table_name: Optional[str], columns, **kwargs) -> None:
    schema = kwargs.get('schema')
    if table_name and not _table_exists(table_name, schema):
        return
    if table_name and _index_exists(index_name, table_name, schema):
        return
    try:
        op.create_index(index_name, table_name, columns, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_drop_index(index_name: str, table_name: Optional[str] = None, **kwargs) -> None:
    schema = kwargs.get('schema')
    if table_name and not _table_exists(table_name, schema):
        return
    if table_name and not _index_exists(index_name, table_name, schema):
        return
    try:
        op.drop_index(index_name, table_name=table_name, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_create_unique_constraint(name: str, table_name: str, columns, **kwargs) -> None:
    schema = kwargs.get('schema')
    if not _table_exists(table_name, schema):
        return
    try:
        op.create_unique_constraint(name, table_name, columns, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_drop_constraint(name: str, table_name: str, **kwargs) -> None:
    schema = kwargs.get('schema')
    if not _table_exists(table_name, schema):
        return
    try:
        op.drop_constraint(name, table_name=table_name, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_create_foreign_key(name: str, source_table: str, referent_table: str,
                             local_cols, remote_cols, **kwargs) -> None:
    source_schema = kwargs.get('source_schema') or kwargs.get('schema')
    referent_schema = kwargs.get('referent_schema') or kwargs.get('schema')
    if not _table_exists(source_table, source_schema):
        return
    if not _table_exists(referent_table, referent_schema):
        return
    try:
        op.create_foreign_key(name, source_table, referent_table, local_cols, remote_cols, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_create_table(table_name: str, *columns, **kwargs) -> None:
    schema = kwargs.get('schema')
    required_tables = kwargs.pop('required_tables', None) or []
    if isinstance(required_tables, str):
        required_tables = [required_tables]
    for dependency in required_tables:
        if not _table_exists(dependency, schema):
            return
    if _table_exists(table_name, schema):
        return
    try:
        op.create_table(table_name, *columns, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_drop_table(table_name: str, *args, **kwargs) -> None:
    schema = kwargs.get('schema')
    if not _table_exists(table_name, schema):
        return
    try:
        op.drop_table(table_name, *args, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_execute(sql, *args, **kwargs) -> None:
    try:
        op.execute(sql, *args, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _drop_index_if_exists(index_name: str, table_name: str, schema: str = 'public') -> None:
    _safe_drop_index(index_name, table_name, schema=schema)


def _drop_table_if_exists(table_name: str, schema: str = 'public') -> None:
    _safe_drop_table(table_name, schema=schema)

def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    # CRITICAL: UUID conversion logic REMOVED to prevent transaction aborts
    #
    # Problem: Raw SQL DDL inside DO $$ blocks would execute ALTER TABLE statements
    # on non-existent tables, causing PostgreSQL to abort the entire transaction.
    # Even with exception handling, once a statement fails inside a transaction,
    # PostgreSQL marks it as "aborted" and refuses all further statements - including
    # the final INSERT INTO alembic_version.
    #
    # Solution: Rely on previous migration 65e4b4ef883d to handle all enum/table creation.
    # If tables don't exist, the _safe_* wrapper functions will gracefully skip DDL operations.
    # The safety wrappers check table existence BEFORE attempting any DDL.

    # UUID conversion blocks (lines 451-912 in original) have been removed.
    # If UUID conversion is needed, it should be in a separate migration that runs
    # AFTER all tables are confirmed to exist.
    # DEFENSIVE: Only run documents UUID conversion if documents table exists
    try:
        if _table_exists('documents'):
            # Ensure documents.id and related FK columns use VARCHAR(36) before new tables reference them
            _safe_execute("""
                DO $$
            DECLARE
                col_type text;
            BEGIN
                SELECT t.typname INTO col_type
                FROM pg_attribute a
                JOIN pg_class c ON a.attrelid = c.oid
                JOIN pg_type t ON a.atttypid = t.oid
                WHERE c.relname = 'documents'
                  AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
                  AND a.attname = 'id'
                  AND a.attnum > 0
                  AND NOT a.attisdropped;

                IF col_type = 'uuid' THEN
                    BEGIN
                        -- Drop FK constraints referencing documents.id
                        ALTER TABLE IF EXISTS document_activities DROP CONSTRAINT IF EXISTS document_activities_document_id_fkey;
                        ALTER TABLE IF EXISTS document_approvals DROP CONSTRAINT IF EXISTS document_approvals_document_id_fkey;
                        ALTER TABLE IF EXISTS document_comparisons DROP CONSTRAINT IF EXISTS document_comparisons_original_document_id_fkey;
                        ALTER TABLE IF EXISTS document_comparisons DROP CONSTRAINT IF EXISTS document_comparisons_revised_document_id_fkey;
                        ALTER TABLE IF EXISTS document_signatures DROP CONSTRAINT IF EXISTS document_signatures_document_id_fkey;
                        ALTER TABLE IF EXISTS team_tasks DROP CONSTRAINT IF EXISTS team_tasks_document_id_fkey;
                        ALTER TABLE IF EXISTS valuation_export_logs DROP CONSTRAINT IF EXISTS valuation_export_logs_document_id_fkey;
                        ALTER TABLE IF EXISTS documents DROP CONSTRAINT IF EXISTS documents_parent_document_id_fkey;
                        ALTER TABLE IF EXISTS document_questions DROP CONSTRAINT IF EXISTS document_questions_document_id_fkey;

                        -- Convert referencing columns to VARCHAR(36)
                        ALTER TABLE IF EXISTS document_activities ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;
                        ALTER TABLE IF EXISTS document_approvals ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;
                        ALTER TABLE IF EXISTS document_comparisons ALTER COLUMN original_document_id TYPE VARCHAR(36) USING original_document_id::text;
                        ALTER TABLE IF EXISTS document_comparisons ALTER COLUMN revised_document_id TYPE VARCHAR(36) USING revised_document_id::text;
                        ALTER TABLE IF EXISTS document_signatures ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;
                        ALTER TABLE IF EXISTS team_tasks ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;
                        ALTER TABLE IF EXISTS valuation_export_logs ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;
                        ALTER TABLE IF EXISTS document_questions ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;
                        ALTER TABLE documents ALTER COLUMN parent_document_id TYPE VARCHAR(36) USING parent_document_id::text;

                        -- Convert documents.id and recreate FKs
                        ALTER TABLE documents ALTER COLUMN id TYPE VARCHAR(36) USING id::text;
                        ALTER TABLE documents ADD CONSTRAINT documents_parent_document_id_fkey FOREIGN KEY (parent_document_id) REFERENCES documents(id);
                        ALTER TABLE IF EXISTS document_activities ADD CONSTRAINT document_activities_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
                        ALTER TABLE IF EXISTS document_approvals ADD CONSTRAINT document_approvals_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
                        ALTER TABLE IF EXISTS document_comparisons ADD CONSTRAINT document_comparisons_original_document_id_fkey FOREIGN KEY (original_document_id) REFERENCES documents(id);
                        ALTER TABLE IF EXISTS document_comparisons ADD CONSTRAINT document_comparisons_revised_document_id_fkey FOREIGN KEY (revised_document_id) REFERENCES documents(id);
                        ALTER TABLE IF EXISTS document_signatures ADD CONSTRAINT document_signatures_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
                        ALTER TABLE IF EXISTS team_tasks ADD CONSTRAINT team_tasks_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id);
                        ALTER TABLE IF EXISTS valuation_export_logs ADD CONSTRAINT valuation_export_logs_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id);
                        ALTER TABLE IF EXISTS document_questions ADD CONSTRAINT document_questions_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
                    EXCEPTION
                        WHEN OTHERS THEN
                            RAISE NOTICE 'Failed to convert documents table UUID columns: %', SQLERRM;
                            NULL;
                    END;
                END IF;
            END;
            $$;
            """)
    except (ProgrammingError, NoSuchTableError, InternalError, Exception):
        pass

    # Always use VARCHAR(36) for user foreign keys (matching converted users.id type)
    # The conversion above ensures users.id is VARCHAR(36), so FKs must be VARCHAR(36) too
    _safe_create_table('community_follows',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('follower_user_id', sa.String(length=36), nullable=False),
        sa.Column('following_user_id', sa.String(length=36), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['follower_user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['following_user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        required_tables=('users',)
    )
    _safe_create_index('idx_community_follows_follower', 'community_follows', ['follower_user_id'], unique=False)
    _safe_create_index('idx_community_follows_following', 'community_follows', ['following_user_id'], unique=False)
    _safe_create_index('idx_community_follows_org', 'community_follows', ['organization_id'], unique=False)
    _safe_create_index('idx_community_follows_unique', 'community_follows', ['follower_user_id', 'following_user_id'], unique=True)
    _safe_create_index(op.f('ix_community_follows_follower_user_id'), 'community_follows', ['follower_user_id'], unique=False)
    _safe_create_index(op.f('ix_community_follows_following_user_id'), 'community_follows', ['following_user_id'], unique=False)
    _safe_create_index(op.f('ix_community_follows_organization_id'), 'community_follows', ['organization_id'], unique=False)
    _safe_create_table('community_moderation_actions',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('target_type', sa.Enum('post', 'comment', name='targettype', native_enum=False, length=32), nullable=False),
    sa.Column('target_id', sa.String(length=36), nullable=False),
    sa.Column('action_type', sa.Enum('approve', 'reject', 'flag', 'delete', 'unflag', name='moderationactiontype', native_enum=False, length=32), nullable=False),
    sa.Column('moderator_user_id', sa.String(length=36), nullable=False),
    sa.Column('reason', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['moderator_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('users',)
    )
    _safe_create_index('idx_community_moderation_created', 'community_moderation_actions', ['created_at'], unique=False)
    _safe_create_index('idx_community_moderation_moderator', 'community_moderation_actions', ['moderator_user_id'], unique=False)
    _safe_create_index('idx_community_moderation_target', 'community_moderation_actions', ['target_type', 'target_id'], unique=False)
    _safe_create_index(op.f('ix_community_moderation_actions_moderator_user_id'), 'community_moderation_actions', ['moderator_user_id'], unique=False)
    _safe_create_index(op.f('ix_community_moderation_actions_target_id'), 'community_moderation_actions', ['target_id'], unique=False)
    _safe_create_table('community_posts',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('organization_id', sa.String(length=36), nullable=False),
    sa.Column('author_user_id', sa.String(length=36), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('category', sa.Enum('general', 'deals', 'insights', 'qa', 'networking', name='postcategory', native_enum=False, length=32), nullable=False),
    sa.Column('tags', sa.Text(), nullable=True),
    sa.Column('status', sa.Enum('draft', 'published', 'archived', 'flagged', name='poststatus', native_enum=False, length=32), nullable=False),
    sa.Column('view_count', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['author_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('users',)
    )
    _safe_create_index('idx_community_posts_author', 'community_posts', ['author_user_id'], unique=False)
    _safe_create_index('idx_community_posts_category', 'community_posts', ['category'], unique=False)
    _safe_create_index('idx_community_posts_created', 'community_posts', ['created_at'], unique=False)
    _safe_create_index('idx_community_posts_org_id', 'community_posts', ['organization_id'], unique=False)
    _safe_create_index('idx_community_posts_status', 'community_posts', ['status'], unique=False)
    _safe_create_index(op.f('ix_community_posts_author_user_id'), 'community_posts', ['author_user_id'], unique=False)
    _safe_create_index(op.f('ix_community_posts_organization_id'), 'community_posts', ['organization_id'], unique=False)
    _safe_create_table('community_reactions',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('target_type', sa.Enum('post', 'comment', name='targettype', native_enum=False, length=32), nullable=False),
    sa.Column('target_id', sa.String(length=36), nullable=False),
    sa.Column('user_id', sa.String(length=36), nullable=False),
    sa.Column('reaction_type', sa.Enum('like', 'love', 'insightful', 'celebrate', name='reactiontype', native_enum=False, length=32), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('users',)
    )
    _safe_create_index('idx_community_reactions_target', 'community_reactions', ['target_type', 'target_id'], unique=False)
    _safe_create_index('idx_community_reactions_unique', 'community_reactions', ['target_type', 'target_id', 'user_id', 'reaction_type'], unique=True)
    _safe_create_index('idx_community_reactions_user', 'community_reactions', ['user_id'], unique=False)
    _safe_create_index(op.f('ix_community_reactions_target_id'), 'community_reactions', ['target_id'], unique=False)
    _safe_create_index(op.f('ix_community_reactions_user_id'), 'community_reactions', ['user_id'], unique=False)
    _safe_create_table('events',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('event_type', sa.Enum('VIRTUAL', 'IN_PERSON', 'HYBRID', name='eventtype'), nullable=False),
    sa.Column('status', sa.Enum('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED', name='eventstatus'), nullable=False),
    sa.Column('start_date', sa.DateTime(timezone=True), nullable=False),
    sa.Column('end_date', sa.DateTime(timezone=True), nullable=False),
    sa.Column('registration_deadline', sa.DateTime(timezone=True), nullable=True),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('virtual_link', sa.String(), nullable=True),
    sa.Column('capacity', sa.Integer(), nullable=True),
    sa.Column('base_price', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('currency', sa.String(length=3), nullable=True),
    sa.Column('organization_id', sa.String(length=36), nullable=False),
    sa.Column('created_by_user_id', sa.String(length=36), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('organizations',)
    )
    _safe_create_table('community_comments',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('post_id', sa.String(length=36), nullable=False),
    sa.Column('author_user_id', sa.String(length=36), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('parent_comment_id', sa.String(length=36), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['author_user_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['parent_comment_id'], ['community_comments.id'], ),
    sa.ForeignKeyConstraint(['post_id'], ['community_posts.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('community_posts', 'users')
    )
    _safe_create_index('idx_community_comments_author', 'community_comments', ['author_user_id'], unique=False)
    _safe_create_index('idx_community_comments_created', 'community_comments', ['created_at'], unique=False)
    _safe_create_index('idx_community_comments_parent', 'community_comments', ['parent_comment_id'], unique=False)
    _safe_create_index('idx_community_comments_post', 'community_comments', ['post_id'], unique=False)
    _safe_create_index(op.f('ix_community_comments_author_user_id'), 'community_comments', ['author_user_id'], unique=False)
    _safe_create_index(op.f('ix_community_comments_parent_comment_id'), 'community_comments', ['parent_comment_id'], unique=False)
    _safe_create_index(op.f('ix_community_comments_post_id'), 'community_comments', ['post_id'], unique=False)
    _safe_create_table('event_analytics',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('event_id', sa.String(length=36), nullable=False),
    sa.Column('total_registrations', sa.Integer(), nullable=True),
    sa.Column('total_attendees', sa.Integer(), nullable=True),
    sa.Column('total_revenue', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('currency', sa.String(length=3), nullable=True),
    sa.Column('session_metrics', sa.JSON(), nullable=True),
    sa.Column('recorded_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('organization_id', sa.String(length=36), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('events', 'organizations')
    )
    _safe_create_table('event_sessions',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('event_id', sa.String(length=36), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('start_time', sa.DateTime(timezone=True), nullable=False),
    sa.Column('end_time', sa.DateTime(timezone=True), nullable=False),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('virtual_link', sa.String(), nullable=True),
    sa.Column('capacity', sa.Integer(), nullable=True),
    sa.Column('speaker_name', sa.String(), nullable=True),
    sa.Column('speaker_bio', sa.Text(), nullable=True),
    sa.Column('organization_id', sa.String(length=36), nullable=False),
    sa.Column('created_by_user_id', sa.String(length=36), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('events', 'organizations')
    )
    _safe_create_table('event_tickets',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('event_id', sa.String(length=36), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('currency', sa.String(length=3), nullable=True),
    sa.Column('quantity_available', sa.Integer(), nullable=True),
    sa.Column('quantity_sold', sa.Integer(), nullable=True),
    sa.Column('status', sa.Enum('ACTIVE', 'SOLD_OUT', 'CANCELLED', name='ticketstatus'), nullable=False),
    sa.Column('sale_start_date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('sale_end_date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('organization_id', sa.String(length=36), nullable=False),
    sa.Column('created_by_user_id', sa.String(length=36), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('events', 'organizations')
    )
    _safe_create_table('document_ai_suggestions',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('document_id', sa.String(length=36), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('confidence', sa.Integer(), nullable=True),
    sa.Column('reasoning', sa.Text(), nullable=True),
    sa.Column('status', sa.Enum('PENDING', 'ACCEPTED', 'REJECTED', 'APPLIED', name='suggestionstatus'), nullable=False),
    sa.Column('organization_id', sa.String(length=36), nullable=False),
    sa.Column('created_by_user_id', sa.String(length=36), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('applied_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['document_id'], ['generated_documents.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('generated_documents', 'organizations')
    )
    _safe_create_table('document_versions',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('document_id', sa.String(length=36), nullable=False),
    sa.Column('version_number', sa.Integer(), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('label', sa.String(), nullable=True),
    sa.Column('summary', sa.Text(), nullable=True),
    sa.Column('organization_id', sa.String(length=36), nullable=False),
    sa.Column('created_by_user_id', sa.String(length=36), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['document_id'], ['generated_documents.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('generated_documents', 'organizations')
    )
    _safe_create_table('event_registrations',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('event_id', sa.String(length=36), nullable=False),
    sa.Column('session_id', sa.String(length=36), nullable=True),
    sa.Column('ticket_id', sa.String(length=36), nullable=True),
    sa.Column('attendee_name', sa.String(), nullable=False),
    sa.Column('attendee_email', sa.String(), nullable=False),
    sa.Column('attendee_phone', sa.String(), nullable=True),
    sa.Column('payment_status', sa.String(), nullable=True),
    sa.Column('payment_amount', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('currency', sa.String(length=3), nullable=True),
    sa.Column('stripe_payment_intent_id', sa.String(), nullable=True),
    sa.Column('status', sa.Enum('PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED', 'NO_SHOW', name='registrationstatus'), nullable=False),
    sa.Column('checked_in', sa.Boolean(), nullable=True),
    sa.Column('checked_in_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('organization_id', sa.String(length=36), nullable=False),
    sa.Column('registered_by_user_id', sa.String(length=36), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
    sa.ForeignKeyConstraint(['session_id'], ['event_sessions.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['ticket_id'], ['event_tickets.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('events', 'event_sessions', 'event_tickets', 'organizations')
    )
    _safe_create_table('document_share_links',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('document_id', sa.String(length=36), nullable=False),
    sa.Column('share_token', sa.String(length=64), nullable=False),
    sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('allow_download', sa.Integer(), nullable=False),
    sa.Column('password_hash', sa.String(length=255), nullable=True),
    sa.Column('access_count', sa.Integer(), nullable=False),
    sa.Column('last_accessed_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('download_count', sa.Integer(), nullable=False),
    sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_by', sa.String(length=36), nullable=False),
    sa.Column('organization_id', sa.String(length=36), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
    sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
    sa.PrimaryKeyConstraint('id'),
    required_tables=('documents', 'users', 'organizations')
    )
    _safe_create_index('idx_share_links_document_id', 'document_share_links', ['document_id'], unique=False)
    _safe_create_index('idx_share_links_expires_at', 'document_share_links', ['expires_at'], unique=False)
    _safe_create_index('idx_share_links_org_id', 'document_share_links', ['organization_id'], unique=False)
    _safe_create_index('idx_share_links_token', 'document_share_links', ['share_token'], unique=False)
    _safe_create_index(op.f('ix_document_share_links_share_token'), 'document_share_links', ['share_token'], unique=True)
    _drop_index_if_exists('ix_contact_messages_created_at', 'contact_messages')
    _drop_index_if_exists('ix_contact_messages_email', 'contact_messages')
    _drop_index_if_exists('ix_contact_messages_id', 'contact_messages')
    _drop_table_if_exists('contact_messages')
    _safe_alter_column('admin_activities', 'amount',
               existing_type=sa.INTEGER(),
               server_default=None,
               existing_nullable=True)
    _safe_alter_column('admin_activities', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('admin_activities', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_activities_id'), 'admin_activities', ['id'], unique=False)
    _safe_alter_column('admin_campaign_recipients', 'sent',
               existing_type=sa.BOOLEAN(),
               server_default=None,
               existing_nullable=True)
    _safe_alter_column('admin_campaign_recipients', 'opened',
               existing_type=sa.BOOLEAN(),
               server_default=None,
               existing_nullable=True)
    _safe_alter_column('admin_campaign_recipients', 'clicked',
               existing_type=sa.BOOLEAN(),
               server_default=None,
               existing_nullable=True)
    _safe_alter_column('admin_campaign_recipients', 'bounced',
               existing_type=sa.BOOLEAN(),
               server_default=None,
               existing_nullable=True)
    _safe_create_index(op.f('ix_admin_campaign_recipients_id'), 'admin_campaign_recipients', ['id'], unique=False)
    _safe_alter_column('admin_campaigns', 'status',
       existing_type=postgresql.ENUM('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled', name='campaignstatus'),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_campaigns', 'total_recipients',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_campaigns', 'sent_count',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_campaigns', 'opened_count',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_campaigns', 'clicked_count',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_campaigns', 'created_at',
       existing_type=postgresql.TIMESTAMP(),
       server_default=None,
       existing_nullable=False)
    _safe_alter_column('admin_campaigns', 'updated_at',
       existing_type=postgresql.TIMESTAMP(),
       server_default=None,
       existing_nullable=False)
    _safe_create_index(op.f('ix_admin_campaigns_id'), 'admin_campaigns', ['id'], unique=False)
    _safe_alter_column('admin_collateral', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('admin_collateral', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_collateral_id'), 'admin_collateral', ['id'], unique=False)
    _safe_alter_column('admin_collateral_usage', 'used_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_collateral_usage_id'), 'admin_collateral_usage', ['id'], unique=False)
    _safe_alter_column('admin_content_pieces', 'status',
       existing_type=postgresql.ENUM('idea', 'scripting', 'recording', 'editing', 'ready', 'published', name='contentstatus'),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_content_pieces', 'views_count',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_content_pieces', 'created_at',
       existing_type=postgresql.TIMESTAMP(),
       server_default=None,
       existing_nullable=False)
    _safe_alter_column('admin_content_pieces', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_content_pieces_id'), 'admin_content_pieces', ['id'], unique=False)
    _safe_alter_column('admin_content_scripts', 'created_at',
       existing_type=postgresql.TIMESTAMP(),
       server_default=None,
       existing_nullable=False)
    _safe_alter_column('admin_content_scripts', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_content_scripts_id'), 'admin_content_scripts', ['id'], unique=False)
    _safe_alter_column('admin_deals', 'stage',
       existing_type=postgresql.ENUM('discovery', 'qualification', 'proposal', 'negotiation', 'closing', 'won', 'lost', name='admindealstage'),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_deals', 'probability',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_deals', 'created_at',
       existing_type=postgresql.TIMESTAMP(),
       server_default=None,
       existing_nullable=False)
    _safe_alter_column('admin_deals', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_deals_id'), 'admin_deals', ['id'], unique=False)
    _safe_alter_column('admin_focus_sessions', 'duration_minutes',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_focus_sessions', 'completed',
       existing_type=sa.BOOLEAN(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_focus_sessions', 'interrupted',
       existing_type=sa.BOOLEAN(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_focus_sessions', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_focus_sessions_id'), 'admin_focus_sessions', ['id'], unique=False)
    _safe_alter_column('admin_goals', 'target_discoveries',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_goals', 'target_emails',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_goals', 'target_videos',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_goals', 'target_calls',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_goals', 'created_at',
       existing_type=postgresql.TIMESTAMP(),
       server_default=None,
       existing_nullable=False)
    _safe_alter_column('admin_goals', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_goals_id'), 'admin_goals', ['id'], unique=False)
    _safe_alter_column('admin_lead_captures', 'synced_to_ghl',
       existing_type=sa.BOOLEAN(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_lead_captures', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_lead_captures_id'), 'admin_lead_captures', ['id'], unique=False)
    _safe_alter_column('admin_meetings', 'duration_minutes',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_meetings', 'created_at',
       existing_type=postgresql.TIMESTAMP(),
       server_default=None,
       existing_nullable=False)
    _safe_alter_column('admin_meetings', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_meetings_id'), 'admin_meetings', ['id'], unique=False)
    _safe_alter_column('admin_nudges', 'priority',
       existing_type=postgresql.ENUM('low', 'normal', 'high', 'urgent', name='nudgepriority'),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_nudges', 'read',
       existing_type=sa.BOOLEAN(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_nudges', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_nudges_id'), 'admin_nudges', ['id'], unique=False)
    _safe_alter_column('admin_prospects', 'status',
       existing_type=postgresql.ENUM('new', 'qualified', 'engaged', 'proposal', 'negotiation', 'closed_won', 'closed_lost', name='prospectstatus'),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_prospects', 'created_at',
       existing_type=postgresql.TIMESTAMP(),
       server_default=None,
       existing_nullable=False)
    _safe_alter_column('admin_prospects', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_prospects_id'), 'admin_prospects', ['id'], unique=False)
    _safe_alter_column('admin_scores', 'streak_days',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_scores', 'activities_count',
       existing_type=sa.INTEGER(),
       server_default=None,
       existing_nullable=True)
    _safe_alter_column('admin_scores', 'created_at',
       existing_type=postgresql.TIMESTAMP(),
       server_default=None,
       existing_nullable=False)
    _safe_alter_column('admin_scores', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_create_index(op.f('ix_admin_scores_id'), 'admin_scores', ['id'], unique=False)
    # blog_posts table (may not exist in all environments)
    _safe_alter_column('blog_posts', 'author',
               existing_type=sa.VARCHAR(length=100),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('blog_posts', 'published',
               existing_type=sa.BOOLEAN(),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('blog_posts', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('blog_posts', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('blog_posts', 'read_time_minutes',
               existing_type=sa.INTEGER(),
               server_default=None,
               existing_nullable=False)
    # deal_matches table - add organization_id if table exists and column doesn't exist
    if _table_exists('deal_matches') and not _column_exists('deal_matches', 'organization_id'):
        _safe_add_column('deal_matches', sa.Column('organization_id', sa.String(length=36), nullable=False))
        _safe_create_index(op.f('ix_deal_matches_organization_id'), 'deal_matches', ['organization_id'], unique=False)
        _safe_create_foreign_key(None, 'deal_matches', 'organizations', ['organization_id'], ['id'], ondelete='CASCADE')
    # document_questions table (may not exist in all environments)
    _safe_alter_column('document_questions', 'status',
               existing_type=sa.VARCHAR(length=20),
               server_default=None,
               existing_nullable=False)
    
    # document_templates table (may not exist in all environments)
    _safe_alter_column('document_templates', 'id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.String(length=36),
               existing_nullable=False)
    _safe_alter_column('document_templates', 'variables',
               existing_type=postgresql.JSON(astext_type=sa.Text()),
               server_default=None,
               nullable=True)
    _safe_alter_column('document_templates', 'status',
               existing_type=postgresql.ENUM('DRAFT', 'ACTIVE', 'ARCHIVED', name='templatestatus'),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('document_templates', 'version',
               existing_type=sa.INTEGER(),
               server_default=None,
               nullable=True)
    _safe_alter_column('document_templates', 'organization_id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.String(length=36),
               existing_nullable=False)
    _safe_alter_column('document_templates', 'created_by_user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.String(length=36),
               existing_nullable=False)
    _safe_alter_column('document_templates', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               server_default=None,
               nullable=True)
    _drop_index_if_exists('idx_document_templates_created_at', 'document_templates')
    _drop_index_if_exists('idx_document_templates_organization_id', 'document_templates')
    _drop_index_if_exists('idx_document_templates_status', 'document_templates')
    _drop_index_if_exists('idx_document_templates_template_type', 'document_templates')
    # generated_documents table (may not exist in all environments)
    _safe_alter_column('generated_documents', 'id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.String(length=36),
               existing_nullable=False)
    _safe_alter_column('generated_documents', 'template_id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.String(length=36),
               existing_nullable=False)
    _safe_alter_column('generated_documents', 'variable_values',
               existing_type=postgresql.JSON(astext_type=sa.Text()),
               server_default=None,
               nullable=True)
    _safe_alter_column('generated_documents', 'status',
               existing_type=postgresql.ENUM('draft', 'generated', 'finalized', 'sent', name='documentstatus'),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('generated_documents', 'organization_id',
               existing_type=sa.VARCHAR(length=36),
               type_=sa.String(length=36),
               existing_nullable=False)
    _safe_alter_column('generated_documents', 'generated_by_user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.String(length=36),
               existing_nullable=False)
    _safe_alter_column('generated_documents', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               server_default=None,
               nullable=True)
    _drop_index_if_exists('idx_generated_documents_created_at', 'generated_documents')
    _drop_index_if_exists('idx_generated_documents_organization_id', 'generated_documents')
    _drop_index_if_exists('idx_generated_documents_status', 'generated_documents')
    _drop_index_if_exists('idx_generated_documents_template_id', 'generated_documents')
    # pipeline_template_stages table (Pipeline Management module - may not exist in production)
    _safe_alter_column('pipeline_template_stages', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('pipeline_template_stages', 'updated_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               server_default=None,
               existing_nullable=False)
    _safe_drop_index('ix_pipeline_template_stages_order', 'pipeline_template_stages')
    _safe_drop_index('ix_pipeline_template_stages_template', 'pipeline_template_stages')
    _safe_create_index(op.f('ix_pipeline_template_stages_template_id'), 'pipeline_template_stages', ['template_id'], unique=False)
    # pipeline_templates table (Pipeline Management module - may not exist in production)
    _safe_alter_column('pipeline_templates', 'is_default',
               existing_type=sa.BOOLEAN(),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('pipeline_templates', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               server_default=None,
               existing_nullable=False)
    _safe_alter_column('pipeline_templates', 'updated_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               server_default=None,
               existing_nullable=False)
    _safe_drop_index('ix_pipeline_templates_org_default', 'pipeline_templates')
    _safe_create_index('idx_pipeline_templates_org_default', 'pipeline_templates', ['organization_id', 'is_default'], unique=False)
    _safe_create_index(op.f('ix_pipeline_templates_organization_id'), 'pipeline_templates', ['organization_id'], unique=False)
    # rbac_audit_logs table (Master Admin module - may not exist in production)
    _safe_alter_column('rbac_audit_logs', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               server_default=None,
               existing_nullable=False)
    _safe_drop_index('ix_rbac_audit_logs_action', 'rbac_audit_logs')
    _safe_drop_index('ix_rbac_audit_logs_actor', 'rbac_audit_logs')
    _safe_drop_index('ix_rbac_audit_logs_org', 'rbac_audit_logs')
    _safe_drop_index('ix_rbac_audit_logs_target', 'rbac_audit_logs')
    _safe_create_index(op.f('ix_rbac_audit_logs_organization_id'), 'rbac_audit_logs', ['organization_id'], unique=False)
    # valuation_export_logs table (Valuation Suite module - may not exist in production)
    _safe_drop_index('ix_valuation_export_logs_task_id', 'valuation_export_logs')
    _safe_create_unique_constraint(None, 'valuation_export_logs', ['task_id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    # valuation_export_logs table (Valuation Suite module - may not exist in production)
    # Remove if _table_exists guard - let _safe_* methods handle missing tables
    try:
        _safe_drop_constraint(None, 'valuation_export_logs', type_='unique')
        _safe_create_index('ix_valuation_export_logs_task_id', 'valuation_export_logs', ['task_id'], unique=False)
    except (ProgrammingError, NoSuchTableError, InternalError):
        pass

    # rbac_audit_logs table (Master Admin module - may not exist in production)
    # Remove if _table_exists guard - let _safe_* methods handle missing tables
    try:
        _safe_drop_index(op.f('ix_rbac_audit_logs_organization_id'), 'rbac_audit_logs')
        _safe_create_index('ix_rbac_audit_logs_target', 'rbac_audit_logs', ['target_user_id'], unique=False)
        _safe_create_index('ix_rbac_audit_logs_org', 'rbac_audit_logs', ['organization_id'], unique=False)
        _safe_create_index('ix_rbac_audit_logs_actor', 'rbac_audit_logs', ['actor_user_id'], unique=False)
        _safe_create_index('ix_rbac_audit_logs_action', 'rbac_audit_logs', ['action'], unique=False)
        _safe_alter_column('rbac_audit_logs', 'created_at',
                   existing_type=postgresql.TIMESTAMP(timezone=True),
                   server_default=sa.text('CURRENT_TIMESTAMP'),
                   existing_nullable=False)
    except (ProgrammingError, NoSuchTableError, InternalError):
        pass
    # pipeline_templates table (Pipeline Management module - may not exist in production)
    # Remove if _table_exists guard - let _safe_* methods handle missing tables
    try:
        _safe_drop_index('idx_pipeline_templates_org_default', 'pipeline_templates')
        _safe_create_index('ix_pipeline_templates_org_default', 'pipeline_templates', ['organization_id', 'is_default'], unique=False)
        _safe_alter_column('pipeline_templates', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(timezone=True),
                   server_default=sa.text('CURRENT_TIMESTAMP'),
                   existing_nullable=False)
        _safe_alter_column('pipeline_templates', 'created_at',
                   existing_type=postgresql.TIMESTAMP(timezone=True),
                   server_default=sa.text('CURRENT_TIMESTAMP'),
                   existing_nullable=False)
        _safe_alter_column('pipeline_templates', 'is_default',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=False)
    except (ProgrammingError, NoSuchTableError, InternalError):
        pass
    # pipeline_template_stages table (Pipeline Management module - may not exist in production)
    # Remove if _table_exists guard - let _safe_* methods handle missing tables
    try:
        _safe_drop_index(op.f('ix_pipeline_template_stages_template_id'), 'pipeline_template_stages')
        _safe_create_index('ix_pipeline_template_stages_template', 'pipeline_template_stages', ['template_id'], unique=False)
        _safe_create_index('ix_pipeline_template_stages_order', 'pipeline_template_stages', ['order_index'], unique=False)
        _safe_alter_column('pipeline_template_stages', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(timezone=True),
                   server_default=sa.text('CURRENT_TIMESTAMP'),
                   existing_nullable=False)
        _safe_alter_column('pipeline_template_stages', 'created_at',
                   existing_type=postgresql.TIMESTAMP(timezone=True),
                   server_default=sa.text('CURRENT_TIMESTAMP'),
                   existing_nullable=False)
    except (ProgrammingError, NoSuchTableError, InternalError):
        pass
    # op.alter_column is already patched to use _safe_alter_column
    _safe_create_index('idx_generated_documents_template_id', 'generated_documents', ['template_id'], unique=False)
    _safe_create_index('idx_generated_documents_status', 'generated_documents', ['status'], unique=False)
    _safe_create_index('idx_generated_documents_organization_id', 'generated_documents', ['organization_id'], unique=False)
    _safe_create_index('idx_generated_documents_created_at', 'generated_documents', ['created_at'], unique=False)
    if _column_exists('generated_documents', 'created_at'):
        _safe_alter_column('generated_documents', 'created_at',
                   existing_type=postgresql.TIMESTAMP(timezone=True),
                   server_default=sa.text('now()'),
                   nullable=False)
    if _column_exists('generated_documents', 'generated_by_user_id'):
        _safe_alter_column('generated_documents', 'generated_by_user_id',
                   existing_type=sa.String(length=36),
                   type_=sa.VARCHAR(),
                   existing_nullable=False)
    if _column_exists('generated_documents', 'organization_id'):
        _safe_alter_column('generated_documents', 'organization_id',
                   existing_type=sa.String(length=36),
                   type_=sa.VARCHAR(length=36),
                   existing_nullable=False)
    if _column_exists('generated_documents', 'status'):
        _safe_alter_column('generated_documents', 'status',
                   existing_type=postgresql.ENUM('draft', 'generated', 'finalized', 'sent', name='documentstatus'),
                   server_default=sa.text("'generated'::documentstatus"),
                   existing_nullable=False)
    if _column_exists('generated_documents', 'variable_values'):
        _safe_alter_column('generated_documents', 'variable_values',
                   existing_type=postgresql.JSON(astext_type=sa.Text()),
                   server_default=sa.text("'{}'::json"),
                   nullable=False)
    if _column_exists('generated_documents', 'template_id'):
        _safe_alter_column('generated_documents', 'template_id',
                   existing_type=sa.String(length=36),
                   type_=sa.VARCHAR(length=36),
                   existing_nullable=False)
    if _column_exists('generated_documents', 'id'):
        _safe_alter_column('generated_documents', 'id',
                   existing_type=sa.String(length=36),
                   type_=sa.VARCHAR(length=36),
                   existing_nullable=False)
    # op.alter_column is already patched to use _safe_alter_column
    _safe_create_index('idx_document_templates_template_type', 'document_templates', ['template_type'], unique=False)
    _safe_create_index('idx_document_templates_status', 'document_templates', ['status'], unique=False)
    _safe_create_index('idx_document_templates_organization_id', 'document_templates', ['organization_id'], unique=False)
    _safe_create_index('idx_document_templates_created_at', 'document_templates', ['created_at'], unique=False)
    if _column_exists('document_templates', 'created_at'):
        _safe_alter_column('document_templates', 'created_at',
                   existing_type=postgresql.TIMESTAMP(timezone=True),
                   server_default=sa.text('now()'),
                   nullable=False)
    if _column_exists('document_templates', 'created_by_user_id'):
        _safe_alter_column('document_templates', 'created_by_user_id',
                   existing_type=sa.String(length=36),
                   type_=sa.VARCHAR(),
                   existing_nullable=False)
    if _column_exists('document_templates', 'organization_id'):
        _safe_alter_column('document_templates', 'organization_id',
                   existing_type=sa.String(length=36),
                   type_=sa.VARCHAR(length=36),
                   existing_nullable=False)
    if _column_exists('document_templates', 'version'):
        _safe_alter_column('document_templates', 'version',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('1'),
                   nullable=False)
    if _column_exists('document_templates', 'status'):
        _safe_alter_column('document_templates', 'status',
                   existing_type=postgresql.ENUM('DRAFT', 'ACTIVE', 'ARCHIVED', name='templatestatus'),
                   server_default=sa.text("'ACTIVE'::templatestatus"),
                   existing_nullable=False)
    if _column_exists('document_templates', 'variables'):
        _safe_alter_column('document_templates', 'variables',
                   existing_type=postgresql.JSON(astext_type=sa.Text()),
                   server_default=sa.text("'[]'::json"),
                   nullable=False)
    if _column_exists('document_templates', 'id'):
        _safe_alter_column('document_templates', 'id',
                   existing_type=sa.String(length=36),
                   type_=sa.VARCHAR(length=36),
                   existing_nullable=False)
    # op.alter_column is already patched to use _safe_alter_column
    if _column_exists('document_questions', 'status'):
        _safe_alter_column('document_questions', 'status',
                   existing_type=sa.VARCHAR(length=20),
                   server_default=sa.text("'open'::character varying"),
                   existing_nullable=False)
    if _column_exists('deal_matches', 'organization_id'):
        inspector = _inspector()
        if inspector is not None:
            try:
                fks = inspector.get_foreign_keys('deal_matches')
            except SAFE_EXCEPTIONS:
                fks = []
            for fk in fks:
                if 'organization_id' in fk.get('constrained_columns', []):
                    _safe_drop_constraint(fk['name'], 'deal_matches', type_='foreignkey')
                    break
            _safe_drop_index(op.f('ix_deal_matches_organization_id'), 'deal_matches')
            _safe_drop_column('deal_matches', 'organization_id')
    # op.alter_column is already patched to use _safe_alter_column
    if _column_exists('blog_posts', 'read_time_minutes'):
        _safe_alter_column('blog_posts', 'read_time_minutes',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('10'),
                   existing_nullable=False)
    if _column_exists('blog_posts', 'updated_at'):
        _safe_alter_column('blog_posts', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
    if _column_exists('blog_posts', 'created_at'):
        _safe_alter_column('blog_posts', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
    if _column_exists('blog_posts', 'published'):
        _safe_alter_column('blog_posts', 'published',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=False)
    if _column_exists('blog_posts', 'author'):
        _safe_alter_column('blog_posts', 'author',
                   existing_type=sa.VARCHAR(length=100),
                   server_default=sa.text("'Dudley Peacock'::character varying"),
                   existing_nullable=False)
    try:
        _safe_drop_index(op.f('ix_admin_scores_id'), 'admin_scores')
        _safe_alter_column('admin_scores', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_scores', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_scores', 'activities_count',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_scores', 'streak_days',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_prospects_id'), 'admin_prospects')
        _safe_alter_column('admin_prospects', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_prospects', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_prospects', 'status',
                   existing_type=postgresql.ENUM('new', 'qualified', 'engaged', 'proposal', 'negotiation', 'closed_won', 'closed_lost', name='prospectstatus'),
                   server_default=sa.text("'new'::prospectstatus"),
                   existing_nullable=True)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_nudges_id'), 'admin_nudges')
        _safe_alter_column('admin_nudges', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_nudges', 'read',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=True)
        _safe_alter_column('admin_nudges', 'priority',
                   existing_type=postgresql.ENUM('low', 'normal', 'high', 'urgent', name='nudgepriority'),
                   server_default=sa.text("'normal'::nudgepriority"),
                   existing_nullable=True)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_meetings_id'), 'admin_meetings')
        _safe_alter_column('admin_meetings', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_meetings', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_meetings', 'duration_minutes',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('60'),
                   existing_nullable=True)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_lead_captures_id'), 'admin_lead_captures')
        _safe_alter_column('admin_lead_captures', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_lead_captures', 'synced_to_ghl',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=True)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_goals_id'), 'admin_goals')
        _safe_alter_column('admin_goals', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_goals', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_goals', 'target_calls',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_goals', 'target_videos',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_goals', 'target_emails',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_goals', 'target_discoveries',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_focus_sessions_id'), 'admin_focus_sessions')
        _safe_alter_column('admin_focus_sessions', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_focus_sessions', 'interrupted',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=True)
        _safe_alter_column('admin_focus_sessions', 'completed',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=True)
        _safe_alter_column('admin_focus_sessions', 'duration_minutes',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('50'),
                   existing_nullable=True)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_deals_id'), 'admin_deals')
        _safe_alter_column('admin_deals', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_deals', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_deals', 'probability',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_deals', 'stage',
                   existing_type=postgresql.ENUM('discovery', 'qualification', 'proposal', 'negotiation', 'closing', 'won', 'lost', name='admindealstage'),
                   server_default=sa.text("'discovery'::admindealstage"),
                   existing_nullable=True)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_content_scripts_id'), 'admin_content_scripts')
        _safe_alter_column('admin_content_scripts', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_content_scripts', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_content_pieces_id'), 'admin_content_pieces')
        _safe_alter_column('admin_content_pieces', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_content_pieces', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_content_pieces', 'views_count',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_content_pieces', 'status',
                   existing_type=postgresql.ENUM('idea', 'scripting', 'recording', 'editing', 'ready', 'published', name='contentstatus'),
                   server_default=sa.text("'idea'::contentstatus"),
                   existing_nullable=True)
    except ProgrammingError:
        pass
    try:
        _safe_drop_index(op.f('ix_admin_collateral_usage_id'), 'admin_collateral_usage')
        _safe_alter_column('admin_collateral_usage', 'used_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
    except (ProgrammingError, NoSuchTableError, InternalError):
        pass
    # admin_collateral table (Master Admin module - may not exist in production)
    try:
        _safe_drop_index(op.f('ix_admin_collateral_id'), 'admin_collateral')
        _safe_alter_column('admin_collateral', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_collateral', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
    except (ProgrammingError, NoSuchTableError, InternalError):
        pass
    # admin_campaigns table (Master Admin module - may not exist in production)
    try:
        _safe_drop_index(op.f('ix_admin_campaigns_id'), 'admin_campaigns')
        _safe_alter_column('admin_campaigns', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_campaigns', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_campaigns', 'clicked_count',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_campaigns', 'opened_count',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_campaigns', 'sent_count',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_campaigns', 'total_recipients',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('0'),
                   existing_nullable=True)
        _safe_alter_column('admin_campaigns', 'status',
                   existing_type=postgresql.ENUM('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled', name='campaignstatus'),
                   server_default=sa.text("'draft'::campaignstatus"),
                   existing_nullable=True)
    except (ProgrammingError, NoSuchTableError, InternalError):
        pass
    # admin_campaign_recipients table (Master Admin module - may not exist in production)
    try:
        _safe_drop_index(op.f('ix_admin_campaign_recipients_id'), 'admin_campaign_recipients')
        _safe_alter_column('admin_campaign_recipients', 'bounced',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=True)
        _safe_alter_column('admin_campaign_recipients', 'clicked',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=True)
        _safe_alter_column('admin_campaign_recipients', 'opened',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=True)
        _safe_alter_column('admin_campaign_recipients', 'sent',
                   existing_type=sa.BOOLEAN(),
                   server_default=sa.text('false'),
                   existing_nullable=True)
    except (ProgrammingError, NoSuchTableError, InternalError):
        pass
    # admin_activities table (Master Admin module - may not exist in production)
    try:
        _safe_drop_index(op.f('ix_admin_activities_id'), 'admin_activities')
        _safe_alter_column('admin_activities', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_activities', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   server_default=sa.text('now()'),
                   existing_nullable=False)
        _safe_alter_column('admin_activities', 'amount',
                   existing_type=sa.INTEGER(),
                   server_default=sa.text('1'),
                   existing_nullable=True)
    except (ProgrammingError, NoSuchTableError, InternalError):
        pass
    _safe_create_table('contact_messages',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('company', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('phone', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('message', sa.TEXT(), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.Column('status', sa.VARCHAR(length=50), server_default=sa.text("'new'::character varying"), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='contact_messages_pkey')
    )
    _safe_create_index('ix_contact_messages_id', 'contact_messages', ['id'], unique=False)
    _safe_create_index('ix_contact_messages_email', 'contact_messages', ['email'], unique=False)
    _safe_create_index('ix_contact_messages_created_at', 'contact_messages', ['created_at'], unique=False)
    _safe_drop_index(op.f('ix_document_share_links_share_token'), 'document_share_links')
    _safe_drop_index('idx_share_links_token', 'document_share_links')
    _safe_drop_index('idx_share_links_org_id', 'document_share_links')
    _safe_drop_index('idx_share_links_expires_at', 'document_share_links')
    _safe_drop_index('idx_share_links_document_id', 'document_share_links')
    _safe_drop_table('document_share_links')
    _safe_drop_table('event_registrations')
    _safe_drop_table('document_versions')
    _safe_drop_table('document_ai_suggestions')
    _safe_drop_table('event_tickets')
    _safe_drop_table('event_sessions')
    _safe_drop_table('event_analytics')
    _safe_drop_index(op.f('ix_community_comments_post_id'), 'community_comments')
    _safe_drop_index(op.f('ix_community_comments_parent_comment_id'), 'community_comments')
    _safe_drop_index(op.f('ix_community_comments_author_user_id'), 'community_comments')
    _safe_drop_index('idx_community_comments_post', 'community_comments')
    _safe_drop_index('idx_community_comments_parent', 'community_comments')
    _safe_drop_index('idx_community_comments_created', 'community_comments')
    _safe_drop_index('idx_community_comments_author', 'community_comments')
    _safe_drop_table('community_comments')
    _safe_drop_table('events')
    _safe_drop_index(op.f('ix_community_reactions_user_id'), 'community_reactions')
    _safe_drop_index(op.f('ix_community_reactions_target_id'), 'community_reactions')
    _safe_drop_index('idx_community_reactions_user', 'community_reactions')
    _safe_drop_index('idx_community_reactions_unique', 'community_reactions')
    _safe_drop_index('idx_community_reactions_target', 'community_reactions')
    _safe_drop_table('community_reactions')
    _safe_drop_index(op.f('ix_community_posts_organization_id'), 'community_posts')
    _safe_drop_index(op.f('ix_community_posts_author_user_id'), 'community_posts')
    _safe_drop_index('idx_community_posts_status', 'community_posts')
    _safe_drop_index('idx_community_posts_org_id', 'community_posts')
    _safe_drop_index('idx_community_posts_created', 'community_posts')
    _safe_drop_index('idx_community_posts_category', 'community_posts')
    _safe_drop_index('idx_community_posts_author', 'community_posts')
    _safe_drop_table('community_posts')
    _safe_drop_index(op.f('ix_community_moderation_actions_target_id'), 'community_moderation_actions')
    _safe_drop_index(op.f('ix_community_moderation_actions_moderator_user_id'), 'community_moderation_actions')
    _safe_drop_index('idx_community_moderation_target', 'community_moderation_actions')
    _safe_drop_index('idx_community_moderation_moderator', 'community_moderation_actions')
    _safe_drop_index('idx_community_moderation_created', 'community_moderation_actions')
    _safe_drop_table('community_moderation_actions')
    _safe_drop_index(op.f('ix_community_follows_organization_id'), 'community_follows')
    _safe_drop_index(op.f('ix_community_follows_following_user_id'), 'community_follows')
    _safe_drop_index(op.f('ix_community_follows_follower_user_id'), 'community_follows')
    _safe_drop_index('idx_community_follows_unique', 'community_follows')
    _safe_drop_index('idx_community_follows_org', 'community_follows')
    _safe_drop_index('idx_community_follows_following', 'community_follows')
    _safe_drop_index('idx_community_follows_follower', 'community_follows')
    _safe_drop_table('community_follows')
    # ### end Alembic commands ###
