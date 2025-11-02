# Kill any process using port 5174
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Stopping Process on Port 5174" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find the process using port 5174
$processInfo = netstat -ano | findstr :5174 | findstr LISTENING
if ($processInfo) {
    # Extract PID (last column)
    $processId = ($processInfo -split '\s+')[-1]
    
    Write-Host "Found process using port 5174: PID $processId" -ForegroundColor Yellow
    
    try {
        Stop-Process -Id $processId -Force
        Write-Host "✓ Successfully killed process $processId" -ForegroundColor Green
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "✗ Failed to kill process: $_" -ForegroundColor Red
    }
} else {
    Write-Host "✓ Port 5174 is already free" -ForegroundColor Green
}

Write-Host ""
Write-Host "Port 5174 is now available!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run: npm run dev" -ForegroundColor Cyan
Write-Host ""
