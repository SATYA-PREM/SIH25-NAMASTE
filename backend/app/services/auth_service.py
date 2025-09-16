import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext

from ..config import settings
from ..database import get_db
from ..models import UserType, AuthResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        self.secret_key = settings.secret_key
        self.algorithm = settings.algorithm
        self.access_token_expire_minutes = settings.access_token_expire_minutes

    def generate_otp(self) -> str:
        """Generate a 6-digit OTP"""
        return str(secrets.randbelow(999999)).zfill(6)

    def store_otp(self, identifier: str, otp_code: str, user_type: UserType) -> bool:
        """Store OTP in database with expiration"""
        try:
            with get_db() as conn:
                cursor = conn.cursor()
                expires_at = datetime.now() + timedelta(minutes=10)  # OTP expires in 10 minutes

                # Deactivate any existing OTPs for this identifier
                cursor.execute("""
                    UPDATE otp_records
                    SET is_used = TRUE
                    WHERE identifier = ? AND otp_type = ? AND is_used = FALSE
                """, (identifier, f"{user_type.value}_login"))

                # Store new OTP
                cursor.execute("""
                    INSERT INTO otp_records (identifier, otp_code, otp_type, expires_at)
                    VALUES (?, ?, ?, ?)
                """, (identifier, otp_code, f"{user_type.value}_login", expires_at))

                return True
        except Exception as e:
            print(f"Error storing OTP: {e}")
            return False

    def verify_otp(self, identifier: str, otp_code: str, user_type: UserType) -> bool:
        """Verify OTP and mark as used"""
        try:
            with get_db() as conn:
                cursor = conn.cursor()

                cursor.execute("""
                    SELECT id, expires_at FROM otp_records
                    WHERE identifier = ? AND otp_code = ? AND otp_type = ?
                    AND is_used = FALSE AND expires_at > ?
                """, (identifier, otp_code, f"{user_type.value}_login", datetime.now()))

                result = cursor.fetchone()
                if result:
                    # Mark OTP as used
                    cursor.execute("""
                        UPDATE otp_records SET is_used = TRUE WHERE id = ?
                    """, (result['id'],))
                    return True
                return False
        except Exception as e:
            print(f"Error verifying OTP: {e}")
            return False

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)

        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError:
            return None

    def create_session(self, user_id: int, user_type: UserType) -> str:
        """Create user session and return session token"""
        try:
            with get_db() as conn:
                cursor = conn.cursor()

                # Generate session token
                session_token = secrets.token_urlsafe(32)
                expires_at = datetime.now() + timedelta(minutes=self.access_token_expire_minutes)

                # Deactivate existing sessions for this user
                cursor.execute("""
                    UPDATE user_sessions
                    SET is_active = FALSE
                    WHERE user_id = ? AND user_type = ? AND is_active = TRUE
                """, (user_id, user_type.value))

                # Create new session
                cursor.execute("""
                    INSERT INTO user_sessions (user_id, user_type, session_token, expires_at)
                    VALUES (?, ?, ?, ?)
                """, (user_id, user_type.value, session_token, expires_at))

                return session_token
        except Exception as e:
            print(f"Error creating session: {e}")
            return None

    def get_user_from_session(self, session_token: str) -> Optional[Dict[str, Any]]:
        """Get user info from session token"""
        try:
            with get_db() as conn:
                cursor = conn.cursor()

                cursor.execute("""
                    SELECT user_id, user_type FROM user_sessions
                    WHERE session_token = ? AND is_active = TRUE AND expires_at > ?
                """, (session_token, datetime.now()))

                result = cursor.fetchone()
                if result:
                    return {
                        "user_id": result['user_id'],
                        "user_type": result['user_type']
                    }
                return None
        except Exception as e:
            print(f"Error getting user from session: {e}")
            return None

# Global auth service instance
auth_service = AuthService()
