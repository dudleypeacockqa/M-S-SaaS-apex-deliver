from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.contact_message import ContactMessage
from app.models.newsletter_subscription import NewsletterSubscription


def test_submit_contact_form_success(client: TestClient, db_session: Session) -> None:
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "company": "Growth Co",
        "message": "We would like to schedule a platform demo for next week.",
    }

    response = client.post("/api/marketing/contact", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert "Thank you" in data["message"]
    assert data["id"] is not None

    stored = db_session.query(ContactMessage).filter_by(email=payload["email"]).first()
    assert stored is not None
    assert stored.name == payload["name"]
    assert stored.message.startswith("We would like")


def test_submit_contact_form_validation_error(client: TestClient) -> None:
    payload = {
        "name": "",
        "email": "not-an-email",
        "message": "too short",
    }

    response = client.post("/api/marketing/contact", json=payload)
    assert response.status_code == 422


def test_subscribe_newsletter_success(client: TestClient, db_session: Session) -> None:
    payload = {"email": "subscriber@example.com", "source": "sticky-cta"}

    response = client.post("/api/marketing/subscribe", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

    stored = (
        db_session.query(NewsletterSubscription)
        .filter_by(email=payload["email"])
        .first()
    )
    assert stored is not None
    assert stored.source == "sticky-cta"


def test_subscribe_newsletter_is_idempotent(client: TestClient, db_session: Session) -> None:
    email = "subscriber@example.com"
    first = NewsletterSubscription(email=email, source="popup")
    db_session.add(first)
    db_session.commit()

    response = client.post(
        "/api/marketing/subscribe",
        json={"email": email, "source": "footer"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"]

    updated = (
        db_session.query(NewsletterSubscription)
        .filter_by(email=email)
        .first()
    )
    assert updated is not None
    assert updated.source == "footer"
