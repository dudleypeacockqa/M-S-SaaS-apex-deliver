"""Valuation API routes for DEV-011 Multi-Method Valuation Suite."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user, require_min_role
from app.db.session import get_db
from app.models.deal import Deal
from app.models.user import User, UserRole
from app.schemas.valuation import (
    ComparableCompanyCreate,
    ComparableCompanyResponse,
    PrecedentTransactionCreate,
    PrecedentTransactionResponse,
    ScenarioCreate,
    ScenarioResponse,
    ValuationCreate,
    ValuationExportCreate,
    ValuationExportResponse,
    ValuationResponse,
    ValuationUpdate,
)
from app.services import valuation_service

router = APIRouter(prefix="/deals/{deal_id}/valuations", tags=["valuation"])


def _error(status_code: int, code: str, message: str):
    raise HTTPException(status_code=status_code, detail={"code": code, "message": message})


def _ensure_deal_access(*, db: Session, deal_id: str, user: User) -> Deal:
    deal = db.get(Deal, deal_id)
    if not deal or deal.organization_id != user.organization_id:
        _error(status.HTTP_404_NOT_FOUND, "DEAL_NOT_FOUND", "Deal not found")
    return deal


def _require_growth_user(current_user: User = Depends(get_current_user)) -> User:
    checker = require_min_role(UserRole.growth)
    return checker(current_user)


@router.get("", response_model=List[ValuationResponse])
def list_valuations(
    deal_id: str,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    valuations = valuation_service.list_valuations(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
    )
    return valuations


@router.post("", response_model=ValuationResponse, status_code=status.HTTP_201_CREATED)
def create_valuation(
    deal_id: str,
    valuation_data: ValuationCreate,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    valuation = valuation_service.create_valuation(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        **valuation_data.model_dump(),
    )
    return valuation


def _get_valuation(*, db: Session, deal_id: str, valuation_id: str, user: User):
    valuation = valuation_service.get_valuation(db=db, valuation_id=valuation_id, organization_id=user.organization_id)
    if valuation is None:
        _error(status.HTTP_404_NOT_FOUND, "VALUATION_NOT_FOUND", "Valuation not found")
    if str(valuation.deal_id) != deal_id:
        _error(status.HTTP_403_FORBIDDEN, "DEAL_MISMATCH", "Valuation does not belong to this deal")
    return valuation


@router.get("/{valuation_id}", response_model=ValuationResponse)
def get_valuation(
    deal_id: str,
    valuation_id: str,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    valuation = _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    return valuation


@router.put("/{valuation_id}", response_model=ValuationResponse)
def update_valuation(
    deal_id: str,
    valuation_id: str,
    valuation_update: ValuationUpdate,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    updated = valuation_service.update_valuation(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
        updates=valuation_update.model_dump(exclude_unset=True),
    )
    return updated


@router.delete("/{valuation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_valuation(
    deal_id: str,
    valuation_id: str,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    valuation_service.delete_valuation(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
    )


@router.get("/{valuation_id}/comparables", response_model=List[ComparableCompanyResponse])
def list_comparables(
    deal_id: str,
    valuation_id: str,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    return valuation_service.list_comparable_companies(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
    )


@router.post("/{valuation_id}/comparables", response_model=ComparableCompanyResponse, status_code=status.HTTP_201_CREATED)
def add_comparable_company(
    deal_id: str,
    valuation_id: str,
    comparable_data: ComparableCompanyCreate,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    comparable = valuation_service.add_comparable(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
        **comparable_data.model_dump(),
    )
    return comparable


@router.get("/{valuation_id}/transactions", response_model=List[PrecedentTransactionResponse])
def list_precedent_transactions(
    deal_id: str,
    valuation_id: str,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    return valuation_service.list_precedent_transactions(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
    )


@router.post("/{valuation_id}/transactions", response_model=PrecedentTransactionResponse, status_code=status.HTTP_201_CREATED)
def add_precedent_transaction(
    deal_id: str,
    valuation_id: str,
    precedent_data: PrecedentTransactionCreate,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    precedent = valuation_service.add_precedent_transaction(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
        **precedent_data.model_dump(),
    )
    return precedent


@router.get("/{valuation_id}/scenarios", response_model=List[ScenarioResponse])
def list_scenarios(
    deal_id: str,
    valuation_id: str,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    return valuation_service.list_scenarios(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
    )


@router.post("/{valuation_id}/scenarios", response_model=ScenarioResponse, status_code=status.HTTP_201_CREATED)
def create_scenario(
    deal_id: str,
    valuation_id: str,
    scenario_data: ScenarioCreate,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    scenario = valuation_service.create_scenario(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
        name=scenario_data.name,
        assumptions=scenario_data.assumptions,
        description=scenario_data.description,
    )
    return scenario


@router.get("/{valuation_id}/scenarios/summary", status_code=status.HTTP_200_OK)
def get_scenario_summary(
    deal_id: str,
    valuation_id: str,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    return valuation_service.calculate_scenario_summary(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
    )


@router.get("/{valuation_id}/comparables/summary")
def get_comparable_summary(
    deal_id: str,
    valuation_id: str,
    subject_revenue: Optional[float] = None,
    subject_ebitda: Optional[float] = None,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    return valuation_service.calculate_comparable_multiples(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
        subject_revenue=subject_revenue,
        subject_ebitda=subject_ebitda,
    )


@router.get("/{valuation_id}/transactions/summary")
def get_transaction_summary(
    deal_id: str,
    valuation_id: str,
    subject_ebitda: Optional[float] = None,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    return valuation_service.calculate_precedent_multiples(
        db=db,
        valuation_id=valuation_id,
        organization_id=current_user.organization_id,
        subject_ebitda=subject_ebitda,
    )


@router.get("/{valuation_id}/valuation-summary")
def get_valuation_summary(
    deal_id: str,
    valuation_id: str,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    _ensure_deal_access(db=db, deal_id=deal_id, user=current_user)
    valuations = valuation_service.list_valuations(
        db=db,
        deal_id=deal_id,
        organization_id=current_user.organization_id,
    )
    summaries = [
        {
            "valuation_id": v.id,
            "enterprise_value": v.enterprise_value,
            "equity_value": v.equity_value,
            "created_at": v.created_at,
        }
        for v in valuations
    ]
    return {
        "valuations": summaries,
        "count": len(summaries),
    }


@router.post("/{valuation_id}/monte-carlo")
def run_monte_carlo(
    deal_id: str,
    valuation_id: str,
    payload: dict,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    valuation = _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    iterations = int(payload.get("iterations", 100)
    )
    if iterations <= 0:
        _error(status.HTTP_422_UNPROCESSABLE_ENTITY, "INVALID_ITERATIONS", "iterations must be positive")
    result = valuation_service.run_monte_carlo_simulation(
        base_cash_flows=valuation.cash_flows,
        discount_rate=valuation.discount_rate,
        terminal_growth_rate=valuation.terminal_growth_rate or 0.02,
        iterations=iterations,
        seed=payload.get("seed"),
    )
    return result


@router.post("/{valuation_id}/exports", response_model=ValuationExportResponse, status_code=status.HTTP_202_ACCEPTED)
def trigger_export(
    deal_id: str,
    valuation_id: str,
    export_request: ValuationExportCreate,
    current_user: User = Depends(_require_growth_user),
    db: Session = Depends(get_db),
):
    valuation = _get_valuation(db=db, deal_id=deal_id, valuation_id=valuation_id, user=current_user)
    valuation_service.log_export_event(
        db=db,
        valuation_id=valuation.id,
        organization_id=current_user.organization_id,
        export_type=export_request.export_type,
        export_format=export_request.export_format,
        exported_by=current_user.id,
    )
    task = valuation_service.trigger_export_task(
        valuation_id=valuation.id,
        organization_id=current_user.organization_id,
        export_type=export_request.export_type,
        export_format=export_request.export_format,
    )
    return ValuationExportResponse(
        status="queued",
        task_id=task["task_id"],
        export_type=export_request.export_type,
        export_format=export_request.export_format,
    )
 
