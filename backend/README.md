# AYUSH EMR Backend API

**Smart India Hackathon 2025 - Electronic Medical Record System**

A FastAPI-based backend service for AYUSH practitioners with ABHA ID integration and WHO disease code support.

## 🌟 Features

- 🔐 **ABHA ID Authentication** - Mock ABHA integration with OTP verification
- 👤 **Patient Management** - Complete patient profile management
- 🏥 **WHO Disease Codes** - Integration with AYUSH, Siddha, Unani & ICD-11 databases
- 📊 **Auto-Generated Docs** - Swagger UI and ReDoc documentation
- 🔍 **Advanced Search** - Disease code search across multiple databases
- 📱 **Mobile-Ready** - CORS enabled for frontend integration
- 🛡️ **Secure** - JWT tokens and session management

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Virtual environment (recommended)

### Installation

1. **Navigate to backend directory:**

   ```bash
   cd home/backend
   ```

2. **Activate virtual environment:**

   ```bash
   # On Windows
   venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server:**

   ```bash
   python start_server.py
   ```

   Or using uvicorn directly:

   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 📖 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/ap i/health

## 🧪 Testing with Mock Data

### Mock ABHA IDs

Use these ABHA IDs for testing:

| ABHA ID             | Name                | Mobile        |
| ------------------- | ------------------- | ------------- |
| `91-1234-5678-9012` | Rajesh Kumar Sharma | +919876543210 |
| `91-9876-5432-1098` | Priya Devi Singh    | +919123456789 |
| `91-1111-2222-3333` | Mohammed Ali Khan   | +919988776655 |

### Test OTP

Any 6-digit number works (e.g., `123456`, `000000`, `999999`)

## 📁 Project Structure

```
backend/
├── app/
│   ├── config.py          # Application configuration
│   ├── database.py        # Database setup and connection
│   ├── main.py           # FastAPI application
│   ├── models.py         # Pydantic models
│   ├── routes/           # API routes
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── patients.py   # Patient management
│   │   └── diseases.py   # WHO disease search
│   └── services/         # Business logic
│       ├── auth_service.py    # Authentication service
│       ├── abha_service.py    # Mock ABHA integration
│       ├── patient_service.py # Patient operations
│       └── who_service.py     # WHO API integration
├── requirements.txt      # Python dependencies
├── start_server.py      # Server startup script
└── README.md           # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/generate-otp` - Generate OTP for login
- `POST /api/auth/verify-otp` - Verify OTP and authenticate
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Patients

- `GET /api/patients/profile` - Get patient profile
- `GET /api/patients/abha-profile` - Get ABHA profile data
- `GET /api/patients/diseases` - Get patient's diseases
- `PUT /api/patients/profile-photo` - Update profile photo
- `POST /api/patients/sync-abha` - Sync with ABHA data
- `GET /api/patients/mock-abha-ids` - Get test ABHA IDs

### Diseases (WHO Integration)

- `GET /api/diseases/search` - Search diseases across all databases
- `GET /api/diseases/search/{database}` - Search in specific database
- `GET /api/diseases/code/{code}` - Get disease by code
- `GET /api/diseases/databases` - List available databases
- `GET /api/diseases/health` - Check WHO service health

### General

- `GET /api/health` - API health check
- `GET /api/info` - API information and features

## 🔧 Configuration

Create a `.env` file based on `.env.example`:

```env
SECRET_KEY="your-super-secret-key-change-in-production"
ACCESS_TOKEN_EXPIRE_MINUTES=30
WHO_API_URL="http://127.0.0.1:5000"
```

## 📊 Database Schema

The system uses SQLite with the following tables:

- **patients** - Patient profiles from ABHA
- **doctors** - Doctor information (for future use)
- **otp_records** - OTP verification records
- **patient_diseases** - Disease records for patients
- **user_sessions** - User authentication sessions

## 🔗 Integration

### WHO Disease API

Connects to the existing WHO API service at `http://127.0.0.1:5000`

### ABHA API (Mock)

Simulates ABHA API responses since sandbox is not available:

- Profile data generation
- OTP verification
- Mock authentication flows

## 🛠️ Development

### Adding New Endpoints

1. Create route in appropriate file under `app/routes/`
2. Add business logic to `app/services/`
3. Update models in `app/models.py` if needed
4. Test with auto-generated docs

### Database Changes

1. Update schema in `app/database.py`
2. Delete existing `ayush_emr.db` file
3. Restart server to recreate database

## 🚨 Production Notes

- Change `SECRET_KEY` in production
- Use proper ABHA API credentials
- Configure proper CORS origins
- Set up proper logging
- Use production-grade database
- Implement proper error handling

## 📞 Support

For Smart India Hackathon 2025 - AYUSH EMR Project

---

**🌿 Built for AYUSH practitioners with modern technology and traditional wisdom**
