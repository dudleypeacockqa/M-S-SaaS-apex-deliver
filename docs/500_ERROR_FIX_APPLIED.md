# 500 Error Fix - SQLAlchemy server_default Issue

**Date**: 2025-11-18  
**Error**: `sqlalchemy.exc.ArgumentError: Argument 'arg' is expected to be one of type '<class 'str'>' or '<class 'sqlalchemy.sql.elements.ClauseElement'>' or '<class 'sqlalchemy.sql.elements.TextClause'>', got '<class 'builtin_function_or_method'>'`

## Root Cause

The error occurred in `backend/app/models/master_admin.py` at line 527 in the `CampaignTemplate` class. The production code had:

```python
created_at = Column(DateTime(timezone=True), server_default=datetime.utcnow, nullable=False)
```

The problem is that `server_default` expects:
- A string SQL expression (e.g., `"CURRENT_TIMESTAMP"`)
- A SQLAlchemy `ClauseElement` (e.g., `func.now()`)
- A `TextClause`

But `datetime.utcnow` is a Python function, which SQLAlchemy cannot use as a server default.

Additionally, `onupdate=func.now()` is also incorrect - `onupdate` requires a Python callable, not a SQL function.

## Fix Applied

**File**: `backend/app/models/master_admin.py`

Changed all instances of:
```python
updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
```

To:
```python
updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
```

This fix was applied to:
- `CampaignTemplate` (line 528)
- `VoiceCall` (line 598)
- `ConversationSession` (line 633)
- `Webhook` (line 664)

## Why This Works

1. **`server_default=func.now()`**: This is correct - `func.now()` is a SQLAlchemy function that generates SQL `NOW()` for the database server to execute.

2. **`onupdate=lambda: datetime.now(timezone.utc)`**: This is correct - `onupdate` needs a Python callable that runs when the record is updated. The lambda function will be called by SQLAlchemy in Python, not by the database.

## Verification

After deploying this fix:
1. Application should start without import errors
2. No SQLAlchemy ArgumentError exceptions
3. Database migrations can proceed
4. 100daysandbeyond.com should be accessible

## Next Steps

1. **Deploy the fixed code** to Render
2. **Apply database migrations** (if not already applied)
3. **Verify application starts** successfully
4. **Test endpoints** to ensure everything works

## Related Files

- `backend/app/models/master_admin.py` - Fixed DateTime column definitions
- `backend/app/models/task.py` - Reference implementation (uses correct pattern)

