from fastapi import APIRouter, HTTPException, Depends, Query, Body
from typing import List, Dict, Any, Optional
import json

from ..models.fhir_models import (
    FHIRCodeSystem, FHIRConceptMap, FHIRValueSet, FHIRBundle, FHIRCondition,
    FHIRSearchRequest, FHIRTranslateRequest, FHIRTranslateResponse,
    NAMASTESearchResponse, ProblemListRequest
)
from ..services.fhir_service import fhir_service
from .auth import get_current_user_dependency

router = APIRouter(prefix="/fhir", tags=["FHIR Terminology Service"])

# FHIR CodeSystem Endpoints
@router.get("/CodeSystem/namaste", response_model=Dict[str, Any])
async def get_namaste_codesystem(
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Get FHIR CodeSystem for NAMASTE terminologies"""
    try:
        codesystem = fhir_service.get_namaste_codesystem()
        return codesystem.model_dump(exclude_none=True)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate NAMASTE CodeSystem: {str(e)}"
        )

@router.get("/CodeSystem/icd11-tm2", response_model=Dict[str, Any])
async def get_icd11_tm2_codesystem(
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Get FHIR CodeSystem for ICD-11 TM2"""
    try:
        codesystem = fhir_service.get_icd11_tm2_codesystem()
        return codesystem.model_dump(exclude_none=True)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate ICD-11 TM2 CodeSystem: {str(e)}"
        )

# FHIR ConceptMap Endpoints
@router.get("/ConceptMap/namaste-to-icd11", response_model=Dict[str, Any])
async def get_namaste_icd11_conceptmap(
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Get FHIR ConceptMap between NAMASTE and ICD-11 TM2"""
    try:
        conceptmap = fhir_service.get_namaste_icd11_conceptmap()
        return conceptmap.model_dump(exclude_none=True)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate NAMASTE-ICD11 ConceptMap: {str(e)}"
        )

# FHIR ValueSet Lookup (Auto-complete)
@router.get("/ValueSet/$expand", response_model=NAMASTESearchResponse)
async def expand_valueset(
    url: str = Query(..., description="ValueSet URL to expand"),
    filter: Optional[str] = Query(None, description="Filter term for auto-complete"),
    count: Optional[int] = Query(10, description="Maximum number of results"),
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """FHIR ValueSet $expand operation for auto-complete functionality"""
    try:
        if not filter or len(filter.strip()) < 2:
            raise HTTPException(
                status_code=400,
                detail="Filter term must be at least 2 characters long"
            )

        # Determine system from URL
        system = None
        if "namaste" in url.lower():
            if "ayurveda" in url.lower():
                system = "ayurveda"
            elif "siddha" in url.lower():
                system = "siddha"
            elif "unani" in url.lower():
                system = "unani"

        results = fhir_service.search_namaste_terms(filter.strip(), system, count)
        return results

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"ValueSet expansion failed: {str(e)}"
        )

# FHIR ConceptMap $translate Operation
@router.post("/ConceptMap/$translate", response_model=FHIRTranslateResponse)
async def translate_concept(
    request: FHIRTranslateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """FHIR ConceptMap $translate operation - NAMASTE ↔ ICD-11 TM2"""
    try:
        # Extract system name from system URL
        system_name = None
        if "ayurveda" in request.system.lower():
            system_name = "ayurveda"
        elif "siddha" in request.system.lower():
            system_name = "siddha"
        elif "unani" in request.system.lower():
            system_name = "unani"
        elif "icd" in request.system.lower():
            system_name = "icd11"

        if not system_name:
            raise HTTPException(
                status_code=400,
                detail="Unsupported system URL"
            )

        # Perform translation
        if "icd" in request.target.lower():
            # NAMASTE to ICD-11
            result = fhir_service.translate_namaste_to_icd11(request.code, system_name)
        else:
            # ICD-11 to NAMASTE (reverse translation)
            result = FHIRTranslateResponse(
                result=False,
                message="Reverse translation (ICD-11 to NAMASTE) not yet implemented"
            )

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )

# FHIR Bundle Upload for Double Coding
@router.post("/Bundle", response_model=Dict[str, Any])
async def upload_fhir_bundle(
    bundle: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Upload FHIR Bundle with double-coded conditions"""
    try:
        # Validate bundle structure
        if bundle.get("resourceType") != "Bundle":
            raise HTTPException(
                status_code=400,
                detail="Resource must be a FHIR Bundle"
            )

        # Process bundle entries
        processed_entries = []
        entries = bundle.get("entry", [])

        for entry in entries:
            resource = entry.get("resource", {})

            # Process Condition resources for double coding validation
            if resource.get("resourceType") == "Condition":
                # Validate double coding structure
                code = resource.get("code", {})
                codings = code.get("coding", [])

                if len(codings) < 2:
                    raise HTTPException(
                        status_code=400,
                        detail="Condition must have at least two codings for double coding"
                    )

                # Validate that we have both NAMASTE and ICD-11 codings
                has_namaste = any("ayush.gov.in" in coding.get("system", "") for coding in codings)
                has_icd11 = any("who.int" in coding.get("system", "") for coding in codings)

                if not (has_namaste and has_icd11):
                    raise HTTPException(
                        status_code=400,
                        detail="Double coding requires both NAMASTE and ICD-11 codes"
                    )

            processed_entries.append(entry)

        # Return success response with processed bundle
        return {
            "resourceType": "Bundle",
            "id": f"processed-{bundle.get('id', 'unknown')}",
            "type": "transaction-response",
            "entry": [
                {
                    "response": {
                        "status": "200 OK",
                        "location": f"Condition/{entry.get('resource', {}).get('id', 'unknown')}"
                    }
                } for entry in processed_entries
            ],
            "meta": {
                "lastUpdated": "2024-01-01T00:00:00Z",
                "profile": ["http://hl7.org/fhir/StructureDefinition/Bundle"]
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Bundle processing failed: {str(e)}"
        )

# FHIR Condition (Problem List) Creation
@router.post("/Condition", response_model=Dict[str, Any])
async def create_fhir_condition(
    request: ProblemListRequest,
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Create FHIR Condition resource for Problem List with double coding"""
    try:
        condition = fhir_service.create_fhir_condition(request)
        return condition.model_dump(exclude_none=True)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create FHIR Condition: {str(e)}"
        )

# Search Interface Endpoints
@router.get("/terminology/search", response_model=NAMASTESearchResponse)
async def search_terminology(
    term: str = Query(..., min_length=2, description="Search term"),
    system: Optional[str] = Query(None, description="Medical system (ayurveda, siddha, unani)"),
    limit: Optional[int] = Query(10, ge=1, le=100, description="Maximum results"),
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Search NAMASTE terminologies with auto-complete"""
    try:
        results = fhir_service.search_namaste_terms(term.strip(), system, limit)
        return results

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Terminology search failed: {str(e)}"
        )

# WHO ICD-11 API Integration
@router.get("/who/updates", response_model=Dict[str, Any])
async def get_who_updates(
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Fetch updates from WHO ICD-11 API"""
    try:
        updates = await fhir_service.fetch_who_icd_updates()
        return updates

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch WHO updates: {str(e)}"
        )

# Version and Metadata Endpoints
@router.get("/metadata", response_model=Dict[str, Any])
async def get_fhir_metadata():
    """Get FHIR CapabilityStatement for terminology service"""
    return {
        "resourceType": "CapabilityStatement",
        "id": "ayush-emr-terminology",
        "url": "http://terminology.ayush.gov.in/fhir/CapabilityStatement/ayush-emr-terminology",
        "version": "1.0.0",
        "name": "AYUSHEMRTerminologyService",
        "title": "AYUSH EMR FHIR Terminology Service",
        "status": "active",
        "date": "2024-01-01",
        "publisher": "Ministry of AYUSH, Government of India",
        "description": "FHIR R4 compliant terminology service for NAMASTE and ICD-11 TM2 integration",
        "kind": "instance",
        "software": {
            "name": "AYUSH EMR Terminology Service",
            "version": "1.0.0"
        },
        "implementation": {
            "description": "AYUSH EMR FHIR Terminology Microservice"
        },
        "fhirVersion": "4.0.1",
        "format": ["json"],
        "rest": [{
            "mode": "server",
            "resource": [
                {
                    "type": "CodeSystem",
                    "interaction": [{"code": "read"}, {"code": "search-type"}]
                },
                {
                    "type": "ConceptMap",
                    "interaction": [{"code": "read"}, {"code": "search-type"}],
                    "operation": [{"name": "translate", "definition": "ConceptMap/$translate"}]
                },
                {
                    "type": "ValueSet",
                    "interaction": [{"code": "read"}, {"code": "search-type"}],
                    "operation": [{"name": "expand", "definition": "ValueSet/$expand"}]
                },
                {
                    "type": "Bundle",
                    "interaction": [{"code": "create"}]
                },
                {
                    "type": "Condition",
                    "interaction": [{"code": "create"}, {"code": "read"}, {"code": "search-type"}]
                }
            ]
        }]
    }

@router.get("/health", response_model=Dict[str, Any])
async def fhir_health_check():
    """FHIR Terminology Service health check"""
    return {
        "status": "healthy",
        "service": "AYUSH EMR FHIR Terminology Service",
        "version": "1.0.0",
        "timestamp": "2024-01-01T00:00:00Z",
        "features": [
            "NAMASTE CodeSystem generation",
            "ICD-11 TM2 CodeSystem integration",
            "NAMASTE ↔ ICD-11 ConceptMap",
            "Auto-complete ValueSet expansion",
            "Double coding support",
            "FHIR Bundle processing",
            "Problem List creation"
        ]
    }





