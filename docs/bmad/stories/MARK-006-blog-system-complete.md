# MARK-006: Blog System Complete with CMS Integration

**Story ID**: MARK-006
**Epic**: Marketing & Lead Generation
**Priority**: Medium
**Sprint**: Marketing 70% → 100% Completion
**Estimated Effort**: 6 hours
**Status**: Pending
**Created**: 2025-10-30
**Assigned To**: Claude Code (AI Developer)

---

## Story Description

### User Story
**As a** content marketing manager for 100daysandbeyond.com
**I want** a fully functional blog system with backend API, database, and simple CMS
**So that** I can publish SEO-optimized blog posts to drive organic traffic and convert readers to trial users

### Business Context
The blog system currently has:
- ✅ Frontend pages built (BlogListingPage, BlogPostPage)
- ✅ 12 blog posts written (50 planned in BLOG_CONTENT_PLAN.md)
- ❌ Backend API returns errors (blog_posts table may not exist)
- ❌ No CMS for managing posts (must edit JSON files manually)
- ❌ Posts not seeded in production database

Without a working blog:
- **SEO Impact**: Missing 50 pages of keyword-targeted content
- **Lead Generation**: No content marketing funnel
- **Organic Traffic**: Zero blog-driven visitors
- **Thought Leadership**: Can't establish authority in M&A space

Completing this enables the content marketing pillar of the £1.4M ARR Year 1 goal.

### Success Metrics
- Blog API endpoints return 200 OK
- All 12 existing posts display correctly on frontend
- CMS allows creating/editing/publishing posts
- Blog post pages rank for target keywords within 30 days
- Blog drives 100+ organic visitors/month within 90 days

---

## Requirements

### Functional Requirements

#### FR-1: Backend Blog API
- **FR-1.1**: Ensure `blog_posts` table exists in database with proper schema:
  - id (UUID primary key)
  - title (string)
  - slug (string, unique index)
  - excerpt (text)
  - content (text, markdown)
  - author (string)
  - category (string)
  - tags (array of strings)
  - featured_image_url (string, nullable)
  - published_at (timestamp, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)
  - status (enum: draft, published, archived)
  - organization_id (UUID, nullable - for future multi-tenant)

- **FR-1.2**: Create database migration to add blog_posts table

- **FR-1.3**: Implement API endpoints:
  - `GET /api/blog` - List all published posts (with pagination, filters)
  - `GET /api/blog/:slug` - Get single post by slug
  - `POST /api/blog` - Create new post (authenticated, admin only)
  - `PUT /api/blog/:id` - Update post (authenticated, admin only)
  - `DELETE /api/blog/:id` - Delete post (authenticated, admin only)
  - `GET /api/blog/categories` - List all categories with counts
  - `GET /api/blog/search?q=query` - Search posts by title/content

- **FR-1.4**: Add proper error handling (404 for not found, 500 for server errors)

- **FR-1.5**: Add CORS headers for frontend domain (100daysandbeyond.com)

#### FR-2: Database Seeding
- **FR-2.1**: Create seeding script to import `blog_posts_for_database.json`
- **FR-2.2**: Parse JSON and insert 12 posts into blog_posts table
- **FR-2.3**: Generate slugs from titles (lowercase, hyphenated)
- **FR-2.4**: Set all posts to "published" status
- **FR-2.5**: Set published_at to current timestamp

#### FR-3: Frontend Integration
- **FR-3.1**: Verify BlogListingPage fetches from `/api/blog` (not placeholder data)
- **FR-3.2**: Verify BlogPostPage fetches from `/api/blog/:slug`
- **FR-3.3**: Add loading states while fetching
- **FR-3.4**: Add error states for failed fetches
- **FR-3.5**: Add empty state for "No posts yet" (if API returns empty array)

#### FR-4: Simple CMS (Basic CRUD UI)
- **FR-4.1**: Create admin blog management page at `/admin/blog`
- **FR-4.2**: Display list of all posts (draft and published)
- **FR-4.3**: Add "New Post" button
- **FR-4.4**: Create post editor form:
  - Title input
  - Slug input (auto-generated from title, editable)
  - Excerpt textarea
  - Content textarea (markdown editor)
  - Category dropdown
  - Tags input (comma-separated)
  - Featured image URL input
  - Status select (draft, published)
  - Publish date picker
- **FR-4.5**: Add "Save Draft" and "Publish" buttons
- **FR-4.6**: Add "Edit" and "Delete" actions on post list

#### FR-5: Content Management
- **FR-5.1**: Import 12 existing posts from JSON to database (one-time)
- **FR-5.2**: Verify all 12 posts display correctly on frontend
- **FR-5.3**: Test creating new post via CMS
- **FR-5.4**: Test editing existing post
- **FR-5.5**: Test deleting post (soft delete, set status to archived)

### Non-Functional Requirements

#### NFR-1: Performance
- **NFR-1.1**: Blog listing page loads in <2 seconds
- **NFR-1.2**: Individual post pages load in <1.5 seconds
- **NFR-1.3**: API response time <500ms

#### NFR-2: SEO
- **NFR-2.1**: All blog posts have unique title tags
- **NFR-2.2**: All blog posts have meta descriptions
- **NFR-2.3**: All blog posts have Open Graph tags
- **NFR-2.4**: All blog posts have Article structured data (JSON-LD)

#### NFR-3: Security
- **NFR-3.1**: Blog CMS requires authentication (Clerk admin role)
- **NFR-3.2**: Public API endpoints (list, read) are unauthenticated
- **NFR-3.3**: Write endpoints (create, update, delete) require admin auth
- **NFR-3.4**: SQL injection protection (use parameterized queries)

---

## Technical Design

### Database Schema
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(100),
  category VARCHAR(50),
  tags TEXT[], -- PostgreSQL array
  featured_image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  organization_id UUID REFERENCES organizations(id) -- nullable for now
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
```

### API Endpoints
```python
# backend/app/api/routes/blog.py

@router.get("/blog", response_model=List[BlogPostResponse])
async def list_blog_posts(
    category: Optional[str] = None,
    limit: int = 10,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """List all published blog posts with pagination and filtering"""
    pass

@router.get("/blog/{slug}", response_model=BlogPostResponse)
async def get_blog_post(slug: str, db: AsyncSession = Depends(get_db)):
    """Get single blog post by slug"""
    pass

@router.post("/blog", response_model=BlogPostResponse)
async def create_blog_post(
    post: BlogPostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create new blog post (admin only)"""
    pass

@router.put("/blog/{id}", response_model=BlogPostResponse)
async def update_blog_post(
    id: str,
    post: BlogPostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update blog post (admin only)"""
    pass

@router.delete("/blog/{id}")
async def delete_blog_post(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete blog post (admin only, soft delete)"""
    pass
```

### Frontend Integration
```typescript
// frontend/src/services/api/blog.ts
export async function fetchBlogPosts(category?: string): Promise<BlogPost[]> {
  const url = category
    ? `${API_URL}/blog?category=${category}`
    : `${API_URL}/blog`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
}

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  const response = await fetch(`${API_URL}/blog/${slug}`);
  if (!response.ok) throw new Error('Post not found');
  return response.json();
}
```

---

## Test-Driven Development (TDD) Plan

### Backend API Tests

```python
# backend/tests/api/test_blog_endpoints.py

@pytest.mark.asyncio
async def test_list_blog_posts_returns_published_only(client: AsyncClient):
    """List endpoint returns only published posts"""
    response = await client.get("/api/blog")
    assert response.status_code == 200
    posts = response.json()
    assert len(posts) >= 0
    for post in posts:
        assert post['status'] == 'published'

@pytest.mark.asyncio
async def test_get_blog_post_by_slug(client: AsyncClient):
    """Get single post by slug"""
    response = await client.get("/api/blog/complete-guide-to-ma-deal-flow")
    assert response.status_code == 200
    post = response.json()
    assert post['slug'] == 'complete-guide-to-ma-deal-flow'
    assert 'title' in post
    assert 'content' in post

@pytest.mark.asyncio
async def test_get_nonexistent_post_returns_404(client: AsyncClient):
    """Getting non-existent post returns 404"""
    response = await client.get("/api/blog/nonexistent-slug")
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_create_post_requires_authentication(client: AsyncClient):
    """Creating post without auth returns 401"""
    response = await client.post("/api/blog", json={
        "title": "Test Post",
        "content": "Test content"
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_create_post_as_admin(client: AsyncClient, admin_user):
    """Admin can create blog post"""
    response = await client.post("/api/blog",
        json={
            "title": "New Test Post",
            "content": "This is test content",
            "category": "M&A Strategy",
            "status": "published"
        },
        headers={"Authorization": f"Bearer {admin_user.token}"}
    )
    assert response.status_code == 201
    post = response.json()
    assert post['title'] == "New Test Post"
    assert 'slug' in post  # auto-generated

@pytest.mark.asyncio
async def test_filter_by_category(client: AsyncClient):
    """Filter posts by category"""
    response = await client.get("/api/blog?category=M&A Strategy")
    assert response.status_code == 200
    posts = response.json()
    for post in posts:
        assert post['category'] == "M&A Strategy"
```

### Frontend Integration Tests

```typescript
// frontend/src/pages/marketing/BlogListingPage.test.tsx

describe('BlogListingPage', () => {
  it('fetches and displays blog posts from API', async () => {
    const mockPosts = [
      { title: 'Post 1', slug: 'post-1', excerpt: 'Excerpt 1' },
      { title: 'Post 2', slug: 'post-2', excerpt: 'Excerpt 2' },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    } as Response);

    render(<BlogListingPage />);

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
  });

  it('displays error message when API fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API Error'));

    render(<BlogListingPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  it('displays empty state when no posts exist', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    render(<BlogListingPage />);

    await waitFor(() => {
      expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
    });
  });
});
```

---

## Implementation Phases

### Phase 1: Database Setup (1 hour)
- [ ] Create blog_posts table migration
- [ ] Add indexes for slug, category, status, published_at
- [ ] Run migration on development database
- [ ] Verify table created correctly

### Phase 2: Backend API (2 hours)
- [ ] Create BlogPost SQLAlchemy model
- [ ] Create Pydantic schemas (BlogPostCreate, BlogPostResponse)
- [ ] Implement GET /api/blog endpoint
- [ ] Implement GET /api/blog/:slug endpoint
- [ ] Implement POST /api/blog endpoint (admin only)
- [ ] Implement PUT /api/blog/:id endpoint (admin only)
- [ ] Implement DELETE /api/blog/:id endpoint (admin only)
- [ ] Add proper error handling
- [ ] Test all endpoints with Postman/curl

### Phase 3: Database Seeding (30 min)
- [ ] Create seeding script to read blog_posts_for_database.json
- [ ] Parse JSON and generate slugs from titles
- [ ] Insert 12 posts into database
- [ ] Verify posts inserted correctly (query database)

### Phase 4: Frontend Integration (1 hour)
- [ ] Update BlogListingPage to call /api/blog
- [ ] Update BlogPostPage to call /api/blog/:slug
- [ ] Add loading spinners
- [ ] Add error messages
- [ ] Test in development (npm start)
- [ ] Verify 12 posts display correctly

### Phase 5: Simple CMS (1.5 hours)
- [ ] Create /admin/blog page (protected route)
- [ ] Add post list table with edit/delete actions
- [ ] Create post editor form
- [ ] Implement "New Post" functionality
- [ ] Implement "Edit Post" functionality
- [ ] Implement "Delete Post" functionality (soft delete)
- [ ] Test CRUD operations

### Phase 6: Testing & Deployment (30 min)
- [ ] Write backend API tests (15 tests)
- [ ] Write frontend integration tests (5 tests)
- [ ] Run full test suite
- [ ] Deploy to production (Render)
- [ ] Run seeding script on production database
- [ ] Verify blog works in production

---

## Acceptance Criteria

### Must Have
- [ ] blog_posts database table exists with proper schema
- [ ] Backend API endpoints return 200 OK:
  - GET /api/blog
  - GET /api/blog/:slug
- [ ] All 12 existing posts seeded in database
- [ ] BlogListingPage displays all 12 posts from API
- [ ] BlogPostPage displays individual posts correctly
- [ ] Click post card on listing page navigates to post detail
- [ ] Category filtering works
- [ ] Admin can create new posts via CMS
- [ ] Admin can edit existing posts via CMS
- [ ] Admin can delete posts via CMS (soft delete)
- [ ] All blog pages have SEO meta tags
- [ ] All tests passing (20+ new tests)

### Should Have
- [ ] Search functionality works
- [ ] Pagination works (10 posts per page)
- [ ] Markdown rendering works correctly
- [ ] Featured images display
- [ ] Related posts section works

### Nice to Have
- [ ] Rich text editor (instead of markdown textarea)
- [ ] Image upload for featured images
- [ ] Draft preview functionality
- [ ] Schedule post publishing

---

## Dependencies

### Internal Dependencies
- ✅ Backend FastAPI framework (already setup)
- ✅ PostgreSQL database (already setup)
- ✅ Frontend React app (already setup)
- ✅ Clerk authentication (for admin CMS)

### External Dependencies
- blog_posts_for_database.json (12 posts already written)
- Alembic for migrations
- Markdown parser (marked.js or remark)

---

## Risks & Mitigation

### Risk 1: Database Migration Fails in Production
**Risk**: Alembic migration may fail if table already exists
**Mitigation**: Check if table exists before creating, use IF NOT EXISTS

### Risk 2: JSON Seeding Script Errors
**Risk**: JSON parsing or insertion may fail
**Mitigation**: Validate JSON format, add error handling, test in development first

### Risk 3: CMS Requires Too Much Time
**Risk**: Building a full CMS may exceed 6 hours
**Mitigation**: Build MVP CMS with basic CRUD, defer advanced features (rich editor, image upload)

---

## Future Enhancements
- Rich text WYSIWYG editor (TinyMCE, Quill)
- Image upload and management
- Draft preview functionality
- Scheduled publishing
- Categories and tags management UI
- SEO preview in CMS
- Bulk actions (publish multiple posts)
- Comments system
- Related posts algorithm
- Reading time calculation

---

## Notes
- **Seeding**: Run seeding script ONCE to import 12 existing posts
- **CMS**: Keep it simple - focus on CRUD, not fancy features
- **Security**: Only admins can create/edit/delete posts
- **SEO**: Each post must have unique meta tags and structured data
- **Content**: 12 posts is good start, plan to add 38 more over time

---

## Definition of Done
- [ ] blog_posts table exists in both development and production databases
- [ ] All 5 backend API endpoints functional and tested
- [ ] 12 blog posts seeded in production database
- [ ] Frontend displays all 12 posts correctly
- [ ] Admin CMS allows creating/editing/deleting posts
- [ ] 20+ tests passing (backend + frontend)
- [ ] Blog system works in production (verified manually)
- [ ] Changes committed with blog feature message
- [ ] BMAD_PROGRESS_TRACKER.md updated
- [ ] Story marked complete in tracker

---

**Story Created**: 2025-10-30
**Last Updated**: 2025-10-30
**Author**: Claude Code (AI Developer)
**Reviewer**: TBD
