#!/usr/bin/env python3
"""
Simple server startup script for AYUSH EMR API
"""

import uvicorn;
import sys
import os

if __name__ == "__main__":
    print("🌿 Starting AYUSH EMR API Server...")
    print("📖 Documentation: http://localhost:8000/docs")
    print("❤️  Health Check: http://localhost:8000/api/health")
    print("🧪 Mock ABHA IDs: 91-1234-5678-9012, 91-9876-5432-1098, 91-1111-2222-3333")
    print("🔐 Test OTP: Any 6-digit number (e.g., 123456)")
    print("-" * 60)

    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
