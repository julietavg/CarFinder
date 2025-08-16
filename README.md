# CarFinder Application

A full-stack car finder application with Spring Boot backend and React frontend, deployed on Kubernetes using Rancher Desktop.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Rancher Desktop** - for Kubernetes cluster management
- **Docker** - for building container images
- **PowerShell** - for running deployment scripts

## Setup Instructions

### 1. Install Rancher Desktop

Download and install [Rancher Desktop](https://rancherdesktop.io/) to provide a local Kubernetes cluster.

### 2. Configure Host File

Add the following entry to your hosts file to enable local domain access:

**Windows**: Edit `C:\Windows\System32\drivers\etc\hosts`
```
127.0.0.1 carfinder.local
```

**Mac/Linux**: Edit `/etc/hosts`
```
127.0.0.1 carfinder.local
```

### 3. Configure Docker Registry IP

Update the Docker registry IP address in the following files to match your local registry:

#### Update `deploy/deployment.yaml`:
```yaml
# Change these image references:
image: 192.168.1.72:8085/carfinder-ui:latest
image: 192.168.1.72:8085/carfinder-api:latest

# To your registry IP:
image: YOUR_REGISTRY_IP:8085/carfinder-ui:latest
image: YOUR_REGISTRY_IP:8085/carfinder-api:latest
```

#### Update `docker-compose.yml`:
```yaml
# Change these image references:
image: 192.168.1.72:8085/carfinder-ui:latest
image: 192.168.1.72:8085/carfinder-api:latest

# To your registry IP:
image: YOUR_REGISTRY_IP:8085/carfinder-ui:latest
image: YOUR_REGISTRY_IP:8085/carfinder-api:latest
```

### 4. Configure Docker Daemon for Insecure Registry

Add your registry IP to Docker's insecure registries list:

#### Rancher Desktop:
1. Open Rancher Desktop
2. Go to Settings/Preferences
3. Navigate to Docker Engine settings
4. Add your registry to the insecure registries:
```json
{
  "insecure-registries": ["YOUR_REGISTRY_IP:8085"]
}
```

#### Docker Desktop (if using instead):
1. Open Docker Desktop
2. Go to Settings → Docker Engine
3. Add to the configuration:
```json
{
  "insecure-registries": ["YOUR_REGISTRY_IP:8085"]
}
```

## Deployment

### Automated Deployment

The entire application can be deployed using the provided PowerShell script:

```powershell
.\deploy.ps1
```

This script performs three main steps:

1. **Build Images**: Builds Docker images for both frontend and backend
2. **Push Images**: Pushes the built images to your configured registry
3. **Deploy to Kubernetes**: Applies all Kubernetes manifests to deploy the application

### Manual Deployment Steps

If you prefer to run the steps manually:

```powershell
# 1. Build and push images
docker-compose build
docker-compose push

# 2. Deploy to Kubernetes
kubectl apply -f deploy/
```

## Accessing the Application

Once deployed, you can access the application at:

- **Frontend**: [http://carfinder.local](http://carfinder.local)
- **API**: [http://carfinder.local/api/cars](http://carfinder.local/api/cars)
- **Swagger UI**: [http://carfinder.local/swagger-ui/index.html](http://carfinder.local/swagger-ui/index.html)
- **API Documentation**: [http://carfinder.local/v3/api-docs](http://carfinder.local/v3/api-docs)

### Direct NodePort Access (for testing)

If domain access doesn't work, you can access services directly via NodePort:

- **Frontend**: [http://localhost:30080](http://localhost:30080)
- **Backend**: [http://localhost:30881](http://localhost:30881)
- **MySQL**: [http://localhost:30336](http://localhost:30336)
- **Swagger UI**: [http://localhost:30881/swagger-ui/index.html](http://localhost:30881/swagger-ui/index.html)

## Architecture

The application consists of:

- **Frontend**: React application served via Nginx
- **Backend**: Spring Boot REST API with MySQL database
- **Database**: MySQL 8.0 with persistent storage
- **Ingress**: Traefik ingress controller for routing

## Troubleshooting

### Common Issues:

1. **404 errors**: Ensure the hosts file is configured correctly
2. **Image pull errors**: Verify the insecure registry configuration
3. **Database connection issues**: Check that the MySQL pod is running
4. **Port conflicts**: Ensure ports 30080, 30881, and 30336 are available

### Checking Deployment Status:

```powershell
# Check all pods
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# View pod logs
kubectl logs <pod-name>
```

## Development

For local development without Kubernetes:

1. Start MySQL locally or use Docker
2. Update `application.properties` with local database settings
3. Run the Spring Boot application
4. Run the React development server