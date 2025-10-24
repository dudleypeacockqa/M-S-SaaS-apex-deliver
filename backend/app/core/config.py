"""Application configuration powered by Pydantic settings."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized application configuration."""

    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), env_file_encoding="utf-8", extra="ignore")

    app_name: str = "M&A Intelligence Platform"
    debug: bool = False
    database_url: str = "sqlite:///./app.db"
    clerk_secret_key: str = ""
    clerk_webhook_secret: str = ""
    algorithm: str = "HS256"


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance to avoid repeated environment parsing."""
    return Settings()


settings = get_settings()
