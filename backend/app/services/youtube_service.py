"""YouTube integration service for DEV-016 Podcast Studio."""
from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping, Sequence

try:  # Optional dependency; patched in tests.
    from googleapiclient.discovery import build  # type: ignore
    from googleapiclient.http import MediaFileUpload  # type: ignore[arg-type]
except ModuleNotFoundError:  # pragma: no cover - optional dependency
    build = None  # type: ignore[assignment]
    MediaFileUpload = None  # type: ignore[assignment]

from app.core.subscription import SubscriptionTier
from app.services.entitlement_service import check_feature_access, get_required_tier

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class VideoUpload:
    """Payload for uploading a podcast video to YouTube."""

    title: str
    description: str
    file_path: str


async def upload_video(
    *,
    data: Mapping[str, Any],
    organization_id: str,
    user_tier: SubscriptionTier,
) -> str:
    """Upload a podcast video to YouTube for Premium+ tenants.

    Args:
        data: Mapping containing `title`, `description`, `file_path`
        organization_id: Tenant identifier
        user_tier: Subscription tier of current user (used for additional messaging)

    Returns:
        str: YouTube video identifier

    Raises:
        PermissionError: When organization lacks `youtube_integration` entitlement
        RuntimeError: When YouTube client cannot be initialised (missing deps/creds)
    """

    has_access = await check_feature_access(organization_id, "youtube_integration")
    if not has_access:
        required_tier = get_required_tier("youtube_integration")
        raise PermissionError(
            f"{required_tier.value.title()} tier required to unlock YouTube integration."
        )

    payload = _coerce_payload(data)
    client = await _youtube_client()

    videos_resource = await _ensure_coroutine(client.videos())
    metadata = generate_video_metadata(
        title=payload.title,
        description=payload.description,
        tags=data.get("tags"),
        category_id=data.get("category_id"),
    )

    insert_request = await _ensure_coroutine(
        videos_resource.insert(
            part="snippet,status",
            body={
                "snippet": metadata,
                "status": {"privacyStatus": "private"},
            },
            media_body=_media_upload(payload.file_path),
        )
    )

    response = await _ensure_coroutine(insert_request.execute())
    video_id = response.get("id")
    if not video_id:
        raise RuntimeError("YouTube API did not return a video id")

    logger.info(
        "Uploaded podcast video to YouTube",
        extra={"organization_id": organization_id, "video_id": video_id},
    )
    return video_id


def _coerce_payload(data: Mapping[str, Any]) -> VideoUpload:
    try:
        return VideoUpload(
            title=str(data["title"]),
            description=str(data.get("description", "")),
            file_path=str(data["file_path"]),
        )
    except KeyError as exc:  # pragma: no cover - defensive branch
        raise ValueError("Missing required video upload fields") from exc


async def _youtube_client() -> Any:
    """Return a lazily created YouTube client (awaitable for easy patching)."""

    if build is None:  # pragma: no cover - optional dependency
        raise RuntimeError(
            "googleapiclient is not installed. Install optional integration dependencies to enable YouTube uploads."
        )

    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, lambda: build("youtube", "v3", credentials=None))


async def _ensure_coroutine(value: Any) -> Any:
    """Await value when it's awaitable; otherwise return synchronously."""

    if asyncio.iscoroutine(value) or isinstance(value, asyncio.Future):
        return await value
    return value


def _media_upload(file_path: str) -> Any:
    """Create a media upload helper; patched in tests."""

    resolved = Path(file_path)
    if MediaFileUpload is None:  # pragma: no cover - optional dependency
        return resolved
    return MediaFileUpload(str(resolved), chunksize=-1, resumable=True)


__all__ = ["upload_video"]


def generate_video_metadata(
    *,
    title: str,
    description: str,
    tags: Sequence[str] | None = None,
    category_id: str | None = None,
) -> dict[str, Any]:
    """Generate YouTube snippet payload with sensible defaults."""

    snippet: dict[str, Any] = {
        "title": title.strip() or "Podcast Episode",
        "description": description.strip(),
    }

    if tags:
        snippet["tags"] = [tag.strip() for tag in tags if tag.strip()]

    if category_id:
        snippet["categoryId"] = category_id
    else:
        snippet["categoryId"] = "22"  # People & Blogs default

    if not snippet.get("description"):
        snippet["description"] = "Uploaded from ApexDeliver Podcast Studio"

    return snippet
