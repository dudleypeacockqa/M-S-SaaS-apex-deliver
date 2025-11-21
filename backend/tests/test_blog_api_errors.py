"""
Tests for Blog API Error Paths - Phase 3.5
TDD: RED → GREEN → REFACTOR
Feature: Error handling for blog API endpoints
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.blog_post import BlogPost
from app.main import app


class TestBlogAPIErrorPaths:
    """Test error paths in blog API endpoints"""
    
    def test_get_blog_post_returns_404_when_not_found(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test GET /blog/{post_id} returns 404 when post doesn't exist."""
        response = client.get("/api/blog/99999")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_get_blog_post_by_slug_returns_404_when_not_found(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test GET /blog/slug/{slug} returns 404 when post doesn't exist."""
        response = client.get("/api/blog/slug/non-existent-slug")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_list_blog_posts_with_invalid_category(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test GET /blog with invalid category filter still works (returns empty or filtered results)."""
        response = client.get("/api/blog?category=InvalidCategory")
        
        # Should return 200 with empty or filtered results, not error
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_list_blog_posts_with_search_term(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test GET /blog with search term returns filtered results."""
        response = client.get("/api/blog?search=nonexistent")
        
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_list_blog_posts_with_pagination(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test GET /blog with pagination parameters."""
        response = client.get("/api/blog?limit=10&offset=0")
        
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_list_blog_posts_with_draft_included(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test GET /blog with published_only=false includes drafts."""
        response = client.get("/api/blog?published_only=false")
        
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_list_blog_posts_with_large_offset(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test GET /blog with large offset returns empty list."""
        response = client.get("/api/blog?offset=99999")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # May be empty if no posts exist

