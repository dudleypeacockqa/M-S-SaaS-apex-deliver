###############################################################################
# Local Accessibility & Performance Audit Script (PowerShell)
#
# This script automates running Lighthouse and Axe accessibility tests
# against a local Vite preview server.
#
# Usage:
#   $env:VITE_CLERK_PUBLISHABLE_KEY="pk_test_xxxx"; .\scripts\run_local_audits.ps1
#
# Requirements:
#   - Node.js and npm installed
#   - lighthouse and @axe-core/cli installed (via npm install)
#   - VITE_CLERK_PUBLISHABLE_KEY environment variable set
###############################################################################

# Exit on error
$ErrorActionPreference = "Stop"

# Configuration
$PREVIEW_HOST = "0.0.0.0"
$PREVIEW_PORT = "4173"
$PRIMARY_URL = if ($env:AUDIT_PREVIEW_URL) { $env:AUDIT_PREVIEW_URL } else { "http://127.0.0.1:${PREVIEW_PORT}" }
$FALLBACK_URL = if ($env:AUDIT_PREVIEW_FALLBACK) { $env:AUDIT_PREVIEW_FALLBACK } else { "http://localhost:${PREVIEW_PORT}" }
$REPORT_DIR = "docs\testing"
$MAX_WAIT_TIME = if ($env:AUDIT_WAIT_SECONDS) { [int]$env:AUDIT_WAIT_SECONDS } else { 60 }

# Print banner
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  M&A Platform - Local Audit Runner" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Validation: Check if VITE_CLERK_PUBLISHABLE_KEY is set
if (-not $env:VITE_CLERK_PUBLISHABLE_KEY) {
    Write-Host "ERROR: VITE_CLERK_PUBLISHABLE_KEY environment variable is not set" -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage:"
    Write-Host '  $env:VITE_CLERK_PUBLISHABLE_KEY="pk_test_xxxx"; .\scripts\run_local_audits.ps1'
    Write-Host ""
    exit 1
}

# Validation: Check if we're in the project root
if (-not (Test-Path "frontend")) {
    Write-Host "ERROR: Must run from project root directory" -ForegroundColor Red
    exit 1
}

# Create report directory if it doesn't exist
New-Item -ItemType Directory -Force -Path $REPORT_DIR | Out-Null

# Navigate to frontend directory
Push-Location frontend

try {
    Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
    npm install --include=dev --silent

    Write-Host "Step 2: Building frontend for preview..." -ForegroundColor Yellow
    npm run build

    # Start preview server in background
    Write-Host "Step 3: Starting preview server on ${PREVIEW_HOST}:${PREVIEW_PORT}..." -ForegroundColor Yellow
    Write-Host "  Command: npm run preview:test"

    $job = Start-Job -ScriptBlock {
        param($clerkKey, $location)
        Set-Location $location
        $env:VITE_CLERK_PUBLISHABLE_KEY = $clerkKey
        npm run preview:test
    } -ArgumentList $env:VITE_CLERK_PUBLISHABLE_KEY, (Get-Location)

    # Wait for server to be ready
    Write-Host "Step 4: Waiting for server to start..." -ForegroundColor Yellow
    $ELAPSED = 0
    $ACTIVE_URL = ""

    while ($true) {
        try {
            $response = Invoke-WebRequest -Uri $PRIMARY_URL -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $ACTIVE_URL = $PRIMARY_URL
                break
            }
        } catch {}

        if ($FALLBACK_URL -ne $PRIMARY_URL) {
            try {
                $response = Invoke-WebRequest -Uri $FALLBACK_URL -TimeoutSec 2 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    $ACTIVE_URL = $FALLBACK_URL
                    break
                }
            } catch {}
        }

        if ($ELAPSED -ge $MAX_WAIT_TIME) {
            Write-Host ""
            Write-Host "ERROR: Server failed to start within ${MAX_WAIT_TIME} seconds" -ForegroundColor Red
            Stop-Job $job
            Remove-Job $job
            exit 1
        }

        Start-Sleep -Seconds 1
        $ELAPSED++
        Write-Host "." -NoNewline
    }

    Write-Host ""
    Write-Host "Server is ready at ${ACTIVE_URL}!" -ForegroundColor Green
    Write-Host ""

    # Run Lighthouse audit
    Write-Host "Step 5: Running Lighthouse performance audit..." -ForegroundColor Yellow
    Write-Host "  URL: $ACTIVE_URL"
    Write-Host "  Report: ${REPORT_DIR}\lighthouse-report.html"

    $lighthouseArgs = @(
        "lighthouse",
        $ACTIVE_URL,
        "--output", "html",
        "--output", "json",
        "--output-path=..\${REPORT_DIR}\lighthouse-report",
        "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
        "--quiet"
    )

    & npx @lighthouseArgs

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Lighthouse audit completed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Lighthouse audit failed" -ForegroundColor Red
    }

    Write-Host ""

    # Run Axe accessibility audit
    Write-Host "Step 6: Running Axe accessibility audit..." -ForegroundColor Yellow
    Write-Host "  URL: $ACTIVE_URL"
    Write-Host "  Report: ${REPORT_DIR}\axe-report.json"

    $axeArgs = @(
        "axe",
        $ACTIVE_URL,
        "--load-delay", "5000",
        "--timeout", "60000",
        "--save", "..\${REPORT_DIR}\axe-report.json",
        "--chrome-options=no-sandbox,disable-dev-shm-usage"
    )

    & npx @axeArgs

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Axe accessibility audit completed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Axe accessibility audit failed" -ForegroundColor Red
    }

    Write-Host ""

    # Parse and display summary from Lighthouse JSON report
    $lighthouseJsonPath = "..\${REPORT_DIR}\lighthouse-report.json"
    if (Test-Path $lighthouseJsonPath) {
        Write-Host "========================================" -ForegroundColor Blue
        Write-Host "  Lighthouse Score Summary" -ForegroundColor Blue
        Write-Host "========================================" -ForegroundColor Blue

        $lighthouseData = Get-Content $lighthouseJsonPath | ConvertFrom-Json
        $categories = $lighthouseData.categories

        Write-Host "  Performance:       $([math]::Round($categories.performance.score * 100))%"
        Write-Host "  Accessibility:     $([math]::Round($categories.accessibility.score * 100))%"
        Write-Host "  Best Practices:    $([math]::Round($categories.'best-practices'.score * 100))%"
        Write-Host "  SEO:               $([math]::Round($categories.seo.score * 100))%"
        Write-Host ""
    }

    # Display Axe summary
    $axeJsonPath = "..\${REPORT_DIR}\axe-report.json"
    if (Test-Path $axeJsonPath) {
        Write-Host "========================================" -ForegroundColor Blue
        Write-Host "  Axe Accessibility Summary" -ForegroundColor Blue
        Write-Host "========================================" -ForegroundColor Blue

        $axeData = Get-Content $axeJsonPath | ConvertFrom-Json
        $violations = $axeData.violations

        $critical = ($violations | Where-Object { $_.impact -eq "critical" }).Count
        $serious = ($violations | Where-Object { $_.impact -eq "serious" }).Count
        $moderate = ($violations | Where-Object { $_.impact -eq "moderate" }).Count
        $minor = ($violations | Where-Object { $_.impact -eq "minor" }).Count

        Write-Host "  Critical:   ${critical}"
        Write-Host "  Serious:    ${serious}"
        Write-Host "  Moderate:   ${moderate}"
        Write-Host "  Minor:      ${minor}"
        Write-Host ""
    }

    # Final summary
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Audit Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Reports saved to:"
    Write-Host "  - ${REPORT_DIR}\lighthouse-report.html (open in browser)"
    Write-Host "  - ${REPORT_DIR}\lighthouse-report.json (machine-readable)"
    Write-Host "  - ${REPORT_DIR}\axe-report.json (accessibility violations)"
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Open lighthouse-report.html in your browser to view detailed results"
    Write-Host "  2. Review axe-report.json for accessibility violations"
    Write-Host "  3. Address any critical/serious issues before deployment"
    Write-Host ""

} finally {
    # Cleanup: Stop the preview server
    if ($job) {
        Write-Host "Cleaning up: Stopping preview server..." -ForegroundColor Yellow
        Stop-Job $job -ErrorAction SilentlyContinue
        Remove-Job $job -ErrorAction SilentlyContinue
    }

    # Return to project root
    Pop-Location
}

exit 0
