# Restart Server Script for Windows (PowerShell)
Write-Host "Restarting Rehana Server..."

# 1. Kill existing node processes running server.js
$processes = Get-Process node -ErrorAction SilentlyContinue
foreach ($p in $processes) {
    try {
        # Check command line arguments if possible, or just kill all node processes (safer for this environment)
        # For now, we will be aggressive as requested
        Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped process $($p.Id)"
    } catch {
        Write-Host "Failed to stop process $($p.Id)"
    }
}

# 2. Wait a moment
Start-Sleep -Seconds 2

# 3. Start the server
$logFile = Join-Path (Get-Location) "server.log"
Write-Host "Starting server..."
Start-Process -FilePath "node" -ArgumentList "backend/server.js" -RedirectStandardOutput $logFile -RedirectStandardError $logFile -WindowStyle Hidden

Write-Host "Server started. Logs at $logFile"
