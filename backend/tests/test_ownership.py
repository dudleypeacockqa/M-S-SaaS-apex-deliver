"""Tests for resource ownership helpers."""
from fastapi import HTTPException

from app.core.ownership import require_deal_access


def test_require_deal_access_allows_owner(
    db_session,
    create_deal_for_org,
):
    deal, owner, _ = create_deal_for_org()
    dependency = require_deal_access

    result = dependency(
        deal_id=str(deal.id),
        current_user=owner,
        db=db_session,
    )

    assert result.id == deal.id


def test_require_deal_access_blocks_other_org(
    db_session,
    create_deal_for_org,
    create_user,
    create_organization,
):
    deal, owner, org = create_deal_for_org()
    other_org = create_organization(name="Other Org")
    intruder = create_user(email="intruder@other.org", organization_id=str(other_org.id))

    dependency = require_deal_access

    try:
        dependency(
            deal_id=str(deal.id),
            current_user=intruder,
            db=db_session,
        )
    except HTTPException as exc:
        assert exc.status_code == 404
        assert exc.detail["code"] == "DEAL_NOT_FOUND"
    else:  # pragma: no cover
        raise AssertionError("Expected HTTPException for unauthorized access")
