from typing import Dict, Any, List, Optional
from datetime import datetime
import json
import sqlite3
from pathlib import Path

class VersionTrackingService:
    """
    Version tracking and consent metadata service for EHR Standards compliance
    Implements ISO 22600 access control and audit trail requirements
    """

    def __init__(self):
        self.db_path = Path(__file__).parent.parent.parent / "ayush_emr.db"
        self._init_version_tables()

    def _init_version_tables(self):
        """Initialize version tracking and audit tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Version tracking table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS resource_versions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resource_type TEXT NOT NULL,
                resource_id TEXT NOT NULL,
                version_number INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by TEXT NOT NULL,
                change_summary TEXT,
                metadata TEXT,
                checksum TEXT,
                UNIQUE(resource_type, resource_id, version_number)
            )
        ''')

        # Consent tracking table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS consent_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id TEXT NOT NULL,
                consent_type TEXT NOT NULL,
                status TEXT NOT NULL,
                granted_at TIMESTAMP,
                revoked_at TIMESTAMP,
                granted_by TEXT,
                purpose TEXT,
                scope TEXT,
                data_categories TEXT,
                recipients TEXT,
                expiry_date TIMESTAMP,
                metadata TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Audit trail table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_trail (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id TEXT NOT NULL,
                user_type TEXT NOT NULL,
                action TEXT NOT NULL,
                resource_type TEXT,
                resource_id TEXT,
                patient_id TEXT,
                ip_address TEXT,
                user_agent TEXT,
                session_id TEXT,
                outcome TEXT,
                details TEXT,
                metadata TEXT
            )
        ''')

        # Access control table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS access_control (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                role TEXT NOT NULL,
                permissions TEXT NOT NULL,
                resource_scope TEXT,
                granted_by TEXT NOT NULL,
                granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                status TEXT DEFAULT 'active',
                metadata TEXT
            )
        ''')

        conn.commit()
        conn.close()

    def create_resource_version(
        self,
        resource_type: str,
        resource_id: str,
        content: Dict[str, Any],
        user_id: str,
        change_summary: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> int:
        """Create a new version of a resource"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Get next version number
        cursor.execute(
            "SELECT MAX(version_number) FROM resource_versions WHERE resource_type = ? AND resource_id = ?",
            (resource_type, resource_id)
        )
        result = cursor.fetchone()
        next_version = (result[0] or 0) + 1

        # Calculate checksum
        content_str = json.dumps(content, sort_keys=True)
        import hashlib
        checksum = hashlib.sha256(content_str.encode()).hexdigest()

        # Insert new version
        cursor.execute('''
            INSERT INTO resource_versions
            (resource_type, resource_id, version_number, content, created_by, change_summary, metadata, checksum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            resource_type,
            resource_id,
            next_version,
            content_str,
            user_id,
            change_summary,
            json.dumps(metadata or {}),
            checksum
        ))

        conn.commit()
        conn.close()

        return next_version

    def get_resource_version(
        self,
        resource_type: str,
        resource_id: str,
        version: Optional[int] = None
    ) -> Optional[Dict[str, Any]]:
        """Get a specific version of a resource (latest if version not specified)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        if version:
            cursor.execute('''
                SELECT content, version_number, created_at, created_by, change_summary, metadata, checksum
                FROM resource_versions
                WHERE resource_type = ? AND resource_id = ? AND version_number = ?
            ''', (resource_type, resource_id, version))
        else:
            cursor.execute('''
                SELECT content, version_number, created_at, created_by, change_summary, metadata, checksum
                FROM resource_versions
                WHERE resource_type = ? AND resource_id = ?
                ORDER BY version_number DESC LIMIT 1
            ''', (resource_type, resource_id))

        result = cursor.fetchone()
        conn.close()

        if result:
            return {
                "content": json.loads(result[0]),
                "version": result[1],
                "created_at": result[2],
                "created_by": result[3],
                "change_summary": result[4],
                "metadata": json.loads(result[5]) if result[5] else {},
                "checksum": result[6]
            }

        return None

    def get_resource_versions(self, resource_type: str, resource_id: str) -> List[Dict[str, Any]]:
        """Get all versions of a resource"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT version_number, created_at, created_by, change_summary, checksum
            FROM resource_versions
            WHERE resource_type = ? AND resource_id = ?
            ORDER BY version_number DESC
        ''', (resource_type, resource_id))

        results = cursor.fetchall()
        conn.close()

        return [
            {
                "version": result[0],
                "created_at": result[1],
                "created_by": result[2],
                "change_summary": result[3],
                "checksum": result[4]
            }
            for result in results
        ]

    def record_consent(
        self,
        patient_id: str,
        consent_type: str,
        status: str,
        granted_by: str,
        purpose: str,
        scope: List[str],
        data_categories: List[str],
        recipients: List[str],
        expiry_date: Optional[datetime] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> int:
        """Record patient consent"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO consent_records
            (patient_id, consent_type, status, granted_at, granted_by, purpose, scope,
             data_categories, recipients, expiry_date, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            patient_id,
            consent_type,
            status,
            datetime.now() if status == 'granted' else None,
            granted_by,
            purpose,
            json.dumps(scope),
            json.dumps(data_categories),
            json.dumps(recipients),
            expiry_date,
            json.dumps(metadata or {})
        ))

        consent_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return consent_id

    def check_consent(self, patient_id: str, purpose: str, data_category: str) -> bool:
        """Check if patient has given consent for specific purpose and data category"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id FROM consent_records
            WHERE patient_id = ? AND status = 'granted'
            AND (expiry_date IS NULL OR expiry_date > ?)
            AND purpose = ?
            AND data_categories LIKE ?
        ''', (
            patient_id,
            datetime.now(),
            purpose,
            f'%"{data_category}"%'
        ))

        result = cursor.fetchone()
        conn.close()

        return result is not None

    def log_audit_event(
        self,
        user_id: str,
        user_type: str,
        action: str,
        outcome: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        patient_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        session_id: Optional[str] = None,
        details: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Log audit event for compliance tracking"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO audit_trail
            (user_id, user_type, action, resource_type, resource_id, patient_id,
             ip_address, user_agent, session_id, outcome, details, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            user_type,
            action,
            resource_type,
            resource_id,
            patient_id,
            ip_address,
            user_agent,
            session_id,
            outcome,
            details,
            json.dumps(metadata or {})
        ))

        conn.commit()
        conn.close()

    def get_audit_trail(
        self,
        patient_id: Optional[str] = None,
        user_id: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Get audit trail records"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        query = "SELECT * FROM audit_trail WHERE 1=1"
        params = []

        if patient_id:
            query += " AND patient_id = ?"
            params.append(patient_id)

        if user_id:
            query += " AND user_id = ?"
            params.append(user_id)

        if start_date:
            query += " AND timestamp >= ?"
            params.append(start_date)

        if end_date:
            query += " AND timestamp <= ?"
            params.append(end_date)

        query += " ORDER BY timestamp DESC LIMIT ?"
        params.append(limit)

        cursor.execute(query, params)
        results = cursor.fetchall()
        conn.close()

        columns = [
            'id', 'timestamp', 'user_id', 'user_type', 'action', 'resource_type',
            'resource_id', 'patient_id', 'ip_address', 'user_agent', 'session_id',
            'outcome', 'details', 'metadata'
        ]

        return [dict(zip(columns, result)) for result in results]

    def set_access_control(
        self,
        user_id: str,
        role: str,
        permissions: List[str],
        granted_by: str,
        resource_scope: Optional[str] = None,
        expires_at: Optional[datetime] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> int:
        """Set access control permissions for user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO access_control
            (user_id, role, permissions, resource_scope, granted_by, expires_at, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            role,
            json.dumps(permissions),
            resource_scope,
            granted_by,
            expires_at,
            json.dumps(metadata or {})
        ))

        access_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return access_id

    def check_permission(self, user_id: str, permission: str, resource_type: Optional[str] = None) -> bool:
        """Check if user has specific permission"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT permissions, resource_scope FROM access_control
            WHERE user_id = ? AND status = 'active'
            AND (expires_at IS NULL OR expires_at > ?)
        ''', (user_id, datetime.now()))

        results = cursor.fetchall()
        conn.close()

        for permissions_json, resource_scope in results:
            permissions = json.loads(permissions_json)

            # Check if user has the permission
            if permission in permissions or 'admin' in permissions:
                # Check resource scope if specified
                if resource_type and resource_scope:
                    if resource_type not in resource_scope:
                        continue
                return True

        return False

    def get_fhir_metadata_with_versioning(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """Add FHIR metadata with versioning and audit information"""
        metadata = {
            "versionId": "1",
            "lastUpdated": datetime.now().isoformat(),
            "profile": ["http://hl7.org/fhir/StructureDefinition/" + resource.get("resourceType", "")],
            "security": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/v3-ActReason",
                    "code": "HTEST",
                    "display": "test health data"
                }
            ],
            "tag": [
                {
                    "system": "http://terminology.ayush.gov.in/CodeSystem/resource-tags",
                    "code": "NAMASTE",
                    "display": "NAMASTE Terminology"
                },
                {
                    "system": "http://terminology.hl7.org/CodeSystem/common-tags",
                    "code": "actionable",
                    "display": "Actionable"
                }
            ]
        }

        # Add to resource
        resource["meta"] = metadata
        return resource

# Global service instance
version_service = VersionTrackingService()





