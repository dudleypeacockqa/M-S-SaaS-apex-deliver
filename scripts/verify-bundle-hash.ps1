# PowerShell script to verify local bundle hash
Write-Host "Checking local build bundle hash..."
Set-Location frontend

if (-not (Test-Path "dist")) {
    Write-Host "❌ dist/ directory not found. Run 'npm run build' first."
    exit 1
}

$bundleFile = Get-ChildItem -Path "dist\assets\js" -Filter "react-vendor-*.js" | Select-Object -First 1
if (-not $bundleFile) {
    Write-Host "❌ react-vendor bundle not found in dist/"
    exit 1
}

$bundleName = $bundleFile.Name
$hash = $bundleName -replace 'react-vendor-(.+)\.js', '$1'

Write-Host "✅ Local bundle hash: $hash"
Write-Host "📦 Bundle file: $bundleName"
Write-Host ""
Write-Host "After deployment, verify production serves: react-vendor-$hash.js"

