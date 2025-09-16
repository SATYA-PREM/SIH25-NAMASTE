from typing import Optional, List, Dict, Any
from datetime import datetime, date

from ..database import get_db
from ..models import PatientCreate, PatientResponse, DiseaseRecord, DiseaseRecordResponse
from .abha_service import abha_service

class PatientService:
    """Service for patient operations"""

    def __init__(self):
        pass

    def create_patient(self, patient_data: PatientCreate) -> Optional[PatientResponse]:
        """Create a new patient"""
        try:
            with get_db() as conn:
                cursor = conn.cursor()

                # Check if patient already exists
                cursor.execute("SELECT id FROM patients WHERE abha_id = ?", (patient_data.abha_id,))
                if cursor.fetchone():
                    return None  # Patient already exists

                # Insert new patient
                cursor.execute("""
                    INSERT INTO patients (abha_id, abha_number, mobile_number, name, date_of_birth,
                                        gender, address, email, profile_photo, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    patient_data.abha_id,
                    patient_data.abha_number,
                    patient_data.mobile_number,
                    patient_data.name,
                    patient_data.date_of_birth,
                    patient_data.gender.value if patient_data.gender else None,
                    patient_data.address,
                    patient_data.email,
                    None,  # profile_photo will be updated from ABHA
                    datetime.now()
                ))

                patient_id = cursor.lastrowid

                # Fetch the created patient
                return self.get_patient_by_id(patient_id)

        except Exception as e:
            print(f"Error creating patient: {e}")
            return None

    def get_patient_by_id(self, patient_id: int) -> Optional[PatientResponse]:
        """Get patient by ID"""
        try:
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM patients WHERE id = ?", (patient_id,))
                row = cursor.fetchone()

                if row:
                    return PatientResponse(
                        id=row['id'],
                        abha_id=row['abha_id'],
                        abha_number=row['abha_number'],
                        name=row['name'],
                        date_of_birth=datetime.fromisoformat(row['date_of_birth']).date() if row['date_of_birth'] else None,
                        gender=row['gender'],
                        mobile_number=row['mobile_number'],
                        email=row['email'],
                        address=row['address'],
                        profile_photo=row['profile_photo'],
                        created_at=datetime.fromisoformat(row['created_at']),
                        updated_at=datetime.fromisoformat(row['updated_at'])
                    )
                return None
        except Exception as e:
            print(f"Error getting patient by ID: {e}")
            return None

    def get_patient_by_abha_id(self, abha_id: str) -> Optional[PatientResponse]:
        """Get patient by ABHA ID"""
        try:
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM patients WHERE abha_id = ?", (abha_id,))
                row = cursor.fetchone()

                if row:
                    return PatientResponse(
                        id=row['id'],
                        abha_id=row['abha_id'],
                        abha_number=row['abha_number'],
                        name=row['name'],
                        date_of_birth=datetime.fromisoformat(row['date_of_birth']).date() if row['date_of_birth'] else None,
                        gender=row['gender'],
                        mobile_number=row['mobile_number'],
                        email=row['email'],
                        address=row['address'],
                        profile_photo=row['profile_photo'],
                        created_at=datetime.fromisoformat(row['created_at']),
                        updated_at=datetime.fromisoformat(row['updated_at'])
                    )
                return None
        except Exception as e:
            print(f"Error getting patient by ABHA ID: {e}")
            return None

    async def create_or_update_from_abha(self, abha_id: str) -> Optional[PatientResponse]:
        """Create or update patient from ABHA profile"""
        try:
            # Get ABHA profile
            abha_result = await abha_service.get_profile_by_abha_id(abha_id)
            if not abha_result["success"]:
                return None

            profile = abha_result["data"]

            # Check if patient exists
            existing_patient = self.get_patient_by_abha_id(abha_id)

            # Convert ABHA profile to patient data
            dob = None
            if profile.get("yearOfBirth"):
                year = int(profile["yearOfBirth"])
                month = int(profile.get("monthOfBirth", 1))
                day = int(profile.get("dayOfBirth", 1))
                try:
                    dob = date(year, month, day)
                except ValueError:
                    dob = date(year, 1, 1)  # Fallback to Jan 1st if invalid date

            gender_map = {"M": "male", "F": "female", "O": "other"}
            gender = gender_map.get(profile.get("gender"), "other")

            with get_db() as conn:
                cursor = conn.cursor()

                if existing_patient:
                    # Update existing patient - handle potential ABHA number conflicts
                    try:
                        cursor.execute("""
                            UPDATE patients
                            SET abha_number = ?, name = ?, date_of_birth = ?, gender = ?,
                                mobile_number = ?, email = ?, address = ?, profile_photo = ?, updated_at = ?
                            WHERE abha_id = ?
                        """, (
                            profile.get("abhaNumber"),
                            profile.get("name"),
                            dob,
                            gender,
                            profile.get("mobile"),
                            profile.get("email"),
                            profile.get("address"),
                            profile.get("profilePhoto"),
                            datetime.now(),
                            abha_id
                        ))
                    except Exception as e:
                        # If ABHA number conflict, update without ABHA number
                        print(f"ABHA number conflict during update, skipping: {e}")
                        cursor.execute("""
                            UPDATE patients
                            SET name = ?, date_of_birth = ?, gender = ?,
                                mobile_number = ?, email = ?, address = ?, profile_photo = ?, updated_at = ?
                            WHERE abha_id = ?
                        """, (
                            profile.get("name"),
                            dob,
                            gender,
                            profile.get("mobile"),
                            profile.get("email"),
                            profile.get("address"),
                            profile.get("profilePhoto"),
                            datetime.now(),
                            abha_id
                        ))
                    return self.get_patient_by_abha_id(abha_id)
                else:
                    # Create new patient - handle potential ABHA number conflicts
                    try:
                        cursor.execute("""
                            INSERT INTO patients (abha_id, abha_number, name, date_of_birth, gender,
                                                mobile_number, email, address, profile_photo, updated_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, (
                            abha_id,
                            profile.get("abhaNumber"),
                            profile.get("name"),
                            dob,
                            gender,
                            profile.get("mobile"),
                            profile.get("email"),
                            profile.get("address"),
                            profile.get("profilePhoto"),
                            datetime.now()
                        ))
                    except Exception as e:
                        # If ABHA number conflict, create without ABHA number
                        print(f"ABHA number conflict during creation, creating without ABHA number: {e}")
                        cursor.execute("""
                            INSERT INTO patients (abha_id, name, date_of_birth, gender,
                                                mobile_number, email, address, profile_photo, updated_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, (
                            abha_id,
                            profile.get("name"),
                            dob,
                            gender,
                            profile.get("mobile"),
                            profile.get("email"),
                            profile.get("address"),
                            profile.get("profilePhoto"),
                            datetime.now()
                        ))

                    patient_id = cursor.lastrowid
                    return self.get_patient_by_id(patient_id)

        except Exception as e:
            print(f"Error creating/updating patient from ABHA: {e}")
            return None

    def get_patient_diseases(self, patient_id: int) -> List[DiseaseRecordResponse]:
        """Get all diseases for a patient"""
        try:
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT pd.*, d.name as doctor_name
                    FROM patient_diseases pd
                    LEFT JOIN doctors d ON pd.doctor_id = d.id
                    WHERE pd.patient_id = ?
                    ORDER BY pd.created_at DESC
                """, (patient_id,))

                diseases = []
                for row in cursor.fetchall():
                    disease = DiseaseRecordResponse(
                        id=row['id'],
                        patient_id=row['patient_id'],
                        doctor_id=row['doctor_id'],
                        disease_code=row['disease_code'],
                        disease_name=row['disease_name'],
                        disease_system=row['disease_system'],
                        diagnosis_date=datetime.fromisoformat(row['diagnosis_date']).date() if row['diagnosis_date'] else None,
                        notes=row['notes'],
                        created_at=datetime.fromisoformat(row['created_at'])
                    )
                    diseases.append(disease)

                return diseases
        except Exception as e:
            print(f"Error getting patient diseases: {e}")
            return []

    def update_profile_photo(self, patient_id: int, photo_url: str) -> bool:
        """Update patient profile photo"""
        try:
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    UPDATE patients SET profile_photo = ?, updated_at = ? WHERE id = ?
                """, (photo_url, datetime.now(), patient_id))
                return cursor.rowcount > 0
        except Exception as e:
            print(f"Error updating profile photo: {e}")
            return False

# Global patient service instance
patient_service = PatientService()
