import sqlite3
import os
from typing import Optional
from contextlib import contextmanager

DATABASE_PATH = "ayush_emr.db"

def get_db_connection():
    """Get database connection with row factory"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@contextmanager
def get_db():
    """Context manager for database connections"""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_database():
    """Initialize database with required tables"""
    with get_db() as conn:
        cursor = conn.cursor()

        # Patients table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                abha_id TEXT UNIQUE NOT NULL,
                abha_number TEXT,
                mobile_number TEXT,
                name TEXT NOT NULL,
                date_of_birth DATE,
                gender TEXT,
                address TEXT,
                email TEXT,
                profile_photo TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Doctors table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS doctors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                doctor_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                specialization TEXT,
                qualification TEXT,
                license_number TEXT,
                mobile_number TEXT,
                email TEXT,
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # OTP table for authentication
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS otp_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                identifier TEXT NOT NULL,  -- ABHA ID or mobile number
                otp_code TEXT NOT NULL,
                otp_type TEXT NOT NULL,  -- 'patient_login', 'doctor_login'
                expires_at TIMESTAMP NOT NULL,
                is_used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Patient diseases table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS patient_diseases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                doctor_id INTEGER NOT NULL,
                disease_code TEXT NOT NULL,
                disease_name TEXT NOT NULL,
                disease_system TEXT,  -- ayurveda, siddha, unani, icd11
                diagnosis_date DATE,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients (id),
                FOREIGN KEY (doctor_id) REFERENCES doctors (id)
            )
        """)

        # Sessions table for authentication
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                user_type TEXT NOT NULL,  -- 'patient', 'doctor'
                session_token TEXT UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Insert sample doctor for testing
        cursor.execute("""
            INSERT OR IGNORE INTO doctors (doctor_id, name, specialization, qualification, license_number, mobile_number, email, is_verified)
            VALUES ('DOC001', 'Dr. Rajesh Kumar', 'Ayurveda', 'BAMS, MD', 'AYU12345', '+919876543210', 'dr.rajesh@example.com', TRUE)
        """)

        print("Database initialized successfully!")

if __name__ == "__main__":
    init_database()
