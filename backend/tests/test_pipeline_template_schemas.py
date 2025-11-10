"""Tests for pipeline template schemas."""
from pydantic import ValidationError

from app.schemas.pipeline_template import (
    PipelineTemplateCreate,
    PipelineTemplateStageCreate,
)


def test_stage_color_normalizes_to_uppercase_hex():
    stage = PipelineTemplateStageCreate(name="Prospecting", order_index=1, color="ff00aa")

    assert stage.color == "#FF00AA"


def test_stage_color_without_hash_gets_hash_prefix():
    stage = PipelineTemplateStageCreate(name="Closed", order_index=2, color="00ff00")

    assert stage.color == "#00FF00"


def test_stage_color_with_hash_preserves_hash_and_uppercases():
    stage = PipelineTemplateStageCreate(name="Negotiation", order_index=3, color="#12ab34")

    assert stage.color == "#12AB34"


def test_template_requires_at_least_one_stage():
    try:
        PipelineTemplateCreate(name="Enterprise", stages=[])
    except ValidationError as exc:  # pragma: no cover - explicit assertion below
        errors = exc.errors()
    else:  # pragma: no cover - should not happen
        raise AssertionError("Template creation should have raised ValidationError")

    assert errors[0]["msg"] == "At least one stage is required"
