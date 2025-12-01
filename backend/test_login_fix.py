#!/usr/bin/env python3
"""
Test the fixed login functionality
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_fixed_login():
    """Test the fixed login flow"""

    print("🔧 Testing Fixed AYUSH EHR Login")
    print("=" * 50)

    # Test ABHA ID from your request
    test_abha_id = "91123456789012"  # Your format

    print(f"1️⃣  Testing with ABHA ID: {test_abha_id}")

    # Step 1: Generate OTP
    print("   Generating OTP...")
    try:
        payload = {
            "identifier": test_abha_id,
            "user_type": "patient"
        }
        response = requests.post(f"{BASE_URL}/api/auth/generate-otp", json=payload)
        print(f"   Response Status: {response.status_code}")

        if response.status_code == 200:
            otp_data = response.json()
            print("   ✅ OTP generated successfully")
            print(f"   Message: {otp_data['message']}")
            print(f"   Normalized ID: {otp_data['data'].get('normalized_id')}")
            test_otp = otp_data['data']['otp']
            print(f"   OTP: {test_otp}")
        else:
            print(f"   ❌ OTP generation failed: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ OTP generation error: {e}")
        return False

    # Step 2: Verify OTP (using your exact request)
    print(f"\n2️⃣  Testing OTP verification with OTP: 404348")
    try:
        payload = {
            "identifier": test_abha_id,
            "otp_code": "404348",  # Your OTP
            "user_type": "patient"
        }
        response = requests.post(f"{BASE_URL}/api/auth/verify-otp", json=payload)
        print(f"   Response Status: {response.status_code}")

        if response.status_code == 200:
            auth_data = response.json()
            print("   ✅ Login successful!")
            print(f"   User ID: {auth_data.get('user_id')}")
            print(f"   Token: {auth_data.get('access_token')[:30]}...")
            return True
        else:
            print(f"   ❌ Login failed: {response.text}")

            # Try with the generated OTP instead
            print(f"\n   Trying with generated OTP: {test_otp}")
            payload["otp_code"] = test_otp
            response = requests.post(f"{BASE_URL}/api/auth/verify-otp", json=payload)
            print(f"   Response Status: {response.status_code}")

            if response.status_code == 200:
                auth_data = response.json()
                print("   ✅ Login successful with generated OTP!")
                print(f"   User ID: {auth_data.get('user_id')}")
                print(f"   Token: {auth_data.get('access_token')[:30]}...")
                return True
            else:
                print(f"   ❌ Login still failed: {response.text}")
                return False
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return False

if __name__ == "__main__":
    print("Waiting for server to restart...")
    time.sleep(2)

    success = test_fixed_login()
    if success:
        print("\n🎉 Login fix successful!")
    else:
        print("\n❌ Login still has issues")
