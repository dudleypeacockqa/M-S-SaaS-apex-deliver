"""
Tests for Invite Service - Organization Invitation Helpers
TDD: RED → GREEN → REFACTOR
Feature: Organization invitations via Clerk
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from clerk_backend_api.models import (
    ClerkErrors,
    ClerkErrorsData,
    ClerkError,
    OrganizationInvitation,
    OrganizationInvitations,
)
from clerk_backend_api.models.sdkerror import SDKError

from app.services.invite_service import (
    InvitationError,
    get_clerk_client,
    _extract_error_message,
    create_invitation,
    list_pending_invitations,
)


# Test InvitationError
def test_invitation_error_initialization():
    """Test InvitationError can be created with message and status code."""
    error = InvitationError("Test error", status_code=500)
    assert str(error) == "Test error"
    assert error.message == "Test error"
    assert error.status_code == 500


def test_invitation_error_default_status_code():
    """Test InvitationError defaults to 400 if no status code provided."""
    error = InvitationError("Test error")
    assert error.status_code == 400


# Test get_clerk_client()
@patch("app.services.invite_service.settings")
def test_get_clerk_client_success(mock_settings):
    """Test get_clerk_client returns Clerk client when secret key is configured."""
    mock_settings.clerk_secret_key = "test-secret-key"
    
    # Clear cache to ensure fresh test
    get_clerk_client.cache_clear()
    
    client = get_clerk_client()
    assert client is not None
    assert hasattr(client, "organization_invitations")
    
    get_clerk_client.cache_clear()


@patch("app.services.invite_service.settings")
def test_get_clerk_client_missing_secret_key(mock_settings):
    """Test get_clerk_client raises InvitationError when secret key is missing."""
    mock_settings.clerk_secret_key = None
    
    # Clear cache to ensure fresh test
    get_clerk_client.cache_clear()
    
    with pytest.raises(InvitationError) as exc_info:
        get_clerk_client()
    
    assert exc_info.value.message == "Clerk secret key is not configured"
    assert exc_info.value.status_code == 500
    
    get_clerk_client.cache_clear()


# Test _extract_error_message()
def test_extract_error_message_with_long_message():
    """Test _extract_error_message extracts long_message when available."""
    error = Mock(spec=ClerkErrors)
    error_data = Mock(spec=ClerkErrorsData)
    clerk_error = Mock(spec=ClerkError)
    clerk_error.long_message = "Long error message"
    clerk_error.message = "Short error message"
    error_data.errors = [clerk_error]
    error.data = error_data
    
    message = _extract_error_message(error)
    assert message == "Long error message"


def test_extract_error_message_without_long_message():
    """Test _extract_error_message falls back to message when long_message is missing."""
    error = Mock(spec=ClerkErrors)
    error_data = Mock(spec=ClerkErrorsData)
    clerk_error = Mock(spec=ClerkError)
    clerk_error.long_message = None
    clerk_error.message = "Short error message"
    error_data.errors = [clerk_error]
    error.data = error_data
    
    message = _extract_error_message(error)
    assert message == "Short error message"


def test_extract_error_message_no_data():
    """Test _extract_error_message returns default message when no data."""
    error = Mock(spec=ClerkErrors)
    error.data = None
    
    message = _extract_error_message(error)
    assert message == "Clerk invitation failed"


def test_extract_error_message_no_errors():
    """Test _extract_error_message returns default message when no errors."""
    error = Mock(spec=ClerkErrors)
    error_data = Mock(spec=ClerkErrorsData)
    error_data.errors = []
    error.data = error_data
    
    message = _extract_error_message(error)
    assert message == "Clerk invitation failed"


# Test create_invitation()
@patch("app.services.invite_service.get_clerk_client")
def test_create_invitation_success(mock_get_client):
    """Test create_invitation successfully creates invitation."""
    # Setup mock
    mock_client = Mock()
    mock_invitation = Mock(spec=OrganizationInvitation)
    mock_client.organization_invitations.create.return_value = mock_invitation
    mock_get_client.return_value = mock_client
    
    result = create_invitation(
        organization_id="org-123",
        email_address="user@example.com",
        role="admin",
        inviter_user_id="user-456",
        public_metadata={"key": "value"},
        private_metadata={"secret": "data"},
        redirect_url="https://example.com/redirect",
    )
    
    assert result == mock_invitation
    mock_client.organization_invitations.create.assert_called_once_with(
        organization_id="org-123",
        email_address="user@example.com",
        role="admin",
        inviter_user_id="user-456",
        public_metadata={"key": "value"},
        private_metadata={"secret": "data"},
        redirect_url="https://example.com/redirect",
    )


@patch("app.services.invite_service.get_clerk_client")
def test_create_invitation_with_minimal_params(mock_get_client):
    """Test create_invitation works with minimal parameters."""
    # Setup mock
    mock_client = Mock()
    mock_invitation = Mock(spec=OrganizationInvitation)
    mock_client.organization_invitations.create.return_value = mock_invitation
    mock_get_client.return_value = mock_client
    
    result = create_invitation(
        organization_id="org-123",
        email_address="user@example.com",
        role="member",
        inviter_user_id=None,
    )
    
    assert result == mock_invitation
    mock_client.organization_invitations.create.assert_called_once_with(
        organization_id="org-123",
        email_address="user@example.com",
        role="member",
        inviter_user_id=None,
        public_metadata=None,
        private_metadata=None,
        redirect_url=None,
    )


@patch("app.services.invite_service.get_clerk_client")
def test_create_invitation_clerk_errors(mock_get_client):
    """Test create_invitation raises InvitationError on ClerkErrors."""
    # Setup mock - create a proper ClerkErrors instance
    mock_client = Mock()
    
    # Create a proper ClerkErrors exception with the required structure
    error_obj = Mock(spec=ClerkError)
    error_obj.long_message = "Invalid organization ID"
    error_obj.message = "Bad request"
    
    error_data = Mock(spec=ClerkErrorsData)
    error_data.errors = [error_obj]
    
    # Create ClerkErrors instance properly (requires data argument)
    clerk_error = ClerkErrors(data=error_data)
    
    mock_client.organization_invitations.create.side_effect = clerk_error
    mock_get_client.return_value = mock_client
    
    with pytest.raises(InvitationError) as exc_info:
        create_invitation(
            organization_id="org-123",
            email_address="user@example.com",
            role="admin",
            inviter_user_id="user-456",
        )
    
    assert exc_info.value.message == "Invalid organization ID"
    assert exc_info.value.status_code == 400


@patch("app.services.invite_service.get_clerk_client")
def test_create_invitation_sdk_error(mock_get_client):
    """Test create_invitation raises InvitationError on SDKError."""
    # Setup mock
    mock_client = Mock()
    sdk_error = SDKError("Connection failed")
    mock_client.organization_invitations.create.side_effect = sdk_error
    mock_get_client.return_value = mock_client
    
    with pytest.raises(InvitationError) as exc_info:
        create_invitation(
            organization_id="org-123",
            email_address="user@example.com",
            role="admin",
            inviter_user_id="user-456",
        )
    
    assert "Connection failed" in exc_info.value.message
    assert exc_info.value.status_code == 400


# Test list_pending_invitations()
@patch("app.services.invite_service.get_clerk_client")
def test_list_pending_invitations_success(mock_get_client):
    """Test list_pending_invitations successfully lists invitations."""
    # Setup mock
    mock_client = Mock()
    mock_invitations = Mock(spec=OrganizationInvitations)
    mock_client.organization_invitations.list_pending.return_value = mock_invitations
    mock_get_client.return_value = mock_client
    
    result = list_pending_invitations(
        organization_id="org-123",
        limit=50,
        offset=10,
    )
    
    assert result == mock_invitations
    mock_client.organization_invitations.list_pending.assert_called_once_with(
        organization_id="org-123",
        limit=50,
        offset=10,
    )


@patch("app.services.invite_service.get_clerk_client")
def test_list_pending_invitations_default_params(mock_get_client):
    """Test list_pending_invitations uses default limit and offset."""
    # Setup mock
    mock_client = Mock()
    mock_invitations = Mock(spec=OrganizationInvitations)
    mock_client.organization_invitations.list_pending.return_value = mock_invitations
    mock_get_client.return_value = mock_client
    
    result = list_pending_invitations(organization_id="org-123")
    
    assert result == mock_invitations
    mock_client.organization_invitations.list_pending.assert_called_once_with(
        organization_id="org-123",
        limit=25,
        offset=0,
    )


@patch("app.services.invite_service.get_clerk_client")
def test_list_pending_invitations_clerk_errors(mock_get_client):
    """Test list_pending_invitations raises InvitationError on ClerkErrors."""
    # Setup mock - create a proper ClerkErrors instance
    mock_client = Mock()
    
    # Create a proper ClerkErrors exception with the required structure
    error_obj = Mock(spec=ClerkError)
    error_obj.long_message = "Organization not found"
    error_obj.message = "404"
    
    error_data = Mock(spec=ClerkErrorsData)
    error_data.errors = [error_obj]
    
    # Create ClerkErrors instance properly (requires data argument)
    clerk_error = ClerkErrors(data=error_data)
    
    mock_client.organization_invitations.list_pending.side_effect = clerk_error
    mock_get_client.return_value = mock_client
    
    with pytest.raises(InvitationError) as exc_info:
        list_pending_invitations(organization_id="org-123")
    
    assert exc_info.value.message == "Organization not found"
    assert exc_info.value.status_code == 400


@patch("app.services.invite_service.get_clerk_client")
def test_list_pending_invitations_sdk_error(mock_get_client):
    """Test list_pending_invitations raises InvitationError on SDKError."""
    # Setup mock
    mock_client = Mock()
    sdk_error = SDKError("Network timeout")
    mock_client.organization_invitations.list_pending.side_effect = sdk_error
    mock_get_client.return_value = mock_client
    
    with pytest.raises(InvitationError) as exc_info:
        list_pending_invitations(organization_id="org-123")
    
    assert "Network timeout" in exc_info.value.message
    assert exc_info.value.status_code == 400

