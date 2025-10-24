"""Application configuration and settings."""
from __future__ import annotations

from typing import Any

from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="allow",
    )

    # Application
    app_name: str = "M&A Intelligence Platform API"
    debug: bool = False
    environment: str = "production"

    # Database
    database_url: PostgresDsn

    # Clerk Authentication
    clerk_publishable_key: str
    clerk_secret_key: str
    clerk_webhook_secret: str = ""

    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | list[str]) -> list[str]:
        """Parse CORS origins from comma-separated string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # API Keys
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # Storage (Cloudflare R2)
    cloudflare_account_id: str = ""
    cloudflare_r2_bucket_name: str = ""
    cloudflare_r2_endpoint: str = ""
    cloudflare_r2_access_key_id: str = ""
    cloudflare_r2_secret_access_key: str = ""

    # Email (SendGrid)
    sendgrid_api_key: str = ""
    sendgrid_from_email: str = ""
    sendgrid_from_name: str = "M&A Platform"

    # Feature Flags
    enable_ai_insights: bool = True
    enable_analytics: bool = True
    enable_rate_limiting: bool = True
    rate_limit_per_minute: int = 60


settings = Settings()
