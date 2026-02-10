# Trigger notification generation manually
# Make sure backend is running on port 5000

Write-Host "🔔 Triggering notification generation..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/notifications/generate-daily" -Method POST -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Generated: $($result.count) notifications" -ForegroundColor Yellow
    Write-Host "Fields: $($result.fields)" -ForegroundColor Yellow
    Write-Host "Timestamp: $($result.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "Make sure backend is running on port 5000" -ForegroundColor Yellow
}
