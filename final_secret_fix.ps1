# Final comprehensive secret fix using index-filter
# Replace placeholder tokens (e.g., [REDACTED-CLERK-SECRET]) locally before running.

Write-Host "Fixing secrets in git history using index-filter..."

$env:FILTER_BRANCH_SQUELCH_WARNING=1

# Create a bash script that uses git show and git hash-object to replace file contents
$bashScript = @'
#!/bin/bash
# Fix secrets in specific files using git objects directly

fix_file() {
    local file="$1"
    local old_secret="$2"
    local replacement="$3"
    
    if git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
        # Get the file content from git
        git show "HEAD:$file" > /tmp/file_content 2>/dev/null || return 0
        
        # Replace the secret
        sed "s|$old_secret|$replacement|g" /tmp/file_content > /tmp/file_fixed 2>/dev/null
        
        # Create new git object
        local new_hash=$(git hash-object -w /tmp/file_fixed 2>/dev/null)
        
        if [ -n "$new_hash" ]; then
            # Update index with new content
            git update-index --cacheinfo 100644 "$new_hash" "$file" 2>/dev/null || true
        fi
        
        rm -f /tmp/file_content /tmp/file_fixed 2>/dev/null
    fi
}

# Fix EXECUTION_GUIDE.md
fix_file "docs/testing/master-admin/2025-11-21/crud-evidence/EXECUTION_GUIDE.md" \
    "[REDACTED-CLERK-SECRET]" \
    "[REDACTED - Use Render Dashboard]"

# Fix BFG-EXECUTION-INSTRUCTIONS.md  
fix_file "docs/BFG-EXECUTION-INSTRUCTIONS.md" \
    "[REDACTED-STRIPE-SECRET]" \
    "[REDACTED - Use Render Dashboard]"

fix_file "docs/BFG-EXECUTION-INSTRUCTIONS.md" \
    "[REDACTED-CLERK-SECRET]" \
    "[REDACTED - Use Render Dashboard]"

# Fix ENV-BASELINE-CROSSCHECK.md
fix_file "docs/bmad/2025-11-22-ENV-BASELINE-CROSSCHECK.md" \
    "[REDACTED-STRIPE-SECRET]" \
    "[REDACTED - Use Render Dashboard]"

# Remove problematic script files
git rm --cached --ignore-unmatch "fix_execution_guide_secret.ps1" "comprehensive_secret_fix.ps1" 2>/dev/null || true
'@

$scriptPath = Join-Path $env:TEMP "final_fix_secrets.sh"
$bashScript | Out-File -FilePath $scriptPath -Encoding utf8 -NoNewline

Write-Host "Rewriting commits from 1fb36d25 to HEAD..."
git filter-branch --force --index-filter "bash $scriptPath" --prune-empty --tag-name-filter cat -- 1fb36d25^..HEAD 2>&1 | Select-Object -First 30

Remove-Item $scriptPath -ErrorAction SilentlyContinue

Write-Host "Done. Verify and push."

