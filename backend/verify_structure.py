#!/usr/bin/env python3
"""
Verify the backend structure and imports work correctly
"""

import sys
import os

def verify_imports():
    """Test that all our modules can be imported correctly"""
    print("🔍 Verifying AYUSH EMR Backend Structure...")
    print("=" * 50)

    try:
        # Test config
        from app.config import settings
        print("✅ Config loaded successfully")
        print(f"   App Name: {settings.app_name}")
        print(f"   Version: {settings.app_version}")

        # Test database
        from app.database import init_database, get_db
        print("✅ Database module imported")

        # Test models
        from app.models import PatientResponse, AuthResponse, WHOSearchResponse
        print("✅ Models imported successfully")

        # Test services
        from app.services.auth_service import auth_service
        from app.services.abha_service import abha_service
        from app.services.patient_service import patient_service
        from app.services.who_service import who_service
        print("✅ All services imported successfully")

        # Test routes
        from app.routes import auth, patients, diseases
        print("✅ All routes imported successfully")

        # Test main app
        from app.main import app
        print("✅ FastAPI app created successfully")

        # Initialize database
        print("\n📊 Initializing database...")
        init_database()
        print("✅ Database initialized successfully")

        # Test ABHA service
        print("\n🔐 Testing ABHA service...")
        mock_ids = abha_service.get_mock_abha_ids()
        print(f"✅ Mock ABHA IDs available: {len(mock_ids)}")
        for abha_id in mock_ids:
            print(f"   - {abha_id}")

        # Test auth service
        print("\n🔑 Testing auth service...")
        test_otp = auth_service.generate_otp()
        print(f"✅ OTP generation works: {test_otp}")

        print("\n" + "=" * 50)
        print("🎉 All modules verified successfully!")
        print("📖 To start the server, run: python run.py")
        print("📚 Then visit: http://localhost:8000/docs")

        return True

    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Verification error: {e}")
        return False

if __name__ == "__main__":
    success = verify_imports()
    sys.exit(0 if success else 1)
