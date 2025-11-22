# Script to fix EXECUTION_GUIDE.md secret in commit 1fb36d25

# First, ensure the file is properly redacted in working directory
$filePath = "docs/testing/master-admin/2025-11-21/crud-evidence/EXECUTION_GUIDE.md"
if (Test-Path $filePath) {
    $content = Get-Content $filePath -Raw
    $content = $content -replace 'sk_live_[A-Za-z0-9]+', '[REDACTED - Use Render Dashboard]'
    $content = $content -replace 'rk_live_[A-Za-z0-9]+', '[REDACTED - Use Render Dashboard]'
    Set-Content $filePath -Value $content -NoNewline
    Write-Host "File redacted in working directory"
}

# Use git filter-branch with tree-filter to replace file content in all commits
Write-Host "Rewriting git history to fix EXECUTION_GUIDE.md..."
$env:FILTER_BRANCH_SQUELCH_WARNING=1

git filter-branch --force --tree-filter 'if [ -f "docs/testing/master-admin/2025-11-21/crud-evidence/EXECUTION_GUIDE.md" ]; then sed -i "s/sk_live_[A-Za-z0-9]\+/[REDACTED - Use Render Dashboard]/g" "docs/testing/master-admin/2025-11-21/crud-evidence/EXECUTION_GUIDE.md" 2>/dev/null || true; sed -i "s/rk_live_[A-Za-z0-9]\+/[REDACTED - Use Render Dashboard]/g" "docs/testing/master-admin/2025-11-21/crud-evidence/EXECUTION_GUIDE.md" 2>/dev/null || true; fi' --prune-empty --tag-name-filter cat -- 1fb36d25^..HEAD 2>&1 | Select-Object -First 50

