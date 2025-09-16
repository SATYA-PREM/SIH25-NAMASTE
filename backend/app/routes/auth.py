from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
import asyncio

from ..models import (
    OTPRequest, OTPVerifyRequest, AuthResponse, APIResponse,
    UserType, ErrorResponse
)
from ..services.auth_service import auth_service
from ..services.abha_service import abha_service
from ..services.patient_service import patient_service

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

@router.post("/generate-otp", response_model=APIResponse)
async def generate_otp(request: OTPRequest):
    """Generate OTP for patient/doctor login"""
    try:
        if request.user_type == UserType.PATIENT:
            # Normalize ABHA ID format
            normalized_abha_id = abha_service.normalize_abha_id(request.identifier)

            # For patients, validate ABHA ID and generate OTP
            is_valid = await abha_service.validate_abha_id(normalized_abha_id)
            if not is_valid:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid ABHA ID format"
                )

            # Generate OTP via ABHA service (mock)
            abha_result = await abha_service.generate_otp(normalized_abha_id)
            if not abha_result["success"]:
                raise HTTPException(
                    status_code=400,
                    detail=abha_result.get("error", "Failed to generate OTP")
                )

        # Generate and store OTP locally (use normalized ID for patients)
        identifier_to_store = normalized_abha_id if request.user_type == UserType.PATIENT else request.identifier
        otp_code = auth_service.generate_otp()
        success = auth_service.store_otp(identifier_to_store, otp_code, request.user_type)

        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate OTP"
            )

        # In development, return the OTP for testing
        return APIResponse(
            success=True,
            message=f"OTP sent successfully to {identifier_to_store}",
            data={"otp": otp_code, "expires_in": 600, "normalized_id": identifier_to_store}  # Remove in production
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/verify-otp", response_model=AuthResponse)
async def verify_otp(request: OTPVerifyRequest):
    """Verify OTP and authenticate user"""
    try:
        # Normalize ABHA ID for patients
        identifier_to_verify = abha_service.normalize_abha_id(request.identifier) if request.user_type == UserType.PATIENT else request.identifier

        # Verify OTP
        is_valid = auth_service.verify_otp(identifier_to_verify, request.otp_code, request.user_type)
        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired OTP"
            )

        if request.user_type == UserType.PATIENT:
            # For patients, create/update from ABHA profile
            patient = await patient_service.create_or_update_from_abha(identifier_to_verify)
            if not patient:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to retrieve patient profile"
                )

            # Create session
            session_token = auth_service.create_session(patient.id, UserType.PATIENT)
            if not session_token:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to create session"
                )

            # Create JWT token
            token_data = {
                "sub": str(patient.id),
                "user_type": UserType.PATIENT.value,
                "abha_id": patient.abha_id,
                "session": session_token
            }
            access_token = auth_service.create_access_token(token_data)

            return AuthResponse(
                access_token=access_token,
                token_type="bearer",
                user_id=patient.id,
                user_type=UserType.PATIENT,
                expires_in=auth_service.access_token_expire_minutes * 60
            )

        else:  # Doctor login
            # TODO: Implement doctor authentication
            raise HTTPException(
                status_code=501,
                detail="Doctor authentication not implemented yet"
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/logout", response_model=APIResponse)
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout user and invalidate session"""
    try:
        token = credentials.credentials
        payload = auth_service.verify_token(token)

        if not payload:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        # Invalidate session if present
        session_token = payload.get("session")
        if session_token:
            # TODO: Implement session invalidation
            pass

        return APIResponse(
            success=True,
            message="Logged out successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Logout failed: {str(e)}"
        )

@router.get("/me", response_model=Dict[str, Any])
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user info"""
    try:
        token = credentials.credentials
        payload = auth_service.verify_token(token)

        if not payload:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        user_id = int(payload["sub"])
        user_type = payload["user_type"]

        if user_type == UserType.PATIENT.value:
            patient = patient_service.get_patient_by_id(user_id)
            if not patient:
                raise HTTPException(
                    status_code=404,
                    detail="Patient not found"
                )

            return {
                "user_id": patient.id,
                "user_type": UserType.PATIENT.value,
                "profile": patient.model_dump()
            }

        else:  # Doctor
            # TODO: Implement doctor profile retrieval
            raise HTTPException(
                status_code=501,
                detail="Doctor profile not implemented yet"
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get user info: {str(e)}"
        )

# Dependency for getting current user
async def get_current_user_dependency(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Dependency to get current authenticated user"""
    token = credentials.credentials
    payload = auth_service.verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return {
        "user_id": int(payload["sub"]),
        "user_type": payload["user_type"],
        "token_payload": payload
    }

