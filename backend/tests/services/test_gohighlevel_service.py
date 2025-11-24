"""Tests for GoHighLevel CRM integration service."""

import pytest
from unittest.mock import AsyncMock, patch
import httpx

from app.services.gohighlevel_service import sync_contact_to_gohighlevel
from app.core.config import settings


@pytest.mark.asyncio
async def test_sync_contact_to_gohighlevel_success():
    """Test successful contact sync to GoHighLevel."""
    with patch('app.services.gohighlevel_service.settings') as mock_settings:
        mock_settings.gohighlevel_api_key = "test_api_key"
        mock_settings.gohighlevel_location_id = "test_location_id"
        
        with patch('httpx.AsyncClient') as mock_client:
            mock_response = AsyncMock()
            mock_response.raise_for_status = AsyncMock(return_value=None)
            mock_response.status_code = 201
            
            mock_post = AsyncMock(return_value=mock_response)
            mock_client_instance = AsyncMock()
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_instance.post = mock_post
            mock_client.return_value = mock_client_instance
            
            result = await sync_contact_to_gohighlevel(
                name="John Doe",
                email="john@example.com",
                phone="+1234567890",
                company="Test Corp",
                message="Test message"
            )
            
            assert result is True


@pytest.mark.asyncio
async def test_sync_contact_to_gohighlevel_not_configured():
    """Test that sync is skipped when GoHighLevel is not configured."""
    with patch('app.services.gohighlevel_service.settings') as mock_settings:
        mock_settings.gohighlevel_api_key = ""
        mock_settings.gohighlevel_location_id = ""
        
        result = await sync_contact_to_gohighlevel(
            name="John Doe",
            email="john@example.com"
        )
        
        assert result is False


@pytest.mark.asyncio
async def test_sync_contact_to_gohighlevel_api_error():
    """Test handling of API errors during sync."""
    with patch('app.services.gohighlevel_service.settings') as mock_settings:
        mock_settings.gohighlevel_api_key = "test_api_key"
        mock_settings.gohighlevel_location_id = "test_location_id"
        
        with patch('httpx.AsyncClient') as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.__aenter__.return_value.post = AsyncMock(side_effect=httpx.HTTPError("API Error"))
            mock_client_instance.__aexit__.return_value = None
            mock_client.return_value = mock_client_instance
            
            result = await sync_contact_to_gohighlevel(
                name="John Doe",
                email="john@example.com"
            )
            
            assert result is False

