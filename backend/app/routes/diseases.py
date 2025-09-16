from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional

from ..models import WHOSearchResponse, WHODiseaseResult, APIResponse
from ..services.who_service import who_service
from .auth import get_current_user_dependency

router = APIRouter(prefix="/diseases", tags=["WHO Diseases"])

@router.get("/search", response_model=WHOSearchResponse)
async def search_diseases(
    term: str = Query(..., description="Search term for diseases"),
    system: Optional[str] = Query(None, description="Filter by medical system (ayurveda, siddha, unani, icd11)"),
    limit: Optional[int] = Query(10, description="Maximum number of results"),
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Search for diseases across all WHO databases"""
    try:
        if not term or len(term.strip()) < 2:
            raise HTTPException(
                status_code=400,
                detail="Search term must be at least 2 characters long"
            )

        results = await who_service.search_diseases(term.strip(), system, limit)
        return results

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Disease search failed: {str(e)}"
        )

@router.get("/search/{database}", response_model=List[WHODiseaseResult])
async def search_diseases_by_database(
    database: str,
    term: str = Query(..., description="Search term for diseases"),
    limit: Optional[int] = Query(10, description="Maximum number of results"),
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Search for diseases in a specific database"""
    try:
        if not term or len(term.strip()) < 2:
            raise HTTPException(
                status_code=400,
                detail="Search term must be at least 2 characters long"
            )

        valid_databases = ["ayurveda", "siddha", "unani", "icd11"]
        if database not in valid_databases:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid database. Must be one of: {', '.join(valid_databases)}"
            )

        results = await who_service.search_by_database(database, term.strip(), limit)
        return results

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database search failed: {str(e)}"
        )

@router.get("/code/{code}", response_model=WHODiseaseResult)
async def get_disease_by_code(
    code: str,
    database: Optional[str] = Query(None, description="Specific database to search in"),
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Get specific disease by code"""
    try:
        if not code or len(code.strip()) < 1:
            raise HTTPException(
                status_code=400,
                detail="Disease code is required"
            )

        result = await who_service.get_disease_by_code(code.strip(), database)
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Disease with code '{code}' not found"
            )

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get disease by code: {str(e)}"
        )

@router.get("/databases", response_model=Dict[str, Any])
async def get_available_databases():
    """Get list of available WHO databases and their status"""
    try:
        databases = await who_service.get_available_databases()
        return databases

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get databases: {str(e)}"
        )

@router.get("/health", response_model=APIResponse)
async def check_who_service_health():
    """Check if WHO disease service is available"""
    try:
        is_healthy = await who_service.health_check()

        return APIResponse(
            success=is_healthy,
            message="WHO service is healthy" if is_healthy else "WHO service is unavailable",
            data={"status": "healthy" if is_healthy else "unhealthy"}
        )

    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Health check failed: {str(e)}",
            data={"status": "error"}
        )
