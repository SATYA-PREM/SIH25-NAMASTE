import sqlite3
import json
import pandas as pd
import requests
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from pathlib import Path

from ..models.fhir_models import (
    FHIRCodeSystem, FHIRConceptMap, FHIRValueSet, FHIRBundle, FHIRCondition,
    CodeSystemConcept, ConceptMapGroup, ConceptMapElement, ConceptMapTarget,
    FHIRCoding, FHIRCodeableConcept, FHIRIdentifier,
    PublicationStatus, ConceptMapEquivalence,
    FHIRTranslateResponse, NAMASTESearchResponse, ProblemListRequest
)

class FHIRTerminologyService:
    def __init__(self):
        self.base_path = Path(__file__).parent.parent.parent.parent / "who-api"
        self.databases = {
            "ayurveda": self.base_path / "Ayurveda.db",
            "siddha": self.base_path / "siddha.db",
            "unani": self.base_path / "unani.db",
            "icd11": self.base_path / "icd11.db"
        }
        self.who_api_base = "https://id.who.int/icd/release/11/2022-02"

    def get_namaste_codesystem(self) -> FHIRCodeSystem:
        """Generate FHIR CodeSystem for NAMASTE terminologies"""
        concepts = []

        # Load concepts from all NAMASTE databases
        for system_name, db_path in self.databases.items():
            if system_name != "icd11":  # Skip ICD-11 for NAMASTE CodeSystem
                system_concepts = self._load_concepts_from_db(db_path, system_name)
                concepts.extend(system_concepts)

        return FHIRCodeSystem(
            id="namaste-terminology",
            url="http://terminology.ayush.gov.in/CodeSystem/namaste",
            identifier=[
                FHIRIdentifier(
                    system="http://terminology.ayush.gov.in",
                    value="NAMASTE-2024"
                )
            ],
            version="1.0.0",
            name="NAMASTETerminology",
            title="National AYUSH Morbidity & Standardized Terminologies Electronic (NAMASTE)",
            status=PublicationStatus.ACTIVE,
            experimental=False,
            date=datetime.now(),
            publisher="Ministry of AYUSH, Government of India",
            description="Standardized terminologies for Ayurveda, Siddha, and Unani disorders with over 4,500 terms",
            purpose="To provide standardized coding for traditional medicine diagnoses in Indian healthcare systems",
            copyright="© 2024 Ministry of AYUSH, Government of India",
            caseSensitive=True,
            content="complete",
            count=len(concepts),
            concept=concepts
        )

    def get_icd11_tm2_codesystem(self) -> FHIRCodeSystem:
        """Generate FHIR CodeSystem for ICD-11 TM2"""
        concepts = self._load_concepts_from_db(self.databases["icd11"], "icd11")

        return FHIRCodeSystem(
            id="icd11-tm2",
            url="http://id.who.int/icd/release/11/2022-02/mms/tm2",
            identifier=[
                FHIRIdentifier(
                    system="http://id.who.int/icd",
                    value="ICD-11-TM2-2022-02"
                )
            ],
            version="2022-02",
            name="ICD11TM2",
            title="ICD-11 Traditional Medicine Module 2 (TM2)",
            status=PublicationStatus.ACTIVE,
            experimental=False,
            date=datetime.now(),
            publisher="World Health Organization (WHO)",
            description="ICD-11 Traditional Medicine Module 2 with 529 disorder categories and 196 pattern codes",
            purpose="Global standardized coding for traditional medicine integrated with ICD-11",
            copyright="© 2022 World Health Organization",
            caseSensitive=True,
            content="complete",
            count=len(concepts),
            concept=concepts
        )

    def get_namaste_icd11_conceptmap(self) -> FHIRConceptMap:
        """Generate ConceptMap between NAMASTE and ICD-11 TM2"""
        groups = []

        # Create mapping groups for each NAMASTE system to ICD-11
        for system_name in ["ayurveda", "siddha", "unani"]:
            group_elements = self._create_mapping_elements(system_name)

            group = ConceptMapGroup(
                source=f"http://terminology.ayush.gov.in/CodeSystem/namaste/{system_name}",
                target="http://id.who.int/icd/release/11/2022-02/mms/tm2",
                element=group_elements
            )
            groups.append(group)

        return FHIRConceptMap(
            id="namaste-to-icd11-tm2",
            url="http://terminology.ayush.gov.in/ConceptMap/namaste-to-icd11-tm2",
            identifier=[
                FHIRIdentifier(
                    system="http://terminology.ayush.gov.in",
                    value="NAMASTE-ICD11-MAP-2024"
                )
            ],
            version="1.0.0",
            name="NAMASTEToICD11TM2",
            title="NAMASTE to ICD-11 TM2 Concept Mapping",
            status=PublicationStatus.ACTIVE,
            date=datetime.now(),
            publisher="Ministry of AYUSH, Government of India",
            description="Concept mapping between NAMASTE terminologies and ICD-11 Traditional Medicine Module 2",
            purpose="Enable interoperability between Indian traditional medicine codes and global ICD-11 TM2 codes",
            sourceCanonical="http://terminology.ayush.gov.in/CodeSystem/namaste",
            targetCanonical="http://id.who.int/icd/release/11/2022-02/mms/tm2",
            group=groups
        )

    def search_namaste_terms(self, term: str, system: Optional[str] = None, limit: int = 10) -> NAMASTESearchResponse:
        """Search NAMASTE terminologies with auto-complete functionality"""
        results = []
        total_count = 0

        databases_to_search = [system] if system and system != "icd11" else ["ayurveda", "siddha", "unani"]

        for db_name in databases_to_search:
            if db_name in self.databases:
                db_results = self._search_database(self.databases[db_name], term, limit)
                for result in db_results:
                    result["system"] = db_name
                results.extend(db_results)

        # Sort by relevance and limit results
        results = sorted(results, key=lambda x: self._calculate_relevance(x.get("term", ""), term), reverse=True)[:limit]
        total_count = len(results)

        return NAMASTESearchResponse(
            search_term=term,
            total_count=total_count,
            results=results
        )

    def translate_namaste_to_icd11(self, code: str, system: str) -> FHIRTranslateResponse:
        """Translate NAMASTE code to ICD-11 TM2 code"""
        try:
            # Find the NAMASTE concept
            namaste_concept = self._find_concept_by_code(system, code)
            if not namaste_concept:
                return FHIRTranslateResponse(
                    result=False,
                    message=f"NAMASTE code {code} not found in system {system}"
                )

            # Find corresponding ICD-11 mapping (simplified logic)
            icd11_matches = self._find_icd11_matches(namaste_concept)

            if not icd11_matches:
                return FHIRTranslateResponse(
                    result=False,
                    message=f"No ICD-11 TM2 mapping found for {code}"
                )

            matches = []
            for match in icd11_matches:
                matches.append({
                    "equivalence": "equivalent",
                    "concept": {
                        "system": "http://id.who.int/icd/release/11/2022-02/mms/tm2",
                        "code": match.get("code"),
                        "display": match.get("display")
                    }
                })

            return FHIRTranslateResponse(
                result=True,
                message="Translation successful",
                match=matches
            )

        except Exception as e:
            return FHIRTranslateResponse(
                result=False,
                message=f"Translation failed: {str(e)}"
            )

    def create_fhir_condition(self, request: ProblemListRequest) -> FHIRCondition:
        """Create FHIR Condition resource for Problem List"""
        # Primary coding
        primary_coding = FHIRCoding(
            system=request.condition_system,
            code=request.condition_code,
            display=request.condition_display
        )

        # Double coding if provided
        codings = [primary_coding]
        if request.double_coding:
            secondary_coding = FHIRCoding(
                system=request.double_coding.get("system"),
                code=request.double_coding.get("code"),
                display=request.double_coding.get("display")
            )
            codings.append(secondary_coding)

        condition_code = FHIRCodeableConcept(
            coding=codings,
            text=request.condition_display
        )

        # Clinical and verification status
        clinical_status = FHIRCodeableConcept(
            coding=[FHIRCoding(
                system="http://terminology.hl7.org/CodeSystem/condition-clinical",
                code=request.clinical_status,
                display=request.clinical_status.title()
            )]
        )

        verification_status = FHIRCodeableConcept(
            coding=[FHIRCoding(
                system="http://terminology.hl7.org/CodeSystem/condition-ver-status",
                code=request.verification_status,
                display=request.verification_status.title()
            )]
        )

        return FHIRCondition(
            id=f"condition-{request.patient_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            clinicalStatus=clinical_status,
            verificationStatus=verification_status,
            category=[FHIRCodeableConcept(
                coding=[FHIRCoding(
                    system="http://terminology.hl7.org/CodeSystem/condition-category",
                    code="problem-list-item",
                    display="Problem List Item"
                )]
            )],
            code=condition_code,
            subject={"reference": f"Patient/{request.patient_id}"},
            onsetDateTime=request.onset_date,
            recordedDate=datetime.now(),
            note=[{"text": request.notes}] if request.notes else []
        )

    async def fetch_who_icd_updates(self) -> Dict[str, Any]:
        """Fetch updates from WHO ICD-11 API"""
        try:
            # This would connect to the actual WHO ICD-11 API
            # For now, return mock data structure
            return {
                "status": "success",
                "last_updated": datetime.now().isoformat(),
                "tm2_updates": [],
                "biomedicine_updates": [],
                "message": "WHO ICD-11 API integration pending - using local database"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to fetch WHO updates: {str(e)}"
            }

    def _load_concepts_from_db(self, db_path: Path, system_name: str) -> List[CodeSystemConcept]:
        """Load concepts from SQLite database"""
        concepts = []

        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()

            # Try different table structures
            tables = self._get_table_names(cursor)

            for table in tables:
                try:
                    query = f"SELECT * FROM {table} LIMIT 1000"
                    cursor.execute(query)
                    columns = [description[0] for description in cursor.description]
                    rows = cursor.fetchall()

                    for row in rows:
                        row_dict = dict(zip(columns, row))
                        concept = self._create_concept_from_row(row_dict, system_name)
                        if concept:
                            concepts.append(concept)

                except sqlite3.Error:
                    continue

            conn.close()

        except Exception as e:
            print(f"Error loading concepts from {db_path}: {e}")

        return concepts

    def _get_table_names(self, cursor) -> List[str]:
        """Get table names from SQLite database"""
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        return [row[0] for row in cursor.fetchall()]

    def _create_concept_from_row(self, row_dict: Dict[str, Any], system_name: str) -> Optional[CodeSystemConcept]:
        """Create CodeSystemConcept from database row"""
        try:
            # Extract code and display from various possible column names
            code = None
            display = None
            definition = None

            # Common column name patterns
            code_columns = ['code', 'Code', 'disease_code', 'id', 'ID']
            display_columns = ['name', 'Name', 'disease_name', 'term', 'Term', 'title', 'Title']
            definition_columns = ['definition', 'Definition', 'description', 'Description', 'details']

            for col in code_columns:
                if col in row_dict and row_dict[col]:
                    code = str(row_dict[col])
                    break

            for col in display_columns:
                if col in row_dict and row_dict[col]:
                    display = str(row_dict[col])
                    break

            for col in definition_columns:
                if col in row_dict and row_dict[col]:
                    definition = str(row_dict[col])
                    break

            if code and display:
                return CodeSystemConcept(
                    code=f"{system_name.upper()}-{code}",
                    display=display,
                    definition=definition or display
                )

        except Exception:
            pass

        return None

    def _create_mapping_elements(self, system_name: str) -> List[Dict[str, Any]]:
        """Create mapping elements between NAMASTE and ICD-11"""
        elements = []

        try:
            # Load NAMASTE concepts
            namaste_concepts = self._load_concepts_from_db(self.databases[system_name], system_name)

            # Create simplified mappings (in real implementation, this would use proper mapping logic)
            for concept in namaste_concepts[:50]:  # Limit for demo
                element = {
                    "code": concept.code,
                    "display": concept.display,
                    "target": [{
                        "code": f"TM2-{concept.code}",
                        "display": f"TM2: {concept.display}",
                        "equivalence": "equivalent"
                    }]
                }
                elements.append(element)

        except Exception as e:
            print(f"Error creating mapping elements: {e}")

        return elements

    def _search_database(self, db_path: Path, term: str, limit: int) -> List[Dict[str, Any]]:
        """Search database for matching terms"""
        results = []

        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()

            tables = self._get_table_names(cursor)

            for table in tables:
                try:
                    # Try to find searchable columns
                    cursor.execute(f"PRAGMA table_info({table})")
                    columns = cursor.fetchall()

                    text_columns = [col[1] for col in columns if col[2].upper() in ['TEXT', 'VARCHAR']]

                    if text_columns:
                        search_conditions = " OR ".join([f"{col} LIKE ?" for col in text_columns])
                        query = f"SELECT * FROM {table} WHERE {search_conditions} LIMIT ?"

                        search_params = [f"%{term}%"] * len(text_columns) + [limit]
                        cursor.execute(query, search_params)

                        column_names = [description[0] for description in cursor.description]
                        rows = cursor.fetchall()

                        for row in rows:
                            row_dict = dict(zip(column_names, row))
                            results.append(row_dict)

                except sqlite3.Error:
                    continue

            conn.close()

        except Exception as e:
            print(f"Error searching database {db_path}: {e}")

        return results[:limit]

    def _calculate_relevance(self, text: str, search_term: str) -> float:
        """Calculate relevance score for search results"""
        if not text or not search_term:
            return 0.0

        text_lower = text.lower()
        term_lower = search_term.lower()

        # Exact match
        if text_lower == term_lower:
            return 1.0

        # Starts with
        if text_lower.startswith(term_lower):
            return 0.9

        # Contains
        if term_lower in text_lower:
            return 0.7

        # Word match
        text_words = set(text_lower.split())
        term_words = set(term_lower.split())

        if text_words & term_words:
            return 0.5

        return 0.0

    def _find_concept_by_code(self, system: str, code: str) -> Optional[Dict[str, Any]]:
        """Find concept by code in specific system"""
        if system not in self.databases:
            return None

        try:
            conn = sqlite3.connect(self.databases[system])
            cursor = conn.cursor()

            # Try to find the concept (simplified)
            tables = self._get_table_names(cursor)

            for table in tables:
                try:
                    cursor.execute(f"SELECT * FROM {table} WHERE code = ? OR Code = ? LIMIT 1", (code, code))
                    row = cursor.fetchone()

                    if row:
                        column_names = [description[0] for description in cursor.description]
                        return dict(zip(column_names, row))

                except sqlite3.Error:
                    continue

            conn.close()

        except Exception:
            pass

        return None

    def _find_icd11_matches(self, namaste_concept: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Find ICD-11 matches for NAMASTE concept (simplified)"""
        # This is a simplified implementation
        # In reality, this would use sophisticated mapping algorithms

        matches = []

        try:
            # Mock mapping based on concept name similarity
            concept_name = namaste_concept.get("name", namaste_concept.get("Name", ""))

            if concept_name:
                matches.append({
                    "code": f"TM2-{namaste_concept.get('code', 'UNKNOWN')}",
                    "display": f"TM2: {concept_name}"
                })

        except Exception:
            pass

        return matches

# Global service instance
fhir_service = FHIRTerminologyService()





