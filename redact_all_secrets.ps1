# Script to redact all secrets from git history using git filter-branch
# This will rewrite all commits from 1fb36d25 to HEAD

Write-Host "Redacting all secrets from git history..."

$env:FILTER_BRANCH_SQUELCH_WARNING=1

# List of secrets to replace (use Render Dashboard for actual values)
$secrets = @{
    "[REDACTED-CLERK-SECRET]" = "[REDACTED - Use Render Dashboard]"
    "[REDACTED-STRIPE-SECRET]" = "[REDACTED - Use Render Dashboard]"
    "[REDACTED-OPENAI-SECRET]" = "[REDACTED - Use Render Dashboard]"
    "[REDACTED-ANTHROPIC-SECRET]" = "[REDACTED - Use Render Dashboard]"
    "[REDACTED-SENDGRID-SECRET]" = "[REDACTED - Use Render Dashboard]"
}

# Use git filter-branch with tree-filter to replace secrets in all files
# We'll use sed commands in a bash script
$filterScript = @'
#!/bin/bash
find . -type f -name "*.md" -o -name "*.txt" -o -name "*.ps1" -o -name "*.sh" | while read file; do
    if [ -f "$file" ]; then
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
'@

$scriptPath = Join-Path $env:TEMP "redact_secrets.sh"
$filterScript | Out-File -FilePath $scriptPath -Encoding utf8 -NoNewline

Write-Host "Using git filter-branch to rewrite history..."
git filter-branch --force --tree-filter "bash $scriptPath" --prune-empty --tag-name-filter cat -- 1fb36d25^..HEAD 2>&1 | Select-Object -First 20

Remove-Item $scriptPath -ErrorAction SilentlyContinue

Write-Host "Done. Verify with: git log --all --source --full-history | Select-String -Pattern 'REDACTED'"

