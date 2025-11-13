<# 
 .SYNOPSIS
  Runs the frontend Vitest suite in manageable chunks with coverage enabled.

 .DESCRIPTION
  This wrapper iterates over chunk manifests under frontend/.tmp/vitest-chunks/,
  runs Vitest with coverage for each chunk, captures the console output into
  docs/tests/, and moves the resulting coverage-final.json into
  frontend/coverage/chunks/{chunk}.json so coverage can be merged later.

 .USAGE
   # From repo root
   pwsh scripts/run_frontend_coverage_chunks.ps1
#>

param(
    [string]$ChunkDirectory = "frontend/.tmp/vitest-chunks",
    [string]$CoverageChunkDirectory = "frontend/coverage/chunks",
    [string]$LogDirectory = "docs/tests",
    [string]$SummaryFile = "docs/tests/2025-11-14-frontend-coverage-summary.md"
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

if (-not (Test-Path $ChunkDirectory)) {
    throw "Chunk directory '$ChunkDirectory' not found. Generate chunk manifests first."
}

if (-not (Test-Path $CoverageChunkDirectory)) {
    New-Item -ItemType Directory -Path $CoverageChunkDirectory -Force | Out-Null
}

if (-not (Test-Path $LogDirectory)) {
    New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null
}

$chunkFiles = Get-ChildItem $ChunkDirectory -Filter "chunk*.txt" | Sort-Object Name
if ($chunkFiles.Count -eq 0) {
    throw "No chunk manifest files found under '$ChunkDirectory'."
}

$summary = @()

foreach ($chunk in $chunkFiles) {
    $tests = Get-Content $chunk | Where-Object { $_.Trim() -ne "" }
    if ($tests.Count -eq 0) {
        Write-Warning "Skipping $($chunk.Name) because it contains no tests."
        continue
    }

    $chunkName = [System.IO.Path]::GetFileNameWithoutExtension($chunk.Name)
    $logPath = Join-Path $LogDirectory ("2025-11-14-frontend-{0}.log" -f $chunkName)
    $coverageTarget = Join-Path $CoverageChunkDirectory ("{0}.json" -f $chunkName)

    Write-Host "=== Running $chunkName ($($tests.Count) tests) ==="

    Push-Location "frontend"
    try {
        $arguments = @("run", "test", "--", "--run", "--coverage", "--pool=threads") + $tests
        & npm @arguments 2>&1 | Tee-Object -FilePath $logPath
        $exitCode = $LASTEXITCODE
    } finally {
        Pop-Location
    }

    if ($exitCode -ne 0) {
        throw "Vitest failed for $chunkName. See $logPath for details."
    }

    $coverageSource = "frontend/coverage/coverage-final.json"
    if (-not (Test-Path $coverageSource)) {
        throw "Expected coverage file '$coverageSource' not found after running $chunkName."
    }

    Move-Item -Path $coverageSource -Destination $coverageTarget -Force
    $summary += "- `$chunkName`: ✅ log -> `$logPath`, coverage -> `$coverageTarget`"
}

$summaryHeader = @(
    "# Frontend Coverage Chunk Run – $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "",
    "Chunks executed:",
    ""
)
Set-Content -Path $SummaryFile -Value ($summaryHeader + $summary)
Write-Host "All chunks completed. Summary written to $SummaryFile"
