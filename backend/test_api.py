#!/usr/bin/env python3
"""
AYUSH EHR API Test Script
Tests the main functionality of the API
"""

import requests
import json
import time
import sys

BASE_URL = "http://localhost:8000"

def test_api():
    """Test the AYUSH EHR API Test endpoints"""

    print("🧪 Testing AYUSH EHR API")
    print("=" * 50)

    # Test 1: Health Check
    print("1️⃣  Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Status: {response.json()['status']}")
        else:
            print("❌ Health check failed")
            return False
    except requests.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

    # Test 2: API Info
    print("\n2️⃣  Testing API Info...")
    try:
        response = requests.get(f"{BASE_URL}/api/info")
        if response.status_code == 200:
            print("✅ API info retrieved")
            info = response.json()
            print(f"   Name: {info['name']}")
            print(f"   Version: {info['version']}")
        else:
            print("❌ API info failed")
    except requests.RequestException as e:
        print(f"❌ API info failed: {e}")

    # Test 3: Mock ABHA IDs
    print("\n3️⃣  Testing Mock ABHA IDs...")
    try:
        response = requests.get(f"{BASE_URL}/api/patients/mock-abha-ids")
        if response.status_code == 200:
            print("✅ Mock ABHA IDs retrieved")
            abha_ids = response.json()
            print(f"   Available IDs: {len(abha_ids)}")
            test_abha_id = abha_ids[0] if abha_ids else "91-1234-5678-9012"
        else:
            print("❌ Mock ABHA IDs failed")
            test_abha_id = "91-1234-5678-9012"
    except requests.RequestException as e:
        print(f"❌ Mock ABHA IDs failed: {e}")
        test_abha_id = "91-1234-5678-9012"

    # Test 4: Generate OTP
    print(f"\n4️⃣  Testing OTP Generation for {test_abha_id}...")
    try:
        payload = {
            "identifier": test_abha_id,
            "user_type": "patient"
        }
        response = requests.post(f"{BASE_URL}/api/auth/generate-otp", json=payload)
        if response.status_code == 200:
            print("✅ OTP generated successfully")
            otp_data = response.json()
            test_otp = otp_data.get('data', {}).get('otp', '123456')
            print(f"   Test OTP: {test_otp}")
        else:
            print("❌ OTP generation failed")
            print(f"   Error: {response.text}")
            return False
    except requests.RequestException as e:
        print(f"❌ OTP generation failed: {e}")
        return False

    # Test 5: Verify OTP and Login
    print(f"\n5️⃣  Testing OTP Verification...")
    try:
        payload = {
            "identifier": test_abha_id,
            "otp_code": test_otp,
            "user_type": "patient"
        }
        response = requests.post(f"{BASE_URL}/api/auth/verify-otp", json=payload)
        if response.status_code == 200:
            print("✅ OTP verified and user authenticated")
            auth_data = response.json()
            access_token = auth_data.get('access_token')
            print(f"   Token received: {access_token[:20]}...")

            # Set up headers for authenticated requests
            headers = {"Authorization": f"Bearer {access_token}"}

        else:
            print("❌ OTP verification failed")
            print(f"   Error: {response.text}")
            return False
    except requests.RequestException as e:
        print(f"❌ OTP verification failed: {e}")
        return False

    # Test 6: Get Current User
    print(f"\n6️⃣  Testing Current User Info...")
    try:
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        if response.status_code == 200:
            print("✅ User info retrieved")
            user_data = response.json()
            print(f"   User ID: {user_data.get('user_id')}")
            print(f"   User Type: {user_data.get('user_type')}")
        else:
            print("❌ User info failed")
            print(f"   Error: {response.text}")
    except requests.RequestException as e:
        print(f"❌ User info failed: {e}")

    # Test 7: Get Patient Profile
    print(f"\n7️⃣  Testing Patient Profile...")
    try:
        response = requests.get(f"{BASE_URL}/api/patients/profile", headers=headers)
        if response.status_code == 200:
            print("✅ Patient profile retrieved")
            profile = response.json()
            print(f"   Name: {profile.get('name')}")
            print(f"   ABHA ID: {profile.get('abha_id')}")
        else:
            print("❌ Patient profile failed")
            print(f"   Error: {response.text}")
    except requests.RequestException as e:
        print(f"❌ Patient profile failed: {e}")

    # Test 8: Get ABHA Profile
    print(f"\n8️⃣  Testing ABHA Profile...")
    try:
        response = requests.get(f"{BASE_URL}/api/patients/abha-profile", headers=headers)
        if response.status_code == 200:
            print("✅ ABHA profile retrieved")
            abha_profile = response.json()
            print(f"   Name: {abha_profile.get('name')}")
            print(f"   Mobile: {abha_profile.get('mobile')}")
            print(f"   State: {abha_profile.get('stateName')}")
        else:
            print("❌ ABHA profile failed")
            print(f"   Error: {response.text}")
    except requests.RequestException as e:
        print(f"❌ ABHA profile failed: {e}")

    # Test 9: Disease Search (if WHO API is running)
    print(f"\n9️⃣  Testing Disease Search...")
    try:
        response = requests.get(f"{BASE_URL}/api/diseases/health")
        if response.status_code == 200:
            health_data = response.json()
            if health_data.get('success'):
                print("✅ WHO service is healthy, testing disease search...")

                # Search for a common term
                search_response = requests.get(
                    f"{BASE_URL}/api/diseases/search",
                    params={"term": "fever", "limit": 5},
                    headers=headers
                )
                if search_response.status_code == 200:
                    search_data = search_response.json()
                    print(f"✅ Disease search successful")
                    print(f"   Found {search_data.get('total_count', 0)} results")

                    results = search_data.get('combined_results', [])
                    for i, result in enumerate(results[:3], 1):
                        print(f"   {i}. {result.get('term')} ({result.get('source_database')})")
                else:
                    print("❌ Disease search failed")
                    print(f"   Error: {search_response.text}")
            else:
                print("⚠️  WHO service not available - skipping disease search")
        else:
            print("⚠️  Cannot check WHO service health - skipping disease search")
    except requests.RequestException as e:
        print(f"⚠️  Disease search test failed: {e}")

    print("\n" + "=" * 50)
    print("🎉 API Testing Complete!")
    print("📖 Visit http://localhost:8000/docs for interactive documentation")
    return True

if __name__ == "__main__":
    print("Waiting 3 seconds for server to start...")
    time.sleep(3)

    success = test_api()
    if success:
        print("✅ All critical tests passed!")
        sys.exit(0)
    else:
        print("❌ Some tests failed!")
        sys.exit(1)
