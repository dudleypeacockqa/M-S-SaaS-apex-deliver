# Comprehensive secret cleanup using git filter-branch
# This will rewrite all commits from 1fb36d25 to HEAD

Write-Host "Starting comprehensive secret cleanup..."

$env:FILTER_BRANCH_SQUELCH_WARNING=1

# Create a bash script for git filter-branch tree-filter
$bashScript = @'
#!/bin/bash
# Fix secrets in all files across all commits

# Files to check and fix
files=(
    "docs/testing/master-admin/2025-11-21/crud-evidence/EXECUTION_GUIDE.md"
    "docs/BFG-EXECUTION-INSTRUCTIONS.md"
    "docs/bmad/2025-11-22-ENV-BASELINE-CROSSCHECK.md"
    "docs/deployments/2025-11-22-redeploy-execution.md"
    "secrets-to-remove.txt"
    "secrets-replacements.txt"
    "fix_execution_guide.ps1"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        # Replace secrets with redacted placeholders
        # Replace secrets with redacted placeholders
        # Note: Actual secret values should be retrieved from Render Dashboard
        sed -i.bak "s|\[REDACTED-CLERK-SECRET\]|[REDACTED - Use Render Dashboard]|g" "$file" 2>/dev/null
        sed -i.bak "s|\[REDACTED-STRIPE-SECRET\]|[REDACTED - Use Render Dashboard]|g" "$file" 2>/dev/null
        sed -i.bak "s|\[REDACTED-OPENAI-SECRET\]|[REDACTED - Use Render Dashboard]|g" "$file" 2>/dev/null
        sed -i.bak "s|\[REDACTED-ANTHROPIC-SECRET\]|[REDACTED - Use Render Dashboard]|g" "$file" 2>/dev/null
        sed -i.bak "s|\[REDACTED-SENDGRID-SECRET\]|[REDACTED - Use Render Dashboard]|g" "$file" 2>/dev/null
        rm -f "$file.bak" 2>/dev/null
    fi
done

# Remove problematic files entirely
rm -f "secrets-to-remove.txt" "secrets-replacements.txt" "fix_execution_guide.ps1" "fix_execution_guide_secret.ps1" 2>/dev/null || true
'@

$scriptPath = Join-Path $env:TEMP "fix_secrets.sh"
$bashScript | Out-File -FilePath $scriptPath -Encoding utf8 -NoNewline

Write-Host "Rewriting git history from commit 1fb36d25 to HEAD..."
git filter-branch --force --tree-filter "bash $scriptPath" --prune-empty --tag-name-filter cat -- 1fb36d25^..HEAD 2>&1 | Select-Object -First 30

Remove-Item $scriptPath -ErrorAction SilentlyContinue

Write-Host "Done. Now verify and push."

