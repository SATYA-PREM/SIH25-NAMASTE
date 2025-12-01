# 🚀 AYUSH EMR Backend - Coolify Deployment Guide

**Smart India Hackathon 2025 - Production Deployment**

## 📋 Prerequisites

- Coolify instance running
- Docker support enabled
- Domain name (optional)
- SSL certificate (automatic with Coolify)

## 🔧 Coolify Deployment Steps

### 1. **Create New Application in Coolify**

1. Login to your Coolify dashboard
2. Click **"New Application"**
3. Choose **"Docker Compose"** or **"Dockerfile"**
4. Connect your Git repository

### 2. **Configure Environment Variables**

Set these environment variables in Coolify dashboard:

```bash
# Required Variables
SECRET_KEY=your-super-secret-production-key-min-32-characters
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Optional Variables (with defaults)
APP_NAME=AYUSH EHR API
APP_VERSION=1.0.0
DATABASE_URL=sqlite:///./data/ayush_emr.db
WHO_API_URL=http://your-who-service-url:5000

# ABHA API (when available)
ABHA_CLIENT_ID=your_real_abha_client_id
ABHA_CLIENT_SECRET=your_real_abha_client_secret
ABHA_API_URL=https://abdm.gov.in
```

### 3. **Configure Build Settings**

In Coolify application settings:

- **Build Pack**: Docker
- **Dockerfile Path**: `./Dockerfile`
- **Build Context**: `./`
- **Port**: `8000`
- **Health Check**: `/api/health`

### 4. **Domain Configuration**

1. Go to **Domains** section
2. Add your domain or use Coolify subdomain
3. Enable **SSL/TLS** (automatic with Let's Encrypt)
4. Set **Port** to `8000`

### 5. **Volume Configuration** (Optional)

For persistent database storage:

1. Go to **Volumes** section
2. Add volume: `/app/data` → `/data/ayush-emr`
3. This persists SQLite database across deployments

## 🌐 **Alternative Deployment Methods**

### Method 1: Git Repository (Recommended)

```bash
# In Coolify Dashboard:
1. New Application → Git Repository
2. Repository URL: https://github.com/your-repo/ayush-emr
3. Branch: main
4. Build Pack: Docker
5. Deploy!
```

### Method 2: Docker Image

```bash
# Build and push to registry first
docker build -t your-registry/ayush-emr-api:latest .
docker push your-registry/ayush-emr-api:latest

# In Coolify:
1. New Application → Docker Image
2. Image: your-registry/ayush-emr-api:latest
3. Port: 8000
4. Deploy!
```

### Method 3: Docker Compose

```yaml
# Use the provided docker-compose.yml
# Upload to Coolify as Docker Compose application
```

## 📊 **Production Configuration**

### Database Options

**Option 1: SQLite (Simple)**

```bash
DATABASE_URL=sqlite:///./data/ayush_emr.db
```

**Option 2: PostgreSQL (Scalable)**

```bash
DATABASE_URL=postgresql://user:password@postgres:5432/ayush_emr
```

### Security Settings

```bash
# Generate strong secret key
SECRET_KEY=$(openssl rand -hex 32)

# Longer token expiry for production
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Enable HTTPS only
FORCE_HTTPS=true
```

## 🔍 **Health Checks & Monitoring**

### Built-in Health Check

- **Endpoint**: `GET /api/health`
- **Expected Response**: `{"status": "healthy"}`
- **Interval**: 30 seconds

### API Documentation

- **Swagger UI**: `https://your-domain.com/docs`
- **ReDoc**: `https://your-domain.com/redoc`

### Monitoring Endpoints

- **Health**: `/api/health`
- **Info**: `/api/info`
- **Metrics**: `/api/patients/mock-abha-ids` (for testing)

## 🚨 **Troubleshooting**

### Common Issues

**1. Application Won't Start**

```bash
# Check logs in Coolify dashboard
# Common causes:
- Missing environment variables
- Port conflicts
- Database connection issues
```

**2. Database Issues**

```bash
# Ensure volume is mounted correctly
# Check database permissions
# Verify DATABASE_URL format
```

**3. ABHA API Connection**

```bash
# Check ABHA credentials
# Verify network connectivity
# Use mock mode for testing
```

### Debug Commands

```bash
# Check application logs
docker logs <container-id>

# Test health endpoint
curl https://your-domain.com/api/health

# Test API endpoints
curl https://your-domain.com/api/info
```

## 📱 **Testing Deployment**

### 1. **Basic Health Check**

```bash
curl https://your-domain.com/api/health
# Expected: {"status": "healthy", "service": "AYUSH EHR API"}
```

### 2. **API Documentation**

```bash
# Visit in browser
https://your-domain.com/docs
```

### 3. **Test Authentication**

```bash
# Generate OTP
curl -X POST https://your-domain.com/api/auth/generate-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "91123456789012", "user_type": "patient"}'

# Verify OTP (use OTP from response)
curl -X POST https://your-domain.com/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "91123456789012", "otp_code": "123456", "user_type": "patient"}'
```

## 🔐 **Security Checklist**

- [ ] Set strong `SECRET_KEY`
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable health checks
- [ ] Set up monitoring
- [ ] Regular backups of database
- [ ] Update dependencies regularly

## 📞 **Support**

For deployment issues:

1. Check Coolify logs
2. Verify environment variables
3. Test health endpoints
4. Check database connectivity
5. Review security settings

---

**🌿 Ready for production deployment with Coolify!**

**Smart India Hackathon 2025 - AYUSH EMR Project**
