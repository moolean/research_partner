"""
Application configuration
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # Storage
    storage_path: str = "/tmp/research_partner"
    
    # Default OpenAI settings (can be overridden by user)
    default_api_base: str = "https://api.openai.com/v1"
    default_model: str = "gpt-4-turbo-preview"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
