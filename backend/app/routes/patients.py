from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials
from typing import List, Dict, Any

from ..models import (
    PatientResponse, DiseaseRecordResponse, APIResponse,
    UserType, ABHAProfile
)
from ..services.patient_service import patient_service
from ..services.abha_service import abha_service
from .auth import get_current_user_dependency

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/profile", response_model=PatientResponse)
async def get_patient_profile(current_user: Dict[str, Any] = Depends(get_current_user_dependency)):
    """Get current patient's profile"""
    try:
        # Ensure user is a patient
        if current_user["user_type"] != UserType.PATIENT.value:
            raise HTTPException(
                status_code=403,
                detail="Only patients can access this endpoint"
            )

        patient = patient_service.get_patient_by_id(current_user["user_id"])
        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient profile not found"
            )

        return patient

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get patient profile: {str(e)}"
        )

@router.get("/abha-profile", response_model=ABHAProfile)
async def get_abha_profile(current_user: Dict[str, Any] = Depends(get_current_user_dependency)):
    """Get patient's ABHA profile with latest data"""
    try:
        # Ensure user is a patient
        if current_user["user_type"] != UserType.PATIENT.value:
            raise HTTPException(
                status_code=403,
                detail="Only patients can access this endpoint"
            )

        # Get patient to get ABHA ID
        patient = patient_service.get_patient_by_id(current_user["user_id"])
        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient profile not found"
            )

        # Get fresh ABHA profile
        abha_result = await abha_service.get_profile_by_abha_id(patient.abha_id)
        if not abha_result["success"]:
            raise HTTPException(
                status_code=400,
                detail=abha_result.get("error", "Failed to fetch ABHA profile")
            )

        return ABHAProfile(**abha_result["data"])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get ABHA profile: {str(e)}"
        )

@router.get("/diseases", response_model=List[DiseaseRecordResponse])
async def get_patient_diseases(current_user: Dict[str, Any] = Depends(get_current_user_dependency)):
    """Get all diseases for current patient"""
    try:
        # Ensure user is a patient
        if current_user["user_type"] != UserType.PATIENT.value:
            raise HTTPException(
                status_code=403,
                detail="Only patients can access this endpoint"
            )

        diseases = patient_service.get_patient_diseases(current_user["user_id"])
        return diseases

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get patient diseases: {str(e)}"
        )

@router.put("/profile-photo", response_model=APIResponse)
async def update_profile_photo(
    photo_url: str,
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Update patient's profile photo"""
    try:
        # Ensure user is a patient
        if current_user["user_type"] != UserType.PATIENT.value:
            raise HTTPException(
                status_code=403,
                detail="Only patients can access this endpoint"
            )

        success = patient_service.update_profile_photo(current_user["user_id"], photo_url)
        if not success:
            raise HTTPException(
                status_code=400,
                detail="Failed to update profile photo"
            )

        return APIResponse(
            success=True,
            message="Profile photo updated successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update profile photo: {str(e)}"
        )

@router.post("/sync-abha", response_model=APIResponse)
async def sync_with_abha(current_user: Dict[str, Any] = Depends(get_current_user_dependency)):
    """Sync patient profile with latest ABHA data"""
    try:
        # Ensure user is a patient
        if current_user["user_type"] != UserType.PATIENT.value:
            raise HTTPException(
                status_code=403,
                detail="Only patients can access this endpoint"
            )

        # Get current patient
        patient = patient_service.get_patient_by_id(current_user["user_id"])
        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient profile not found"
            )

        # Update from ABHA
        updated_patient = await patient_service.create_or_update_from_abha(patient.abha_id)
        if not updated_patient:
            raise HTTPException(
                status_code=400,
                detail="Failed to sync with ABHA profile"
            )

        return APIResponse(
            success=True,
            message="Profile synced successfully with ABHA",
            data={"updated_at": updated_patient.updated_at.isoformat()}
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync with ABHA: {str(e)}"
        )

# Mock ABHA IDs endpoint for testing
@router.get("/mock-abha-ids", response_model=List[str])
async def get_mock_abha_ids():
    """Get list of mock ABHA IDs for testing (development only)"""
    return abha_service.get_mock_abha_ids()
