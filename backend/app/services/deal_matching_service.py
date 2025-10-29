"""Deal Matching Service implementation for DEV-018 intelligent matching."""
from __future__ import annotations

import math
from decimal import Decimal
from typing import Dict, Iterable, List, Optional

try:  # pragma: no cover - patched in tests
    import openai  # type: ignore
except ImportError:  # pragma: no cover - fallback when SDK not installed
    class _OpenAIStub:  # pylint: disable=too-few-public-methods
        class Embedding:  # type: ignore
            @staticmethod
            def create(*_args, **_kwargs):  # pragma: no cover - runtime guard
                raise RuntimeError("OpenAI SDK not installed; inject mock for tests")

    openai = _OpenAIStub()  # type: ignore

from pydantic import BaseModel

from app.models.deal import Deal
from app.models.deal_match import DealMatchCriteria


_DEFAULT_WEIGHTS: Dict[str, float] = {
    "industry": 0.35,
    "size": 0.25,
    "geography": 0.2,
    "description": 0.2,
}

_RELATED_INDUSTRIES: Dict[str, set[str]] = {
    "saas": {"software", "cloud", "technology", "software-as-a-service"},
    "software": {"saas", "technology", "enterprise software"},
    "fintech": {"financial technology", "finance", "saas", "technology"},
    "technology": {"saas", "software", "fintech", "ai"},
    "manufacturing": {"industrial", "hardware"},
}

_GEOGRAPHY_SYNONYMS: Dict[str, set[str]] = {
    "uk": {"united kingdom", "england", "london", "britain", "great britain"},
    "eu": {"europe", "european union", "france", "germany", "spain", "italy"},
    "us": {"united states", "usa", "america", "new york", "california"},
    "asia": {"singapore", "hong kong", "china", "japan", "india"},
}


class MatchResult(BaseModel):
    """Structured match response for a candidate deal."""

    deal_id: str
    score: float  # 0-100 scale
    confidence: str
    explanation: Dict[str, Dict[str, object]]


class DealMatchingService:
    """Service responsible for calculating intelligent deal matches."""

    def __init__(self, embedding_model: str = "text-embedding-3-small") -> None:
        self.embedding_model = embedding_model

    # ------------------------------------------------------------------
    # Scoring component helpers
    # ------------------------------------------------------------------
    def _calculate_industry_match(self, deal_industry: Optional[str], criteria_industries: Iterable[str]) -> float:
        if not deal_industry or not criteria_industries:
            return 0.0

        deal_industry_norm = deal_industry.strip().lower()
        normalized_criteria = {item.strip().lower() for item in criteria_industries if item}

        if deal_industry_norm in normalized_criteria:
            return 1.0

        related_sources = _RELATED_INDUSTRIES.get(deal_industry_norm, set())
        for industry in normalized_criteria:
            if deal_industry_norm in _RELATED_INDUSTRIES.get(industry, set()) or industry in related_sources:
                return 0.6
        return 0.0

    def _calculate_size_match(self, deal_size: Optional[Decimal], min_size: Optional[Decimal], max_size: Optional[Decimal]) -> float:
        if deal_size is None or min_size is None or max_size is None:
            return 0.0

        deal_value = float(deal_size)
        lower = float(min_size)
        upper = float(max_size)
        if lower <= deal_value <= upper:
            midpoint = (lower + upper) / 2
            half_range = max((upper - lower) / 2, 1.0)
            proximity = 1 - abs(deal_value - midpoint) / half_range
            return max(min(proximity, 1.0), 0.0)

        range_size = max(upper - lower, 1.0)
        if deal_value < lower:
            diff = lower - deal_value
        else:
            diff = deal_value - upper
        score = max(0.0, 1 - diff / (range_size * 2))
        return score

    def _calculate_geography_match(self, deal_geography: Optional[str], criteria_geographies: Optional[Iterable[str]]) -> float:
        if not deal_geography or not criteria_geographies:
            return 0.0

        deal_geo_norm = deal_geography.strip().lower()
        normalized_criteria = {item.strip().lower() for item in criteria_geographies if item}

        if deal_geo_norm in normalized_criteria:
            return 1.0

        deal_aliases = _GEOGRAPHY_SYNONYMS.get(deal_geo_norm, set())
        for criterion in normalized_criteria:
            synonyms = _GEOGRAPHY_SYNONYMS.get(criterion, set())
            if deal_geo_norm in synonyms or criterion in deal_aliases:
                return 0.7
            if self._matches_alias(deal_geo_norm, synonyms) or self._matches_alias(criterion, deal_aliases):
                return 0.7

        return 0.0

    @staticmethod
    async def _calculate_semantic_similarity(text1: str, text2: str) -> float:
        if not text1 or not text2:
            return 0.0

        try:
            response = openai.Embedding.create(input=[text1, text2], model="text-embedding-3-small")
            embeddings = [item["embedding"] for item in response["data"]][:2]
        except Exception:  # pragma: no cover - network/SDK fallback
            # Simple lexical overlap fallback when OpenAI unavailable
            tokens1 = set(text1.lower().split())
            tokens2 = set(text2.lower().split())
            if not tokens1 or not tokens2:
                return 0.0
            overlap = len(tokens1 & tokens2) / max(len(tokens1 | tokens2), 1)
            return overlap

        if len(embeddings) < 2:
            return 0.0

        similarity = DealMatchingService._cosine_similarity(embeddings[0], embeddings[1])
        return max(min((similarity + 1) / 2, 1.0), 0.0)

    @staticmethod
    def _calculate_weighted_score(component_scores: Dict[str, float], weights: Optional[Dict[str, float]]) -> float:
        effective_weights = _DEFAULT_WEIGHTS.copy()
        if weights:
            effective_weights.update({k: float(v) for k, v in weights.items() if isinstance(v, (int, float))})

        total_weight = sum(effective_weights.values())
        if total_weight == 0:
            return 0.0

        weighted_sum = 0.0
        for key, score in component_scores.items():
            weighted_sum += effective_weights.get(key, 0.0) * max(min(score, 1.0), 0.0)

        return weighted_sum / total_weight

    @staticmethod
    def _determine_confidence_level(score: float) -> str:
        if score >= 80:
            return "high"
        if score >= 60:
            return "medium"
        return "low"

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    async def find_matches(
        self,
        *,
        criteria: DealMatchCriteria,
        target_deal: Deal,
        candidate_deals: Iterable[Deal],
        top_n: int = 5,
        min_score: float = 0.0,
    ) -> List[MatchResult]:
        results: List[MatchResult] = []
        for candidate in candidate_deals:
            if str(candidate.id) == str(target_deal.id):
                continue

            industry_score = self._calculate_industry_match(candidate.industry, criteria.industries or [])
            size_score = self._calculate_size_match(candidate.deal_size, criteria.min_deal_size, criteria.max_deal_size)
            geography_score = self._calculate_geography_match(
                self._infer_geography(candidate, criteria.geographies or []),
                criteria.geographies,
            )
            description_score = await self._calculate_semantic_similarity(
                candidate.description or "",
                target_deal.description or "",
            )

            component_scores = {
                "industry": industry_score,
                "size": size_score,
                "geography": geography_score,
                "description": description_score,
            }

            weighted_score = self._calculate_weighted_score(component_scores, criteria.weights)
            score_percent = round(weighted_score * 100, 2)
            if score_percent < min_score:
                continue

            confidence = self._determine_confidence_level(score_percent)
            explanation = self._build_explanation(candidate, component_scores)

            results.append(
                MatchResult(
                    deal_id=str(candidate.id),
                    score=score_percent,
                    confidence=confidence,
                    explanation=explanation,
                )
            )

        results.sort(key=lambda result: result.score, reverse=True)
        return results[:top_n]

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _cosine_similarity(vec1: Iterable[float], vec2: Iterable[float]) -> float:
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return dot_product / (norm1 * norm2)

    @staticmethod
    def _matches_alias(value: str, aliases: Iterable[str]) -> bool:
        for alias in aliases:
            if alias in value:
                return True
        return False

    @staticmethod
    def _infer_geography(deal: Deal, criteria_geographies: Iterable[str]) -> Optional[str]:
        explicit = getattr(deal, "geography", None)
        if explicit:
            return explicit

        description = (deal.description or "").lower()
        for geography in criteria_geographies:
            if not geography:
                continue
            geo_lower = geography.lower()
            if geo_lower in description:
                return geography
            synonyms = _GEOGRAPHY_SYNONYMS.get(geo_lower, set())
            if any(alias in description for alias in synonyms):
                return geography
        return None

    @staticmethod
    def _build_explanation(deal: Deal, component_scores: Dict[str, float]) -> Dict[str, Dict[str, object]]:
        industry_reason = "No industry information provided."
        if deal.industry:
            industry_reason = f"Deal operates in '{deal.industry}'."

        size_reason = "Deal size not available."
        if deal.deal_size is not None:
            size_reason = f"Deal size is {deal.deal_size}."

        geography_reason = "Geography not identified."
        if deal.description:
            geography_reason = "Geography inferred from description." if component_scores["geography"] > 0 else "No geography match found."

        description_reason = "Semantic similarity between descriptions."

        return {
            "industry_match": {"score": round(component_scores["industry"], 2), "reason": industry_reason},
            "size_match": {"score": round(component_scores["size"], 2), "reason": size_reason},
            "geography_match": {"score": round(component_scores["geography"], 2), "reason": geography_reason},
            "description_match": {"score": round(component_scores["description"], 2), "reason": description_reason},
        }

*** End of File
