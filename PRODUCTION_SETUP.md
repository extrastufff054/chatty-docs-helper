
# Production Deployment Guide

This guide provides comprehensive instructions for deploying the I4C Chatbot in a production environment.

## Prerequisites

- Linux server with at least 4GB RAM and 2 CPUs
- Docker and Docker Compose installed
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)
- 20GB+ storage space (depending on document volume)

## Security Considerations Before Deployment

1. **Replace Placeholder Credentials**: 
   - Update default admin credentials
   - Generate strong, unique passwords
   - Replace any hardcoded tokens in the codebase

2. **Upgrade Password Hashing**:
   - The current implementation uses SHA-256
   - For production, implement bcrypt or Argon2 with proper salting
   - Update the `hashPassword` function in `auth.ts`

3. **Implement Proper SSL**:
   - Never deploy without HTTPS in production
   - Configure SSL termination either at load balancer or Nginx
   - Implement proper certificate renewal

4. **Data Protection**:
   - Implement regular backups of the database
   - Set up proper document storage backup
   - Consider encryption for sensitive documents

## Deployment Steps

### 1. Preparing the Environment

```bash
# Clone the repository
git clone https://github.com/your-org/i4c-chatbot.git
cd i4c-chatbot

# Create required directories
mkdir -p data/documents data/vectors logs

# Set proper permissions
chmod 755 data logs
```

### 2. Configuration Files

Create a `.env` file with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=production
ADMIN_TOKEN=<your-secure-admin-token>

# Ollama Configuration
OLLAMA_BASE_URL=http://ollama:11434

# Storage Configuration
STORAGE_PATH=/app/data

# Security Configuration
SESSION_SECRET=<your-session-secret>
TOKEN_EXPIRY_DAYS=7

# Logging Configuration
LOG_LEVEL=info
```

### 3. Docker Deployment

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
      - ./public:/usr/share/nginx/html
    depends_on:
      - app
    restart: always

  app:
    build: .
    env_file: .env
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    depends_on:
      - ollama
    restart: always

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ./ollama-models:/root/.ollama
    restart: always
```

### 4. Setting Up Nginx

Create an `nginx.conf` file:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; connect-src 'self' http://localhost:11434; img-src 'self' data:; style-src 'self' 'unsafe-inline';" always;
    
    # Root directory for static files
    root /usr/share/nginx/html;
    index index.html;
    
    # API Proxy
    location /api/ {
        proxy_pass http://app:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /admin/ {
        proxy_pass http://app:5000/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # For SPA routing, route all non-file requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 5. Build and Deploy

```bash
# Build and start the containers
docker-compose up -d

# Check if containers are running properly
docker-compose ps

# Check application logs
docker-compose logs -f app
```

## Scaling for Production

### Horizontal Scaling

For high-traffic deployments, consider:

1. **Load Balancer Setup**:
   - Set up Nginx or HAProxy as a load balancer
   - Configure multiple app instances behind it
   - Ensure session stickiness if needed

2. **Distributed Document Storage**:
   - Move document storage to a shared filesystem (NFS) or object storage (S3)
   - Update storage configuration to point to the shared location

3. **Containerized Scaling**:
   - Use Kubernetes instead of Docker Compose
   - Create appropriate deployment, service, and ingress resources
   - Set up auto-scaling based on CPU/memory usage

### Vertical Scaling

For improved performance:

1. **Increase Resources**:
   - Allocate more CPU and RAM to containers
   - Use instance types optimized for ML workloads if using cloud

2. **Database Optimization**:
   - If migrating to a dedicated database, optimize indexes
   - Consider database read replicas for query-heavy workloads

3. **Caching Strategy**:
   - Implement Redis for caching frequent queries
   - Cache document embeddings for faster retrieval

## Monitoring and Maintenance

### Logging Configuration

Set up comprehensive logging:

```bash
# Create a logrotate configuration
cat > /etc/logrotate.d/i4c-chatbot << EOF
/path/to/i4c-chatbot/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 640 root root
    sharedscripts
    postrotate
        docker-compose -f /path/to/docker-compose.yml restart app
    endscript
}
EOF
```

### Monitoring Setup

1. **Health Checks**:
   - Implement `/health` endpoint for basic status
   - Integrate with monitoring tools (Prometheus/Grafana)

2. **Performance Monitoring**:
   - Track response times for queries
   - Monitor memory usage, especially during document processing
   - Set up alerts for abnormal patterns

3. **Backup Strategy**:
   - Regular database backups
   - Document storage backups
   - System configuration backups

## Upgrading Process

1. **Prepare for Update**:
   ```bash
   # Pull latest changes
   git pull origin main
   ```

2. **Apply Database Migrations** (if necessary):
   ```bash
   # Run migration scripts if provided
   ./scripts/migrate.sh
   ```

3. **Rebuild and Restart**:
   ```bash
   # Rebuild containers with new code
   docker-compose build
   
   # Apply update with minimal downtime
   docker-compose up -d
   ```

## Disaster Recovery

1. **Regular Backups**:
   - Database: Daily full backup
   - Document Storage: Regular differential backups
   - Configuration: Version-controlled and backed up

2. **Recovery Procedures**:
   - Document step-by-step recovery process
   - Test recovery procedures regularly
   - Maintain backup verification logs

This production setup guide covers the essential aspects of deploying the I4C Chatbot in a secure, scalable, and maintainable way.
