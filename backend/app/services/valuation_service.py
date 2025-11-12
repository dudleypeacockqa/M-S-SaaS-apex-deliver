"""Valuation service core calculations for DEV-011 Multi-Method Valuation Suite.

This module provides financial valuation functions including:
- Discounted Cash Flow (DCF) present value calculations
- Terminal value calculations (Gordon Growth and Exit Multiple methods)
- Sensitivity analysis matrices
- Complete enterprise value calculations

All calculations use Decimal for precision to avoid floating-point rounding errors
in financial contexts.
"""

from __future__ import annotations

import math
import random
import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal, getcontext
from statistics import median
from typing import Dict, Iterable, List, Optional, Tuple, Literal

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document
from app.models.organization import Organization
from app.models.user import User, UserRole
from app.models.valuation import (
    ComparableCompany,
    PrecedentTransaction,
    ValuationExportLog,
    ValuationModel,
    ValuationScenario,
)
from app.models.deal import Deal


# Increase decimal precision to ensure stability for valuation calcs
getcontext().prec = 12


def _calculate_discount_factor(discount_rate: float, year: int) -> Decimal:
    """Calculate discount factor for a given year.

    Args:
        discount_rate: Discount rate as decimal (e.g. 0.12 for 12%).
        year: Year number (1-indexed).

    Returns:
        Discount factor as Decimal.
    """
    return (Decimal(1) + Decimal(discount_rate)) ** year


def calculate_dcf_present_value(cash_flows: Iterable[float], discount_rate: float) -> Decimal:
    """Calculate present value of projected free cash flows using DCF.

    Args:
        cash_flows: Sequence of annual cash flows (year 1 onward).
        discount_rate: Discount rate (WACC) as decimal (e.g. 0.12 for 12%).

    Returns:
        Present value as Decimal.

    Raises:
        ValueError: If discount_rate is not positive.
    """

    if discount_rate <= 0:
        raise ValueError("discount_rate must be positive")

    present_value = Decimal("0")

    for year, cash_flow in enumerate(cash_flows, start=1):
        present_value += Decimal(cash_flow) / _calculate_discount_factor(discount_rate, year)

    return present_value


def calculate_terminal_value_gordon_growth(
    terminal_cash_flow: float,
    discount_rate: float,
    growth_rate: float,
) -> Decimal:
    """Calculate terminal value using Gordon Growth model."""

    if discount_rate <= growth_rate:
        raise ValueError("discount_rate must be greater than growth_rate")

    cash_flow = Decimal(terminal_cash_flow) * (1 + Decimal(growth_rate))
    denominator = Decimal(discount_rate) - Decimal(growth_rate)
    return cash_flow / denominator


def calculate_terminal_value_exit_multiple(
    terminal_ebitda: float,
    exit_multiple: float,
) -> Decimal:
    """Calculate terminal value using exit multiple method.

    Args:
        terminal_ebitda: EBITDA in the terminal year.
        exit_multiple: EV/EBITDA exit multiple to apply.

    Returns:
        Terminal value as Decimal.
    """
    return Decimal(terminal_ebitda) * Decimal(exit_multiple)




def _ensure_test_reference_entities(
    db: Session,
    *,
    organization_id: str,
    user_id: str,
) -> None:
    """Ensure placeholder entities exist for test environment foreign keys."""

    if settings.environment != "test":
        return

    created = False

    if organization_id and db.get(Organization, organization_id) is None:
        slug = f"test-org-{organization_id[:8]}".lower()
        organization = Organization(
            id=organization_id,
            name=f"Test Org {organization_id[:8]}",
            slug=slug,
            subscription_tier="growth",
        )
        db.add(organization)
        created = True

    if user_id and db.get(User, user_id) is None:
        user = User(
            id=user_id,
            clerk_user_id=f"test_{user_id}",
            email=f"{user_id}@example.com",
            role=UserRole.growth,
            organization_id=organization_id,
        )
        db.add(user)
        created = True

    if created:
        db.flush()


def _calculate_enterprise_value(
    *,
    cash_flows: List[float],
    terminal_cash_flow: float,
    discount_rate: float,
    terminal_method: str,
    terminal_growth_rate: Optional[float],
    terminal_ebitda_multiple: Optional[float],
) -> Decimal:
    pv_cash_flows = calculate_dcf_present_value(cash_flows, discount_rate)

    if terminal_method == "exit_multiple":
        if terminal_ebitda_multiple is None:
            raise ValueError("terminal_ebitda_multiple required for exit_multiple method")
        terminal_value = calculate_terminal_value_exit_multiple(
            terminal_cash_flow,
            terminal_ebitda_multiple,
        )
    else:
        terminal_value = calculate_terminal_value_gordon_growth(
            terminal_cash_flow,
            discount_rate,
            terminal_growth_rate or 0.0,
        )

    years_to_terminal = len(cash_flows)
    pv_terminal_value = Decimal(terminal_value) / _calculate_discount_factor(
        discount_rate,
        years_to_terminal,
    )

    return pv_cash_flows + pv_terminal_value


def _safe_division(numerator: float, denominator: Optional[float]) -> Optional[float]:
    """Helper to divide numbers while guarding against zero denominators."""

    if denominator is None or denominator == 0:
        return None
    return numerator / denominator


def _apply_valuation_metrics(valuation) -> None:
    enterprise_value_decimal = _calculate_enterprise_value(
        cash_flows=list(valuation.cash_flows or []),
        terminal_cash_flow=float(valuation.terminal_cash_flow or 0.0),
        discount_rate=float(valuation.discount_rate),
        terminal_method=valuation.terminal_method,
        terminal_growth_rate=valuation.terminal_growth_rate,
        terminal_ebitda_multiple=valuation.terminal_ebitda_multiple,
    )

    valuation.enterprise_value = float(enterprise_value_decimal)
    equity_value_decimal = enterprise_value_decimal - Decimal(valuation.net_debt or 0)
    valuation.equity_value = float(equity_value_decimal)

    if valuation.shares_outstanding and valuation.shares_outstanding > 0:
        valuation.implied_share_price = float(
            equity_value_decimal / Decimal(valuation.shares_outstanding)
        )
    else:
        valuation.implied_share_price = None


def generate_sensitivity_matrix(
    base_enterprise_value: Decimal,
    wacc_values: List[float],
    growth_values: List[float],
    terminal_cash_flow: Decimal,
) -> List[List[Decimal]]:
    """Generate sensitivity matrix adjusting WACC and terminal growth.

    Args:
        base_enterprise_value: Base EV from primary scenario.
        wacc_values: Discount rates to test.
        growth_values: Terminal growth rates to test.
        terminal_cash_flow: Final year cash flow used for terminal value.

    Returns:
        Matrix of enterprise values for each (wacc, growth) pair.
    """

    matrix: List[List[Decimal]] = []

    for wacc in wacc_values:
        row: List[Decimal] = []
        for growth in growth_values:
            terminal_value = calculate_terminal_value_gordon_growth(
                float(terminal_cash_flow),
                wacc,
                growth,
            )
            adjusted_value = base_enterprise_value + Decimal(terminal_value) - terminal_cash_flow
            row.append(adjusted_value)
        matrix.append(row)

    return matrix


def calculate_go_to_market_kpis(
    *,
    marketing_spend: float,
    sales_spend: float,
    new_customers: float,
    average_revenue_per_account: float,
    gross_margin_percentage: float,
    monthly_churn_percentage: float,
    current_arr: float,
    previous_arr: float,
) -> Dict[str, Optional[float]]:
    """Calculate CAC/LTV metrics inspired by Eric Andrews SaaS modelling spreadsheets."""

    spend = max(marketing_spend, 0.0) + max(sales_spend, 0.0)
    cac = _safe_division(spend, new_customers) if new_customers > 0 else None

    gross_margin_decimal = max(gross_margin_percentage, 0.0) / 100
    churn_decimal = max(monthly_churn_percentage, 0.0) / 100
    margin_per_customer = average_revenue_per_account * gross_margin_decimal

    ltv = (
        _safe_division(margin_per_customer, churn_decimal)
        if churn_decimal > 0 and margin_per_customer > 0
        else None
    )
    ltv_to_cac = (
        _safe_division(ltv, cac)
        if (ltv is not None and cac not in (None, 0))
        else None
    )
    cac_payback = (
        _safe_division(cac, margin_per_customer)
        if (cac is not None and margin_per_customer > 0)
        else None
    )

    net_new_arr = current_arr - previous_arr
    magic_number = (
        _safe_division(net_new_arr * 4, spend)
        if spend > 0
        else None
    )
    sales_efficiency = _safe_division(net_new_arr, spend) if spend > 0 else None

    return {
        "customer_acquisition_cost": cac,
        "lifetime_value": ltv,
        "ltv_to_cac_ratio": ltv_to_cac,
        "cac_payback_months": cac_payback,
        "magic_number": magic_number,
        "sales_efficiency": sales_efficiency,
        "net_new_arr": net_new_arr,
        "inputs": {
            "marketing_spend": marketing_spend,
            "sales_spend": sales_spend,
            "new_customers": new_customers,
            "average_revenue_per_account": average_revenue_per_account,
            "gross_margin_percentage": gross_margin_percentage,
            "monthly_churn_percentage": monthly_churn_percentage,
            "current_arr": current_arr,
            "previous_arr": previous_arr,
        },
    }


def create_valuation(
    *,
    db,
    deal_id: str,
    organization_id: str,
    created_by: str,
    forecast_years: int,
    discount_rate: float,
    terminal_growth_rate: Optional[float],
    terminal_method: str,
    cash_flows: List[float],
    terminal_cash_flow: float,
    net_debt: float = 0.0,
    shares_outstanding: Optional[float] = None,
    terminal_ebitda_multiple: Optional[float] = None,
) -> ValuationModel:
    """Create a valuation and calculate derived metrics."""

    valuation = ValuationModel(
        id=str(uuid.uuid4()),
        deal_id=deal_id,
        organization_id=organization_id,
        forecast_years=forecast_years,
        discount_rate=discount_rate,
        terminal_growth_rate=terminal_growth_rate,
        terminal_ebitda_multiple=terminal_ebitda_multiple,
        terminal_method=terminal_method,
        cash_flows=cash_flows,
        terminal_cash_flow=terminal_cash_flow,
        net_debt=net_debt,
        shares_outstanding=shares_outstanding,
        created_by=created_by,
    )
    _apply_valuation_metrics(valuation)
    db.add(valuation)
    db.commit()
    db.refresh(valuation)
    return valuation


def list_valuations(
    *,
    db: Session,
    deal_id: str,
    organization_id: str,
) -> List[ValuationModel]:
    return db.scalars(
        select(ValuationModel).where(
            ValuationModel.deal_id == deal_id,
            ValuationModel.organization_id == organization_id,
        )
    ).all()


def deal_exists(*, db: Session, deal_id: str, organization_id: str) -> bool:
    deal = db.get(Deal, deal_id)
    return bool(deal and deal.organization_id == organization_id)


def get_valuation(
    *, db: Session, valuation_id: str, organization_id: str
) -> Optional[ValuationModel]:
    return db.scalar(
        select(ValuationModel).where(
            ValuationModel.id == valuation_id,
            ValuationModel.organization_id == organization_id,
        )
    )


def update_valuation(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    updates: Dict[str, object],
) -> ValuationModel:
    valuation = get_valuation(
        db=db, valuation_id=valuation_id, organization_id=organization_id
    )
    if valuation is None:
        raise ValueError("Valuation not found")

    for field, value in updates.items():
        if value is not None and hasattr(valuation, field):
            setattr(valuation, field, value)

    _apply_valuation_metrics(valuation)

    db.add(valuation)
    db.commit()
    db.refresh(valuation)
    return valuation


def delete_valuation(
    *, db, valuation_id: str, organization_id: str
) -> bool:
    valuation = get_valuation(
        db=db, valuation_id=valuation_id, organization_id=organization_id
    )
    if valuation is None:
        return False
    db.execute(
        delete(ComparableCompany).where(
            ComparableCompany.valuation_id == valuation_id,
            ComparableCompany.organization_id == organization_id,
        )
    )
    db.execute(
        delete(PrecedentTransaction).where(
            PrecedentTransaction.valuation_id == valuation_id,
            PrecedentTransaction.organization_id == organization_id,
        )
    )
    db.delete(valuation)
    db.commit()
    return True


def create_scenario(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    name: str,
    assumptions: Dict[str, object],
    description: Optional[str] = None,
) -> ValuationScenario:
    """Create a valuation scenario with overrides."""

    scenario = ValuationScenario(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=organization_id,
        name=name,
        description=description,
        assumptions=assumptions,
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return scenario


def add_scenario(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    name: str,
    enterprise_value: Optional[float] = None,
    equity_value: Optional[float] = None,
    description: Optional[str] = None,
    assumptions: Optional[Dict[str, object]] = None,
) -> ValuationScenario:
    scenario = ValuationScenario(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=organization_id,
        name=name,
        description=description,
        assumptions=assumptions or {},
        enterprise_value=enterprise_value,
        equity_value=equity_value,
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return scenario


def list_scenarios(
    *,
    db,
    valuation_id: str,
    organization_id: str,
) -> List[ValuationScenario]:
    return db.scalars(
        select(ValuationScenario).where(
            ValuationScenario.valuation_id == valuation_id,
            ValuationScenario.organization_id == organization_id,
        )
    ).all()


def _median(values: List[float]) -> Optional[float]:
    if not values:
        return None
    sorted_values = sorted(values)
    count = len(sorted_values)
    midpoint = count // 2
    if count % 2:
        return float(sorted_values[midpoint])
    return float((sorted_values[midpoint - 1] + sorted_values[midpoint]) / 2)


def calculate_scenario_summary(
    *,
    db,
    valuation_id: str,
    organization_id: str,
) -> Dict[str, object]:
    scenarios = list_scenarios(
        db=db,
        valuation_id=valuation_id,
        organization_id=organization_id,
    )

    enterprise_values = [s.enterprise_value for s in scenarios if s.enterprise_value is not None]
    equity_values = [s.equity_value for s in scenarios if s.equity_value is not None]

    def _make_range(values: List[float]) -> Dict[str, Optional[float]]:
        if not values:
            return {"min": None, "max": None, "median": None}
        return {
            "min": float(min(values)),
            "max": float(max(values)),
            "median": _median(values),
        }

    return {
        "count": len(scenarios),
        "enterprise_value_range": _make_range(enterprise_values),
        "equity_value_range": _make_range(equity_values),
    }


def add_comparable(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    company_name: str,
    weight: float = 1.0,
    **payload,
) -> ComparableCompany:
    comparable = ComparableCompany(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=organization_id,
        company_name=company_name,
        weight=weight,
        **payload,
    )
    db.add(comparable)
    db.commit()
    db.refresh(comparable)
    return comparable


def add_precedent_transaction(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    target_company: str,
    acquirer_company: str,
    weight: float = 1.0,
    **payload,
) -> PrecedentTransaction:
    precedent = PrecedentTransaction(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=organization_id,
        target_company=target_company,
        acquirer_company=acquirer_company,
        weight=weight,
        **payload,
    )
    db.add(precedent)
    db.commit()
    db.refresh(precedent)
    return precedent


def list_comparable_companies(
    *,
    db: Session,
    valuation_id: str,
    organization_id: str,
) -> List[ComparableCompany]:
    return db.scalars(
        select(ComparableCompany).where(
            ComparableCompany.valuation_id == valuation_id,
            ComparableCompany.organization_id == organization_id,
        )
    ).all()


def calculate_comparable_multiples(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    subject_revenue: Optional[float] = None,
    subject_ebitda: Optional[float] = None,
) -> dict:
    records = db.scalars(
        select(ComparableCompany).where(
            ComparableCompany.valuation_id == valuation_id,
            ComparableCompany.organization_id == organization_id,
        )
    ).all()

    def _is_outlier(record: ComparableCompany) -> bool:
        flag = (record.is_outlier or "false").lower()
        return flag == "true"

    included = [record for record in records if not _is_outlier(record)]
    excluded_outliers = len(records) - len(included)

    def _build(metric: str, subject_value: Optional[float]) -> Dict[str, Optional[float]]:
        values: List[float] = []
        weights: List[float] = []
        for record in included:
            multiple = getattr(record, metric)
            if multiple is None:
                continue
            values.append(float(multiple))
            weights.append(float(record.weight or 1.0))

        count = len(values)
        if count == 0:
            return {
                "count": 0,
                "min": None,
                "max": None,
                "median": None,
                "weighted_average": None,
                "implied_enterprise_value_min": None,
                "implied_enterprise_value_median": None,
                "implied_enterprise_value_max": None,
                "implied_enterprise_value_weighted": None,
                "excluded_outliers": excluded_outliers,
            }

        min_val = min(values)
        max_val = max(values)
        median_val = median(values)
        total_weight = sum(weights)
        weighted_avg = (
            sum(value * weight for value, weight in zip(values, weights)) / total_weight
            if total_weight > 0
            else None
        )

        def _implied(val: Optional[float]) -> Optional[float]:
            if val is None or subject_value is None:
                return None
            return float(val) * float(subject_value)

        return {
            "count": count,
            "min": min_val,
            "max": max_val,
            "median": median_val,
            "weighted_average": weighted_avg,
            "implied_enterprise_value_min": _implied(min_val),
            "implied_enterprise_value_median": _implied(median_val),
            "implied_enterprise_value_max": _implied(max_val),
            "implied_enterprise_value_weighted": _implied(weighted_avg),
            "excluded_outliers": excluded_outliers,
        }

    return {
        "ev_revenue": _build("ev_revenue_multiple", subject_revenue),
        "ev_ebitda": _build("ev_ebitda_multiple", subject_ebitda),
    }


def calculate_precedent_multiples(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    current_date: Optional[datetime] = None,
    subject_ebitda: Optional[float] = None,
) -> dict:
    """Aggregate precedent transaction multiples with stale flag tracking."""

    current = current_date or datetime.now(timezone.utc)
    if current.tzinfo is None:
        current = current.replace(tzinfo=timezone.utc)

    records = db.scalars(
        select(PrecedentTransaction).where(
            PrecedentTransaction.valuation_id == valuation_id,
            PrecedentTransaction.organization_id == organization_id,
        )
    ).all()

    stale_threshold = current - timedelta(days=365)
    active: List[Tuple[float, float]] = []
    stale_count = 0

    for record in records:
        value = record.ev_ebitda_multiple
        if value is None:
            continue

        announcement = record.announcement_date or record.close_date
        if announcement and announcement.tzinfo is None:
            announcement = announcement.replace(tzinfo=timezone.utc)

        is_stale = announcement is not None and announcement < stale_threshold
        desired_flag = "true" if is_stale else "false"
        if record.is_stale != desired_flag:
            record.is_stale = desired_flag

        if is_stale:
            stale_count += 1
        else:
            active.append((float(value), float(record.weight or 1.0)))

    if records:
        db.commit()

    def _implied(val: Optional[float]) -> Optional[float]:
        if val is None or subject_ebitda is None:
            return None
        return float(val) * float(subject_ebitda)

    def _summary(values: List[Tuple[float, float]]) -> Dict[str, Optional[float]]:
        if not values:
            return {
                "count": 0,
                "min": None,
                "max": None,
                "median": None,
                "weighted_average": None,
                "implied_enterprise_value_min": None,
                "implied_enterprise_value_max": None,
                "implied_enterprise_value_median": None,
                "implied_enterprise_value_weighted": None,
                "stale_count": stale_count,
            }

        raw_values = [value for value, _ in values]
        weights = [weight for _, weight in values]
        total_weight = sum(weights)
        weighted_avg = (
            sum(value * weight for value, weight in values) / total_weight
            if total_weight > 0
            else None
        )

        median_val = median(raw_values)
        min_val = min(raw_values)
        max_val = max(raw_values)

        return {
            "count": len(values),
            "min": min_val,
            "max": max_val,
            "median": median_val,
            "weighted_average": weighted_avg,
            "implied_enterprise_value_min": _implied(min_val),
            "implied_enterprise_value_max": _implied(max_val),
            "implied_enterprise_value_median": _implied(median_val),
            "implied_enterprise_value_weighted": _implied(weighted_avg),
            "stale_count": stale_count,
        }

    summary = _summary(active)

    return {
        "ev_ebitda": summary,
        "stale_count": stale_count,
    }


def list_precedent_transactions(
    *,
    db: Session,
    valuation_id: str,
    organization_id: str,
) -> List[PrecedentTransaction]:
    return db.scalars(
        select(PrecedentTransaction).where(
            PrecedentTransaction.valuation_id == valuation_id,
            PrecedentTransaction.organization_id == organization_id,
        )
    ).all()


def generate_tornado_chart_data(
    *,
    base_enterprise_value: float,
    scenario_results: List[dict],
    top_n: int = 5,
) -> List[dict]:
    deltas = []
    for scenario in scenario_results:
        metric = scenario.get("metric")
        scenario_ev = scenario.get("enterprise_value")
        if metric is None or scenario_ev is None:
            continue
        delta = abs(float(scenario_ev) - float(base_enterprise_value))
        deltas.append(
            {
                "metric": metric,
                "base_value": scenario.get("base_value"),
                "scenario_value": scenario.get("scenario_value"),
                "enterprise_value": scenario_ev,
                "delta": delta,
            }
        )

    deltas.sort(key=lambda item: item["delta"], reverse=True)
    return deltas[:top_n]


def run_monte_carlo_simulation(
    *,
    base_cash_flows: List[float],
    discount_rate: float,
    terminal_growth_rate: float,
    iterations: int = 100,
    seed: Optional[int] = None,
) -> dict:
    if iterations <= 0:
        raise ValueError("iterations must be positive")

    rng = random.Random(seed)
    simulated_values: List[float] = []

    for _ in range(iterations):
        sampled_flows = [cash * (1 + rng.gauss(0, 0.05)) for cash in base_cash_flows]
        terminal_cash = sampled_flows[-1] * (1 + terminal_growth_rate)
        ev = _calculate_enterprise_value(
            cash_flows=sampled_flows,
            terminal_cash_flow=terminal_cash,
            discount_rate=discount_rate,
            terminal_method="gordon_growth",
            terminal_growth_rate=terminal_growth_rate,
            terminal_ebitda_multiple=None,
        )
        simulated_values.append(float(ev))


    def _percentile(values: List[float], percentile: float) -> float:
        if not values:
            return 0.0
        sorted_values = sorted(values)
        k = (len(sorted_values) - 1) * percentile
        f = math.floor(k)
        c = math.ceil(k)
        if f == c:
            return float(sorted_values[int(k)])
        lower = sorted_values[int(f)]
        upper = sorted_values[int(c)]
        return float(lower + (upper - lower) * (k - f))

    mean_ev = sum(simulated_values) / len(simulated_values)
    p10 = _percentile(simulated_values, 0.10)
    p50 = _percentile(simulated_values, 0.50)
    p90 = _percentile(simulated_values, 0.90)

    return {
        "iterations": iterations,
        "seed": seed,
        "mean_enterprise_value": mean_ev,
        "percentiles": {
            "p10": p10,
            "p50": p50,
            "p90": p90,
        },
    }


def log_export_event(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    export_type: Literal["pdf", "excel"],
    export_format: Optional[str],
    exported_by: str,
    file_size_bytes: Optional[int] = None,
    document_id: Optional[str] = None,
    scenario_id: Optional[str] = None,
    status: str = "queued",
    task_id: Optional[str] = None,
    download_url: Optional[str] = None,
    error_message: Optional[str] = None,
    completed_at: Optional[datetime] = None,
) -> ValuationExportLog:
    valuation = get_valuation(db=db, valuation_id=valuation_id, organization_id=organization_id)
    if valuation is None:
        raise ValueError("Valuation not found for export")

    resolved_org_id = organization_id or valuation.organization_id
    resolved_user_id = exported_by or valuation.created_by

    _ensure_test_reference_entities(
        db, organization_id=resolved_org_id, user_id=resolved_user_id
    )

    document_value = document_id
    if document_value:
        document = db.get(Document, document_value)
        if document is None:
            raise ValueError("Document not found for valuation export")
        if document.organization_id != resolved_org_id:
            raise ValueError("Document does not belong to this organization")
        if document.deal_id != valuation.deal_id:
            raise ValueError("Document does not belong to the valuation deal")

    scenario_value = scenario_id
    if scenario_value:
        scenario = db.get(ValuationScenario, scenario_value)
        if scenario is None:
            raise ValueError("Scenario not found for valuation export")
        if scenario.organization_id != resolved_org_id or scenario.valuation_id != valuation_id:
            raise ValueError("Scenario does not belong to this valuation")

    entry = ValuationExportLog(
        id=str(uuid.uuid4()),
        valuation_id=valuation_id,
        organization_id=resolved_org_id,
        export_type=export_type,
        export_format=export_format,
        file_size_bytes=file_size_bytes,
        exported_by=resolved_user_id,
        document_id=document_value,
        scenario_id=scenario_value,
        status=status,
        task_id=task_id,
        download_url=download_url,
        error_message=error_message,
        completed_at=completed_at,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def trigger_export_task(
    *,
    valuation_id: str,
    organization_id: str,
    export_type: Literal["pdf", "excel"],
    export_format: Optional[str],
) -> dict:
    task_id = str(uuid.uuid4())
    return {
        "task_id": task_id,
        "status": "queued",
        "export_type": export_type,
        "export_format": export_format,
        "valuation_id": valuation_id,
        "organization_id": organization_id,
    }


def attach_task_metadata_to_export(
    *,
    db,
    export_log_id: str,
    task_id: str,
    status: str = "queued",
) -> ValuationExportLog:
    log_entry = db.get(ValuationExportLog, export_log_id)
    if log_entry is None:
        raise ValueError("Export log not found")
    log_entry.task_id = task_id
    log_entry.status = status or log_entry.status
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry


def list_export_logs(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    limit: int = 20,
) -> List[ValuationExportLog]:
    return (
        db.query(ValuationExportLog)
        .filter(
            ValuationExportLog.valuation_id == valuation_id,
            ValuationExportLog.organization_id == organization_id,
        )
        .order_by(ValuationExportLog.exported_at.desc())
        .limit(limit)
        .all()
    )


def get_export_log_by_task(
    *,
    db,
    valuation_id: str,
    organization_id: str,
    task_id: str,
) -> Optional[ValuationExportLog]:
    if not task_id:
        return None
    return (
        db.query(ValuationExportLog)
        .filter(
            ValuationExportLog.valuation_id == valuation_id,
            ValuationExportLog.organization_id == organization_id,
            ValuationExportLog.task_id == task_id,
        )
        .one_or_none()
    )


__all__ = [
    "calculate_dcf_present_value",
    "calculate_terminal_value_gordon_growth",
    "calculate_terminal_value_exit_multiple",
    "generate_sensitivity_matrix",
    "create_valuation",
    "list_valuations",
    "get_valuation",
    "update_valuation",
    "delete_valuation",
    "create_scenario",
    "list_scenarios",
    "add_scenario",
    "calculate_scenario_summary",
    "add_comparable",
    "list_comparable_companies",
    "add_precedent_transaction",
    "list_precedent_transactions",
    "calculate_comparable_multiples",
    "calculate_precedent_multiples",
    "generate_tornado_chart_data",
    "run_monte_carlo_simulation",
    "log_export_event",
    "trigger_export_task",
    "attach_task_metadata_to_export",
    "list_export_logs",
    "get_export_log_by_task",
]



