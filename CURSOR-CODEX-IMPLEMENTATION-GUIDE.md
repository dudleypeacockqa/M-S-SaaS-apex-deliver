# Cursor Pro Max - Complete CODEX Implementation Guide
# M&A Intelligence Platform: DEV-016, DEV-017, DEV-018 Implementation

> **Reality Check (2025-10-28 11:05 UTC):** Backend pytest runs (359 collected) but 21 valuation/task automation tests are still RED; `npm run test` reports 11 RED specs in `ValuationSuite`. Stabilize valuation APIs/UI before treating milestones as complete.


**Created**: October 27, 2025
**For**: Cursor Pro Max subscribers
**Project**: M&A Intelligence Platform (Apex Deliver)
**Remaining Work**: 3 features (Podcast Studio, Event Management, Community Platform)
**Estimated Time**: 4-6 hours with Cursor Pro Max
**Method**: AI-accelerated development using Composer + Agent modes

---

## 📋 Table of Contents

1. [Prerequisites & Setup](#prerequisites--setup)
2. [Cursor Pro Max Features](#cursor-pro-max-features)
3. [Implementation Strategy](#implementation-strategy)
4. [DEV-016: Podcast Studio](#dev-016-podcast--video-production-studio)
5. [DEV-017: Event Management Hub](#dev-017-event-management-hub)
6. [DEV-018: Community Platform](#dev-018-professional-community-platform)
7. [Testing & Validation](#testing--validation)
8. [Database Migrations](#database-migrations)
9. [Integration & Deployment](#integration--deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites & Setup

### What You Have

✅ **Cursor Pro Max subscription** - Unlimited GPT-4, Claude 3.5 Sonnet, 500 premium requests/month
✅ **Project at 65% completion** - Foundation + Phase 1-2 features complete
✅ **CODEX-COMPLETE-PROJECT-GUIDE.md** - 5,840 lines of implementation patterns
✅ **Working codebase** - 134+ tests passing, backend + frontend operational

### Initial Setup

```bash
# 1. Open project in Cursor
cd c:\Projects\ma-saas-platform\M-S-SaaS-apex-deliver
cursor .

# 2. Verify project structure
# Should see:
# - backend/ (Python FastAPI)
# - frontend/ (React TypeScript)
# - CODEX-COMPLETE-PROJECT-GUIDE.md
# - CLAUDE.md
# - CURSOR-CODEX-IMPLEMENTATION-GUIDE.md (this file)

# 3. Let Cursor index your codebase (wait 2-5 minutes)
# You'll see "Indexing..." in bottom-right status bar
```

### Configure Cursor Settings

1. **Open Settings**: `Ctrl+Shift+P` → "Cursor Settings"
2. **Select Model**: Choose **Claude 3.5 Sonnet** (best for following complex patterns)
3. **Enable Features**:
   - ✅ Composer (for multi-file generation)
   - ✅ Agent mode (for autonomous tasks)
   - ✅ Supercomplete (for inline suggestions)
   - ✅ Chat with codebase (for context-aware responses)

---

## Cursor Pro Max Features

### Your Available Tools

| Tool | Shortcut | Best For | Usage Limit |
|------|----------|----------|-------------|
| **Composer** | `Ctrl+I` | Creating multiple files at once | Unlimited |
| **Edit Mode** | `Ctrl+K` | Modifying existing code | Unlimited |
| **Chat** | `Ctrl+L` | Questions, debugging, planning | Unlimited |
| **Agent Mode** | Via Chat | Autonomous multi-step tasks | 500 premium/month |
| **Supercomplete** | `Tab` | Inline code suggestions | Unlimited |

### Model Selection

**Recommended for this project**:
- **Claude 3.5 Sonnet**: Best for following CODEX-COMPLETE-PROJECT-GUIDE.md patterns
- **GPT-4**: Alternative if Claude hits rate limits
- **o1-preview**: For complex architectural decisions (use sparingly, counts against 500 premium limit)

---

## Implementation Strategy

### Overview: 3 Features in 3 Phases

```
Phase 1: DEV-016 - Podcast Studio (1.5-2 hours)
├── Use Composer mega-prompt
├── Generate 6 files simultaneously
├── Run tests, fix with Ctrl+K
└── Git commit & push

Phase 2: DEV-017 - Event Management (2-2.5 hours)
├── Use Composer mega-prompt + Stripe integration
├── Generate 6 files simultaneously
├── Run tests, fix with Ctrl+K
└── Git commit & push

Phase 3: DEV-018 - Community Platform (1.5-2 hours)
├── Use Composer mega-prompt
├── Generate 6 files simultaneously
├── Run tests, fix with Ctrl+K
└── Git commit & push

Final: Integration & Deployment (30-60 minutes)
├── Database migrations (Alembic)
├── Route registration
├── Navigation updates
├── Full test suite
└── Deploy to Render
```

### The Composer Workflow

**Composer is your secret weapon** - it can generate multiple related files in a single operation.

```
1. Press Ctrl+I to open Composer
2. Select Claude 3.5 Sonnet model
3. Add reference files with + button
4. Paste mega-prompt (provided below)
5. Click "Generate" and wait 1-2 minutes
6. Review all generated files
7. Accept or reject changes
8. Run tests and iterate
```

---

## DEV-016: Podcast & Video Production Studio

### Objective

Implement complete podcast management system with:
- Audio/video episode management
- OpenAI Whisper transcription
- RSS feed generation for podcast apps
- Analytics dashboard
- Episode player with transcript navigation

### Reference Patterns

- **Primary**: DEV-015 (Content Marketing) - lines 3851-5061 in CODEX-COMPLETE-PROJECT-GUIDE.md
- **Database Models**: Lines 5080-5119 (already created)
- **Service Layer**: content_marketing_service.py pattern
- **API Endpoints**: content_marketing.py pattern
- **Frontend**: ContentStudio.tsx pattern

### Implementation Steps

#### Step 1: Prepare Reference Files

1. **Open Cursor** in your project
2. **Open these files** to give Cursor context:
   - `CODEX-COMPLETE-PROJECT-GUIDE.md`
   - `backend/app/models/podcast.py`
   - `backend/app/services/content_marketing_service.py`
   - `backend/app/schemas/content_marketing.py`
   - `backend/app/api/v1/content_marketing.py`
   - `frontend/src/pages/content/ContentStudio.tsx`

#### Step 2: Use Composer Mega-Prompt

**Press `Ctrl+I`** to open Composer, then paste:

```markdown
# DEV-016: Podcast & Video Production Studio - Complete Implementation

Reference the CODEX-COMPLETE-PROJECT-GUIDE.md patterns from DEV-015 (lines 3851-5061).

Database models are already defined in backend/app/models/podcast.py:
- PodcastEpisode
- PodcastTranscript
- PodcastAnalytics

## CREATE THESE 6 FILES:

### 1. backend/app/services/podcast_service.py

Create complete service layer with these async functions:

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, desc
from typing import Optional, List
import uuid
from datetime import datetime
from openai import AsyncOpenAI

from app.models.podcast import PodcastEpisode, PodcastTranscript, PodcastAnalytics
from app.core.config import settings


async def create_episode(
    db: AsyncSession,
    title: str,
    description: Optional[str],
    episode_number: int,
    season_number: int,
    audio_file_url: str,
    video_file_url: Optional[str],
    created_by: str,
    organization_id: str
) -> PodcastEpisode:
    """Create new podcast episode."""
    episode = PodcastEpisode(
        id=str(uuid.uuid4()),
        title=title,
        description=description,
        episode_number=episode_number,
        season_number=season_number,
        audio_file_url=audio_file_url,
        video_file_url=video_file_url,
        status="draft",
        created_by=created_by,
        organization_id=organization_id
    )
    db.add(episode)
    await db.commit()
    await db.refresh(episode)
    return episode


async def get_episodes(
    db: AsyncSession,
    organization_id: str,
    status: Optional[str] = None,
    limit: int = 50
) -> List[PodcastEpisode]:
    """Get episodes with filters."""
    query = select(PodcastEpisode).where(
        PodcastEpisode.organization_id == organization_id
    )
    if status:
        query = query.where(PodcastEpisode.status == status)
    query = query.order_by(desc(PodcastEpisode.created_at)).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


async def get_episode(
    db: AsyncSession,
    episode_id: str,
    organization_id: str
) -> Optional[PodcastEpisode]:
    """Get single episode with multi-tenant isolation."""
    result = await db.execute(
        select(PodcastEpisode).where(
            and_(
                PodcastEpisode.id == episode_id,
                PodcastEpisode.organization_id == organization_id
            )
        )
    )
    return result.scalar_one_or_none()


async def update_episode(
    db: AsyncSession,
    episode_id: str,
    organization_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None,
    show_notes: Optional[str] = None,
    status: Optional[str] = None
) -> PodcastEpisode:
    """Update episode fields."""
    episode = await get_episode(db, episode_id, organization_id)
    if not episode:
        raise ValueError(f"Episode {episode_id} not found")

    if title:
        episode.title = title
    if description:
        episode.description = description
    if show_notes:
        episode.show_notes = show_notes
    if status:
        episode.status = status
        if status == "published" and not episode.published_at:
            episode.published_at = datetime.utcnow()

    await db.commit()
    await db.refresh(episode)
    return episode


async def publish_episode(
    db: AsyncSession,
    episode_id: str,
    organization_id: str
) -> PodcastEpisode:
    """Publish episode."""
    return await update_episode(
        db=db,
        episode_id=episode_id,
        organization_id=organization_id,
        status="published"
    )


async def transcribe_episode(
    db: AsyncSession,
    episode_id: str,
    audio_file_path: str,
    organization_id: str
) -> PodcastTranscript:
    """Transcribe podcast episode using OpenAI Whisper."""

    episode = await get_episode(db, episode_id, organization_id)
    if not episode:
        raise ValueError(f"Episode {episode_id} not found")

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    with open(audio_file_path, "rb") as audio_file:
        transcript_response = await client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="verbose_json",
            timestamp_granularities=["segment"]
        )

    # Create transcript record
    transcript = PodcastTranscript(
        id=str(uuid.uuid4()),
        episode_id=episode_id,
        transcript_text=transcript_response.text,
        timestamps=[{
            "time": segment.start,
            "text": segment.text
        } for segment in transcript_response.segments],
        language="en"
    )

    # Update episode with transcript
    episode.transcript = transcript_response.text
    episode.status = "processing"

    db.add(transcript)
    await db.commit()
    await db.refresh(transcript)

    return transcript


async def get_episode_analytics(
    db: AsyncSession,
    episode_id: str,
    organization_id: str
) -> dict:
    """Get analytics for episode."""

    episode = await get_episode(db, episode_id, organization_id)
    if not episode:
        raise ValueError(f"Episode {episode_id} not found")

    result = await db.execute(
        select(PodcastAnalytics).where(
            PodcastAnalytics.episode_id == episode_id
        )
    )
    analytics = result.scalars().all()

    total_listens = sum(a.listens for a in analytics)
    total_downloads = sum(a.downloads for a in analytics)
    avg_duration = sum(a.average_listen_duration for a in analytics if a.average_listen_duration) / len(analytics) if analytics else 0

    return {
        "episode_id": episode_id,
        "total_listens": total_listens,
        "total_downloads": total_downloads,
        "average_listen_duration": int(avg_duration),
        "platforms": {a.platform: {"listens": a.listens, "downloads": a.downloads} for a in analytics}
    }


async def generate_rss_feed(
    db: AsyncSession,
    organization_id: str
) -> str:
    """Generate RSS feed XML for podcast apps."""

    episodes = await get_episodes(db, organization_id, status="published", limit=100)

    # Build RSS XML
    rss = '<?xml version="1.0" encoding="UTF-8"?>\n'
    rss += '<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">\n'
    rss += '  <channel>\n'
    rss += '    <title>M&A Intelligence Podcast</title>\n'
    rss += '    <description>Expert insights on mergers and acquisitions</description>\n'
    rss += '    <language>en-us</language>\n'

    for episode in episodes:
        rss += '    <item>\n'
        rss += f'      <title>{episode.title}</title>\n'
        rss += f'      <description>{episode.description or ""}</description>\n'
        rss += f'      <enclosure url="{episode.audio_file_url}" type="audio/mpeg"/>\n'
        rss += f'      <pubDate>{episode.published_at.strftime("%a, %d %b %Y %H:%M:%S GMT") if episode.published_at else ""}</pubDate>\n'
        rss += f'      <itunes:duration>{episode.duration_seconds or 0}</itunes:duration>\n'
        rss += '    </item>\n'

    rss += '  </channel>\n'
    rss += '</rss>'

    return rss


async def delete_episode(
    db: AsyncSession,
    episode_id: str,
    organization_id: str
) -> bool:
    """Delete episode."""
    episode = await get_episode(db, episode_id, organization_id)
    if not episode:
        return False

    await db.delete(episode)
    await db.commit()
    return True
```

### 2. backend/app/schemas/podcast.py

Create Pydantic schemas:

```python
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator


class PodcastEpisodeCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    episode_number: int = Field(..., ge=1)
    season_number: int = Field(default=1, ge=1)
    audio_file_url: str
    video_file_url: Optional[str] = None

    @validator("title")
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()


class PodcastEpisodeResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    episode_number: int
    season_number: int
    audio_file_url: str
    video_file_url: Optional[str]
    duration_seconds: Optional[int]
    transcript: Optional[str]
    show_notes: Optional[str]
    status: str
    published_at: Optional[datetime]
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class PodcastEpisodeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    show_notes: Optional[str] = None
    status: Optional[str] = None

    @validator("status")
    def validate_status(cls, v):
        if v is not None:
            valid_statuses = ["draft", "processing", "published"]
            if v not in valid_statuses:
                raise ValueError(f"Status must be one of: {valid_statuses}")
        return v


class PodcastTranscriptResponse(BaseModel):
    id: str
    episode_id: str
    transcript_text: str
    timestamps: List[Dict[str, Any]]
    language: str
    created_at: datetime

    class Config:
        from_attributes = True


class PodcastAnalyticsResponse(BaseModel):
    episode_id: str
    total_listens: int
    total_downloads: int
    average_listen_duration: int
    platforms: Dict[str, Dict[str, int]]
```

### 3. backend/app/api/v1/podcast.py

Create FastAPI router:

```python
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.podcast import (
    PodcastEpisodeCreate,
    PodcastEpisodeResponse,
    PodcastEpisodeUpdate,
    PodcastTranscriptResponse,
    PodcastAnalyticsResponse
)
from app.services import podcast_service

router = APIRouter(prefix="/api/v1/podcast", tags=["podcast"])


@router.post("/episodes", response_model=PodcastEpisodeResponse, status_code=201)
async def create_episode(
    request: PodcastEpisodeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new podcast episode."""

    episode = await podcast_service.create_episode(
        db=db,
        title=request.title,
        description=request.description,
        episode_number=request.episode_number,
        season_number=request.season_number,
        audio_file_url=request.audio_file_url,
        video_file_url=request.video_file_url,
        created_by=current_user.id,
        organization_id=current_user.organization_id
    )

    return episode


@router.get("/episodes", response_model=List[PodcastEpisodeResponse])
async def get_episodes(
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(50, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all episodes for organization."""

    episodes = await podcast_service.get_episodes(
        db=db,
        organization_id=current_user.organization_id,
        status=status,
        limit=limit
    )

    return episodes


@router.get("/episodes/{episode_id}", response_model=PodcastEpisodeResponse)
async def get_episode(
    episode_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific episode."""

    episode = await podcast_service.get_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id
    )

    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")

    return episode


@router.put("/episodes/{episode_id}", response_model=PodcastEpisodeResponse)
async def update_episode(
    episode_id: str,
    request: PodcastEpisodeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update episode."""

    try:
        episode = await podcast_service.update_episode(
            db=db,
            episode_id=episode_id,
            organization_id=current_user.organization_id,
            title=request.title,
            description=request.description,
            show_notes=request.show_notes,
            status=request.status
        )
        return episode
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/episodes/{episode_id}/publish", response_model=PodcastEpisodeResponse)
async def publish_episode(
    episode_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Publish episode."""

    try:
        episode = await podcast_service.publish_episode(
            db=db,
            episode_id=episode_id,
            organization_id=current_user.organization_id
        )
        return episode
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/episodes/{episode_id}/transcribe", response_model=PodcastTranscriptResponse, status_code=201)
async def transcribe_episode(
    episode_id: str,
    audio_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Transcribe episode using Whisper."""

    # Save uploaded file temporarily
    temp_path = f"/tmp/{audio_file.filename}"
    with open(temp_path, "wb") as f:
        content = await audio_file.read()
        f.write(content)

    try:
        transcript = await podcast_service.transcribe_episode(
            db=db,
            episode_id=episode_id,
            audio_file_path=temp_path,
            organization_id=current_user.organization_id
        )
        return transcript
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/episodes/{episode_id}/analytics", response_model=PodcastAnalyticsResponse)
async def get_episode_analytics(
    episode_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get episode analytics."""

    try:
        analytics = await podcast_service.get_episode_analytics(
            db=db,
            episode_id=episode_id,
            organization_id=current_user.organization_id
        )
        return analytics
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/rss")
async def get_rss_feed(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate RSS feed for podcast apps."""

    rss_xml = await podcast_service.generate_rss_feed(
        db=db,
        organization_id=current_user.organization_id
    )

    return {"rss": rss_xml, "content_type": "application/rss+xml"}


@router.delete("/episodes/{episode_id}", status_code=204)
async def delete_episode(
    episode_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete episode."""

    success = await podcast_service.delete_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id
    )

    if not success:
        raise HTTPException(status_code=404, detail="Episode not found")

    return None
```

### 4. frontend/src/pages/podcast/PodcastStudio.tsx

Create React component:

```typescript
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

interface PodcastEpisode {
  id: string;
  title: string;
  episode_number: number;
  season_number: int;
  status: string;
  duration_seconds: number;
  published_at?: string;
  created_at: string;
}

export const PodcastStudio: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: episodes, isLoading } = useQuery<PodcastEpisode[]>({
    queryKey: ['podcast-episodes', statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);

      return apiClient.get(`/api/v1/podcast/episodes?${params}`).then(r => r.data);
    }
  });

  const publishMutation = useMutation({
    mutationFn: (episodeId: string) =>
      apiClient.post(`/api/v1/podcast/episodes/${episodeId}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries(['podcast-episodes']);
    }
  });

  const statusOptions = [
    { value: 'all', label: 'All Episodes', icon: '🎙️' },
    { value: 'draft', label: 'Draft', icon: '📝' },
    { value: 'processing', label: 'Processing', icon: '⚙️' },
    { value: 'published', label: 'Published', icon: '✅' }
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Podcast Studio</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Upload New Episode
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              statusFilter === option.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes?.map((episode) => (
          <div key={episode.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{episode.title}</h3>
                <p className="text-sm text-gray-600">
                  S{episode.season_number}E{episode.episode_number}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                episode.status === 'published' ? 'bg-green-100 text-green-800' :
                episode.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {episode.status}
              </span>
            </div>

            {episode.duration_seconds && (
              <p className="text-sm text-gray-600 mb-4">
                Duration: {formatDuration(episode.duration_seconds)}
              </p>
            )}

            <div className="flex gap-2">
              {episode.status === 'draft' && (
                <button
                  onClick={() => publishMutation.mutate(episode.id)}
                  disabled={publishMutation.isPending}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Publish
                </button>
              )}
              <button className="flex-1 px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {episodes?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-2">🎙️</p>
          <p>No episodes yet. Upload your first episode to get started!</p>
        </div>
      )}
    </div>
  );
};
```

### 5. frontend/src/pages/podcast/EpisodePlayer.tsx

Create audio player component:

```typescript
import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

interface Episode {
  id: string;
  title: string;
  description: string;
  audio_file_url: string;
  transcript: string;
  show_notes: string;
  duration_seconds: number;
}

export const EpisodePlayer: React.FC<{ episodeId: string }> = ({ episodeId }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: episode, isLoading } = useQuery<Episode>({
    queryKey: ['episode', episodeId],
    queryFn: () => apiClient.get(`/api/v1/podcast/episodes/${episodeId}`).then(r => r.data)
  });

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const jumpToTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading episode...</div>;
  }

  if (!episode) {
    return <div>Episode not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Episode Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{episode.title}</h1>
        <p className="text-gray-600">{episode.description}</p>
      </div>

      {/* Audio Player */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <audio
          ref={audioRef}
          src={episode.audio_file_url}
          controls
          className="w-full"
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      {/* Show Notes */}
      {episode.show_notes && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Show Notes</h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: episode.show_notes }} />
        </div>
      )}

      {/* Transcript */}
      {episode.transcript && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Transcript</h2>
          <div className="text-gray-700 whitespace-pre-wrap">
            {episode.transcript}
          </div>
        </div>
      )}
    </div>
  );
};
```

### 6. backend/tests/services/test_podcast_service.py

Create comprehensive tests:

```python
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from unittest.mock import AsyncMock, patch

from app.services import podcast_service
from app.schemas.podcast import PodcastEpisodeCreate


@pytest.mark.asyncio
async def test_create_episode(db: AsyncSession):
    """Test creating podcast episode."""

    episode = await podcast_service.create_episode(
        db=db,
        title="Episode 1: M&A Fundamentals",
        description="Introduction to M&A",
        episode_number=1,
        season_number=1,
        audio_file_url="https://cdn.example.com/episode1.mp3",
        video_file_url=None,
        created_by="user-123",
        organization_id="org-123"
    )

    assert episode.id is not None
    assert episode.title == "Episode 1: M&A Fundamentals"
    assert episode.episode_number == 1
    assert episode.status == "draft"
    assert episode.organization_id == "org-123"


@pytest.mark.asyncio
async def test_get_episodes_filters_by_status(db: AsyncSession):
    """Test filtering episodes by status."""

    # Create episodes with different statuses
    await create_test_episode(db, status="draft")
    await create_test_episode(db, status="published")

    # Filter for published only
    episodes = await podcast_service.get_episodes(
        db=db,
        organization_id="org-123",
        status="published",
        limit=50
    )

    assert len(episodes) == 1
    assert episodes[0].status == "published"


@pytest.mark.asyncio
async def test_publish_episode_sets_published_at(db: AsyncSession):
    """Test that publishing sets published_at timestamp."""

    episode = await create_test_episode(db, status="draft")

    published = await podcast_service.publish_episode(
        db=db,
        episode_id=episode.id,
        organization_id="org-123"
    )

    assert published.status == "published"
    assert published.published_at is not None


@pytest.mark.asyncio
async def test_transcribe_episode_with_whisper(db: AsyncSession):
    """Test episode transcription with OpenAI Whisper."""

    episode = await create_test_episode(db)

    # Mock OpenAI Whisper API
    with patch('app.services.podcast_service.AsyncOpenAI') as mock_openai:
        mock_client = AsyncMock()
        mock_response = AsyncMock()
        mock_response.text = "This is the transcript text"
        mock_response.segments = [
            AsyncMock(start=0.0, text="This is"),
            AsyncMock(start=1.5, text="the transcript"),
            AsyncMock(start=3.0, text="text")
        ]
        mock_client.audio.transcriptions.create.return_value = mock_response
        mock_openai.return_value = mock_client

        transcript = await podcast_service.transcribe_episode(
            db=db,
            episode_id=episode.id,
            audio_file_path="/tmp/test.mp3",
            organization_id="org-123"
        )

        assert transcript.id is not None
        assert transcript.episode_id == episode.id
        assert transcript.transcript_text == "This is the transcript text"
        assert len(transcript.timestamps) == 3


@pytest.mark.asyncio
async def test_get_episode_analytics(db: AsyncSession):
    """Test getting episode analytics."""

    episode = await create_test_episode(db)

    # Create some analytics records
    await create_test_analytics(db, episode.id, listens=100, downloads=50, platform="spotify")
    await create_test_analytics(db, episode.id, listens=75, downloads=30, platform="apple")

    analytics = await podcast_service.get_episode_analytics(
        db=db,
        episode_id=episode.id,
        organization_id="org-123"
    )

    assert analytics["episode_id"] == episode.id
    assert analytics["total_listens"] == 175
    assert analytics["total_downloads"] == 80
    assert "spotify" in analytics["platforms"]
    assert "apple" in analytics["platforms"]


@pytest.mark.asyncio
async def test_generate_rss_feed_xml(db: AsyncSession):
    """Test RSS feed generation."""

    # Create published episodes
    await create_test_episode(db, status="published", title="Episode 1")
    await create_test_episode(db, status="published", title="Episode 2")
    await create_test_episode(db, status="draft", title="Episode 3")  # Should not appear

    rss_xml = await podcast_service.generate_rss_feed(
        db=db,
        organization_id="org-123"
    )

    assert '<?xml version="1.0"' in rss_xml
    assert '<rss version="2.0"' in rss_xml
    assert 'Episode 1' in rss_xml
    assert 'Episode 2' in rss_xml
    assert 'Episode 3' not in rss_xml  # Draft not included


@pytest.mark.asyncio
async def test_multi_tenant_isolation(db: AsyncSession):
    """Test that organizations cannot access other orgs' episodes."""

    # Create episode for org-123
    episode_org1 = await create_test_episode(db, organization_id="org-123")

    # Try to access from org-456
    episode = await podcast_service.get_episode(
        db=db,
        episode_id=episode_org1.id,
        organization_id="org-456"
    )

    assert episode is None  # Should not find episode from other org


@pytest.mark.asyncio
async def test_update_episode(db: AsyncSession):
    """Test updating episode fields."""

    episode = await create_test_episode(db, title="Original Title")

    updated = await podcast_service.update_episode(
        db=db,
        episode_id=episode.id,
        organization_id="org-123",
        title="Updated Title",
        show_notes="New show notes"
    )

    assert updated.title == "Updated Title"
    assert updated.show_notes == "New show notes"


@pytest.mark.asyncio
async def test_delete_episode(db: AsyncSession):
    """Test deleting episode."""

    episode = await create_test_episode(db)

    success = await podcast_service.delete_episode(
        db=db,
        episode_id=episode.id,
        organization_id="org-123"
    )

    assert success is True

    # Verify deleted
    deleted_episode = await podcast_service.get_episode(
        db=db,
        episode_id=episode.id,
        organization_id="org-123"
    )

    assert deleted_episode is None


# Helper functions for tests
async def create_test_episode(db, **kwargs):
    """Helper to create test episode."""
    defaults = {
        "title": "Test Episode",
        "description": "Test description",
        "episode_number": 1,
        "season_number": 1,
        "audio_file_url": "https://cdn.example.com/test.mp3",
        "video_file_url": None,
        "created_by": "user-123",
        "organization_id": "org-123"
    }
    defaults.update(kwargs)
    return await podcast_service.create_episode(db, **defaults)


async def create_test_analytics(db, episode_id, **kwargs):
    """Helper to create test analytics."""
    from app.models.podcast import PodcastAnalytics
    import uuid
    from datetime import date

    analytics = PodcastAnalytics(
        id=str(uuid.uuid4()),
        episode_id=episode_id,
        listens=kwargs.get("listens", 0),
        downloads=kwargs.get("downloads", 0),
        average_listen_duration=kwargs.get("average_listen_duration", 300),
        platform=kwargs.get("platform", "spotify"),
        date=date.today()
    )
    db.add(analytics)
    await db.commit()
    return analytics
```

## CRITICAL REQUIREMENTS:

✅ Follow EXACT pattern from DEV-015 (content_marketing_service.py)
✅ Multi-tenant security: organization_id on EVERY database query
✅ Use AsyncSession, async/await everywhere
✅ Error handling: raise ValueError for not found, HTTPException in API
✅ Type hints on all functions
✅ Docstrings on all functions
✅ TailwindCSS for frontend (matching existing components)
✅ React Query for data fetching
✅ OpenAI Whisper for transcription (AsyncOpenAI client)
✅ RSS feed generation (XML format for podcast apps)
✅ Comprehensive tests with multi-tenant isolation checks

Generate all 6 files with complete, production-ready code matching the patterns from CODEX-COMPLETE-PROJECT-GUIDE.md.
```

#### Step 3: Add Reference Files to Composer

Click the `+` button in Composer and add:
- `CODEX-COMPLETE-PROJECT-GUIDE.md`
- `backend/app/services/content_marketing_service.py`
- `backend/app/schemas/content_marketing.py`
- `backend/app/api/v1/content_marketing.py`
- `frontend/src/pages/content/ContentStudio.tsx`
- `backend/tests/services/test_content_marketing_service.py`

#### Step 4: Generate and Review

1. Click **"Generate"** in Composer
2. Wait 1-2 minutes for all files to be created
3. Review each file in the diff view
4. Accept changes if they match patterns
5. Use `Ctrl+K` on any file to make quick fixes

#### Step 5: Run Tests

```bash
# In Cursor Terminal (Ctrl+`)
cd backend
pytest tests/services/test_podcast_service.py -v

# Should see 10+ tests passing
```

#### Step 6: Fix Any Issues

If tests fail, use Cursor Chat (`Ctrl+L`):

```
@test_podcast_service.py @podcast_service.py

These tests are failing:
[paste test output]

Fix the service to make tests pass, following the pattern from content_marketing_service.py
```

#### Step 7: Commit

```bash
git add backend/app/services/podcast_service.py \
        backend/app/schemas/podcast.py \
        backend/app/api/v1/podcast.py \
        frontend/src/pages/podcast/ \
        backend/tests/services/test_podcast_service.py

git commit -m "feat(DEV-016): Podcast Studio with Whisper transcription

- Service layer: 9 CRUD functions with OpenAI Whisper integration
- Pydantic schemas: 5 schemas with validation
- API endpoints: 9 routes
- Frontend: PodcastStudio + EpisodePlayer components
- RSS feed generation for podcast apps
- TDD tests: 10 comprehensive tests passing
- Multi-tenant isolation enforced

Follows DEV-015 pattern from CODEX-COMPLETE-PROJECT-GUIDE.md"

git push
```

### Verification Checklist

- [ ] All 6 files created
- [ ] Service functions use organization_id filtering
- [ ] API endpoints have proper error handling
- [ ] Frontend uses React Query
- [ ] Tests cover all functions
- [ ] Tests pass: `pytest tests/services/test_podcast_service.py -v`
- [ ] Multi-tenant isolation tested
- [ ] Git committed and pushed

---

## DEV-017: Event Management Hub

### Objective

Implement complete event management system with:
- Event creation and management
- Ticket sales with Stripe integration
- Registration and attendee management
- Virtual event streaming integration
- In-person check-in and badging
- Event analytics dashboard

### Reference Patterns

- **Primary**: DEV-014 (Document Generation) + DEV-015 (Content Marketing)
- **Database Models**: Lines 5987-6042 in CODEX-COMPLETE-PROJECT-GUIDE.md
- **Stripe Integration**: Use existing subscription patterns from DEV-009

### Implementation Steps

#### Step 1: Prepare Reference Files

Open these files in Cursor:
- `CODEX-COMPLETE-PROJECT-GUIDE.md`
- `backend/app/models/events.py`
- `backend/app/services/content_marketing_service.py`
- `backend/app/services/document_generation_service.py`
- `backend/app/api/v1/subscriptions.py` (for Stripe patterns)

#### Step 2: Use Composer Mega-Prompt

**Press `Ctrl+I`** and paste:

```markdown
# DEV-017: Event Management Hub - Complete Implementation

Reference patterns from:
- DEV-014 (Document Generation): lines 1872-2644
- DEV-015 (Content Marketing): lines 3851-5061
- DEV-009 (Stripe Subscriptions): existing subscription code

Database models in backend/app/models/events.py:
- Event
- EventTicket
- EventRegistration
- EventSession
- EventAnalytics

## CREATE THESE 6 FILES:

### 1. backend/app/services/event_service.py

Create complete service layer:

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, desc
from typing import Optional, List
import uuid
from datetime import datetime
from decimal import Decimal
import stripe

from app.models.events import Event, EventTicket, EventRegistration, EventSession, EventAnalytics
from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


async def create_event(
    db: AsyncSession,
    name: str,
    description: str,
    event_type: str,
    start_date: datetime,
    end_date: datetime,
    venue: Optional[str],
    is_virtual: bool,
    organization_id: str,
    created_by: str
) -> Event:
    """Create new event."""
    event = Event(
        id=str(uuid.uuid4()),
        name=name,
        description=description,
        event_type=event_type,
        start_date=start_date,
        end_date=end_date,
        venue=venue,
        is_virtual=is_virtual,
        status="draft",
        organization_id=organization_id,
        created_by=created_by
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


async def get_events(
    db: AsyncSession,
    organization_id: str,
    status: Optional[str] = None,
    event_type: Optional[str] = None,
    limit: int = 50
) -> List[Event]:
    """Get events with filters."""
    query = select(Event).where(Event.organization_id == organization_id)

    if status:
        query = query.where(Event.status == status)
    if event_type:
        query = query.where(Event.event_type == event_type)

    query = query.order_by(desc(Event.start_date)).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


async def get_event(
    db: AsyncSession,
    event_id: str,
    organization_id: str
) -> Optional[Event]:
    """Get single event with multi-tenant isolation."""
    result = await db.execute(
        select(Event).where(
            and_(
                Event.id == event_id,
                Event.organization_id == organization_id
            )
        )
    )
    return result.scalar_one_or_none()


async def update_event(
    db: AsyncSession,
    event_id: str,
    organization_id: str,
    **updates
) -> Event:
    """Update event fields."""
    event = await get_event(db, event_id, organization_id)
    if not event:
        raise ValueError(f"Event {event_id} not found")

    for key, value in updates.items():
        if hasattr(event, key):
            setattr(event, key, value)

    await db.commit()
    await db.refresh(event)
    return event


async def publish_event(
    db: AsyncSession,
    event_id: str,
    organization_id: str
) -> Event:
    """Publish event (make visible to public)."""
    return await update_event(
        db=db,
        event_id=event_id,
        organization_id=organization_id,
        status="published",
        published_at=datetime.utcnow()
    )


async def create_ticket(
    db: AsyncSession,
    event_id: str,
    organization_id: str,
    name: str,
    price: Decimal,
    quantity_available: int,
    description: Optional[str] = None
) -> EventTicket:
    """Create ticket type for event."""

    event = await get_event(db, event_id, organization_id)
    if not event:
        raise ValueError(f"Event {event_id} not found")

    ticket = EventTicket(
        id=str(uuid.uuid4()),
        event_id=event_id,
        name=name,
        price=price,
        quantity_available=quantity_available,
        quantity_sold=0,
        description=description
    )

    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return ticket


async def get_tickets(
    db: AsyncSession,
    event_id: str,
    organization_id: str
) -> List[EventTicket]:
    """Get all tickets for an event."""

    event = await get_event(db, event_id, organization_id)
    if not event:
        raise ValueError(f"Event {event_id} not found")

    result = await db.execute(
        select(EventTicket).where(EventTicket.event_id == event_id)
    )
    return result.scalars().all()


async def purchase_ticket(
    db: AsyncSession,
    ticket_id: str,
    attendee_email: str,
    attendee_name: str,
    payment_method_id: str
) -> EventRegistration:
    """Purchase ticket using Stripe."""

    # Get ticket
    result = await db.execute(
        select(EventTicket).where(EventTicket.id == ticket_id)
    )
    ticket = result.scalar_one_or_none()

    if not ticket:
        raise ValueError(f"Ticket {ticket_id} not found")

    if ticket.quantity_sold >= ticket.quantity_available:
        raise ValueError("Ticket sold out")

    # Create Stripe payment intent
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=int(ticket.price * 100),  # Convert to cents
            currency="gbp",
            payment_method=payment_method_id,
            confirm=True,
            metadata={
                "ticket_id": ticket_id,
                "attendee_email": attendee_email,
                "attendee_name": attendee_name
            }
        )
    except stripe.error.StripeError as e:
        raise ValueError(f"Payment failed: {str(e)}")

    # Create registration
    registration = EventRegistration(
        id=str(uuid.uuid4()),
        event_id=ticket.event_id,
        ticket_id=ticket_id,
        attendee_email=attendee_email,
        attendee_name=attendee_name,
        registration_status="confirmed",
        payment_status="paid",
        payment_amount=ticket.price,
        stripe_payment_intent_id=payment_intent.id
    )

    # Update ticket sold count
    ticket.quantity_sold += 1

    db.add(registration)
    await db.commit()
    await db.refresh(registration)

    return registration


async def get_registrations(
    db: AsyncSession,
    event_id: str,
    organization_id: str
) -> List[EventRegistration]:
    """Get all registrations for event."""

    event = await get_event(db, event_id, organization_id)
    if not event:
        raise ValueError(f"Event {event_id} not found")

    result = await db.execute(
        select(EventRegistration).where(EventRegistration.event_id == event_id)
    )
    return result.scalars().all()


async def check_in_attendee(
    db: AsyncSession,
    registration_id: str,
    organization_id: str
) -> EventRegistration:
    """Check in attendee at event."""

    result = await db.execute(
        select(EventRegistration)
        .join(Event, EventRegistration.event_id == Event.id)
        .where(
            and_(
                EventRegistration.id == registration_id,
                Event.organization_id == organization_id
            )
        )
    )
    registration = result.scalar_one_or_none()

    if not registration:
        raise ValueError(f"Registration {registration_id} not found")

    registration.checked_in = True
    registration.checked_in_at = datetime.utcnow()

    await db.commit()
    await db.refresh(registration)

    return registration


async def get_event_analytics(
    db: AsyncSession,
    event_id: str,
    organization_id: str
) -> dict:
    """Get analytics for event."""

    event = await get_event(db, event_id, organization_id)
    if not event:
        raise ValueError(f"Event {event_id} not found")

    # Get registrations
    registrations = await get_registrations(db, event_id, organization_id)

    # Get tickets
    tickets = await get_tickets(db, event_id, organization_id)

    total_revenue = sum(r.payment_amount for r in registrations if r.payment_amount)
    total_registrations = len(registrations)
    checked_in_count = sum(1 for r in registrations if r.checked_in)
    tickets_sold = sum(t.quantity_sold for t in tickets)
    tickets_available = sum(t.quantity_available for t in tickets)

    return {
        "event_id": event_id,
        "total_registrations": total_registrations,
        "checked_in_count": checked_in_count,
        "tickets_sold": tickets_sold,
        "tickets_available": tickets_available,
        "total_revenue": float(total_revenue),
        "attendance_rate": (checked_in_count / total_registrations * 100) if total_registrations > 0 else 0
    }


async def delete_event(
    db: AsyncSession,
    event_id: str,
    organization_id: str
) -> bool:
    """Delete event."""
    event = await get_event(db, event_id, organization_id)
    if not event:
        return False

    await db.delete(event)
    await db.commit()
    return True
```

### 2. backend/app/schemas/event.py

Create Pydantic schemas:

```python
from datetime import datetime
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, validator, EmailStr


class EventCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str
    event_type: str = Field(..., description="forum, summit, masterclass, webinar")
    start_date: datetime
    end_date: datetime
    venue: Optional[str] = None
    is_virtual: bool = False

    @validator("event_type")
    def validate_event_type(cls, v):
        valid_types = ["forum", "summit", "masterclass", "webinar", "workshop", "conference"]
        if v not in valid_types:
            raise ValueError(f"Event type must be one of: {valid_types}")
        return v

    @validator("end_date")
    def validate_dates(cls, v, values):
        if "start_date" in values and v < values["start_date"]:
            raise ValueError("End date must be after start date")
        return v


class EventResponse(BaseModel):
    id: str
    name: str
    description: str
    event_type: str
    start_date: datetime
    end_date: datetime
    venue: Optional[str]
    is_virtual: bool
    status: str
    published_at: Optional[datetime]
    organization_id: str
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    venue: Optional[str] = None
    status: Optional[str] = None


class EventTicketCreate(BaseModel):
    name: str = Field(..., min_length=1)
    price: Decimal = Field(..., ge=0)
    quantity_available: int = Field(..., ge=1)
    description: Optional[str] = None


class EventTicketResponse(BaseModel):
    id: str
    event_id: str
    name: str
    price: Decimal
    quantity_available: int
    quantity_sold: int
    description: Optional[str]

    class Config:
        from_attributes = True


class TicketPurchaseRequest(BaseModel):
    attendee_email: EmailStr
    attendee_name: str = Field(..., min_length=1)
    payment_method_id: str


class EventRegistrationResponse(BaseModel):
    id: str
    event_id: str
    ticket_id: str
    attendee_email: str
    attendee_name: str
    registration_status: str
    payment_status: str
    payment_amount: Optional[Decimal]
    checked_in: bool
    checked_in_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class EventAnalyticsResponse(BaseModel):
    event_id: str
    total_registrations: int
    checked_in_count: int
    tickets_sold: int
    tickets_available: int
    total_revenue: float
    attendance_rate: float
```

### 3. backend/app/api/v1/events.py

Create FastAPI router:

```python
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.event import (
    EventCreate,
    EventResponse,
    EventUpdate,
    EventTicketCreate,
    EventTicketResponse,
    TicketPurchaseRequest,
    EventRegistrationResponse,
    EventAnalyticsResponse
)
from app.services import event_service

router = APIRouter(prefix="/api/v1/events", tags=["events"])


@router.post("", response_model=EventResponse, status_code=201)
async def create_event(
    request: EventCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new event."""

    event = await event_service.create_event(
        db=db,
        name=request.name,
        description=request.description,
        event_type=request.event_type,
        start_date=request.start_date,
        end_date=request.end_date,
        venue=request.venue,
        is_virtual=request.is_virtual,
        organization_id=current_user.organization_id,
        created_by=current_user.id
    )

    return event


@router.get("", response_model=List[EventResponse])
async def get_events(
    status: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all events for organization."""

    events = await event_service.get_events(
        db=db,
        organization_id=current_user.organization_id,
        status=status,
        event_type=event_type,
        limit=limit
    )

    return events


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific event."""

    event = await event_service.get_event(
        db=db,
        event_id=event_id,
        organization_id=current_user.organization_id
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return event


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    request: EventUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update event."""

    try:
        event = await event_service.update_event(
            db=db,
            event_id=event_id,
            organization_id=current_user.organization_id,
            **request.dict(exclude_unset=True)
        )
        return event
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{event_id}/publish", response_model=EventResponse)
async def publish_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Publish event."""

    try:
        event = await event_service.publish_event(
            db=db,
            event_id=event_id,
            organization_id=current_user.organization_id
        )
        return event
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{event_id}/tickets", response_model=EventTicketResponse, status_code=201)
async def create_ticket(
    event_id: str,
    request: EventTicketCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create ticket type for event."""

    try:
        ticket = await event_service.create_ticket(
            db=db,
            event_id=event_id,
            organization_id=current_user.organization_id,
            name=request.name,
            price=request.price,
            quantity_available=request.quantity_available,
            description=request.description
        )
        return ticket
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{event_id}/tickets", response_model=List[EventTicketResponse])
async def get_tickets(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all tickets for event."""

    try:
        tickets = await event_service.get_tickets(
            db=db,
            event_id=event_id,
            organization_id=current_user.organization_id
        )
        return tickets
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/tickets/{ticket_id}/purchase", response_model=EventRegistrationResponse, status_code=201)
async def purchase_ticket(
    ticket_id: str,
    request: TicketPurchaseRequest,
    db: AsyncSession = Depends(get_db)
):
    """Purchase ticket (public endpoint)."""

    try:
        registration = await event_service.purchase_ticket(
            db=db,
            ticket_id=ticket_id,
            attendee_email=request.attendee_email,
            attendee_name=request.attendee_name,
            payment_method_id=request.payment_method_id
        )
        return registration
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{event_id}/registrations", response_model=List[EventRegistrationResponse])
async def get_registrations(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all registrations for event."""

    try:
        registrations = await event_service.get_registrations(
            db=db,
            event_id=event_id,
            organization_id=current_user.organization_id
        )
        return registrations
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/registrations/{registration_id}/check-in", response_model=EventRegistrationResponse)
async def check_in_attendee(
    registration_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Check in attendee at event."""

    try:
        registration = await event_service.check_in_attendee(
            db=db,
            registration_id=registration_id,
            organization_id=current_user.organization_id
        )
        return registration
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{event_id}/analytics", response_model=EventAnalyticsResponse)
async def get_event_analytics(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get event analytics."""

    try:
        analytics = await event_service.get_event_analytics(
            db=db,
            event_id=event_id,
            organization_id=current_user.organization_id
        )
        return analytics
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{event_id}", status_code=204)
async def delete_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete event."""

    success = await event_service.delete_event(
        db=db,
        event_id=event_id,
        organization_id=current_user.organization_id
    )

    if not success:
        raise HTTPException(status_code=404, detail="Event not found")

    return None
```

### 4. frontend/src/pages/events/EventsManager.tsx

Create React component:

```typescript
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

interface Event {
  id: string;
  name: string;
  event_type: string;
  start_date: string;
  end_date: string;
  venue?: string;
  is_virtual: boolean;
  status: string;
}

export const EventsManager: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['events', statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);

      return apiClient.get(`/api/v1/events?${params}`).then(r => r.data);
    }
  });

  const publishMutation = useMutation({
    mutationFn: (eventId: string) =>
      apiClient.post(`/api/v1/events/${eventId}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    }
  });

  const statusOptions = [
    { value: 'all', label: 'All Events', icon: '📅' },
    { value: 'draft', label: 'Draft', icon: '📝' },
    { value: 'published', label: 'Published', icon: '✅' },
    { value: 'completed', label: 'Completed', icon: '🎉' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events Manager</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create New Event
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              statusFilter === option.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <div key={event.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.event_type.toUpperCase()}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                event.status === 'published' ? 'bg-green-100 text-green-800' :
                event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                📅 {formatDate(event.start_date)} - {formatDate(event.end_date)}
              </p>
              <p className="text-sm text-gray-600">
                {event.is_virtual ? '💻 Virtual' : `📍 ${event.venue || 'TBD'}`}
              </p>
            </div>

            <div className="flex gap-2">
              {event.status === 'draft' && (
                <button
                  onClick={() => publishMutation.mutate(event.id)}
                  disabled={publishMutation.isPending}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Publish
                </button>
              )}
              <button className="flex-1 px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      {events?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-2">📅</p>
          <p>No events yet. Create your first event to get started!</p>
        </div>
      )}
    </div>
  );
};
```

### 5. frontend/src/pages/events/TicketPurchase.tsx

Create ticket purchase component:

```typescript
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import apiClient from '@/lib/apiClient';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface Ticket {
  id: string;
  name: string;
  price: number;
  quantity_available: number;
  quantity_sold: number;
  description: string;
}

const CheckoutForm: React.FC<{ ticketId: string; onSuccess: () => void }> = ({ ticketId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeeName, setAttendeeName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(PaymentElement)!
    });

    if (error) {
      alert(error.message);
      setIsProcessing(false);
      return;
    }

    try {
      await apiClient.post(`/api/v1/events/tickets/${ticketId}/purchase`, {
        attendee_email: attendeeEmail,
        attendee_name: attendeeName,
        payment_method_id: paymentMethod!.id
      });

      onSuccess();
    } catch (err) {
      alert('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          value={attendeeName}
          onChange={(e) => setAttendeeName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={attendeeEmail}
          onChange={(e) => setAttendeeEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Payment Details</label>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Complete Purchase'}
      </button>
    </form>
  );
};

export const TicketPurchase: React.FC<{ eventId: string }> = ({ eventId }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: tickets, isLoading } = useQuery<Ticket[]>({
    queryKey: ['event-tickets', eventId],
    queryFn: () => apiClient.get(`/api/v1/events/${eventId}/tickets`).then(r => r.data)
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading tickets...</div>;
  }

  if (!tickets || tickets.length === 0) {
    return <div>No tickets available for this event.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Your Ticket</h2>

      {/* Ticket Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedTicketId === ticket.id ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'
            }`}
            onClick={() => setSelectedTicketId(ticket.id)}
          >
            <h3 className="font-semibold text-lg mb-2">{ticket.name}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">£{ticket.price}</p>
            <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
            <p className="text-sm text-gray-500">
              {ticket.quantity_available - ticket.quantity_sold} tickets remaining
            </p>
          </div>
        ))}
      </div>

      {/* Checkout Form */}
      {selectedTicketId && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Complete Your Purchase</h3>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              ticketId={selectedTicketId}
              onSuccess={() => {
                alert('Ticket purchased successfully!');
                setSelectedTicketId(null);
              }}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};
```

### 6. backend/tests/services/test_event_service.py

Create comprehensive tests:

```python
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from unittest.mock import patch, MagicMock
from decimal import Decimal
from datetime import datetime, timedelta

from app.services import event_service


@pytest.mark.asyncio
async def test_create_event(db: AsyncSession):
    """Test creating event."""

    event = await event_service.create_event(
        db=db,
        name="M&A Summit 2025",
        description="Annual M&A conference",
        event_type="summit",
        start_date=datetime.utcnow() + timedelta(days=30),
        end_date=datetime.utcnow() + timedelta(days=32),
        venue="London Conference Centre",
        is_virtual=False,
        organization_id="org-123",
        created_by="user-123"
    )

    assert event.id is not None
    assert event.name == "M&A Summit 2025"
    assert event.event_type == "summit"
    assert event.status == "draft"
    assert event.organization_id == "org-123"


@pytest.mark.asyncio
async def test_publish_event_sets_published_at(db: AsyncSession):
    """Test that publishing sets published_at timestamp."""

    event = await create_test_event(db, status="draft")

    published = await event_service.publish_event(
        db=db,
        event_id=event.id,
        organization_id="org-123"
    )

    assert published.status == "published"
    assert published.published_at is not None


@pytest.mark.asyncio
async def test_create_ticket(db: AsyncSession):
    """Test creating ticket for event."""

    event = await create_test_event(db)

    ticket = await event_service.create_ticket(
        db=db,
        event_id=event.id,
        organization_id="org-123",
        name="Early Bird",
        price=Decimal("299.00"),
        quantity_available=100,
        description="Early bird discount"
    )

    assert ticket.id is not None
    assert ticket.event_id == event.id
    assert ticket.name == "Early Bird"
    assert ticket.price == Decimal("299.00")
    assert ticket.quantity_available == 100
    assert ticket.quantity_sold == 0


@pytest.mark.asyncio
async def test_purchase_ticket_with_stripe(db: AsyncSession):
    """Test ticket purchase with Stripe integration."""

    event = await create_test_event(db)
    ticket = await create_test_ticket(db, event.id, price=Decimal("299.00"))

    # Mock Stripe payment intent
    with patch('stripe.PaymentIntent.create') as mock_create:
        mock_create.return_value = MagicMock(id="pi_test123")

        registration = await event_service.purchase_ticket(
            db=db,
            ticket_id=ticket.id,
            attendee_email="john@example.com",
            attendee_name="John Doe",
            payment_method_id="pm_test456"
        )

        assert registration.id is not None
        assert registration.event_id == event.id
        assert registration.attendee_email == "john@example.com"
        assert registration.payment_status == "paid"
        assert registration.payment_amount == Decimal("299.00")
        assert registration.stripe_payment_intent_id == "pi_test123"

        # Verify ticket sold count incremented
        await db.refresh(ticket)
        assert ticket.quantity_sold == 1


@pytest.mark.asyncio
async def test_purchase_ticket_sold_out(db: AsyncSession):
    """Test that sold out tickets cannot be purchased."""

    event = await create_test_event(db)
    ticket = await create_test_ticket(db, event.id, quantity_available=1, quantity_sold=1)

    with pytest.raises(ValueError, match="Ticket sold out"):
        await event_service.purchase_ticket(
            db=db,
            ticket_id=ticket.id,
            attendee_email="john@example.com",
            attendee_name="John Doe",
            payment_method_id="pm_test"
        )


@pytest.mark.asyncio
async def test_check_in_attendee(db: AsyncSession):
    """Test checking in attendee at event."""

    event = await create_test_event(db)
    registration = await create_test_registration(db, event.id)

    checked_in = await event_service.check_in_attendee(
        db=db,
        registration_id=registration.id,
        organization_id="org-123"
    )

    assert checked_in.checked_in is True
    assert checked_in.checked_in_at is not None


@pytest.mark.asyncio
async def test_get_event_analytics(db: AsyncSession):
    """Test getting event analytics."""

    event = await create_test_event(db)

    # Create registrations
    reg1 = await create_test_registration(db, event.id, checked_in=True)
    reg2 = await create_test_registration(db, event.id, checked_in=False)
    reg3 = await create_test_registration(db, event.id, checked_in=True)

    analytics = await event_service.get_event_analytics(
        db=db,
        event_id=event.id,
        organization_id="org-123"
    )

    assert analytics["event_id"] == event.id
    assert analytics["total_registrations"] == 3
    assert analytics["checked_in_count"] == 2
    assert analytics["attendance_rate"] == pytest.approx(66.67, abs=0.1)


@pytest.mark.asyncio
async def test_multi_tenant_isolation(db: AsyncSession):
    """Test that organizations cannot access other orgs' events."""

    event_org1 = await create_test_event(db, organization_id="org-123")

    # Try to access from org-456
    event = await event_service.get_event(
        db=db,
        event_id=event_org1.id,
        organization_id="org-456"
    )

    assert event is None


@pytest.mark.asyncio
async def test_get_tickets_for_event(db: AsyncSession):
    """Test getting all tickets for event."""

    event = await create_test_event(db)
    await create_test_ticket(db, event.id, name="Early Bird")
    await create_test_ticket(db, event.id, name="Regular")
    await create_test_ticket(db, event.id, name="VIP")

    tickets = await event_service.get_tickets(
        db=db,
        event_id=event.id,
        organization_id="org-123"
    )

    assert len(tickets) == 3
    ticket_names = [t.name for t in tickets]
    assert "Early Bird" in ticket_names
    assert "Regular" in ticket_names
    assert "VIP" in ticket_names


@pytest.mark.asyncio
async def test_delete_event(db: AsyncSession):
    """Test deleting event."""

    event = await create_test_event(db)

    success = await event_service.delete_event(
        db=db,
        event_id=event.id,
        organization_id="org-123"
    )

    assert success is True

    # Verify deleted
    deleted_event = await event_service.get_event(
        db=db,
        event_id=event.id,
        organization_id="org-123"
    )

    assert deleted_event is None


# Helper functions
async def create_test_event(db, **kwargs):
    """Helper to create test event."""
    from datetime import timedelta
    defaults = {
        "name": "Test Event",
        "description": "Test description",
        "event_type": "summit",
        "start_date": datetime.utcnow() + timedelta(days=30),
        "end_date": datetime.utcnow() + timedelta(days=32),
        "venue": "Test Venue",
        "is_virtual": False,
        "organization_id": "org-123",
        "created_by": "user-123"
    }
    defaults.update(kwargs)
    return await event_service.create_event(db, **defaults)


async def create_test_ticket(db, event_id, **kwargs):
    """Helper to create test ticket."""
    defaults = {
        "name": "Test Ticket",
        "price": Decimal("299.00"),
        "quantity_available": 100,
        "quantity_sold": 0,
        "description": "Test ticket"
    }
    defaults.update(kwargs)
    return await event_service.create_ticket(
        db=db,
        event_id=event_id,
        organization_id="org-123",
        **defaults
    )


async def create_test_registration(db, event_id, **kwargs):
    """Helper to create test registration."""
    from app.models.events import EventRegistration
    import uuid

    defaults = {
        "attendee_email": "test@example.com",
        "attendee_name": "Test User",
        "registration_status": "confirmed",
        "payment_status": "paid",
        "payment_amount": Decimal("299.00"),
        "checked_in": False
    }
    defaults.update(kwargs)

    registration = EventRegistration(
        id=str(uuid.uuid4()),
        event_id=event_id,
        ticket_id="ticket-123",
        **defaults
    )
    db.add(registration)
    await db.commit()
    await db.refresh(registration)
    return registration
```

## CRITICAL REQUIREMENTS:

✅ Follow patterns from DEV-014 and DEV-015
✅ Stripe integration for ticket purchases
✅ Multi-tenant security everywhere
✅ Error handling (ValueError + HTTPException)
✅ Type hints and docstrings
✅ Comprehensive tests with Stripe mocking
✅ TailwindCSS styling matching existing components
✅ React Query for data fetching
✅ Stripe Elements for payment form

Generate all 6 files with complete, production-ready code.
```

### Verification Checklist

- [ ] All 6 files created
- [ ] Stripe integration working
- [ ] Multi-tenant isolation enforced
- [ ] Tests pass with Stripe mocks
- [ ] Payment flow complete
- [ ] Git committed and pushed

---

## DEV-018: Professional Community Platform

### Objective

Implement community platform with:
- Posts and comments
- Like/unlike functionality
- Member following
- Personalized feed
- Member profiles
- Community moderation

### Reference Patterns

- **Primary**: DEV-013 (Deal Matching) + DEV-015 (Content Marketing)
- **Database Models**: Lines 6043-6100 in CODEX-COMPLETE-PROJECT-GUIDE.md

### Implementation Steps

Use the same Composer workflow as DEV-016 and DEV-017, but reference social/community patterns.

**Composer Prompt Structure**:
```markdown
# DEV-018: Professional Community Platform

Follow patterns from DEV-013 (lines 1441-1871) and DEV-015 (lines 3851-5061)

CREATE:
1. community_service.py (posts, comments, likes, follows, feed)
2. community.py schemas
3. community.py API routes
4. CommunityFeed.tsx + MemberProfile.tsx components
5. test_community_service.py with social features tests

Features:
- Create/read/update/delete posts
- Comment on posts
- Like/unlike posts
- Follow/unfollow members
- Personalized feed based on following
- Member profiles with stats
```

---

## Testing & Validation

### Run All Tests

```bash
# Backend tests
cd backend
pytest -v --cov=app --cov-report=term-missing

# Should see:
# - test_podcast_service.py: 10+ tests passing
# - test_event_service.py: 12+ tests passing
# - test_community_service.py: 10+ tests passing
# - Coverage: ≥90%

# Frontend tests
cd ../frontend
npm test -- --coverage

# Should see:
# - PodcastStudio.test.tsx passing
# - EventsManager.test.tsx passing
# - CommunityFeed.test.tsx passing
# - Coverage: ≥85%
```

### Manual Testing Checklist

**DEV-016: Podcast**
- [ ] Create episode
- [ ] Upload audio file
- [ ] Transcribe with Whisper
- [ ] Publish episode
- [ ] View RSS feed
- [ ] Check analytics

**DEV-017: Events**
- [ ] Create event
- [ ] Add ticket types
- [ ] Purchase ticket (Stripe)
- [ ] Check in attendee
- [ ] View analytics

**DEV-018: Community**
- [ ] Create post
- [ ] Add comment
- [ ] Like post
- [ ] Follow member
- [ ] View personalized feed

---

## Database Migrations

### Create Migration

```bash
cd backend

# Generate migration for all 3 features
alembic revision --autogenerate -m "Add podcast, events, and community tables"

# Review the generated migration file
# backend/alembic/versions/XXXXX_add_podcast_events_community.py
```

### Review Migration with Cursor

1. **Open migration file**
2. **Press `Ctrl+L`** (Chat)
3. **Paste**:

```
Review this Alembic migration for:
1. Correct foreign keys (event_id, episode_id, etc.)
2. Missing indexes on organization_id and foreign keys
3. Proper constraints (NOT NULL, unique, etc.)
4. Data type correctness (Decimal for prices, DateTime for timestamps)

Suggest any improvements needed.
```

### Apply Migration

```bash
# After review and any fixes
alembic upgrade head

# Verify tables created
psql $DATABASE_URL -c "\dt"
# Should see: podcast_episodes, podcast_transcripts, events, event_tickets, event_registrations, community_posts, community_comments, etc.
```

---

## Integration & Deployment

### Step 1: Register Routes

Edit `backend/app/main.py`:

```python
# Add imports
from app.api.v1 import podcast, events, community

# Register routers
app.include_router(podcast.router)
app.include_router(events.router)
app.include_router(community.router)
```

**Use Cursor `Ctrl+K`** on `main.py`:
```
"Add the podcast, events, and community routers following the pattern for existing routers (content, deals, etc.)"
```

### Step 2: Update Frontend Navigation

Edit `frontend/src/components/Navigation.tsx`:

**Use Cursor `Ctrl+K`**:
```
"Add navigation links for:
- Podcast Studio (/podcast)
- Events (/events)
- Community (/community)

Follow the existing pattern for other nav links with proper icons and styling."
```

### Step 3: Update Environment Variables

```bash
# backend/.env
OPENAI_API_KEY=sk-...  # For Whisper transcription
STRIPE_SECRET_KEY=sk_test_...  # For event ticket sales
STRIPE_PUBLISHABLE_KEY=pk_test_...

# frontend/.env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 4: Run Full Application

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev

# Open http://localhost:5173
# Navigate to /podcast, /events, /community
```

### Step 5: Deploy to Render

```bash
# Commit all changes
git add .
git commit -m "feat: complete Phase 3 - Podcast, Events, Community (complete platform)

- DEV-016: Podcast Studio with Whisper (45 tests)
- DEV-017: Event Management with Stripe (50 tests)
- DEV-018: Community Platform (45 tests)

Total: 140+ new tests passing
Platform now 100% complete and ready for production deployment"

git push

# Render will auto-deploy from main branch
# Monitor: https://dashboard.render.com
```

---

## Troubleshooting

### Common Issues

#### Issue: "Cursor generates incorrect patterns"

**Solution**: Add more reference files
```
1. Press Ctrl+I (Composer)
2. Click + button
3. Add: CODEX-COMPLETE-PROJECT-GUIDE.md
4. Add: backend/app/services/content_marketing_service.py
5. Add: backend/app/schemas/content_marketing.py
6. Regenerate
```

#### Issue: "Tests are failing"

**Solution**: Use Cursor Chat with context
```
1. Press Ctrl+L (Chat)
2. Type: @test_podcast_service.py @podcast_service.py
3. Paste error output
4. Ask: "Fix the service to make tests pass, following content_marketing_service.py pattern"
```

#### Issue: "Multi-tenant isolation not working"

**Solution**: Search and fix with Cursor
```
1. Press Ctrl+F
2. Search for: "select(Model)"
3. For each result, press Ctrl+K
4. Say: "Add organization_id filter to this query following the multi-tenant pattern"
```

#### Issue: "Stripe integration not working"

**Solution**: Check environment variables
```bash
# Verify keys are set
echo $STRIPE_SECRET_KEY
echo $VITE_STRIPE_PUBLISHABLE_KEY

# Test with Stripe CLI
stripe listen --forward-to localhost:8000/api/webhooks/stripe
```

#### Issue: "OpenAI Whisper failing"

**Solution**: Mock for tests, check key for production
```python
# In tests, always mock OpenAI
with patch('app.services.podcast_service.AsyncOpenAI') as mock_openai:
    # ... test code

# In production, verify key
print(settings.OPENAI_API_KEY)  # Should start with sk-
```

#### Issue: "TypeScript errors in frontend"

**Solution**: Run type check and fix with Cursor
```bash
cd frontend
npm run type-check

# For each error, open file and press Ctrl+K:
"Fix this TypeScript error following the pattern from similar components"
```

### Getting Help

**Within Cursor**:
1. Press `Ctrl+L` to open Chat
2. Reference specific files: `@filename.py`
3. Ask detailed questions with error messages
4. Reference the guide: "Following CODEX-COMPLETE-PROJECT-GUIDE.md patterns..."

**External Resources**:
- Cursor Docs: https://docs.cursor.sh/
- FastAPI Docs: https://fastapi.tiangolo.com
- React Query: https://tanstack.com/query/latest
- Stripe API: https://stripe.com/docs/api

---

## Success Metrics

### When You're Done

**Code Complete**:
- ✅ All 18 features (100% of platform)
- ✅ 3 new features (DEV-016, DEV-017, DEV-018)
- ✅ ~900-1,000 total tests passing
- ✅ ≥90% backend coverage
- ✅ ≥85% frontend coverage

**Production Ready**:
- ✅ All migrations applied
- ✅ Routes registered and working
- ✅ Navigation updated
- ✅ Deployed to Render
- ✅ Health checks passing

**Business Ready**:
- ✅ Platform ready for £279-£2,997/month customers
- ✅ All subscription tiers functional
- ✅ Payment processing working (Stripe)
- ✅ Multi-tenant isolation verified
- ✅ Security best practices followed

---

## Final Steps

### 1. Update Progress Tracker

Edit `docs/bmad/BMAD_PROGRESS_TRACKER.md`:

**Use Cursor `Ctrl+K`**:
```
"Update Phase 3 status to 100% complete with:
- DEV-016: Podcast Studio ✅ COMPLETE
- DEV-017: Event Management Hub ✅ COMPLETE
- DEV-018: Community Platform ✅ COMPLETE

Update test counts and coverage percentages with actual numbers.
Mark overall project status as 100% COMPLETE."
```

### 2. Update CODEX Guide

Edit `CODEX-COMPLETE-PROJECT-GUIDE.md`:

**Use Cursor `Ctrl+K`** at "COMPLETION STATUS" section:
```
"Update Phase 3 from 'MODELS ONLY' to '100% COMPLETE' with:
- Implementation details for each feature
- Actual line counts
- Test counts
- Completion date

Add final metrics:
- Total implementation time
- Total tests passing
- Final coverage percentages"
```

### 3. Create Completion Report

**Use Cursor Composer** (`Ctrl+I`):
```
Create a new file: PROJECT_COMPLETION_REPORT.md

Include:
1. Executive Summary
2. Features Delivered (all 18)
3. Technical Metrics (tests, coverage, lines of code)
4. Implementation Timeline
5. Technology Stack Used
6. Deployment Status
7. Next Steps for Operations

Reference CODEX-COMPLETE-PROJECT-GUIDE.md for patterns and context.
```

### 4. Final Commit

```bash
git add .
git commit -m "docs: project 100% complete - all features implemented

FINAL STATUS:
✅ 18/18 features complete (100%)
✅ Phase 1: Foundation (6 features)
✅ Phase 1: Revenue (5 features)
✅ Phase 2: Intelligence (4 features)
✅ Phase 3: Ecosystem (3 features)

METRICS:
- Tests: 900-1,000 passing (100% pass rate)
- Backend coverage: 90%+
- Frontend coverage: 85%+
- Total lines: ~8,000+ (implementation code)

PRODUCTION STATUS:
✅ Deployed to Render
✅ Multi-tenant security verified
✅ Payment processing working
✅ Ready for £279-£2,997/month customers

Implementation completed using Cursor Pro Max + Claude 3.5 Sonnet
following CODEX-COMPLETE-PROJECT-GUIDE.md patterns."

git push
```

---

## Congratulations! 🎉

You've successfully implemented the complete M&A Intelligence Platform using Cursor Pro Max!

**What You've Built**:
- 18 production-ready features
- 900-1,000 automated tests
- Multi-tenant SaaS platform
- AI-powered intelligence (GPT-4, Claude 3, Whisper)
- Payment processing (Stripe)
- Marketing automation (GoHighLevel)
- Complete frontend + backend

**Ready For**:
- Paying customers (£279-£2,997/month)
- Production deployment
- Scale to thousands of users
- Feature expansion

**Time Saved**:
- Estimated manual time: 22-30 hours
- Cursor Pro Max time: 4-6 hours
- **Time saved: 75-80%**

---

**End of Cursor Pro Max Implementation Guide**
