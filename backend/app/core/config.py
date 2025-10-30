"""Application configuration powered by Pydantic settings."""
from functools import lru_cache
from typing import Any

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized application configuration."""

    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), env_file_encoding="utf-8", extra="ignore")

    app_name: str = "M&A Intelligence Platform"
    debug: bool = False
    environment: str = "development"

    # Database
    database_url: str = "sqlite:///./app.db"

    # Clerk Authentication
    clerk_publishable_key: str = ""
    clerk_secret_key: str = ""
    clerk_webhook_secret: str = ""
    clerk_jwt_algorithm: str = "RS256"

    # Security
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS - will be converted to list after init
    cors_origins: Any = "http://localhost:5173,http://localhost:3000,https://ma-saas-platform.onrender.com,https://ma-saas-backend.onrender.com,https://100daysandbeyond.com,https://www.100daysandbeyond.com,https://apexdeliver.com"

    @model_validator(mode="after")
    def parse_cors_origins(self) -> "Settings":
        """Convert cors_origins from string to list if needed."""
        if isinstance(self.cors_origins, str):
            self.cors_origins = [origin.strip() for origin in self.cors_origins.split(",")]
        return self

    # API Keys
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    sendgrid_api_key: str = ""
    sendgrid_from_email: str = "noreply@100daysandbeyond.com"
    sendgrid_from_name: str = "100 Days & Beyond"
    contact_notification_email: str = "contact@100daysandbeyond.com"

    # Storage Configuration
    storage_path: str = "./storage"
    use_s3_storage: bool = False
    r2_endpoint_url: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "ma-saas-documents"
    r2_region: str = "auto"

    # Feature Flags
    enable_ai_insights: bool = True
    enable_analytics: bool = True
    enable_rate_limiting: bool = True
    rate_limit_per_minute: int = 60


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance to avoid repeated environment parsing."""
    return Settings()


settings = get_settings()
