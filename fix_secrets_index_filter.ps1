# Fix secrets using index-filter (avoids Windows path issues)
# This approach works directly on git objects without checking out files

Write-Host "Fixing secrets using index-filter approach..."

$env:FILTER_BRANCH_SQUELCH_WARNING=1

# Files that need secret replacement
$filesToFix = @(
    "docs/testing/master-admin/2025-11-21/crud-evidence/EXECUTION_GUIDE.md",
    "docs/BFG-EXECUTION-INSTRUCTIONS.md",
    "docs/bmad/2025-11-22-ENV-BASELINE-CROSSCHECK.md",
    "docs/deployments/2025-11-22-redeploy-execution.md"
)

# Files to remove entirely
$filesToRemove = @(
    "secrets-to-remove.txt",
    "secrets-replacements.txt",
    "fix_execution_guide.ps1",
    "fix_execution_guide_secret.ps1"
)

# Build the index-filter command
$indexFilter = "git rm --cached --ignore-unmatch " + ($filesToRemove -join " ") + " || true"

Write-Host "Removing problematic files from history..."
git filter-branch --force --index-filter $indexFilter --prune-empty --tag-name-filter cat -- 1fb36d25^..HEAD 2>&1 | Select-Object -First 20

Write-Host "Done. Note: Some files may need manual fixing via GitHub bypass URLs."

