# Simple wrapper to run audits with Clerk key from .env file
$ErrorActionPreference = "Stop"

# Read Clerk key from .env file
$projectRoot = Join-Path $PSScriptRoot ".."
$envPath = Join-Path $projectRoot "frontend\.env.test"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^VITE_CLERK_PUBLISHABLE_KEY=(.+)$') {
            $env:VITE_CLERK_PUBLISHABLE_KEY = $matches[1]
            Write-Host "Loaded Clerk key from frontend/.env.test" -ForegroundColor Green
        }
    }
}

if (-not $env:VITE_CLERK_PUBLISHABLE_KEY) {
    Write-Host "ERROR: Could not find VITE_CLERK_PUBLISHABLE_KEY" -ForegroundColor Red
    exit 1
}

# Run the main audit script
$scriptPath = Join-Path $PSScriptRoot "run_local_audits.ps1"
& $scriptPath
