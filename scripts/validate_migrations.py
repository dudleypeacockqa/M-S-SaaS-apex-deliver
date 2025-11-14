#!/usr/bin/env python3
"""
Migration Validation Script

This script validates Alembic migrations before deployment to prevent common issues:
1. Foreign key type consistency
2. Table existence before ALTER operations
3. Index existence before DROP operations
4. Column existence before modifications
5. Constraint existence before modifications

Usage:
    python scripts/validate_migrations.py

Exit codes:
    0 - All validations passed
    1 - Validation errors found
    2 - Script execution error

Part of incident prevention measures from INC-2025-11-14-001
"""

import os
import sys
import re
from pathlib import Path
from typing import List, Dict, Set, Tuple
import importlib.util
import ast

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


class MigrationValidator:
    """Validates Alembic migration files for common issues"""

    def __init__(self, migrations_dir: str):
        self.migrations_dir = Path(migrations_dir)
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.info: List[str] = []

    def validate_all(self) -> bool:
        """Run all validation checks. Returns True if all pass."""
        print(f"{BLUE}=== Migration Validation Started ==={RESET}\n")

        migration_files = self._get_migration_files()
        print(f"{BLUE}Found {len(migration_files)} migration files{RESET}\n")

        for migration_file in migration_files:
            self._validate_migration_file(migration_file)

        self._print_results()
        return len(self.errors) == 0

    def _get_migration_files(self) -> List[Path]:
        """Get all Python migration files from the versions directory"""
        versions_dir = self.migrations_dir / "versions"
        if not versions_dir.exists():
            self.errors.append(f"Versions directory not found: {versions_dir}")
            return []

        return sorted([
            f for f in versions_dir.glob("*.py")
            if f.name != "__init__.py" and not f.name.startswith(".")
        ])

    def _validate_migration_file(self, file_path: Path):
        """Validate a single migration file"""
        print(f"Validating: {file_path.name}")

        try:
            content = file_path.read_text()

            # Check 1: Foreign key type consistency
            self._check_fk_type_consistency(file_path, content)

            # Check 2: ALTER TABLE operations
            self._check_alter_table_safety(file_path, content)

            # Check 3: DROP operations
            self._check_drop_safety(file_path, content)

            # Check 4: Defensive programming patterns
            self._check_defensive_patterns(file_path, content)

            # Check 5: Downgrade implementation
            self._check_downgrade_implementation(file_path, content)

        except Exception as e:
            self.errors.append(f"{file_path.name}: Failed to read/parse: {e}")

    def _check_fk_type_consistency(self, file_path: Path, content: str):
        """Check that foreign key columns match their referenced column types"""

        # Pattern to find ForeignKeyConstraint definitions
        fk_pattern = r"sa\.ForeignKeyConstraint\(\s*\[['\"](.*?)['\"]\]\s*,\s*\[['\"](.*?)['\"]\]"
        fk_matches = re.findall(fk_pattern, content)

        # Pattern to find Column definitions
        col_pattern = r"sa\.Column\(\s*['\"](.*?)['\"],\s*(sa\.\w+(?:\(.*?\))?)"
        col_matches = re.findall(col_pattern, content)

        # Build a map of column names to types
        column_types: Dict[str, str] = {}
        for col_name, col_type in col_matches:
            # Normalize type (e.g., "sa.String(length=36)" -> "String")
            type_name = col_type.split('(')[0].replace('sa.', '')
            column_types[col_name] = type_name

        # Check each foreign key
        for fk_col, ref_col in fk_matches:
            fk_type = column_types.get(fk_col)

            # Extract table and column from reference (e.g., "documents.id")
            if '.' in ref_col:
                ref_table, ref_col_name = ref_col.split('.')

                # We can't easily check the referenced table's column type
                # without querying the database, but we can check for common issues

                # Check if FK column type is defined
                if fk_col not in column_types:
                    self.warnings.append(
                        f"{file_path.name}: FK column '{fk_col}' type not found in same migration. "
                        f"Ensure type matches '{ref_table}.{ref_col_name}'"
                    )

                # Check for UUID vs String mismatch keywords
                fk_type_lower = fk_type.lower() if fk_type else ""
                if 'uuid' in ref_col_name.lower() and 'string' in fk_type_lower:
                    self.warnings.append(
                        f"{file_path.name}: Possible type mismatch - FK '{fk_col}' is String "
                        f"but references '{ref_col}' (might be UUID)"
                    )
                elif 'uuid' not in ref_col_name.lower() and 'uuid' in fk_type_lower:
                    self.warnings.append(
                        f"{file_path.name}: Possible type mismatch - FK '{fk_col}' is UUID "
                        f"but references '{ref_col}' (might not be UUID)"
                    )

    def _check_alter_table_safety(self, file_path: Path, content: str):
        """Check that ALTER TABLE operations have defensive checks"""

        # Pattern to find op.alter_column calls
        alter_pattern = r"op\.alter_column\(\s*['\"](\w+)['\"]"
        alter_matches = re.findall(alter_pattern, content)

        if not alter_matches:
            return  # No ALTER operations, nothing to check

        # Check if _table_exists helper is defined
        has_table_exists = '_table_exists' in content or 'has_table' in content

        # Check if tables are checked before ALTER
        for table_name in set(alter_matches):
            # Look for if statement checking table existence
            check_pattern = rf"if\s+.*{table_name}.*:"
            has_check = re.search(check_pattern, content)

            if not has_check and not has_table_exists:
                self.errors.append(
                    f"{file_path.name}: ALTER TABLE '{table_name}' without existence check. "
                    f"Add 'if _table_exists(\"{table_name}\"):' guard"
                )
            elif not has_check:
                self.warnings.append(
                    f"{file_path.name}: ALTER TABLE '{table_name}' may need existence check. "
                    f"Verify table always exists at this migration point"
                )

    def _check_drop_safety(self, file_path: Path, content: str):
        """Check that DROP operations use IF EXISTS or defensive checks"""

        # Pattern to find DROP operations without IF EXISTS
        drop_patterns = [
            (r"op\.drop_table\(\s*['\"](\w+)['\"]", "DROP TABLE"),
            (r"op\.drop_column\(\s*['\"](\w+)['\"]", "DROP COLUMN"),
            (r"op\.drop_index\(\s*['\"](\w+)['\"]", "DROP INDEX"),
            (r"op\.drop_constraint\(\s*['\"](\w+)['\"]", "DROP CONSTRAINT"),
        ]

        for pattern, operation in drop_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                # Check if there's an if_exists parameter nearby
                if_exists_pattern = rf"{re.escape(match)}.*if_exists\s*=\s*True"
                has_if_exists = re.search(if_exists_pattern, content, re.DOTALL)

                if not has_if_exists:
                    self.warnings.append(
                        f"{file_path.name}: {operation} '{match}' without 'if_exists=True'. "
                        f"Consider adding for safety"
                    )

    def _check_defensive_patterns(self, file_path: Path, content: str):
        """Check for defensive programming patterns"""

        has_try_except = 'try:' in content and 'except' in content
        has_table_exists_helper = 'def _table_exists' in content
        has_error_imports = 'ProgrammingError' in content or 'NoSuchTableError' in content

        # Check if migration has risky operations
        has_alter = 'op.alter_column' in content or 'op.alter_table' in content
        has_drop = 'op.drop_' in content

        if (has_alter or has_drop) and not has_try_except:
            self.warnings.append(
                f"{file_path.name}: Has ALTER/DROP operations but no try-except error handling"
            )

        if has_alter and not has_table_exists_helper:
            self.info.append(
                f"{file_path.name}: Consider adding _table_exists() helper for ALTER operations"
            )

        if has_try_except and not has_error_imports:
            self.warnings.append(
                f"{file_path.name}: Has try-except but no error imports (ProgrammingError, etc)"
            )

    def _check_downgrade_implementation(self, file_path: Path, content: str):
        """Check that downgrade() is properly implemented"""

        # Pattern to find downgrade function
        downgrade_pattern = r"def downgrade\(\) -> None:\s*(.*?)(?=\n(?:def|\Z))"
        downgrade_match = re.search(downgrade_pattern, content, re.DOTALL)

        if not downgrade_match:
            self.warnings.append(f"{file_path.name}: No downgrade() function found")
            return

        downgrade_body = downgrade_match.group(1).strip()

        # Check if downgrade is just a pass statement
        if downgrade_body == "pass" or downgrade_body == "pass  # No downgrade needed":
            self.warnings.append(
                f"{file_path.name}: downgrade() is empty (pass). "
                f"Consider implementing rollback logic"
            )

        # Check if downgrade has fewer operations than upgrade
        upgrade_ops = len(re.findall(r'op\.', content))
        downgrade_ops = len(re.findall(r'op\.', downgrade_body))

        if upgrade_ops > 0 and downgrade_ops == 0:
            self.warnings.append(
                f"{file_path.name}: upgrade() has operations but downgrade() has none"
            )

    def _print_results(self):
        """Print validation results"""
        print(f"\n{BLUE}=== Validation Results ==={RESET}\n")

        if self.errors:
            print(f"{RED}❌ ERRORS ({len(self.errors)}):{RESET}")
            for error in self.errors:
                print(f"  {RED}•{RESET} {error}")
            print()

        if self.warnings:
            print(f"{YELLOW}⚠️  WARNINGS ({len(self.warnings)}):{RESET}")
            for warning in self.warnings:
                print(f"  {YELLOW}•{RESET} {warning}")
            print()

        if self.info:
            print(f"{BLUE}ℹ️  INFO ({len(self.info)}):{RESET}")
            for info in self.info:
                print(f"  {BLUE}•{RESET} {info}")
            print()

        if not self.errors and not self.warnings:
            print(f"{GREEN}✅ All validations passed!{RESET}\n")
        elif not self.errors:
            print(f"{GREEN}✅ No errors found (warnings present){RESET}\n")
        else:
            print(f"{RED}❌ Validation failed with {len(self.errors)} error(s){RESET}\n")


def main():
    """Main entry point"""
    # Find the backend/alembic directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    alembic_dir = project_root / "backend" / "alembic"

    if not alembic_dir.exists():
        print(f"{RED}Error: Alembic directory not found at {alembic_dir}{RESET}")
        return 2

    validator = MigrationValidator(str(alembic_dir))
    success = validator.validate_all()

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
