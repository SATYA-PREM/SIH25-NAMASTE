import httpx
from typing import List, Dict, Any, Optional
import asyncio

from ..config import settings
from ..models import WHODiseaseResult, WHOSearchResponse

class WHOService:
    """Service to interact with WHO disease codes API"""

    def __init__(self):
        self.base_url = settings.who_api_url
        self.timeout = 30.0

    async def search_diseases(self, term: str, system: Optional[str] = None, limit: Optional[int] = 10) -> WHOSearchResponse:
        """Search for diseases across all WHO databases"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                params = {
                    "term": term,
                    "total_limit": limit
                }

                if system:
                    params["system"] = system

                response = await client.get(f"{self.base_url}/api/search", params=params)
                response.raise_for_status()

                data = response.json()

                # Convert to our model format
                results = []
                for item in data.get("combined_results", []):
                    result = WHODiseaseResult(
                        code=item.get("code") or item.get("sr_no") or item.get("id"),
                        term=item.get("term") or item.get("name"),
                        short_definition=item.get("short_definition"),
                        long_definition=item.get("long_definition"),
                        system=item.get("system"),
                        source_database=item.get("source_database")
                    )
                    results.append(result)

                return WHOSearchResponse(
                    search_term=term,
                    total_count=data.get("total_count", 0),
                    combined_results=results
                )

        except httpx.RequestError as e:
            print(f"WHO API request error: {e}")
            return WHOSearchResponse(
                search_term=term,
                total_count=0,
                combined_results=[]
            )
        except httpx.HTTPStatusError as e:
            print(f"WHO API HTTP error: {e}")
            return WHOSearchResponse(
                search_term=term,
                total_count=0,
                combined_results=[]
            )
        except Exception as e:
            print(f"WHO API unexpected error: {e}")
            return WHOSearchResponse(
                search_term=term,
                total_count=0,
                combined_results=[]
            )

    async def search_by_database(self, database: str, term: str, limit: Optional[int] = 10) -> List[WHODiseaseResult]:
        """Search diseases in specific database"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                params = {
                    "term": term,
                    "database": database,
                    "total_limit": limit
                }

                response = await client.get(f"{self.base_url}/api/search", params=params)
                response.raise_for_status()

                data = response.json()

                results = []
                for item in data.get("data", []):
                    result = WHODiseaseResult(
                        code=item.get("code") or item.get("sr_no") or item.get("id"),
                        term=item.get("term") or item.get("name"),
                        short_definition=item.get("short_definition"),
                        long_definition=item.get("long_definition"),
                        system=item.get("system"),
                        source_database=database
                    )
                    results.append(result)

                return results

        except Exception as e:
            print(f"WHO database search error: {e}")
            return []

    async def get_available_databases(self) -> Dict[str, Any]:
        """Get list of available WHO databases"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/api/databases")
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"WHO databases error: {e}")
            return {"databases": {}}

    async def health_check(self) -> bool:
        """Check if WHO API is available"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/health")
                return response.status_code == 200
        except Exception:
            return False

    async def get_disease_by_code(self, code: str, database: Optional[str] = None) -> Optional[WHODiseaseResult]:
        """Get specific disease by code"""
        try:
            # Search for the exact code
            search_result = await self.search_diseases(code, limit=50)

            # Find exact match
            for result in search_result.combined_results:
                if result.code and result.code.lower() == code.lower():
                    return result

            # If no exact match, return first result that contains the code
            for result in search_result.combined_results:
                if result.code and code.lower() in result.code.lower():
                    return result

            return None

        except Exception as e:
            print(f"Get disease by code error: {e}")
            return None

# Global WHO service instance
who_service = WHOService()
