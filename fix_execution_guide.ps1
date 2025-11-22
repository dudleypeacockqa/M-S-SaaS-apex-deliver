# Fix EXECUTION_GUIDE.md secret using git filter-branch with index-filter
# This approach avoids Windows path issues

Write-Host "Fixing secret in EXECUTION_GUIDE.md using git filter-branch..."

$env:FILTER_BRANCH_SQUELCH_WARNING=1

# Use index-filter which works on git objects directly
git filter-branch --force --index-filter '
file="docs/testing/master-admin/2025-11-21/crud-evidence/EXECUTION_GUIDE.md"
if git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
    git checkout-index --temp "$file" >/tmp/fileinfo 2>/dev/null || true
    if [ -f /tmp/fileinfo ]; then
        tempfile=$(cut -f1 /tmp/fileinfo)
        sed "s|[REDACTED - Use Render Dashboard]|[REDACTED - Use Render Dashboard]|g" "$tempfile" > "$tempfile.new"
        git hash-object -w "$tempfile.new" > /tmp/newhash 2>/dev/null || true
        if [ -f /tmp/newhash ]; then
            newhash=$(cat /tmp/newhash)
            git update-index --cacheinfo 100644 "$newhash" "$file" 2>/dev/null || true
        fi
        rm -f "$tempfile" "$tempfile.new" /tmp/fileinfo /tmp/newhash 2>/dev/null || true
    fi
fi
' --prune-empty --tag-name-filter cat -- 1fb36d25^..HEAD 2>&1 | Select-Object -First 20

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully fixed secret in git history!"
} else {
    Write-Host "Filter-branch encountered an error. Trying alternative approach..."
}

