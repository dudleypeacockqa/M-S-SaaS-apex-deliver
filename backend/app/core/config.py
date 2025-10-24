"""Application configuration powered by Pydantic settings."""
from functools import lru_cache

from pydantic import Field
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

    # CORS - comma-separated string of allowed origins
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    def get_cors_origins_list(self) -> list[str]:
        """Parse CORS origins string to list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    # API Keys
    openai_api_key: str = ""
    anthropic_api_key: str = ""

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
