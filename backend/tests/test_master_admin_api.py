"""RED-phase tests for Master Admin API endpoints."""

from __future__ import annotations

from datetime import date, datetime, timedelta

from fastapi import status


def _current_monday() -> date:
    today = date.today()
    return today - timedelta(days=today.weekday())


def test_master_admin_requires_auth(client):
    response = client.get("/api/master-admin/goals/current")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_goal_crud_flow(client, auth_headers_admin):
    headers = auth_headers_admin
    monday = _current_monday()
    payload = {
        "week_start": monday.isoformat(),
        "target_discoveries": 5,
        "target_emails": 10,
        "target_videos": 3,
        "target_calls": 8,
    }

    create_response = client.post("/api/master-admin/goals", json=payload, headers=headers)
    assert create_response.status_code == status.HTTP_201_CREATED
    goal = create_response.json()
    goal_id = goal["id"]

    duplicate_response = client.post("/api/master-admin/goals", json=payload, headers=headers)
    assert duplicate_response.status_code == status.HTTP_400_BAD_REQUEST

    current_response = client.get("/api/master-admin/goals/current", headers=headers)
    assert current_response.status_code == status.HTTP_200_OK
    assert current_response.json()["id"] == goal_id

    week_response = client.get(f"/api/master-admin/goals/{monday.isoformat()}", headers=headers)
    assert week_response.status_code == status.HTTP_200_OK
    assert week_response.json()["target_calls"] == 8

    missing_response = client.get("/api/master-admin/goals/2099-01-04", headers=headers)
    assert missing_response.status_code == status.HTTP_404_NOT_FOUND

    update_response = client.put(
        f"/api/master-admin/goals/{goal_id}",
        json={"target_calls": 12},
        headers=headers,
    )
    assert update_response.status_code == status.HTTP_200_OK
    assert update_response.json()["target_calls"] == 12


def test_activity_crud_and_listing(client, auth_headers_admin):
    headers = auth_headers_admin
    today = date.today().isoformat()

    first_payload = {
        "type": "discovery",
        "status": "done",
        "date": today,
        "amount": 2,
        "notes": "Discovery calls",
    }
    first_resp = client.post("/api/master-admin/activities", json=first_payload, headers=headers)
    assert first_resp.status_code == status.HTTP_201_CREATED
    first_activity = first_resp.json()
    activity_id = first_activity["id"]

    second_payload = {
        "type": "email",
        "status": "pending",
        "date": today,
        "amount": 3,
        "notes": "Follow up emails",
    }
    second_resp = client.post("/api/master-admin/activities", json=second_payload, headers=headers)
    assert second_resp.status_code == status.HTTP_201_CREATED

    list_resp = client.get("/api/master-admin/activities", headers=headers)
    assert list_resp.status_code == status.HTTP_200_OK
    body = list_resp.json()
    assert body["total"] == 2
    assert isinstance(body["items"], list)

    filtered_resp = client.get(
        "/api/master-admin/activities",
        params={"activity_type": "email"},
        headers=headers,
    )
    assert filtered_resp.status_code == status.HTTP_200_OK
    assert filtered_resp.json()["total"] == 1

    get_resp = client.get(f"/api/master-admin/activities/{activity_id}", headers=headers)
    assert get_resp.status_code == status.HTTP_200_OK
    assert get_resp.json()["amount"] == 2

    update_resp = client.put(
        f"/api/master-admin/activities/{activity_id}",
        json={"amount": 5, "notes": "Updated notes"},
        headers=headers,
    )
    assert update_resp.status_code == status.HTTP_200_OK
    assert update_resp.json()["amount"] == 5
    assert update_resp.json()["notes"] == "Updated notes"

    delete_resp = client.delete(f"/api/master-admin/activities/{activity_id}", headers=headers)
    assert delete_resp.status_code == status.HTTP_204_NO_CONTENT

    missing_resp = client.get(f"/api/master-admin/activities/{activity_id}", headers=headers)
    assert missing_resp.status_code == status.HTTP_404_NOT_FOUND


def test_scores_and_dashboard_stats(client, auth_headers_admin):
    headers = auth_headers_admin
    today = date.today()
    # Use today and yesterday to ensure we have data for the /scores/today endpoint
    # and to test week aggregation
    week_start = _current_monday()
    yesterday = today - timedelta(days=1)

    # Create activities for today and yesterday
    for activity_date in (today, yesterday):
        create_payload = {
            "type": "discovery",
            "status": "done",
            "date": activity_date.isoformat(),
            "amount": 1,
        }
        resp = client.post("/api/master-admin/activities", json=create_payload, headers=headers)
        assert resp.status_code == status.HTTP_201_CREATED

    prospect_resp = client.post(
        "/api/master-admin/prospects",
        json={"name": "Acme Corp", "status": "qualified"},
        headers=headers,
    )
    assert prospect_resp.status_code == status.HTTP_201_CREATED
    prospect_id = prospect_resp.json()["id"]

    deal_resp = client.post(
        "/api/master-admin/deals",
        json={
            "prospect_id": prospect_id,
            "title": "Platform Rollout",
            "stage": "proposal",
            "value": 25000,
            "probability": 60,
        },
        headers=headers,
    )
    assert deal_resp.status_code == status.HTTP_201_CREATED

    nudge_resp = client.post(
        "/api/master-admin/nudges",
        json={"type": "reminder", "message": "Follow up with Acme", "priority": "normal"},
        headers=headers,
    )
    assert nudge_resp.status_code == status.HTTP_201_CREATED

    today_resp = client.get("/api/master-admin/scores/today", headers=headers)
    assert today_resp.status_code == status.HTTP_200_OK
    assert today_resp.json()["score"] > 0

    date_resp = client.get(f"/api/master-admin/scores/{today.isoformat()}", headers=headers)
    assert date_resp.status_code == status.HTTP_200_OK

    week_resp = client.get(
        f"/api/master-admin/scores/week/{_current_monday().isoformat()}",
        headers=headers,
    )
    assert week_resp.status_code == status.HTTP_200_OK
    week_body = week_resp.json()
    assert week_body["total"] >= 1
    assert isinstance(week_body["items"], list)

    streak_resp = client.get("/api/master-admin/scores/streak", headers=headers)
    assert streak_resp.status_code == status.HTTP_200_OK
    assert streak_resp.json()["streak_days"] >= 1

    missing_score = client.get("/api/master-admin/scores/1999-01-01", headers=headers)
    assert missing_score.status_code == status.HTTP_404_NOT_FOUND

    dashboard_resp = client.get("/api/master-admin/dashboard", headers=headers)
    assert dashboard_resp.status_code == status.HTTP_200_OK
    dashboard = dashboard_resp.json()
    assert dashboard["weekly_activities"] >= 2
    assert dashboard["active_prospects"] >= 1
    assert dashboard["open_deals"] >= 1
    assert dashboard["unread_nudges"] == 1


def test_focus_session_flow(client, auth_headers_admin):
    headers = auth_headers_admin
    start_time = datetime.utcnow().replace(microsecond=0).isoformat()

    create_resp = client.post(
        "/api/master-admin/focus-sessions",
        json={"start_time": start_time, "duration_minutes": 50, "notes": "Deep work block"},
        headers=headers,
    )
    assert create_resp.status_code == status.HTTP_201_CREATED
    session_id = create_resp.json()["id"]

    active_resp = client.get("/api/master-admin/focus-sessions/active", headers=headers)
    assert active_resp.status_code == status.HTTP_200_OK
    assert active_resp.json()["id"] == session_id

    complete_resp = client.put(
        f"/api/master-admin/focus-sessions/{session_id}/complete",
        headers=headers,
        params={"interrupted": "false", "notes": "Completed successfully"},
    )
    assert complete_resp.status_code == status.HTTP_200_OK
    assert complete_resp.json()["completed"] is True

    no_active = client.get("/api/master-admin/focus-sessions/active", headers=headers)
    assert no_active.status_code == status.HTTP_404_NOT_FOUND

    second_complete = client.put(
        f"/api/master-admin/focus-sessions/{session_id}/complete",
        headers=headers,
        params={"interrupted": "false"},
    )
    assert second_complete.status_code == status.HTTP_400_BAD_REQUEST


def test_nudge_management(client, auth_headers_admin):
    headers = auth_headers_admin
    create_resp = client.post(
        "/api/master-admin/nudges",
        json={"type": "alert", "message": "Pipeline review due", "priority": "high"},
        headers=headers,
    )
    assert create_resp.status_code == status.HTTP_201_CREATED
    nudge_id = create_resp.json()["id"]

    unread_resp = client.get("/api/master-admin/nudges/unread", headers=headers)
    assert unread_resp.status_code == status.HTTP_200_OK
    unread_body = unread_resp.json()
    assert unread_body["total"] == 1
    assert unread_body["items"][0]["id"] == nudge_id

    mark_resp = client.put(f"/api/master-admin/nudges/{nudge_id}/read", headers=headers)
    assert mark_resp.status_code == status.HTTP_200_OK
    assert mark_resp.json()["read"] is True

    unread_after = client.get("/api/master-admin/nudges/unread", headers=headers)
    assert unread_after.status_code == status.HTTP_200_OK
    assert unread_after.json()["total"] == 0

    missing_resp = client.put(f"/api/master-admin/nudges/{nudge_id + 1}/read", headers=headers)
    assert missing_resp.status_code == status.HTTP_404_NOT_FOUND


def test_meeting_template_management(client, auth_headers_admin):
    headers = auth_headers_admin
    payload = {
        "title": "Discovery Call",
        "type": "discovery",
        "duration_minutes": 45,
        "agenda": "Qualify opportunity",
        "questions": "Budget, Authority, Need, Timeline",
        "follow_up_tasks": "Send recap email",
    }
    create_resp = client.post("/api/master-admin/meetings", json=payload, headers=headers)
    assert create_resp.status_code == status.HTTP_201_CREATED

    list_resp = client.get("/api/master-admin/meetings/type/discovery", headers=headers)
    assert list_resp.status_code == status.HTTP_200_OK
    list_body = list_resp.json()
    assert list_body["total"] == 1
    assert list_body["items"][0]["title"] == "Discovery Call"

    other_resp = client.get("/api/master-admin/meetings/type/demo", headers=headers)
    assert other_resp.status_code == status.HTTP_200_OK
    assert other_resp.json()["total"] == 0


def test_prospect_crud_flow(client, auth_headers_admin):
    headers = auth_headers_admin
    payload = {
        "name": "Jane Founder",
        "email": "jane@example.com",
        "company": "Founders Inc",
        "status": "new",
    }
    create_resp = client.post("/api/master-admin/prospects", json=payload, headers=headers)
    assert create_resp.status_code == status.HTTP_201_CREATED
    prospect = create_resp.json()
    prospect_id = prospect["id"]

    list_resp = client.get("/api/master-admin/prospects", headers=headers)
    assert list_resp.status_code == status.HTTP_200_OK
    assert list_resp.json()["total"] == 1

    get_resp = client.get(f"/api/master-admin/prospects/{prospect_id}", headers=headers)
    assert get_resp.status_code == status.HTTP_200_OK
    assert get_resp.json()["name"] == "Jane Founder"

    update_resp = client.put(
        f"/api/master-admin/prospects/{prospect_id}",
        json={"status": "engaged", "company": "Founders Collective"},
        headers=headers,
    )
    assert update_resp.status_code == status.HTTP_200_OK
    assert update_resp.json()["status"] == "engaged"

    delete_resp = client.delete(f"/api/master-admin/prospects/{prospect_id}", headers=headers)
    assert delete_resp.status_code == status.HTTP_204_NO_CONTENT

    missing_resp = client.get(f"/api/master-admin/prospects/{prospect_id}", headers=headers)
    assert missing_resp.status_code == status.HTTP_404_NOT_FOUND


def test_deal_pipeline_flow(client, auth_headers_admin):
    headers = auth_headers_admin
    prospect_resp = client.post(
        "/api/master-admin/prospects",
        json={"name": "Acme Procurement", "status": "qualified"},
        headers=headers,
    )
    prospect_id = prospect_resp.json()["id"]

    deal_payload = {
        "prospect_id": prospect_id,
        "title": "Enterprise Rollout",
        "stage": "discovery",
        "value": 55000,
        "probability": 30,
    }
    create_resp = client.post("/api/master-admin/deals", json=deal_payload, headers=headers)
    assert create_resp.status_code == status.HTTP_201_CREATED
    deal_id = create_resp.json()["id"]

    list_resp = client.get("/api/master-admin/deals", headers=headers)
    assert list_resp.status_code == status.HTTP_200_OK
    assert list_resp.json()["total"] == 1

    filtered_resp = client.get(
        "/api/master-admin/deals",
        params={"stage": "discovery"},
        headers=headers,
    )
    assert filtered_resp.status_code == status.HTTP_200_OK
    assert filtered_resp.json()["total"] == 1

    get_resp = client.get(f"/api/master-admin/deals/{deal_id}", headers=headers)
    assert get_resp.status_code == status.HTTP_200_OK
    assert get_resp.json()["title"] == "Enterprise Rollout"

    update_resp = client.put(
        f"/api/master-admin/deals/{deal_id}",
        json={"stage": "negotiation", "probability": 65},
        headers=headers,
    )
    assert update_resp.status_code == status.HTTP_200_OK
    assert update_resp.json()["stage"] == "negotiation"
    assert update_resp.json()["probability"] == 65


def test_campaign_and_recipient_management(client, auth_headers_admin):
    headers = auth_headers_admin
    prospect_resp = client.post(
        "/api/master-admin/prospects",
        json={"name": "Pipeline Lead", "email": "lead@example.com", "status": "qualified"},
        headers=headers,
    )
    prospect_id = prospect_resp.json()["id"]

    campaign_payload = {
        "name": "Welcome Series",
        "type": "email",
        "status": "draft",
        "subject": "Welcome to ApexDeliver",
        "content": "Thanks for joining!",
    }
    create_resp = client.post("/api/master-admin/campaigns", json=campaign_payload, headers=headers)
    assert create_resp.status_code == status.HTTP_201_CREATED
    campaign = create_resp.json()
    campaign_id = campaign["id"]

    list_resp = client.get("/api/master-admin/campaigns", headers=headers)
    assert list_resp.status_code == status.HTTP_200_OK
    assert list_resp.json()["total"] == 1

    get_resp = client.get(f"/api/master-admin/campaigns/{campaign_id}", headers=headers)
    assert get_resp.status_code == status.HTTP_200_OK
    assert get_resp.json()["name"] == "Welcome Series"

    update_resp = client.put(
        f"/api/master-admin/campaigns/{campaign_id}",
        json={"subject": "Updated subject line"},
        headers=headers,
    )
    assert update_resp.status_code == status.HTTP_200_OK
    assert update_resp.json()["subject"] == "Updated subject line"

    send_resp = client.post(f"/api/master-admin/campaigns/{campaign_id}/send", headers=headers)
    assert send_resp.status_code == status.HTTP_200_OK
    assert send_resp.json()["status"] == "sent"

    recipient_payload = {"campaign_id": campaign_id, "prospect_id": prospect_id}
    recipient_resp = client.post(
        f"/api/master-admin/campaigns/{campaign_id}/recipients",
        json=recipient_payload,
        headers=headers,
    )
    assert recipient_resp.status_code == status.HTTP_201_CREATED
    recipient = recipient_resp.json()
    recipient_id = recipient["id"]

    list_recipients = client.get(
        f"/api/master-admin/campaigns/{campaign_id}/recipients",
        headers=headers,
    )
    assert list_recipients.status_code == status.HTTP_200_OK
    recipients_body = list_recipients.json()
    assert recipients_body["total"] == 1
    assert recipients_body["items"][0]["prospect_id"] == prospect_id

    update_recipient = client.put(
        f"/api/master-admin/campaigns/{campaign_id}/recipients/{recipient_id}",
        json={"opened": True, "clicked": True},
        headers=headers,
    )
    assert update_recipient.status_code == status.HTTP_200_OK
    assert update_recipient.json()["opened"] is True
    assert update_recipient.json()["clicked"] is True

    delete_recipient = client.delete(
        f"/api/master-admin/campaigns/{campaign_id}/recipients/{recipient_id}",
        headers=headers,
    )
    assert delete_recipient.status_code == status.HTTP_204_NO_CONTENT

    delete_campaign = client.delete(f"/api/master-admin/campaigns/{campaign_id}", headers=headers)
    assert delete_campaign.status_code == status.HTTP_204_NO_CONTENT

    missing_campaign = client.get(f"/api/master-admin/campaigns/{campaign_id}", headers=headers)
    assert missing_campaign.status_code == status.HTTP_404_NOT_FOUND


def test_content_script_and_piece_flow(client, auth_headers_admin):
    headers = auth_headers_admin
    script_payload = {
        "title": "YouTube Launch Script",
        "type": "youtube",
        "script_text": "Opening hook and CTA",
        "duration_minutes": 6,
        "keywords": "[\"apex\", \"growth\"]",
    }
    script_resp = client.post("/api/master-admin/content/scripts", json=script_payload, headers=headers)
    assert script_resp.status_code == status.HTTP_201_CREATED
    script = script_resp.json()
    script_id = script["id"]

    list_scripts = client.get("/api/master-admin/content/scripts", headers=headers)
    assert list_scripts.status_code == status.HTTP_200_OK
    assert list_scripts.json()["total"] == 1

    get_script = client.get(f"/api/master-admin/content/scripts/{script_id}", headers=headers)
    assert get_script.status_code == status.HTTP_200_OK
    assert get_script.json()["title"] == "YouTube Launch Script"

    update_script = client.put(
        f"/api/master-admin/content/scripts/{script_id}",
        json={"duration_minutes": 8},
        headers=headers,
    )
    assert update_script.status_code == status.HTTP_200_OK
    assert update_script.json()["duration_minutes"] == 8

    piece_payload = {
        "title": "Launch Video",
        "type": "youtube",
        "status": "idea",
        "script_id": script_id,
        "recording_url": "https://cdn.example.com/raw.mp4",
    }
    piece_resp = client.post("/api/master-admin/content/pieces", json=piece_payload, headers=headers)
    assert piece_resp.status_code == status.HTTP_201_CREATED
    piece_id = piece_resp.json()["id"]

    list_pieces = client.get("/api/master-admin/content/pieces", headers=headers)
    assert list_pieces.status_code == status.HTTP_200_OK
    assert list_pieces.json()["total"] == 1

    update_piece = client.put(
        f"/api/master-admin/content/pieces/{piece_id}",
        json={"status": "published", "youtube_url": "https://youtu.be/demo"},
        headers=headers,
    )
    assert update_piece.status_code == status.HTTP_200_OK
    updated_piece = update_piece.json()
    assert updated_piece["status"] == "published"
    assert updated_piece["youtube_url"] == "https://youtu.be/demo"

    delete_piece = client.delete(f"/api/master-admin/content/pieces/{piece_id}", headers=headers)
    assert delete_piece.status_code == status.HTTP_204_NO_CONTENT

    delete_script = client.delete(f"/api/master-admin/content/scripts/{script_id}", headers=headers)
    assert delete_script.status_code == status.HTTP_204_NO_CONTENT


def test_lead_capture_flow(client, auth_headers_admin):
    headers = auth_headers_admin
    payload = {
        "name": "Conference Lead",
        "email": "lead@event.com",
        "event_name": "Growth Summit",
        "event_date": date.today().isoformat(),
        "interest_level": "hot",
        "notes": "Met at booth",
    }
    create_resp = client.post("/api/master-admin/lead-captures", json=payload, headers=headers)
    assert create_resp.status_code == status.HTTP_201_CREATED
    lead_id = create_resp.json()["id"]

    list_resp = client.get("/api/master-admin/lead-captures", headers=headers)
    assert list_resp.status_code == status.HTTP_200_OK
    assert list_resp.json()["total"] == 1

    get_resp = client.get(f"/api/master-admin/lead-captures/{lead_id}", headers=headers)
    assert get_resp.status_code == status.HTTP_200_OK
    assert get_resp.json()["name"] == "Conference Lead"

    update_resp = client.put(
        f"/api/master-admin/lead-captures/{lead_id}",
        json={"interest_level": "warm", "follow_up_type": "1-day"},
        headers=headers,
    )
    assert update_resp.status_code == status.HTTP_200_OK
    assert update_resp.json()["interest_level"] == "warm"

    sync_resp = client.post(
        f"/api/master-admin/lead-captures/{lead_id}/sync-ghl",
        headers=headers,
    )
    assert sync_resp.status_code == status.HTTP_200_OK
    assert sync_resp.json()["synced_to_ghl"] is True

    delete_resp = client.delete(f"/api/master-admin/lead-captures/{lead_id}", headers=headers)
    assert delete_resp.status_code == status.HTTP_204_NO_CONTENT

    missing_resp = client.get(f"/api/master-admin/lead-captures/{lead_id}", headers=headers)
    assert missing_resp.status_code == status.HTTP_404_NOT_FOUND


def test_collateral_library_flow(client, auth_headers_admin):
    headers = auth_headers_admin
    collateral_payload = {
        "title": "One Pager",
        "type": "one-pager",
        "description": "Product overview",
        "file_url": "https://cdn.example.com/one-pager.pdf",
        "file_size": 2048,
        "mime_type": "application/pdf",
    }
    create_resp = client.post("/api/master-admin/collateral", json=collateral_payload, headers=headers)
    assert create_resp.status_code == status.HTTP_201_CREATED
    collateral_id = create_resp.json()["id"]

    list_resp = client.get("/api/master-admin/collateral", headers=headers)
    assert list_resp.status_code == status.HTTP_200_OK
    assert list_resp.json()["total"] == 1

    get_resp = client.get(f"/api/master-admin/collateral/{collateral_id}", headers=headers)
    assert get_resp.status_code == status.HTTP_200_OK
    assert get_resp.json()["title"] == "One Pager"

    update_resp = client.put(
        f"/api/master-admin/collateral/{collateral_id}",
        json={"description": "Updated overview"},
        headers=headers,
    )
    assert update_resp.status_code == status.HTTP_200_OK
    assert update_resp.json()["description"] == "Updated overview"

    prospect_resp = client.post(
        "/api/master-admin/prospects",
        json={"name": "Usage Prospect", "status": "new"},
        headers=headers,
    )
    prospect_id = prospect_resp.json()["id"]

    usage_resp = client.post(
        f"/api/master-admin/collateral/{collateral_id}/track-usage",
        headers=headers,
        params={"prospect_id": str(prospect_id)},
    )
    assert usage_resp.status_code == status.HTTP_200_OK
    assert "usage_id" in usage_resp.json()

    delete_resp = client.delete(f"/api/master-admin/collateral/{collateral_id}", headers=headers)
    assert delete_resp.status_code == status.HTTP_204_NO_CONTENT

    missing_resp = client.get(f"/api/master-admin/collateral/{collateral_id}", headers=headers)
    assert missing_resp.status_code == status.HTTP_404_NOT_FOUND
