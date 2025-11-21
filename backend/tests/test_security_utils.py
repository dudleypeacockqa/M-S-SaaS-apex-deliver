"""
Tests for Security Utilities - Phase 3.5
TDD: RED → GREEN → REFACTOR
Feature: Complete coverage for security.py utility functions
"""
import pytest
from unittest.mock import patch, Mock
from jose import JWTError, jwt
import hmac
import hashlib

from app.core.security import (
    AuthError,
    verify_webhook_signature,
    decode_clerk_jwt,
)
from app.core.config import settings


class TestAuthError:
    """Test AuthError exception"""
    
    def test_auth_error_default_message(self):
        """Test AuthError with default message."""
        with pytest.raises(AuthError) as exc_info:
            raise AuthError()
        
        assert exc_info.value.status_code == 401
        assert "Authentication failed" in exc_info.value.detail
    
    def test_auth_error_custom_message(self):
        """Test AuthError with custom message."""
        with pytest.raises(AuthError) as exc_info:
            raise AuthError(detail="Custom auth error", status_code=403)
        
        assert exc_info.value.status_code == 403
        assert "Custom auth error" in exc_info.value.detail


class TestVerifyWebhookSignature:
    """Test verify_webhook_signature function"""
    
    def test_verify_webhook_signature_valid(self):
        """Test verify_webhook_signature with valid signature."""
        payload = b"test payload"
        secret = "test_secret_key"
        
        # Generate expected signature (function expects just the hex digest, not "sha256=" prefix)
        expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
        
        with patch("app.core.security.settings.clerk_webhook_secret", secret):
            # Should not raise - function compares hexdigest directly
            verify_webhook_signature(expected, payload)
    
    def test_verify_webhook_signature_invalid(self):
        """Test verify_webhook_signature with invalid signature."""
        payload = b"test payload"
        secret = "test_secret_key"
        
        with patch("app.core.security.settings.clerk_webhook_secret", secret):
            with pytest.raises(Exception) as exc_info:
                verify_webhook_signature("sha256=invalid_signature", payload)
            
            assert exc_info.value.status_code == 400
            assert "Invalid webhook signature" in exc_info.value.detail
    
    def test_verify_webhook_signature_missing_secret(self):
        """Test verify_webhook_signature raises when secret is missing."""
        payload = b"test payload"
        
        with patch("app.core.security.settings.clerk_webhook_secret", ""):
            with pytest.raises(Exception) as exc_info:
                verify_webhook_signature("sha256=signature", payload)
            
            assert exc_info.value.status_code == 400
            assert "Webhook signature missing" in exc_info.value.detail
    
    def test_verify_webhook_signature_missing_signature(self):
        """Test verify_webhook_signature raises when signature is None."""
        payload = b"test payload"
        secret = "test_secret_key"
        
        with patch("app.core.security.settings.clerk_webhook_secret", secret):
            with pytest.raises(Exception) as exc_info:
                verify_webhook_signature(None, payload)
            
            assert exc_info.value.status_code == 400
            assert "Webhook signature missing" in exc_info.value.detail


class TestDecodeClerkJWT:
    """Test decode_clerk_jwt function"""
    
    def test_decode_clerk_jwt_valid_token(self):
        """Test decode_clerk_jwt with valid token."""
        secret = "test_secret_key"
        token_payload = {"sub": "user_123", "org_id": "org_456"}
        
        # Create a valid token
        token = jwt.encode(token_payload, secret, algorithm="HS256")
        
        with patch("app.core.security.settings.clerk_secret_key", secret):
            with patch("app.core.security.settings.clerk_jwt_algorithm", "HS256"):
                decoded = decode_clerk_jwt(token)
                
                assert decoded["sub"] == "user_123"
                assert decoded["org_id"] == "org_456"
    
    def test_decode_clerk_jwt_invalid_token(self):
        """Test decode_clerk_jwt with invalid token."""
        secret = "test_secret_key"
        invalid_token = "invalid.token.here"
        
        with patch("app.core.security.settings.clerk_secret_key", secret):
            with patch("app.core.security.settings.clerk_jwt_algorithm", "HS256"):
                with pytest.raises(AuthError) as exc_info:
                    decode_clerk_jwt(invalid_token)
                
                assert exc_info.value.status_code == 401
                assert "Invalid authentication token" in exc_info.value.detail
    
    def test_decode_clerk_jwt_wrong_secret(self):
        """Test decode_clerk_jwt with token signed with different secret."""
        correct_secret = "correct_secret"
        wrong_secret = "wrong_secret"
        token_payload = {"sub": "user_123"}
        
        # Create token with wrong secret
        token = jwt.encode(token_payload, wrong_secret, algorithm="HS256")
        
        with patch("app.core.security.settings.clerk_secret_key", correct_secret):
            with patch("app.core.security.settings.clerk_jwt_algorithm", "HS256"):
                with pytest.raises(AuthError) as exc_info:
                    decode_clerk_jwt(token)
                
                assert exc_info.value.status_code == 401
                assert "Invalid authentication token" in exc_info.value.detail
    
    def test_decode_clerk_jwt_missing_secret_key(self):
        """Test decode_clerk_jwt raises when secret key is not configured."""
        token = "some.token.here"
        
        with patch("app.core.security.settings.clerk_secret_key", ""):
            with pytest.raises(AuthError) as exc_info:
                decode_clerk_jwt(token)
            
            assert exc_info.value.status_code == 401
            assert "Clerk secret key is not configured" in exc_info.value.detail
    
    def test_decode_clerk_jwt_expired_token(self):
        """Test decode_clerk_jwt with expired token."""
        from datetime import datetime, timedelta
        import time
        
        secret = "test_secret_key"
        # Create expired token (expired 1 hour ago)
        exp = datetime.utcnow() - timedelta(hours=1)
        token_payload = {
            "sub": "user_123",
            "exp": int(time.mktime(exp.timetuple()))
        }
        
        token = jwt.encode(token_payload, secret, algorithm="HS256")
        
        with patch("app.core.security.settings.clerk_secret_key", secret):
            with patch("app.core.security.settings.clerk_jwt_algorithm", "HS256"):
                with pytest.raises(AuthError) as exc_info:
                    decode_clerk_jwt(token)
                
                assert exc_info.value.status_code == 401
                assert "Invalid authentication token" in exc_info.value.detail

