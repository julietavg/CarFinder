# Simple CarFinder Deployment

Write-Host "🚀 Deploying CarFinder..." -ForegroundColor Green

kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:30080" -ForegroundColor White
Write-Host "Backend: http://localhost:30881" -ForegroundColor White
Write-Host "MySQL: localhost:30336" -ForegroundColor White
Write-Host "Ingress: http://carfinder.local (add to hosts file)" -ForegroundColor White
