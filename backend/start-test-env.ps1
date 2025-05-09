# PowerShell script to start all services needed for testing
# Note: This runs commands sequentially, not with &&

Write-Host "Starting Node.js backend server..." -ForegroundColor Green
Start-Process -FilePath "nodemon" -ArgumentList "index.js" -WorkingDirectory (Get-Location)

Write-Host "Starting test page server..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "serve-test-page.js" -WorkingDirectory (Get-Location)

Write-Host "All services started!" -ForegroundColor Cyan
Write-Host "Access the test page at: http://localhost:3900" -ForegroundColor Yellow
Write-Host "Note: To stop the servers, close the terminal windows or use Ctrl+C in each window" -ForegroundColor Yellow 