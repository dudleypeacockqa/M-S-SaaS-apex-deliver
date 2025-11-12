# MAP-REBUILD-001: Master Admin Portal - Backend Foundation

**Story ID**: MAP-REBUILD-001  
**Epic**: Master Admin Portal Rebuild  
**Status**: In Progress – Monitoring endpoints wired (Updated 2025-11-12 12:10 UTC)  
**Started**: October 31, 2025  
**Methodology**: BMAD v6-alpha with Strict TDD  
**Test Coverage Target**: 100% backend

---

## Overview

Establish the backend foundation for the Master Admin Portal using Python/FastAPI/PostgreSQL/SQLAlchemy architecture. This story implements the Activity Tracker subsystem with complete database models, Alembic migrations, API endpoints, and business logic services. All code will be developed using strict Test-Driven Development (Red-Green-Refactor cycle).

**Scope:**
- Activity Tracker database models (6 tables)
- Alembic migrations for all Master Admin tables
- FastAPI endpoints for Activity Tracker CRUD operations
- Business logic services (scoring, focus sessions, nudges)
- 100% test coverage with Pytest

### Latest Update (2025-11-12)
- Added observability coverage for the existing dashboard endpoint via `scripts/monitoring/collect_health_snapshot.py`; every run now records `/api/master-admin/dashboard` responses (expected 401) in `docs/monitoring/health-snapshot-*.json` so backend rebuild progress is traceable in BMAD evidence.

---

## Acceptance Criteria

### Database & Migrations

- [ ] `admin_goals` table created with proper schema
- [ ] `admin_activities` table created with proper schema
- [ ] `admin_scores` table created with proper schema
- [ ] `admin_focus_sessions` table created with proper schema
- [ ] `admin_nudges` table created with proper schema
- [ ] `admin_meetings` table created with proper schema
- [ ] Alembic migration file generated and tested
- [ ] Migration runs successfully on clean database
- [ ] Migration rollback works correctly
- [ ] All foreign key constraints properly defined

### SQLAlchemy Models

- [ ] `AdminGoal` model with proper relationships
- [ ] `AdminActivity` model with proper relationships
- [ ] `AdminScore` model with proper relationships
- [ ] `AdminFocusSession` model with proper relationships
- [ ] `AdminNudge` model with proper relationships
- [ ] `AdminMeeting` model with proper relationships
- [ ] All models have `__repr__` methods
- [ ] All models have proper type hints
- [ ] All models tested with 100% coverage

### Pydantic Schemas

- [ ] `AdminGoalCreate` schema with validation
- [ ] `AdminGoalUpdate` schema with validation
- [ ] `AdminGoalResponse` schema
- [ ] `AdminActivityCreate` schema with validation
- [ ] `AdminActivityUpdate` schema with validation
- [ ] `AdminActivityResponse` schema
- [ ] `AdminScoreResponse` schema
- [ ] `AdminFocusSessionCreate` schema
- [ ] `AdminFocusSessionResponse` schema
- [ ] All schemas tested with 100% coverage

### API Endpoints

**Goals:**
- [ ] `POST /api/v1/master-admin/goals` - Create weekly goals
- [ ] `GET /api/v1/master-admin/goals` - List goals
- [ ] `GET /api/v1/master-admin/goals/{id}` - Get goal details
- [ ] `PUT /api/v1/master-admin/goals/{id}` - Update goal
- [ ] `DELETE /api/v1/master-admin/goals/{id}` - Delete goal

**Activities:**
- [ ] `POST /api/v1/master-admin/activities` - Log activity
- [ ] `GET /api/v1/master-admin/activities` - List activities
- [ ] `GET /api/v1/master-admin/activities/{id}` - Get activity details
- [ ] `PUT /api/v1/master-admin/activities/{id}` - Update activity
- [ ] `DELETE /api/v1/master-admin/activities/{id}` - Delete activity
- [ ] `GET /api/v1/master-admin/activities/today` - Get today's activities

**Scores:**
- [ ] `GET /api/v1/master-admin/scores/today` - Get today's score
- [ ] `GET /api/v1/master-admin/scores/week` - Get week's scores
- [ ] `GET /api/v1/master-admin/scores/streak` - Get current streak

**Focus Sessions:**
- [ ] `POST /api/v1/master-admin/focus-sessions` - Start focus session
- [ ] `PUT /api/v1/master-admin/focus-sessions/{id}/complete` - Complete session
- [ ] `GET /api/v1/master-admin/focus-sessions/active` - Get active session

### Business Logic Services

- [ ] `ActivityService.create_activity()` - Create activity with validation
- [ ] `ActivityService.calculate_daily_score()` - Calculate weighted score
- [ ] `ActivityService.update_streak()` - Update streak counter
- [ ] `ActivityService.get_weekly_progress()` - Calculate weekly progress
- [ ] `FocusSessionService.start_session()` - Start 50-minute timer
- [ ] `FocusSessionService.complete_session()` - Mark session complete
- [ ] `NudgeService.generate_nudges()` - Generate AI-powered nudges
- [ ] All services tested with 100% coverage

### Authentication & Authorization

- [ ] Clerk JWT verification middleware
- [ ] Master admin role check decorator
- [ ] All endpoints require authentication
- [ ] Only master admin role can access endpoints
- [ ] Proper error responses for unauthorized access

### Testing

- [ ] Unit tests for all models (100% coverage)
- [ ] Unit tests for all schemas (100% coverage)
- [ ] Unit tests for all services (100% coverage)
- [ ] Integration tests for all API endpoints (100% coverage)
- [ ] Test database fixtures and factories
- [ ] Mock external dependencies (Clerk, AI services)
- [ ] All tests pass in CI/CD pipeline

---

## Technical Specification

### Database Schema (PostgreSQL)

```sql
-- Weekly Goals
CREATE TABLE admin_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    target_discoveries INTEGER DEFAULT 0,
    target_emails INTEGER DEFAULT 0,
    target_videos INTEGER DEFAULT 0,
    target_calls INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_start)
);

-- Daily Activities
CREATE TABLE admin_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('discovery', 'email', 'video', 'call')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('done', 'pending', 'cancelled')),
    date DATE NOT NULL,
    amount INTEGER DEFAULT 1,
    notes TEXT,
    prospect_id INTEGER REFERENCES admin_prospects(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Scores
CREATE TABLE admin_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    streak_days INTEGER DEFAULT 0,
    activities_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Focus Sessions
CREATE TABLE admin_focus_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER DEFAULT 50,
    completed BOOLEAN DEFAULT FALSE,
    interrupted BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nudges & Reminders
CREATE TABLE admin_nudges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('reminder', 'suggestion', 'alert', 'celebration')),
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Meeting Templates
CREATE TABLE admin_meetings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('discovery', 'demo', 'negotiation', 'closing')),
    duration_minutes INTEGER DEFAULT 60,
    agenda TEXT,
    questions TEXT,
    follow_up_tasks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_admin_activities_user_date ON admin_activities(user_id, date DESC);
CREATE INDEX idx_admin_scores_user_date ON admin_scores(user_id, date DESC);
CREATE INDEX idx_admin_focus_sessions_user_start ON admin_focus_sessions(user_id, start_time DESC);
CREATE INDEX idx_admin_nudges_user_read ON admin_nudges(user_id, read, created_at DESC);
```

### SQLAlchemy Models

```python
# backend/app/models/master_admin.py
from datetime import date, datetime
from enum import Enum
from sqlalchemy import (
    Column, Integer, String, Text, Date, DateTime, Boolean,
    ForeignKey, CheckConstraint, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class ActivityType(str, Enum):
    """Activity types for tracking."""
    DISCOVERY = "discovery"
    EMAIL = "email"
    VIDEO = "video"
    CALL = "call"


class ActivityStatus(str, Enum):
    """Activity status."""
    DONE = "done"
    PENDING = "pending"
    CANCELLED = "cancelled"


class AdminGoal(Base):
    """Weekly goals for activity tracking."""
    __tablename__ = "admin_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    week_start = Column(Date, nullable=False)
    target_discoveries = Column(Integer, default=0)
    target_emails = Column(Integer, default=0)
    target_videos = Column(Integer, default=0)
    target_calls = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="admin_goals")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "week_start", name="uq_user_week"),
        Index("idx_admin_goals_user_week", "user_id", "week_start"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminGoal(id={self.id}, user_id={self.user_id}, week={self.week_start})>"


class AdminActivity(Base):
    """Daily activity logging."""
    __tablename__ = "admin_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    amount = Column(Integer, default=1)
    notes = Column(Text)
    prospect_id = Column(Integer, ForeignKey("admin_prospects.id", ondelete="SET NULL"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="admin_activities")
    prospect = relationship("AdminProspect", back_populates="activities")
    
    # Constraints
    __table_args__ = (
        CheckConstraint("type IN ('discovery', 'email', 'video', 'call')", name="ck_activity_type"),
        CheckConstraint("status IN ('done', 'pending', 'cancelled')", name="ck_activity_status"),
        Index("idx_admin_activities_user_date", "user_id", "date"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminActivity(id={self.id}, type={self.type}, date={self.date})>"


class AdminScore(Base):
    """Daily scoring and streaks."""
    __tablename__ = "admin_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    score = Column(Integer, nullable=False)
    streak_days = Column(Integer, default=0)
    activities_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="admin_scores")
    
    # Constraints
    __table_args__ = (
        CheckConstraint("score >= 0 AND score <= 100", name="ck_score_range"),
        UniqueConstraint("user_id", "date", name="uq_user_date"),
        Index("idx_admin_scores_user_date", "user_id", "date"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminScore(id={self.id}, date={self.date}, score={self.score})>"


# Additional models: AdminFocusSession, AdminNudge, AdminMeeting
# (Similar structure with proper relationships and constraints)
```

### Pydantic Schemas

```python
# backend/app/schemas/master_admin.py
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, validator


class AdminGoalBase(BaseModel):
    """Base schema for admin goals."""
    week_start: date
    target_discoveries: int = Field(ge=0, default=0)
    target_emails: int = Field(ge=0, default=0)
    target_videos: int = Field(ge=0, default=0)
    target_calls: int = Field(ge=0, default=0)


class AdminGoalCreate(AdminGoalBase):
    """Schema for creating admin goals."""
    pass


class AdminGoalUpdate(BaseModel):
    """Schema for updating admin goals."""
    target_discoveries: Optional[int] = Field(None, ge=0)
    target_emails: Optional[int] = Field(None, ge=0)
    target_videos: Optional[int] = Field(None, ge=0)
    target_calls: Optional[int] = Field(None, ge=0)


class AdminGoalResponse(AdminGoalBase):
    """Schema for admin goal responses."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AdminActivityBase(BaseModel):
    """Base schema for admin activities."""
    type: str = Field(..., pattern="^(discovery|email|video|call)$")
    status: str = Field(..., pattern="^(done|pending|cancelled)$")
    date: date
    amount: int = Field(ge=1, default=1)
    notes: Optional[str] = None
    prospect_id: Optional[int] = None


class AdminActivityCreate(AdminActivityBase):
    """Schema for creating admin activities."""
    pass


class AdminActivityUpdate(BaseModel):
    """Schema for updating admin activities."""
    status: Optional[str] = Field(None, pattern="^(done|pending|cancelled)$")
    notes: Optional[str] = None


class AdminActivityResponse(AdminActivityBase):
    """Schema for admin activity responses."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Additional schemas: AdminScore, AdminFocusSession, etc.
```

### FastAPI Endpoints

```python
# backend/app/api/v1/endpoints/master_admin/activity_tracker.py
from datetime import date, datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db, require_master_admin
from app.models.user import User
from app.schemas.master_admin import (
    AdminActivityCreate, AdminActivityUpdate, AdminActivityResponse,
    AdminGoalCreate, AdminGoalUpdate, AdminGoalResponse,
    AdminScoreResponse
)
from app.services.master_admin.activity_service import ActivityService

router = APIRouter(prefix="/master-admin", tags=["Master Admin - Activity Tracker"])


@router.post("/activities", response_model=AdminActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(
    activity: AdminActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_master_admin)
):
    """Create a new activity and update daily score."""
    service = ActivityService(db)
    return service.create_activity(current_user.id, activity)


@router.get("/activities/today", response_model=List[AdminActivityResponse])
async def get_today_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_master_admin)
):
    """Get today's activities."""
    service = ActivityService(db)
    return service.get_activities_by_date(current_user.id, date.today())


@router.get("/scores/today", response_model=AdminScoreResponse)
async def get_today_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_master_admin)
):
    """Get today's score and streak."""
    service = ActivityService(db)
    return service.get_daily_score(current_user.id, date.today())


# Additional endpoints...
```

### Business Logic Services

```python
# backend/app/services/master_admin/activity_service.py
from datetime import date, datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.master_admin import AdminActivity, AdminScore, ActivityType, ActivityStatus
from app.schemas.master_admin import AdminActivityCreate, AdminActivityResponse


class ActivityService:
    """Business logic for activity management."""
    
    # Activity scoring weights
    ACTIVITY_WEIGHTS = {
        ActivityType.DISCOVERY: 10,
        ActivityType.EMAIL: 5,
        ActivityType.VIDEO: 15,
        ActivityType.CALL: 20,
    }
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_activity(self, user_id: int, activity_data: AdminActivityCreate) -> AdminActivity:
        """Create a new activity and update daily score."""
        # Validate activity type
        if activity_data.type not in [t.value for t in ActivityType]:
            raise ValueError(f"Invalid activity type: {activity_data.type}")
        
        # Create activity
        db_activity = AdminActivity(
            user_id=user_id,
            **activity_data.dict()
        )
        self.db.add(db_activity)
        self.db.commit()
        self.db.refresh(db_activity)
        
        # Update daily score if activity is done
        if activity_data.status == ActivityStatus.DONE:
            self._update_daily_score(user_id, activity_data.date)
        
        return db_activity
    
    def _update_daily_score(self, user_id: int, activity_date: date) -> None:
        """Calculate and update daily score based on activities."""
        # Get all done activities for the date
        activities = self.db.query(AdminActivity).filter(
            AdminActivity.user_id == user_id,
            AdminActivity.date == activity_date,
            AdminActivity.status == ActivityStatus.DONE
        ).all()
        
        # Calculate weighted score
        total_score = 0
        for activity in activities:
            weight = self.ACTIVITY_WEIGHTS.get(activity.type, 0)
            total_score += weight * activity.amount
        
        # Cap at 100
        score = min(total_score, 100)
        
        # Update or create score record
        db_score = self.db.query(AdminScore).filter(
            AdminScore.user_id == user_id,
            AdminScore.date == activity_date
        ).first()
        
        if db_score:
            db_score.score = score
            db_score.activities_count = len(activities)
            db_score.updated_at = datetime.utcnow()
        else:
            # Calculate streak
            streak = self._calculate_streak(user_id, activity_date)
            db_score = AdminScore(
                user_id=user_id,
                date=activity_date,
                score=score,
                streak_days=streak,
                activities_count=len(activities)
            )
            self.db.add(db_score)
        
        self.db.commit()
    
    def _calculate_streak(self, user_id: int, current_date: date) -> int:
        """Calculate current streak of consecutive days with activities."""
        streak = 0
        check_date = current_date - timedelta(days=1)
        
        while True:
            score = self.db.query(AdminScore).filter(
                AdminScore.user_id == user_id,
                AdminScore.date == check_date
            ).first()
            
            if score and score.score > 0:
                streak += 1
                check_date -= timedelta(days=1)
            else:
                break
        
        return streak
    
    # Additional methods: get_activities_by_date, get_weekly_progress, etc.
```

---

## TDD Implementation Steps

### Step 1: Write Failing Tests for Models

```python
# backend/tests/master_admin/test_models.py
import pytest
from datetime import date, datetime
from app.models.master_admin import AdminGoal, AdminActivity, AdminScore


def test_create_admin_goal(db_session):
    """Test creating an admin goal."""
    goal = AdminGoal(
        user_id=1,
        week_start=date(2025, 11, 1),
        target_discoveries=10,
        target_emails=20
    )
    db_session.add(goal)
    db_session.commit()
    
    assert goal.id is not None
    assert goal.target_discoveries == 10
    assert goal.target_emails == 20


def test_admin_goal_unique_constraint(db_session):
    """Test that user can only have one goal per week."""
    goal1 = AdminGoal(user_id=1, week_start=date(2025, 11, 1))
    db_session.add(goal1)
    db_session.commit()
    
    goal2 = AdminGoal(user_id=1, week_start=date(2025, 11, 1))
    db_session.add(goal2)
    
    with pytest.raises(Exception):  # Should raise IntegrityError
        db_session.commit()


# Additional model tests...
```

### Step 2: Implement Models (GREEN)

Implement the SQLAlchemy models as specified above.

### Step 3: Write Failing Tests for Services

```python
# backend/tests/master_admin/test_activity_service.py
import pytest
from datetime import date
from app.services.master_admin.activity_service import ActivityService
from app.schemas.master_admin import AdminActivityCreate


def test_create_activity(db_session):
    """Test creating an activity."""
    service = ActivityService(db_session)
    activity_data = AdminActivityCreate(
        type="discovery",
        status="done",
        date=date.today(),
        amount=1
    )
    
    activity = service.create_activity(user_id=1, activity_data=activity_data)
    
    assert activity.id is not None
    assert activity.type == "discovery"
    assert activity.status == "done"


def test_calculate_daily_score(db_session):
    """Test daily score calculation."""
    service = ActivityService(db_session)
    
    # Create activities
    activities = [
        AdminActivityCreate(type="discovery", status="done", date=date.today(), amount=2),
        AdminActivityCreate(type="email", status="done", date=date.today(), amount=3),
    ]
    
    for activity_data in activities:
        service.create_activity(user_id=1, activity_data=activity_data)
    
    # Get score
    score = service.get_daily_score(user_id=1, date=date.today())
    
    # discovery: 2 * 10 = 20, email: 3 * 5 = 15, total = 35
    assert score.score == 35


# Additional service tests...
```

### Step 4: Implement Services (GREEN)

Implement the business logic services as specified above.

### Step 5: Write Failing Tests for API Endpoints

```python
# backend/tests/master_admin/test_activity_api.py
import pytest
from fastapi.testclient import TestClient
from datetime import date


def test_create_activity_endpoint(client: TestClient, auth_headers):
    """Test POST /api/v1/master-admin/activities."""
    response = client.post(
        "/api/v1/master-admin/activities",
        json={
            "type": "discovery",
            "status": "done",
            "date": str(date.today()),
            "amount": 1
        },
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "discovery"
    assert data["status"] == "done"


def test_get_today_activities_endpoint(client: TestClient, auth_headers):
    """Test GET /api/v1/master-admin/activities/today."""
    # Create some activities first
    client.post(
        "/api/v1/master-admin/activities",
        json={"type": "email", "status": "done", "date": str(date.today())},
        headers=auth_headers
    )
    
    response = client.get(
        "/api/v1/master-admin/activities/today",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["type"] == "email"


# Additional API tests...
```

### Step 6: Implement API Endpoints (GREEN)

Implement the FastAPI endpoints as specified above.

### Step 7: Refactor

Clean up code, extract common logic, improve naming, add documentation.

---

## Testing Strategy

### Unit Tests (Pytest)

```bash
# Run all Master Admin tests
pytest backend/tests/master_admin/ -v

# Run with coverage
pytest backend/tests/master_admin/ --cov=app.models.master_admin --cov=app.services.master_admin --cov-report=html

# Target: 100% coverage
```

### Integration Tests

```bash
# Test database operations
pytest backend/tests/master_admin/test_integration.py -v

# Test with real database (not mocked)
pytest backend/tests/master_admin/ --integration
```

### Test Fixtures

```python
# backend/tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base


@pytest.fixture(scope="function")
def db_session():
    """Create a test database session."""
    engine = create_engine("postgresql://test:test@localhost/test_db")
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(engine)


@pytest.fixture
def auth_headers(test_user):
    """Generate authentication headers for testing."""
    # Mock Clerk JWT token
    token = generate_test_jwt(test_user)
    return {"Authorization": f"Bearer {token}"}
```

---

## Dependencies

### Python Packages

```txt
# Add to backend/requirements.txt
fastapi>=0.104.0
sqlalchemy>=2.0.0
alembic>=1.12.0
pydantic>=2.0.0
pytest>=7.4.0
pytest-cov>=4.1.0
httpx>=0.25.0
```

### Environment Variables

```bash
# Add to .env
DATABASE_URL=postgresql://user:password@localhost:5432/ma_saas_platform
CLERK_SECRET_KEY=sk_live_...
```

---

## Alembic Migration

```bash
# Generate migration
cd backend
alembic revision --autogenerate -m "Add Master Admin Portal tables"

# Review migration file
# backend/alembic/versions/XXXX_add_master_admin_portal_tables.py

# Run migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

---

## Success Criteria

- [ ] All 16 Master Admin tables created successfully
- [ ] All Alembic migrations pass without errors
- [ ] All SQLAlchemy models have 100% test coverage
- [ ] All Pydantic schemas have 100% test coverage
- [ ] All services have 100% test coverage
- [ ] All API endpoints have 100% test coverage
- [ ] All tests pass in CI/CD pipeline
- [ ] Code passes linting (flake8, mypy)
- [ ] API documentation generated (FastAPI /docs)
- [ ] Performance: API responses < 200ms

---

## Follow-Up Stories

1. **MAP-REBUILD-002**: Activity Tracker UI (React components with Vitest tests)
2. **MAP-REBUILD-003**: Prospect Management Backend
3. **MAP-REBUILD-004**: Pipeline Management Backend

---

## Evidence

- Commit history with TDD commits (test → code → refactor)
- Pytest coverage report showing 100% backend coverage
- CI/CD pipeline passing all tests
- Updated BMAD Progress Tracker

---

**Story Owner**: Manus AI  
**Reviewer**: Dudley Peacock  
**Last Updated**: October 31, 2025
