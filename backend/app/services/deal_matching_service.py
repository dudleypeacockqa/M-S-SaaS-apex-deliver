"""
Deal Matching Service - DEV-018 Phase 2
Intelligent deal matching using OpenAI embeddings and weighted scoring
"""

import os
import math
from decimal import Decimal
from typing import Dict, List, Optional
from dataclasses import dataclass
import numpy as np

import openai

from app.models.deal import Deal
from app.models.deal_match import DealMatchCriteria


# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")


@dataclass
class MatchResult:
    """
    Result of a deal matching operation.

    Attributes:
        deal: The matched deal
        score: Overall match score (0-100)
        confidence: Confidence level ("high", "medium", "low")
        explanation: Detailed breakdown of score components
    """
    deal: Deal
    score: float
    confidence: str
    explanation: Dict[str, Dict[str, any]]


class DealMatchingService:
    """
    Service for matching deals based on criteria using AI-powered similarity.

    Uses OpenAI embeddings for semantic similarity and weighted scoring
    for industry, size, geography, and description matching.
    """

    # Industry similarity mapping (for cases where OpenAI unavailable)
    INDUSTRY_SIMILARITY = {
        "saas": ["software", "technology", "fintech"],
        "fintech": ["financial_services", "banking", "saas"],
        "technology": ["saas", "software", "it_services"],
        "manufacturing": ["industrial", "production"],
        "healthcare": ["medical", "pharmaceutical", "biotech"],
    }

    def _calculate_industry_match(
        self, deal_industry: Optional[str], criteria_industries: List[str]
    ) -> float:
        """
        Calculate industry match score.

        Args:
            deal_industry: Industry of the deal
            criteria_industries: List of acceptable industries from criteria

        Returns:
            Score between 0.0 and 1.0
        """
        if not deal_industry or not criteria_industries:
            return 0.0

        deal_industry_lower = deal_industry.lower()

        # Exact match
        if deal_industry_lower in [i.lower() for i in criteria_industries]:
            return 1.0

        # Check similarity mapping
        for criteria_industry in criteria_industries:
            criteria_lower = criteria_industry.lower()
            if criteria_lower in self.INDUSTRY_SIMILARITY:
                similar = self.INDUSTRY_SIMILARITY[criteria_lower]
                if deal_industry_lower in similar:
                    return 0.7  # Partial match for similar industries

        return 0.0

    def _calculate_size_match(
        self, deal_size: Optional[Decimal], min_size: Decimal, max_size: Decimal
    ) -> float:
        """
        Calculate deal size match score.

        Uses a bell curve centered on the criteria range.

        Args:
            deal_size: Size of the deal
            min_size: Minimum acceptable size
            max_size: Maximum acceptable size

        Returns:
            Score between 0.0 and 1.0
        """
        if not deal_size:
            return 0.5  # Neutral score if size unknown

        deal_size_float = float(deal_size)
        min_size_float = float(min_size)
        max_size_float = float(max_size)

        # Perfect score if within range
        if min_size_float <= deal_size_float <= max_size_float:
            # Higher score if closer to center of range
            range_center = (min_size_float + max_size_float) / 2
            range_width = max_size_float - min_size_float
            distance_from_center = abs(deal_size_float - range_center)
            normalized_distance = distance_from_center / (range_width / 2)
            return 1.0 - (normalized_distance * 0.1)  # 0.9 to 1.0 score

        # Penalty for being outside range
        if deal_size_float < min_size_float:
            ratio = deal_size_float / min_size_float
            return max(0.0, ratio * 0.8)  # Up to 0.8 if close to min

        # deal_size > max_size
        ratio = max_size_float / deal_size_float
        return max(0.0, ratio * 0.8)  # Up to 0.8 if close to max

    def _calculate_geography_match(
        self, deal_geography: Optional[str], criteria_geographies: Optional[List[str]]
    ) -> float:
        """
        Calculate geography match score.

        Args:
            deal_geography: Geography/region of the deal
            criteria_geographies: List of acceptable geographies

        Returns:
            Score between 0.0 and 1.0
        """
        if not criteria_geographies or not deal_geography:
            return 0.5  # Neutral if not specified

        deal_geo_lower = deal_geography.lower()

        # Exact match
        if deal_geo_lower in [g.lower() for g in criteria_geographies]:
            return 1.0

        # Regional matching (e.g., UK is part of EU)
        regional_mappings = {
            "uk": ["eu", "europe", "emea"],
            "us": ["north_america", "americas"],
            "canada": ["north_america", "americas"],
        }

        if deal_geo_lower in regional_mappings:
            for region in regional_mappings[deal_geo_lower]:
                if region in [g.lower() for g in criteria_geographies]:
                    return 0.8  # Partial match for regional inclusion

        return 0.0

    async def _calculate_semantic_similarity(
        self, text1: str, text2: str
    ) -> float:
        """
        Calculate semantic similarity between two texts using OpenAI embeddings.

        Args:
            text1: First text
            text2: Second text

        Returns:
            Cosine similarity score between 0.0 and 1.0
        """
        try:
            # Get embeddings from OpenAI
            response = openai.Embedding.create(
                model="text-embedding-ada-002",
                input=[text1, text2]
            )

            # Extract embeddings
            embedding1 = np.array(response["data"][0]["embedding"])
            embedding2 = np.array(response["data"][1]["embedding"])

            # Calculate cosine similarity
            dot_product = np.dot(embedding1, embedding2)
            norm1 = np.linalg.norm(embedding1)
            norm2 = np.linalg.norm(embedding2)
            similarity = dot_product / (norm1 * norm2)

            # Convert from [-1, 1] to [0, 1]
            return (similarity + 1) / 2

        except Exception as e:
            # Fallback to simple keyword matching if OpenAI unavailable
            print(f"OpenAI embedding error: {e}. Using fallback matching.")
            return self._fallback_text_similarity(text1, text2)

    def _fallback_text_similarity(self, text1: str, text2: str) -> float:
        """
        Fallback text similarity using simple keyword overlap.

        Args:
            text1: First text
            text2: Second text

        Returns:
            Jaccard similarity score between 0.0 and 1.0
        """
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())

        intersection = words1.intersection(words2)
        union = words1.union(words2)

        if not union:
            return 0.0

        return len(intersection) / len(union)

    def _calculate_weighted_score(
        self, component_scores: Dict[str, float], weights: Optional[Dict[str, float]]
    ) -> float:
        """
        Calculate weighted total score from component scores.

        Args:
            component_scores: Dictionary of score components
            weights: Dictionary of weights for each component

        Returns:
            Weighted score between 0.0 and 1.0
        """
        if not weights:
            # Equal weighting if not specified
            weights = {key: 1.0 / len(component_scores) for key in component_scores}

        total_score = 0.0
        total_weight = 0.0

        for component, score in component_scores.items():
            weight = weights.get(component, 0.0)
            total_score += score * weight
            total_weight += weight

        if total_weight == 0:
            return 0.0

        return total_score / total_weight

    def _determine_confidence_level(self, score: float) -> str:
        """
        Determine confidence level based on score.

        Args:
            score: Match score (0-100)

        Returns:
            Confidence level: "high", "medium", or "low"
        """
        if score >= 80:
            return "high"
        elif score >= 60:
            return "medium"
        else:
            return "low"

    async def find_matches(
        self,
        criteria: DealMatchCriteria,
        target_deal: Deal,
        candidate_deals: List[Deal],
        top_n: Optional[int] = 10,
        min_score: float = 40.0,
    ) -> List[MatchResult]:
        """
        Find and rank matching deals based on criteria.

        Args:
            criteria: Matching criteria to evaluate against
            target_deal: The deal to find matches for
            candidate_deals: List of candidate deals to evaluate
            top_n: Maximum number of results to return
            min_score: Minimum score threshold (0-100)

        Returns:
            List of MatchResult objects, sorted by score (descending)
        """
        results = []

        for candidate in candidate_deals:
            # Skip if same deal
            if candidate.id == target_deal.id:
                continue

            # Calculate component scores
            industry_score = self._calculate_industry_match(
                deal_industry=candidate.industry,
                criteria_industries=criteria.industries,
            )

            size_score = self._calculate_size_match(
                deal_size=candidate.deal_size,
                min_size=criteria.min_deal_size,
                max_size=criteria.max_deal_size,
            )

            geography_score = self._calculate_geography_match(
                deal_geography=getattr(candidate, "geography", None),
                criteria_geographies=criteria.geographies,
            )

            # Semantic similarity for descriptions
            description_score = 0.5  # Default
            if target_deal.description and candidate.description:
                description_score = await self._calculate_semantic_similarity(
                    text1=target_deal.description,
                    text2=candidate.description,
                )

            # Calculate weighted total score
            component_scores = {
                "industry": industry_score,
                "size": size_score,
                "geography": geography_score,
                "description": description_score,
            }

            total_score = self._calculate_weighted_score(
                component_scores=component_scores,
                weights=criteria.weights,
            )

            # Convert to 0-100 scale
            total_score_100 = total_score * 100

            # Filter by minimum score
            if total_score_100 < min_score:
                continue

            # Determine confidence
            confidence = self._determine_confidence_level(total_score_100)

            # Build explanation
            explanation = {
                "industry_match": {
                    "score": industry_score,
                    "reason": f"Industry '{candidate.industry}' vs criteria {criteria.industries}",
                },
                "size_match": {
                    "score": size_score,
                    "reason": f"Deal size {candidate.deal_size} vs range {criteria.min_deal_size}-{criteria.max_deal_size}",
                },
                "geography_match": {
                    "score": geography_score,
                    "reason": f"Geography match analysis",
                },
                "description_match": {
                    "score": description_score,
                    "reason": f"Semantic similarity: {description_score:.2f}",
                },
            }

            # Create result
            result = MatchResult(
                deal=candidate,
                score=total_score_100,
                confidence=confidence,
                explanation=explanation,
            )
            results.append(result)

        # Sort by score (descending) and limit to top_n
        results.sort(key=lambda x: x.score, reverse=True)
        return results[:top_n] if top_n else results
