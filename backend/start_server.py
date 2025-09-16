#!/usr/bin/env python3
"""
AYUSH EMR API Server Startup Script
Smart India Hackathon 2025

This script starts the FastAPI server with proper configuration.
"""

import uvicorn
import sys
import os
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))

def main():
    """Start the AYUSH EMR API server"""
    print("🌿 Starting AYUSH EMR API Server...")
    print("=" * 50)
    print("📋 Project: Smart India Hackathon 2025")
    print("🏥 System: Electronic Medical Record for AYUSH")
    print("🔗 Features: ABHA Integration + WHO Disease Codes")
    print("=" * 50)

    # Configuration
    host = "0.0.0.0"
    port = 8000

    print(f"🚀 Server starting on: http://{host}:{port}")
    print(f"📖 API Documentation: http://{host}:{port}/docs")
    print(f"📚 Alternative Docs: http://{host}:{port}/redoc")
    print(f"❤️  Health Check: http://{host}:{port}/api/health")
    print("=" * 50)
    print("🧪 Mock ABHA IDs for testing:")
    print("   - 91-1234-5678-9012 (Rajesh Kumar)")
    print("   - 91-9876-5432-1098 (Priya Singh)")
    print("   - 91-1111-2222-3333 (Mohammed Khan)")
    print("🔐 Test OTP: Any 6-digit number (e.g., 123456)")
    print("=" * 50)

    try:
        uvicorn.run(
            "app.main:app",
            host=host,
            port=port,
            reload=True,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
