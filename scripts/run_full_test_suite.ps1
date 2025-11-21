# Full Test Suite Execution Script (PowerShell)
# Runs all test suites and generates coverage reports

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Full Test Suite Execution" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Backend Tests
Write-Host ""
Write-Host "--- Backend Test Suite ---" -ForegroundColor Yellow
Push-Location backend

if (Test-Path "venv\Scripts\Activate.ps1") {
    & .\venv\Scripts\Activate.ps1
}

python -m pytest tests/ `
    --cov=app `
    --cov-report=term `
    --cov-report=html `
    --cov-report=json `
    --maxfail=5 `
    -v `
    | Tee-Object -FilePath "..\docs\tests\backend-test-results-$timestamp.txt"

$backendExit = $LASTEXITCODE
Pop-Location

# Frontend Tests
Write-Host ""
Write-Host "--- Frontend Test Suite ---" -ForegroundColor Yellow
Push-Location frontend

npm run test -- --run --coverage `
    | Tee-Object -FilePath "..\docs\tests\frontend-test-results-$timestamp.txt"

$frontendExit = $LASTEXITCODE
Pop-Location

# Master Admin Tests
Write-Host ""
Write-Host "--- Master Admin Test Suite ---" -ForegroundColor Yellow
Push-Location backend

python -m pytest tests/master_admin/ `
    -v `
    | Tee-Object -FilePath "..\docs\tests\master-admin-test-results-$timestamp.txt"

$masterAdminExit = $LASTEXITCODE
Pop-Location

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Test Suite Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Backend: $(if ($backendExit -eq 0) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if ($backendExit -eq 0) { 'Green' } else { 'Red' })
Write-Host "Frontend: $(if ($frontendExit -eq 0) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if ($frontendExit -eq 0) { 'Green' } else { 'Red' })
Write-Host "Master Admin: $(if ($masterAdminExit -eq 0) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if ($masterAdminExit -eq 0) { 'Green' } else { 'Red' })
Write-Host "==========================================" -ForegroundColor Cyan

if ($backendExit -eq 0 -and $frontendExit -eq 0 -and $masterAdminExit -eq 0) {
    Write-Host "✅ All test suites passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ Some test suites failed. Check logs in docs/tests/" -ForegroundColor Red
    exit 1
}

