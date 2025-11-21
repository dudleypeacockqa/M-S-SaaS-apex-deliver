# DNS Verification Script for 100daysandbeyond.com
# Verifies DNS resolution and HTTP response

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DNS Verification: 100daysandbeyond.com" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check DNS Resolution
Write-Host "1. Checking DNS Resolution..." -ForegroundColor Yellow
try {
    $dnsResult = Resolve-DnsName -Name "100daysandbeyond.com" -Type A -ErrorAction Stop
    Write-Host "   ✓ DNS resolves successfully" -ForegroundColor Green
    Write-Host "   IP Addresses:" -ForegroundColor Gray
    foreach ($ip in $dnsResult) {
        Write-Host "     - $($ip.IPAddress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ DNS resolution failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check HTTP Response
Write-Host "2. Checking HTTP Response..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://100daysandbeyond.com" -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   ✓ HTTP Response: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ Site is accessible!" -ForegroundColor Green
    } elseif ($response.StatusCode -eq 500) {
        Write-Host "   ⚠ HTTP 500 Error - DNS may not be pointing to correct service" -ForegroundColor Yellow
        Write-Host "   → Check Cloudflare DNS settings" -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠ Unexpected status code: $($response.StatusCode)" -ForegroundColor Yellow
    }
    
    Write-Host "   Server: $($response.Headers.Server)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ HTTP request failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status Code: $statusCode" -ForegroundColor Red
    }
}

Write-Host ""

# Check SSL Certificate
Write-Host "3. Checking SSL Certificate..." -ForegroundColor Yellow
try {
    $cert = [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
    $request = [System.Net.HttpWebRequest]::Create("https://100daysandbeyond.com")
    $request.GetResponse() | Out-Null
    Write-Host "   ✓ SSL certificate is valid" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ SSL certificate check inconclusive" -ForegroundColor Yellow
}

Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If HTTP 500: Update Cloudflare DNS to point to ma-saas-platform.onrender.com" -ForegroundColor Gray
Write-Host "2. Wait 5-15 minutes for DNS propagation" -ForegroundColor Gray
Write-Host "3. Re-run this script to verify" -ForegroundColor Gray
Write-Host ""

