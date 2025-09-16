import httpx
import secrets
from datetime import datetime, date
from typing import Optional, Dict, Any
import asyncio

from ..config import settings
from ..models import ABHAProfile, ABHAAuthResponse

class ABHAService:
    """Mock ABHA API Service - Simulates ABHA API responses since sandbox is not available"""

    def __init__(self):
        self.base_url = settings.abha_api_url
        self.client_id = settings.abha_client_id
        self.client_secret = settings.abha_client_secret

    def _generate_mock_abha_profile(self, abha_id: str) -> ABHAProfile:
        """Generate mock ABHA profile data"""
        # Normalize ABHA ID first
        normalized_id = self.normalize_abha_id(abha_id)
        # Extract some info from ABHA ID for realistic mock data
        mock_profiles = {
            "91-1234-5678-9012": {
                "name": "Rajesh Kumar Sharma",
                "firstName": "Rajesh",
                "middleName": "Kumar",
                "lastName": "Sharma",
                "gender": "M",
                "mobile": "+919876543210",
                "email": "rajesh.sharma@example.com",
                "address": "123, MG Road, Bangalore",
                "districtName": "Bangalore Urban",
                "stateName": "Karnataka",
                "pincode": "560001",
                "yearOfBirth": "1985",
                "dayOfBirth": "15",
                "monthOfBirth": "03"
            },
            "91-9876-5432-1098": {
                "name": "Priya Devi Singh",
                "firstName": "Priya",
                "middleName": "Devi",
                "lastName": "Singh",
                "gender": "F",
                "mobile": "+919123456789",
                "email": "priya.singh@example.com",
                "address": "456, Park Street, Delhi",
                "districtName": "Central Delhi",
                "stateName": "Delhi",
                "pincode": "110001",
                "yearOfBirth": "1990",
                "dayOfBirth": "22",
                "monthOfBirth": "07"
            },
            "91-1111-2222-3333": {
                "name": "Mohammed Ali Khan",
                "firstName": "Mohammed",
                "middleName": "Ali",
                "lastName": "Khan",
                "gender": "M",
                "mobile": "+919988776655",
                "email": "mohammed.khan@example.com",
                "address": "789, Old City, Hyderabad",
                "districtName": "Hyderabad",
                "stateName": "Telangana",
                "pincode": "500001",
                "yearOfBirth": "1982",
                "dayOfBirth": "10",
                "monthOfBirth": "11"
            }
        }

        # If normalized ABHA ID exists in mock data, use it
        if normalized_id in mock_profiles:
            profile_data = mock_profiles[normalized_id]
        else:
            # Generate random profile for unknown ABHA IDs
            clean_id = normalized_id.replace("-", "")
            profile_data = {
                "name": f"Mock User {clean_id[-4:]}",
                "firstName": "Mock",
                "middleName": "User",
                "lastName": clean_id[-4:],
                "gender": "M",
                "mobile": f"+91{secrets.randbelow(9000000000) + 1000000000}",
                "email": f"user{clean_id[-4:]}@example.com",
                "address": f"Mock Address, City {clean_id[-2:]}",
                "districtName": "Mock District",
                "stateName": "Mock State",
                "pincode": f"{secrets.randbelow(900000) + 100000}",
                "yearOfBirth": str(1980 + secrets.randbelow(30)),
                "dayOfBirth": str(secrets.randbelow(28) + 1).zfill(2),
                "monthOfBirth": str(secrets.randbelow(12) + 1).zfill(2)
            }

        # Generate ABHA number from normalized ABHA ID
        abha_number = normalized_id.replace("-", "")

        return ABHAProfile(
            abhaId=normalized_id,
            abhaNumber=abha_number,
            name=profile_data["name"],
            firstName=profile_data.get("firstName"),
            middleName=profile_data.get("middleName"),
            lastName=profile_data.get("lastName"),
            gender=profile_data["gender"],
            yearOfBirth=profile_data["yearOfBirth"],
            dayOfBirth=profile_data.get("dayOfBirth"),
            monthOfBirth=profile_data.get("monthOfBirth"),
            mobile=profile_data["mobile"],
            email=profile_data.get("email"),
            address=profile_data.get("address"),
            districtName=profile_data.get("districtName"),
            stateName=profile_data.get("stateName"),
            pincode=profile_data.get("pincode"),
            profilePhoto=f"https://api.dicebear.com/7.x/avataaars/svg?seed={normalized_id}"
        )

    async def generate_otp(self, abha_id: str) -> Dict[str, Any]:
        """Mock OTP generation for ABHA ID"""
        # Simulate API call delay
        await asyncio.sleep(0.5)

        # Validate ABHA ID format (basic validation)
        if not abha_id or len(abha_id) < 10:
            return {
                "success": False,
                "error": "Invalid ABHA ID format"
            }

        # Mock successful OTP generation
        return {
            "success": True,
            "message": "OTP sent successfully to registered mobile number",
            "txnId": f"mock_txn_{secrets.token_hex(8)}",
            "abhaId": abha_id
        }

    async def verify_otp_and_get_profile(self, abha_id: str, otp: str, txn_id: str = None) -> Dict[str, Any]:
        """Mock OTP verification and profile retrieval"""
        # Simulate API call delay
        await asyncio.sleep(0.8)

        # Mock OTP validation (accept any 6-digit OTP for testing)
        if not otp or len(otp) != 6 or not otp.isdigit():
            return {
                "success": False,
                "error": "Invalid OTP format"
            }

        # Generate mock profile
        try:
            profile = self._generate_mock_abha_profile(abha_id)

            # Mock auth response
            auth_response = ABHAAuthResponse(
                token=f"mock_token_{secrets.token_urlsafe(32)}",
                expiresIn=3600,
                refreshToken=f"mock_refresh_{secrets.token_urlsafe(16)}",
                profile=profile
            )

            return {
                "success": True,
                "message": "OTP verified successfully",
                "data": auth_response.model_dump()
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to retrieve profile: {str(e)}"
            }

    async def get_profile_by_abha_id(self, abha_id: str) -> Dict[str, Any]:
        """Get ABHA profile by ABHA ID (mock)"""
        try:
            profile = self._generate_mock_abha_profile(abha_id)
            return {
                "success": True,
                "data": profile.model_dump()
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to retrieve profile: {str(e)}"
            }

    async def validate_abha_id(self, abha_id: str) -> bool:
        """Validate ABHA ID format and existence (mock)"""
        # Basic format validation for ABHA ID
        if not abha_id:
            return False

        # Remove hyphens and check length - accept both formats
        clean_id = abha_id.replace("-", "")
        if len(clean_id) != 14 or not clean_id.isdigit():
            return False

        # Mock: Consider all properly formatted ABHA IDs as valid
        return True

    def normalize_abha_id(self, abha_id: str) -> str:
        """Normalize ABHA ID to standard format with hyphens"""
        if not abha_id:
            return abha_id

        # Remove existing hyphens
        clean_id = abha_id.replace("-", "")

        # Add hyphens in standard format: XX-XXXX-XXXX-XXXX
        if len(clean_id) == 14:
            return f"{clean_id[:2]}-{clean_id[2:6]}-{clean_id[6:10]}-{clean_id[10:14]}"

        return abha_id

    def get_mock_abha_ids(self) -> list[str]:
        """Get list of mock ABHA IDs for testing"""
        return [
            "91-1234-5678-9012",
            "91-9876-5432-1098",
            "91-1111-2222-3333"
        ]

# Global ABHA service instance
abha_service = ABHAService()
