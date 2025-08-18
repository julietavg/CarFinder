# Apply the ConfigMap for database initialization
kubectl apply -f ./deploy/configmap.yaml

# Apply the deployment (which references the ConfigMap)
kubectl apply -f ./deploy/deployment.yaml

Write-Host "Database initialization ConfigMap and deployment applied successfully!"
Write-Host "The init.sql script will run when MySQL pods are created for the first time."
