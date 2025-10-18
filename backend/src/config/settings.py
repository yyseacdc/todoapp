from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = Field(default="Modern Todo Reminders")
    api_prefix: str = Field(default="/v1")
    database_url: str = Field(default="sqlite+aiosqlite:///./data/todo.db")
    reminder_poll_interval: int = Field(default=30, ge=5, le=300)
    reminder_activity_log_level: str = Field(default="INFO")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()


settings = get_settings()
