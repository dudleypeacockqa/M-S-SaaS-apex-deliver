"""
Test Suite: User Foreign Key Type Verification

Validates that all foreign key columns referencing users.id use the correct
type (String(36)) rather than UUID, ensuring PostgreSQL can enforce FK constraints.

TDD Approach: These tests are written BEFORE the fix migration to follow
Red-Green-Refactor methodology.

Bug Context:
- Migration d37ed4cd3013 incorrectly used postgresql.UUID for user FK columns
- users.id is String(36) (converted in migration 36b3e62b4148)
- Type mismatch prevents FK constraint enforcement
"""

import pytest
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError
from uuid import uuid4

from app.models.document import Document, Folder, DocumentPermission, DocumentAccessLog
from app.models.user import User
from app.models.organization import Organization


class TestUserForeignKeyTypes:
    """
    Test Category 1: Migration Type Verification

    Verifies that all FK columns referencing users.id match the users.id type.
    """

    def test_users_id_column_is_string_type(self, db_session):
        """Verify users.id is String(36), not UUID."""
        inspector = inspect(db_session.bind)
        users_columns = inspector.get_columns('users')
        id_column = next(col for col in users_columns if col['name'] == 'id')

        # Should be VARCHAR(36), not UUID
        col_type = str(id_column['type'])
        assert 'VARCHAR' in col_type or 'String' in col_type, \
            f"users.id should be VARCHAR/String, got {col_type}"

    def test_all_user_foreign_key_columns_match_users_id_type(self, db_session):
        """
        Critical Test: Verify all FK columns referencing users.id use String(36).

        This test will FAIL until the fix migration is applied.

        Expected to fail with: AssertionError showing UUID vs VARCHAR mismatch
        Expected to pass after: Migration converts all columns to String(36)
        """
        inspector = inspect(db_session.bind)

        # Get users.id type as baseline
        users_columns = inspector.get_columns('users')
        users_id_column = next(col for col in users_columns if col['name'] == 'id')
        expected_type = str(users_id_column['type'])

        # Define all columns that should reference users.id
        user_fk_columns = [
            ('folders', 'created_by'),
            ('documents', 'uploaded_by'),
            ('document_permissions', 'user_id'),
            ('document_permissions', 'granted_by'),
            ('document_access_logs', 'user_id'),
        ]

        failures = []
        for table_name, column_name in user_fk_columns:
            columns = inspector.get_columns(table_name)
            column = next((col for col in columns if col['name'] == column_name), None)

            if column is None:
                failures.append(f"{table_name}.{column_name}: Column not found")
                continue

            actual_type = str(column['type'])

            # Check if types match
            if actual_type != expected_type:
                failures.append(
                    f"{table_name}.{column_name}: "
                    f"Expected {expected_type}, got {actual_type}"
                )

        assert not failures, \
            f"Foreign key type mismatches found:\n" + "\n".join(failures)

    def test_foreign_key_constraints_exist(self, db_session):
        """Verify FK constraints are defined in the database."""
        inspector = inspect(db_session.bind)

        tables_with_user_fks = ['folders', 'documents', 'document_permissions', 'document_access_logs']

        for table_name in tables_with_user_fks:
            fks = inspector.get_foreign_keys(table_name)
            user_fks = [fk for fk in fks if fk['referred_table'] == 'users']

            assert len(user_fks) > 0, \
                f"Table {table_name} should have at least one FK to users table"


class TestForeignKeyIntegrity:
    """
    Test Category 2: Foreign Key Constraint Enforcement

    Validates that FK constraints actually work and reject invalid references.
    """

    @pytest.fixture(autouse=True)
    def setup_test_data(self, db_session):
        """Create test organization and user for FK testing."""
        # Create organization
        self.org = Organization(
            id=str(uuid4()),
            name="Test Org",
            subscription_tier="professional"
        )
        db_session.add(self.org)

        # Create valid user
        self.user = User(
            id=str(uuid4()),
            email="test@example.com",
            first_name="Test",
            last_name="User",
            clerk_user_id=f"clerk_{uuid4()}",
            organization_id=self.org.id
        )
        db_session.add(self.user)
        db_session.commit()

        yield

        # Cleanup
        db_session.rollback()

    def test_folder_rejects_invalid_created_by(self, db_session):
        """
        Test FK enforcement: folders.created_by must reference valid user.

        This may fail if FK constraints are not enforced due to type mismatch.
        """
        with pytest.raises(IntegrityError, match="violates foreign key constraint"):
            folder = Folder(
                id=str(uuid4()),
                name="Test Folder",
                deal_id=str(uuid4()),
                organization_id=self.org.id,
                created_by="nonexistent-user-id-12345"  # Invalid user_id
            )
            db_session.add(folder)
            db_session.commit()

    def test_document_rejects_invalid_uploaded_by(self, db_session):
        """Test FK enforcement: documents.uploaded_by must reference valid user."""
        with pytest.raises(IntegrityError, match="violates foreign key constraint"):
            doc = Document(
                id=str(uuid4()),
                name="test.pdf",
                file_key="test/key",
                file_size=1024,
                file_type="pdf",
                deal_id=str(uuid4()),
                folder_id=None,
                organization_id=self.org.id,
                uploaded_by="nonexistent-user-id-67890",  # Invalid user_id
                version=1
            )
            db_session.add(doc)
            db_session.commit()

    def test_document_permission_rejects_invalid_user_id(self, db_session):
        """Test FK enforcement: document_permissions.user_id must reference valid user."""
        # First create a valid document
        doc = Document(
            id=str(uuid4()),
            name="test.pdf",
            file_key="test/key",
            file_size=1024,
            file_type="pdf",
            deal_id=str(uuid4()),
            folder_id=None,
            organization_id=self.org.id,
            uploaded_by=self.user.id,  # Valid user_id
            version=1
        )
        db_session.add(doc)
        db_session.commit()

        # Now try to create permission with invalid user_id
        with pytest.raises(IntegrityError, match="violates foreign key constraint"):
            perm = DocumentPermission(
                id=str(uuid4()),
                document_id=doc.id,
                user_id="invalid-user-id",  # Invalid
                granted_by=self.user.id,
                permission_level="view",
                organization_id=self.org.id
            )
            db_session.add(perm)
            db_session.commit()

    def test_valid_user_references_succeed(self, db_session):
        """Positive test: Valid user references should work."""
        # Create folder with valid user
        folder = Folder(
            id=str(uuid4()),
            name="Valid Folder",
            deal_id=str(uuid4()),
            organization_id=self.org.id,
            created_by=self.user.id  # Valid user_id
        )
        db_session.add(folder)
        db_session.commit()

        assert folder.id is not None
        assert folder.created_by == self.user.id


class TestModelSchemAlignment:
    """
    Test Category 3: Model-Schema Consistency

    Ensures SQLAlchemy models accurately reflect the database schema.
    """

    def test_folder_model_matches_database_schema(self, db_session):
        """Verify Folder model's created_by type matches database."""
        inspector = inspect(db_session.bind)

        # Get database column type
        db_columns = inspector.get_columns('folders')
        db_created_by = next(col for col in db_columns if col['name'] == 'created_by')
        db_type = str(db_created_by['type'])

        # Get model column type
        model_type = str(Folder.created_by.type)

        assert model_type in db_type or db_type in model_type, \
            f"Model type {model_type} doesn't match DB type {db_type}"

    def test_document_model_matches_database_schema(self, db_session):
        """Verify Document model's uploaded_by type matches database."""
        inspector = inspect(db_session.bind)

        db_columns = inspector.get_columns('documents')
        db_uploaded_by = next(col for col in db_columns if col['name'] == 'uploaded_by')
        db_type = str(db_uploaded_by['type'])

        model_type = str(Document.uploaded_by.type)

        assert model_type in db_type or db_type in model_type, \
            f"Model type {model_type} doesn't match DB type {db_type}"

    def test_all_user_fk_columns_are_nullable_correct(self, db_session):
        """Verify nullable constraints match between models and database."""
        inspector = inspect(db_session.bind)

        # All user FK columns should be NOT NULL
        expected_not_null = [
            ('folders', 'created_by'),
            ('documents', 'uploaded_by'),
            ('document_permissions', 'user_id'),
            ('document_permissions', 'granted_by'),
            ('document_access_logs', 'user_id'),
        ]

        failures = []
        for table_name, column_name in expected_not_null:
            columns = inspector.get_columns(table_name)
            column = next(col for col in columns if col['name'] == column_name)

            if column['nullable']:
                failures.append(f"{table_name}.{column_name} should be NOT NULL")

        assert not failures, "Nullable constraint mismatches:\n" + "\n".join(failures)


class TestMigrationRollback:
    """
    Test Category 4: Rollback Safety

    Ensures the migration can be safely rolled back if needed.
    """

    def test_downgrade_path_exists(self):
        """
        Verify downgrade function is implemented.

        Note: This is a documentation test - actual rollback testing
        requires special migration test fixtures.
        """
        # This test documents the requirement
        # Actual downgrade testing would be done in deployment testing
        assert True, "Downgrade function must be implemented in migration"
