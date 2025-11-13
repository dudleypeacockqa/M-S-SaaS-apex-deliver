<#
.SYNOPSIS
  Generates Vitest chunk manifests under frontend/.tmp/vitest-chunks.

.DESCRIPTION
  Collects all *.test.ts(x) / *.spec.ts(x) files, splits them into 6 balanced
  groups, and writes chunk1.txt … chunk6.txt so coverage runs can be processed
  in smaller batches.

.USAGE
  pwsh scripts/generate_vitest_chunks.ps1
#>

param(
    [int]$ChunkCount = 6,
    [string]$FrontendPath = "frontend",
    [string]$ChunkDirectory = "frontend/.tmp/vitest-chunks"
)

Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

if (-not (Test-Path $FrontendPath)) {
    throw "Cannot find frontend directory at $FrontendPath"
}

$patterns = @("*.test.ts","*.test.tsx","*.spec.ts","*.spec.tsx")
$tests = @()
foreach ($pattern in $patterns) {
    $tests += Get-ChildItem "$FrontendPath/src" -Recurse -Include $pattern
}

$ordered = $tests.FullName | Sort-Object | Get-Unique
if ($ordered.Count -eq 0) {
    throw "No Vitest files found under $FrontendPath/src"
}

New-Item -ItemType Directory -Path $ChunkDirectory -Force | Out-Null

$chunkSize = [math]::Ceiling($ordered.Count / $ChunkCount)
for ($i = 0; $i -lt $ChunkCount; $i++) {
    $start = $i * $chunkSize
    if ($start -ge $ordered.Count) { break }
    $end = [Math]::Min($start + $chunkSize, $ordered.Count)
    $chunk = $ordered[$start..($end-1)]
    $chunkPath = Join-Path $ChunkDirectory ("chunk{0}.txt" -f ($i+1))
    $chunk | Set-Content $chunkPath
    Write-Host "Generated $chunkPath with $($chunk.Count) tests"
}
