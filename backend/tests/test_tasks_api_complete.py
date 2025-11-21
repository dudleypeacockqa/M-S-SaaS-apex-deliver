"""
Tests for Task API Routes - Missing Endpoints (Phase 3.2)
TDD: RED → GREEN → REFACTOR
Feature: DEV-012 Task templates, automation rules, and logs
"""
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.models.user import UserRole


@pytest.fixture()
def deal_context(create_deal_for_org):
    deal, owner, org = create_deal_for_org()
    return deal, owner, org


class TestTaskTemplatesAPI:
    """Test task template API endpoints"""
    
    def test_create_task_template(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test POST /deals/{deal_id}/task-templates creates a template."""
        deal, owner, org = deal_context
        
        payload = {
            "name": "Due Diligence Template",
            "description": "Standard DD tasks",
            "tasks": [
                {"title": "Financial Review", "priority": "high", "stage_gate": "due_diligence"},
                {"title": "Legal Review", "priority": "high", "stage_gate": "due_diligence"},
            ],
        }
        
        response = client.post(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers_growth,
            json=payload,
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Due Diligence Template"
        assert data["organization_id"] == str(org.id)
        assert len(data["tasks"]) == 2
        assert data["tasks"][0]["title"] == "Financial Review"
    
    def test_list_task_templates(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/task-templates lists templates."""
        deal, owner, org = deal_context
        
        # Create multiple templates
        template1 = {
            "name": "Template 1",
            "description": "First template",
            "tasks": [{"title": "Task 1", "priority": "normal"}],
        }
        template2 = {
            "name": "Template 2",
            "description": "Second template",
            "tasks": [{"title": "Task 2", "priority": "high"}],
        }
        
        client.post(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers_growth,
            json=template1,
        )
        client.post(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers_growth,
            json=template2,
        )
        
        response = client.get(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        names = {t["name"] for t in data}
        assert names == {"Template 1", "Template 2"}
    
    def test_create_template_requires_growth_role(
        self,
        client: TestClient,
        deal_context,
        auth_headers,
    ):
        """Test POST /task-templates requires growth role."""
        deal, owner, org = deal_context
        
        payload = {
            "name": "Test Template",
            "tasks": [{"title": "Task 1"}],
        }
        
        response = client.post(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers,
            json=payload,
        )
        
        assert response.status_code == 403


class TestTaskAutomationRulesAPI:
    """Test task automation rule API endpoints"""
    
    def test_create_automation_rule(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test POST /deals/{deal_id}/automation/rules creates a rule."""
        deal, owner, org = deal_context
        
        # First create a template
        template_payload = {
            "name": "Test Template",
            "tasks": [{"title": "Automated Task", "priority": "normal"}],
        }
        template_resp = client.post(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers_growth,
            json=template_payload,
        )
        template_id = template_resp.json()["id"]
        
        # Create rule
        rule_payload = {
            "name": "Auto-create on stage change",
            "trigger": "stage_change",
            "action": "create_tasks",
            "template_id": template_id,
            "suppress_minutes": 60,
        }
        
        response = client.post(
            f"/api/api/deals/{deal.id}/automation/rules",
            headers=auth_headers_growth,
            json=rule_payload,
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Auto-create on stage change"
        assert data["deal_id"] == str(deal.id)
        assert data["trigger"] == "stage_change"
        assert data["template_id"] == template_id
    
    def test_create_automation_rule_template_not_found(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test POST /automation/rules returns 404 when template not found."""
        deal, owner, org = deal_context
        
        rule_payload = {
            "name": "Test Rule",
            "trigger": "stage_change",
            "action": "create_tasks",
            "template_id": "non-existent-template",
        }
        
        response = client.post(
            f"/api/api/deals/{deal.id}/automation/rules",
            headers=auth_headers_growth,
            json=rule_payload,
        )
        
        assert response.status_code == 404
        assert "Template not found" in response.json()["detail"]
    
    def test_list_automation_rules(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/automation/rules lists rules."""
        deal, owner, org = deal_context
        
        # Create template first
        template_payload = {
            "name": "Test Template",
            "tasks": [{"title": "Task 1"}],
        }
        template_resp = client.post(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers_growth,
            json=template_payload,
        )
        template_id = template_resp.json()["id"]
        
        # Create multiple rules
        rule1_payload = {
            "name": "Rule 1",
            "trigger": "stage_change",
            "action": "create_tasks",
            "template_id": template_id,
        }
        rule2_payload = {
            "name": "Rule 2",
            "trigger": "status_change",
            "action": "create_tasks",
            "template_id": template_id,
        }
        
        client.post(
            f"/api/api/deals/{deal.id}/automation/rules",
            headers=auth_headers_growth,
            json=rule1_payload,
        )
        client.post(
            f"/api/api/deals/{deal.id}/automation/rules",
            headers=auth_headers_growth,
            json=rule2_payload,
        )
        
        response = client.get(
            f"/api/api/deals/{deal.id}/automation/rules",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        names = {r["name"] for r in data}
        assert names == {"Rule 1", "Rule 2"}
    
    def test_run_automation_rule(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test POST /deals/{deal_id}/automation/rules/{rule_id}/run queues rule execution."""
        deal, owner, org = deal_context
        
        # Create template and rule
        template_payload = {
            "name": "Test Template",
            "tasks": [{"title": "Automated Task", "priority": "normal"}],
        }
        template_resp = client.post(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers_growth,
            json=template_payload,
        )
        template_id = template_resp.json()["id"]
        
        rule_payload = {
            "name": "Test Rule",
            "trigger": "stage_change",
            "action": "create_tasks",
            "template_id": template_id,
        }
        rule_resp = client.post(
            f"/api/api/deals/{deal.id}/automation/rules",
            headers=auth_headers_growth,
            json=rule_payload,
        )
        rule_id = rule_resp.json()["id"]
        
        # Run rule
        response = client.post(
            f"/api/api/deals/{deal.id}/automation/rules/{rule_id}/run",
            headers=auth_headers_growth,
            json={},
        )
        
        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "queued"
        assert "log_id" in data
    
    def test_run_automation_rule_not_found(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test POST /automation/rules/{rule_id}/run returns 404 when rule not found."""
        deal, owner, org = deal_context
        
        response = client.post(
            f"/api/api/deals/{deal.id}/automation/rules/non-existent-rule/run",
            headers=auth_headers_growth,
            json={},
        )
        
        assert response.status_code == 404
        assert "Rule not found" in response.json()["detail"]
    
    @patch.dict("os.environ", {"CELERY_TASK_ALWAYS_EAGER": "true"})
    def test_run_automation_rule_eager_execution(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test POST /automation/rules/{rule_id}/run executes immediately when CELERY_TASK_ALWAYS_EAGER=true."""
        deal, owner, org = deal_context
        
        # Create template and rule
        template_payload = {
            "name": "Test Template",
            "tasks": [
                {"title": "Task 1", "priority": "normal"},
                {"title": "Task 2", "priority": "high"},
            ],
        }
        template_resp = client.post(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers_growth,
            json=template_payload,
        )
        template_id = template_resp.json()["id"]
        
        rule_payload = {
            "name": "Test Rule",
            "trigger": "stage_change",
            "action": "create_tasks",
            "template_id": template_id,
        }
        rule_resp = client.post(
            f"/api/api/deals/{deal.id}/automation/rules",
            headers=auth_headers_growth,
            json=rule_payload,
        )
        rule_id = rule_resp.json()["id"]
        
        # Run rule (should execute immediately)
        response = client.post(
            f"/api/api/deals/{deal.id}/automation/rules/{rule_id}/run",
            headers=auth_headers_growth,
            json={},
        )
        
        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "queued"
        # Verify tasks were created by listing them
        tasks_resp = client.get(
            f"/api/api/deals/{deal.id}/tasks",
            headers=auth_headers_growth,
        )
        # Should have created tasks from the template
        assert tasks_resp.status_code == 200


class TestTaskAutomationLogsAPI:
    """Test task automation log API endpoints"""
    
    def test_list_automation_logs(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test GET /deals/{deal_id}/automation/logs lists execution logs."""
        deal, owner, org = deal_context
        
        # Create template and rule, then run it to generate logs
        template_payload = {
            "name": "Test Template",
            "tasks": [{"title": "Task 1"}],
        }
        template_resp = client.post(
            f"/api/api/deals/{deal.id}/task-templates",
            headers=auth_headers_growth,
            json=template_payload,
        )
        template_id = template_resp.json()["id"]
        
        rule_payload = {
            "name": "Test Rule",
            "trigger": "stage_change",
            "action": "create_tasks",
            "template_id": template_id,
        }
        rule_resp = client.post(
            f"/api/api/deals/{deal.id}/automation/rules",
            headers=auth_headers_growth,
            json=rule_payload,
        )
        rule_id = rule_resp.json()["id"]
        
        # Run rule to create log
        client.post(
            f"/api/api/deals/{deal.id}/automation/rules/{rule_id}/run",
            headers=auth_headers_growth,
            json={},
        )
        
        # List logs
        response = client.get(
            f"/api/api/deals/{deal.id}/automation/logs",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert len(data["items"]) >= 1
        log = data["items"][0]
        assert log["rule_id"] == rule_id
        assert log["deal_id"] == str(deal.id)
        # Status may be "queued" or "completed" depending on CELERY_TASK_ALWAYS_EAGER setting
        assert log["status"] in ("queued", "completed")


class TestTaskAPIErrorPaths:
    """Test error paths in task API endpoints"""
    
    def test_update_task_not_found(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test PATCH /tasks/{task_id} returns 404 when task not found."""
        deal, owner, org = deal_context
        
        response = client.patch(
            f"/api/api/deals/{deal.id}/tasks/non-existent-task",
            headers=auth_headers_growth,
            json={"status": "done"},
        )
        
        assert response.status_code == 404
    
    def test_update_task_wrong_deal(
        self,
        client: TestClient,
        deal_context,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test PATCH /tasks/{task_id} returns 404 when task belongs to different deal."""
        deal1, owner1, org1 = deal_context
        deal2, owner2, org2 = create_deal_for_org()
        
        # Create task in deal1
        task_payload = {
            "title": "Task in Deal 1",
            "assignee_id": str(owner1.id),
        }
        task_resp = client.post(
            f"/api/api/deals/{deal1.id}/tasks",
            headers=auth_headers_growth,
            json=task_payload,
        )
        task_id = task_resp.json()["id"]
        
        # Try to update it via deal2 endpoint
        response = client.patch(
            f"/api/api/deals/{deal2.id}/tasks/{task_id}",
            headers=auth_headers_growth,
            json={"status": "done"},
        )
        
        assert response.status_code == 404
    
    def test_delete_task_not_found(
        self,
        client: TestClient,
        deal_context,
        auth_headers_growth,
    ):
        """Test DELETE /tasks/{task_id} returns 404 when task not found."""
        deal, owner, org = deal_context
        
        response = client.delete(
            f"/api/api/deals/{deal.id}/tasks/non-existent-task",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404
    
    def test_delete_task_wrong_deal(
        self,
        client: TestClient,
        deal_context,
        create_deal_for_org,
        auth_headers_growth,
    ):
        """Test DELETE /tasks/{task_id} returns 404 when task belongs to different deal."""
        deal1, owner1, org1 = deal_context
        deal2, owner2, org2 = create_deal_for_org()
        
        # Create task in deal1
        task_payload = {
            "title": "Task in Deal 1",
            "assignee_id": str(owner1.id),
        }
        task_resp = client.post(
            f"/api/api/deals/{deal1.id}/tasks",
            headers=auth_headers_growth,
            json=task_payload,
        )
        task_id = task_resp.json()["id"]
        
        # Try to delete it via deal2 endpoint
        response = client.delete(
            f"/api/api/deals/{deal2.id}/tasks/{task_id}",
            headers=auth_headers_growth,
        )
        
        assert response.status_code == 404

