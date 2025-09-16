from pydantic_settings import BaseSettings 
from typing import Optional
import os

class Settings(BaseSettings):
    # App Settings
    app_name: str = "AYUSH EMR API"
    app_version: str = "1.0.0"
    description: str = "Electronic Medical Record system for AYUSH practitioners with WHO disease codes"

    # Database
    database_url: str = "sqlite:///./ayush_emr.db"

    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # ABHA API (Mock)
    abha_api_url: str = "https://sandbox.abdm.gov.in"
    abha_client_id: str = "mock_client_id"
    abha_client_secret: str = "mock_client_secret"

    # WHO API Integration
    who_api_url: str = "http://127.0.0.1:5000"

    class Config:
        env_file = ".env"

settings = Settings()
