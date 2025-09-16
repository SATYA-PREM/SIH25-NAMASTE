from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union, Literal
from datetime import datetime
from enum import Enum

class FHIRResourceType(str, Enum):
    CODE_SYSTEM = "CodeSystem"
    CONCEPT_MAP = "ConceptMap"
    VALUE_SET = "ValueSet"
    BUNDLE = "Bundle"
    CONDITION = "Condition"
    PATIENT = "Patient"

class PublicationStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    RETIRED = "retired"
    UNKNOWN = "unknown"

class ConceptMapEquivalence(str, Enum):
    RELATEDTO = "relatedto"
    EQUIVALENT = "equivalent"
    EQUAL = "equal"
    WIDER = "wider"
    SUBSUMES = "subsumes"
    NARROWER = "narrower"
    SPECIALIZES = "specializes"
    INEXACT = "inexact"
    UNMATCHED = "unmatched"
    DISJOINT = "disjoint"

# Base FHIR Resource
class FHIRResource(BaseModel):
    resourceType: str
    id: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None
    implicitRules: Optional[str] = None
    language: Optional[str] = None

# FHIR Coding
class FHIRCoding(BaseModel):
    system: Optional[str] = None
    version: Optional[str] = None
    code: Optional[str] = None
    display: Optional[str] = None
    userSelected: Optional[bool] = None

# FHIR CodeableConcept
class FHIRCodeableConcept(BaseModel):
    coding: Optional[List[FHIRCoding]] = []
    text: Optional[str] = None

# FHIR Identifier
class FHIRIdentifier(BaseModel):
    use: Optional[str] = None
    type: Optional[FHIRCodeableConcept] = None
    system: Optional[str] = None
    value: Optional[str] = None
    period: Optional[Dict[str, Any]] = None
    assigner: Optional[Dict[str, Any]] = None

# FHIR Contact Detail
class FHIRContactDetail(BaseModel):
    name: Optional[str] = None
    telecom: Optional[List[Dict[str, Any]]] = []

# FHIR UsageContext
class FHIRUsageContext(BaseModel):
    code: FHIRCoding
    valueCodeableConcept: Optional[FHIRCodeableConcept] = None

# CodeSystem Models
class CodeSystemConcept(BaseModel):
    code: str
    display: Optional[str] = None
    definition: Optional[str] = None
    designation: Optional[List[Dict[str, Any]]] = []
    property: Optional[List[Dict[str, Any]]] = []
    concept: Optional[List['CodeSystemConcept']] = []

class CodeSystemProperty(BaseModel):
    code: str
    uri: Optional[str] = None
    description: Optional[str] = None
    type: str  # code, Coding, string, integer, boolean, dateTime, decimal

class FHIRCodeSystem(FHIRResource):
    resourceType: Literal["CodeSystem"] = "CodeSystem"
    url: Optional[str] = None
    identifier: Optional[List[FHIRIdentifier]] = []
    version: Optional[str] = None
    name: Optional[str] = None
    title: Optional[str] = None
    status: PublicationStatus
    experimental: Optional[bool] = None
    date: Optional[datetime] = None
    publisher: Optional[str] = None
    contact: Optional[List[FHIRContactDetail]] = []
    description: Optional[str] = None
    useContext: Optional[List[FHIRUsageContext]] = []
    jurisdiction: Optional[List[FHIRCodeableConcept]] = []
    purpose: Optional[str] = None
    copyright: Optional[str] = None
    caseSensitive: Optional[bool] = None
    valueSet: Optional[str] = None
    hierarchyMeaning: Optional[str] = None
    compositional: Optional[bool] = None
    versionNeeded: Optional[bool] = None
    content: str  # not-present, example, fragment, complete, supplement
    supplements: Optional[str] = None
    count: Optional[int] = None
    filter: Optional[List[Dict[str, Any]]] = []
    property: Optional[List[CodeSystemProperty]] = []
    concept: Optional[List[CodeSystemConcept]] = []

# ConceptMap Models
class ConceptMapGroup(BaseModel):
    source: Optional[str] = None
    sourceVersion: Optional[str] = None
    target: Optional[str] = None
    targetVersion: Optional[str] = None
    element: List[Dict[str, Any]] = []

class ConceptMapElement(BaseModel):
    code: Optional[str] = None
    display: Optional[str] = None
    target: Optional[List[Dict[str, Any]]] = []

class ConceptMapTarget(BaseModel):
    code: Optional[str] = None
    display: Optional[str] = None
    equivalence: ConceptMapEquivalence
    comment: Optional[str] = None
    dependsOn: Optional[List[Dict[str, Any]]] = []
    product: Optional[List[Dict[str, Any]]] = []

class FHIRConceptMap(FHIRResource):
    resourceType: Literal["ConceptMap"] = "ConceptMap"
    url: Optional[str] = None
    identifier: Optional[List[FHIRIdentifier]] = []
    version: Optional[str] = None
    name: Optional[str] = None
    title: Optional[str] = None
    status: PublicationStatus
    experimental: Optional[bool] = None
    date: Optional[datetime] = None
    publisher: Optional[str] = None
    contact: Optional[List[FHIRContactDetail]] = []
    description: Optional[str] = None
    useContext: Optional[List[FHIRUsageContext]] = []
    jurisdiction: Optional[List[FHIRCodeableConcept]] = []
    purpose: Optional[str] = None
    copyright: Optional[str] = None
    sourceUri: Optional[str] = None
    sourceCanonical: Optional[str] = None
    targetUri: Optional[str] = None
    targetCanonical: Optional[str] = None
    group: Optional[List[ConceptMapGroup]] = []

# ValueSet Models
class ValueSetCompose(BaseModel):
    lockedDate: Optional[str] = None
    inactive: Optional[bool] = None
    include: List[Dict[str, Any]] = []
    exclude: Optional[List[Dict[str, Any]]] = []

class FHIRValueSet(FHIRResource):
    resourceType: Literal["ValueSet"] = "ValueSet"
    url: Optional[str] = None
    identifier: Optional[List[FHIRIdentifier]] = []
    version: Optional[str] = None
    name: Optional[str] = None
    title: Optional[str] = None
    status: PublicationStatus
    experimental: Optional[bool] = None
    date: Optional[datetime] = None
    publisher: Optional[str] = None
    contact: Optional[List[FHIRContactDetail]] = []
    description: Optional[str] = None
    useContext: Optional[List[FHIRUsageContext]] = []
    jurisdiction: Optional[List[FHIRCodeableConcept]] = []
    immutable: Optional[bool] = None
    purpose: Optional[str] = None
    copyright: Optional[str] = None
    compose: Optional[ValueSetCompose] = None
    expansion: Optional[Dict[str, Any]] = None

# Bundle Models
class BundleEntry(BaseModel):
    link: Optional[List[Dict[str, Any]]] = []
    fullUrl: Optional[str] = None
    resource: Optional[Dict[str, Any]] = None
    search: Optional[Dict[str, Any]] = None
    request: Optional[Dict[str, Any]] = None
    response: Optional[Dict[str, Any]] = None

class FHIRBundle(FHIRResource):
    resourceType: Literal["Bundle"] = "Bundle"
    identifier: Optional[FHIRIdentifier] = None
    type: str  # document, message, transaction, transaction-response, batch, batch-response, history, searchset, collection
    timestamp: Optional[datetime] = None
    total: Optional[int] = None
    link: Optional[List[Dict[str, Any]]] = []
    entry: Optional[List[BundleEntry]] = []
    signature: Optional[Dict[str, Any]] = None

# Condition (Problem List) Models
class FHIRCondition(FHIRResource):
    resourceType: Literal["Condition"] = "Condition"
    identifier: Optional[List[FHIRIdentifier]] = []
    clinicalStatus: Optional[FHIRCodeableConcept] = None
    verificationStatus: Optional[FHIRCodeableConcept] = None
    category: Optional[List[FHIRCodeableConcept]] = []
    severity: Optional[FHIRCodeableConcept] = None
    code: Optional[FHIRCodeableConcept] = None
    bodySite: Optional[List[FHIRCodeableConcept]] = []
    subject: Dict[str, str]  # Reference to Patient
    encounter: Optional[Dict[str, str]] = None  # Reference to Encounter
    onsetDateTime: Optional[datetime] = None
    onsetAge: Optional[Dict[str, Any]] = None
    onsetPeriod: Optional[Dict[str, Any]] = None
    onsetRange: Optional[Dict[str, Any]] = None
    onsetString: Optional[str] = None
    abatementDateTime: Optional[datetime] = None
    abatementAge: Optional[Dict[str, Any]] = None
    abatementPeriod: Optional[Dict[str, Any]] = None
    abatementRange: Optional[Dict[str, Any]] = None
    abatementString: Optional[str] = None
    abatementBoolean: Optional[bool] = None
    recordedDate: Optional[datetime] = None
    recorder: Optional[Dict[str, str]] = None  # Reference to Practitioner
    asserter: Optional[Dict[str, str]] = None  # Reference to Patient|Practitioner
    stage: Optional[List[Dict[str, Any]]] = []
    evidence: Optional[List[Dict[str, Any]]] = []
    note: Optional[List[Dict[str, Any]]] = []

# Request/Response Models
class FHIRSearchRequest(BaseModel):
    term: str = Field(..., min_length=2)
    system: Optional[str] = None
    limit: Optional[int] = Field(default=10, ge=1, le=100)

class FHIRTranslateRequest(BaseModel):
    code: str
    system: str
    target: str
    version: Optional[str] = None

class FHIRTranslateResponse(BaseModel):
    result: bool
    message: Optional[str] = None
    match: Optional[List[Dict[str, Any]]] = []

class NAMASTESearchResponse(BaseModel):
    search_term: str
    total_count: int
    results: List[Dict[str, Any]]

class ProblemListRequest(BaseModel):
    patient_id: str
    condition_code: str
    condition_system: str
    condition_display: str
    clinical_status: Optional[str] = "active"
    verification_status: Optional[str] = "confirmed"
    onset_date: Optional[datetime] = None
    notes: Optional[str] = None
    double_coding: Optional[Dict[str, Any]] = None  # For TM2/Biomedicine mapping

# Update CodeSystemConcept for forward references
CodeSystemConcept.model_rebuild()

