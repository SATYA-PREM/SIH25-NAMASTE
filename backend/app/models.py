from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class UserType(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class DiseaseSystem(str, Enum):
    AYURVEDA = "ayurveda"
    SIDDHA = "siddha"
    UNANI = "unani"
    ICD11 = "icd11"

# Patient Models
class PatientBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    mobile_number: Optional[str] = Field(None, pattern=r'^\+?[1-9]\d{1,14}$')
    email: Optional[EmailStr] = None
    address: Optional[str] = None

class PatientCreate(PatientBase):
    abha_id: str = Field(..., min_length=10, max_length=20)
    abha_number: Optional[str] = Field(None, min_length=14, max_length=14)

class PatientResponse(PatientBase):
    id: int
    abha_id: str
    abha_number: Optional[str]
    profile_photo: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Doctor Models
class DoctorBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    license_number: Optional[str] = None
    mobile_number: Optional[str] = Field(None, pattern=r'^\+?[1-9]\d{1,14}$')
    email: Optional[EmailStr] = None

class DoctorCreate(DoctorBase):
    doctor_id: str = Field(..., min_length=3, max_length=20)

class DoctorResponse(DoctorBase):
    id: int
    doctor_id: str
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Authentication Models
class LoginRequest(BaseModel):
    identifier: str = Field(..., description="ABHA ID or mobile number")
    user_type: UserType

class OTPRequest(BaseModel):
    identifier: str = Field(..., description="ABHA ID or mobile number")
    user_type: UserType

class OTPVerifyRequest(BaseModel):
    identifier: str = Field(..., description="ABHA ID or mobile number")
    otp_code: str = Field(..., min_length=4, max_length=6)
    user_type: UserType

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    user_type: UserType
    expires_in: int

# Disease Models
class DiseaseRecord(BaseModel):
    disease_code: str
    disease_name: str
    disease_system: DiseaseSystem
    diagnosis_date: Optional[date] = None
    notes: Optional[str] = None

class DiseaseRecordResponse(DiseaseRecord):
    id: int
    patient_id: int
    doctor_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AddDiseaseRequest(BaseModel):
    patient_id: int
    disease_code: str
    disease_name: str
    disease_system: DiseaseSystem
    diagnosis_date: Optional[date] = None
    notes: Optional[str] = None

# ABHA Mock Response Models
class ABHAProfile(BaseModel):
    abhaId: str = Field(..., alias="abhaId")
    abhaNumber: str = Field(..., alias="abhaNumber")
    name: str
    firstName: Optional[str] = None
    middleName: Optional[str] = None
    lastName: Optional[str] = None
    gender: str
    yearOfBirth: str = Field(..., alias="yearOfBirth")
    dayOfBirth: Optional[str] = Field(None, alias="dayOfBirth")
    monthOfBirth: Optional[str] = Field(None, alias="monthOfBirth")
    mobile: str
    email: Optional[str] = None
    address: Optional[str] = None
    districtName: Optional[str] = Field(None, alias="districtName")
    stateName: Optional[str] = Field(None, alias="stateName")
    pincode: Optional[str] = None
    profilePhoto: Optional[str] = Field(None, alias="profilePhoto")

    class Config:
        populate_by_name = True

class ABHAAuthResponse(BaseModel):
    token: str
    expiresIn: int = Field(..., alias="expiresIn")
    refreshToken: str = Field(..., alias="refreshToken")
    profile: ABHAProfile

    class Config:
        populate_by_name = True

# WHO Disease Search Models
class WHODiseaseResult(BaseModel):
    code: Optional[str] = None
    term: Optional[str] = None
    short_definition: Optional[str] = None
    long_definition: Optional[str] = None
    system: Optional[str] = None
    source_database: Optional[str] = None

class WHOSearchResponse(BaseModel):
    search_term: str
    total_count: int
    combined_results: List[WHODiseaseResult]

# API Response Models
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None
