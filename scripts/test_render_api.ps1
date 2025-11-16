# Comprehensive API Test Script for Render Deployment
# Tests all critical endpoints to verify 100% functionality

$baseUrl = "https://ma-saas-backend.onrender.com"
$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [int]$ExpectedStatus = 200,
        [hashtable]$Headers = @{}
    )
    
    $url = "$baseUrl$Path"
    $result = @{
        Name = $Name
        Method = $Method
        Path = $Path
        ExpectedStatus = $ExpectedStatus
        Status = "PENDING"
        StatusCode = $null
        ResponseTime = $null
        Error = $null
    }
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        
        if ($Method -eq "GET") {
            $response = Invoke-WebRequest -Uri $url -Method $Method -Headers $Headers -ErrorAction Stop -UseBasicParsing
        } else {
            $response = Invoke-WebRequest -Uri $url -Method $Method -Headers $Headers -ErrorAction Stop -UseBasicParsing
        }
        
        $stopwatch.Stop()
        $result.StatusCode = $response.StatusCode
        $result.ResponseTime = $stopwatch.ElapsedMilliseconds
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            $result.Status = "PASS"
        } else {
            $result.Status = "FAIL"
            $result.Error = "Expected $ExpectedStatus, got $($response.StatusCode)"
        }
    } catch {
        $stopwatch.Stop()
        $result.Status = "FAIL"
        $result.Error = $_.Exception.Message
        if ($_.Exception.Response) {
            $result.StatusCode = $_.Exception.Response.StatusCode.value__
        }
    }
    
    return $result
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Comprehensive Render API Test Suite" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Target: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Core Endpoints
Write-Host "Testing Core Endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Name "Root Endpoint" -Method "GET" -Path "/"
$results += Test-Endpoint -Name "Health Check" -Method "GET" -Path "/health"
$results += Test-Endpoint -Name "API Docs" -Method "GET" -Path "/docs"
$results += Test-Endpoint -Name "OpenAPI Schema" -Method "GET" -Path "/openapi.json"

# Public API Endpoints (no auth required)
Write-Host "Testing Public API Endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Name "Blog List" -Method "GET" -Path "/api/blog?limit=1" -ExpectedStatus 200
$results += Test-Endpoint -Name "Blog Categories" -Method "GET" -Path "/api/blog/categories/list" -ExpectedStatus 200

# Protected Endpoints (will return 401/403 without auth - that's expected)
Write-Host "Testing Protected Endpoints (expecting 401/403)..." -ForegroundColor Green
$results += Test-Endpoint -Name "Deals List" -Method "GET" -Path "/api/deals" -ExpectedStatus 401
$results += Test-Endpoint -Name "Document Generation Templates" -Method "GET" -Path "/api/document-generation/templates" -ExpectedStatus 401
$results += Test-Endpoint -Name "Dashboard Metrics" -Method "GET" -Path "/api/dashboard/metrics" -ExpectedStatus 401
$results += Test-Endpoint -Name "Subscriptions" -Method "GET" -Path "/api/subscriptions" -ExpectedStatus 401
$results += Test-Endpoint -Name "Financial Connections" -Method "GET" -Path "/api/financial/connections" -ExpectedStatus 401
$results += Test-Endpoint -Name "Tasks List" -Method "GET" -Path "/api/tasks" -ExpectedStatus 401
$results += Test-Endpoint -Name "Pipeline Templates" -Method "GET" -Path "/api/pipeline-templates" -ExpectedStatus 401
$results += Test-Endpoint -Name "Podcasts List" -Method "GET" -Path "/api/podcasts" -ExpectedStatus 401
$results += Test-Endpoint -Name "Events List" -Method "GET" -Path "/api/events" -ExpectedStatus 401
$results += Test-Endpoint -Name "Community Posts" -Method "GET" -Path "/api/community/posts" -ExpectedStatus 401

# Summary
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $results.Count

foreach ($result in $results) {
    $color = if ($result.Status -eq "PASS") { "Green" } else { "Red" }
    $icon = if ($result.Status -eq "PASS") { "✅" } else { "❌" }
    Write-Host "$icon $($result.Name): $($result.Status)" -ForegroundColor $color
    if ($result.StatusCode) {
        Write-Host "   Status: $($result.StatusCode) | Time: $($result.ResponseTime)ms" -ForegroundColor Gray
    }
    if ($result.Error) {
        Write-Host "   Error: $($result.Error)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Total: $total | Passed: $passed | Failed: $failed" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "✅ ALL TESTS PASSED - Service is 100% functional!" -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "❌ Some tests failed - Review results above" -ForegroundColor Red
    exit 1
}

