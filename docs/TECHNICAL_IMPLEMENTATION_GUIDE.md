# Technical Implementation Guide - ApexDeliver Marketing Website

**Companion to:** WEBSITE_SPECIFICATION.md  
**Purpose:** Detailed technical instructions for developers working on the codebase

---

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Code Architecture Patterns](#code-architecture-patterns)
3. [Component Guidelines](#component-guidelines)
4. [API Integration](#api-integration)
5. [Database Operations](#database-operations)
6. [Authentication Flow](#authentication-flow)
7. [Styling Conventions](#styling-conventions)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Code Examples](#code-examples)

---

## Development Environment Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 14+
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver.git
cd M-S-SaaS-apex-deliver

# Frontend setup
cd frontend
npm install
cp .env.example .env  # Create and configure environment variables

# Backend setup
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Create and configure environment variables

# Database setup
createdb ma_saas_dev
# Run migrations (if using Alembic)
alembic upgrade head
```

### Environment Variables

#### Frontend (`.env`)
```bash
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

#### Backend (`.env`)
```bash
DATABASE_URL=postgresql://localhost/ma_saas_dev
CLERK_SECRET_KEY=sk_test_your_key_here
SECRET_KEY=your-jwt-secret-key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Code Architecture Patterns

### Frontend Architecture

#### Component Organization
```
src/
├── pages/              # Page-level components (routes)
│   ├── marketing/      # Public marketing pages
│   └── [feature]/      # Feature-specific pages
├── components/
│   ├── marketing/      # Marketing-specific components
│   ├── common/         # Shared components
│   └── [feature]/      # Feature-specific components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── assets/             # Static assets
└── App.tsx             # Main application component
```

#### Naming Conventions
- **Components:** PascalCase (e.g., `MarketingNav.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utils:** camelCase (e.g., `formatDate.ts`)
- **Types:** PascalCase with descriptive names (e.g., `BlogPostResponse`)

### Backend Architecture

#### FastAPI Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── routes/         # API route handlers
│   │   │   ├── blog.py
│   │   │   └── ...
│   │   └── __init__.py     # Router aggregation
│   ├── models/             # SQLAlchemy models
│   │   ├── blog_post.py
│   │   └── ...
│   ├── schemas/            # Pydantic schemas
│   ├── db/
│   │   ├── session.py      # Database session
│   │   └── base.py         # Base model
│   ├── core/
│   │   ├── config.py       # Configuration
│   │   └── security.py     # Auth utilities
│   └── main.py             # FastAPI app
└── requirements.txt
```

---

## Component Guidelines

### Creating a New Marketing Page

```typescript
// frontend/src/pages/marketing/NewPage.tsx
import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';

export const NewPage: React.FC = () => {
  return (
    <MarketingLayout>
      <SEO
        title="Page Title | ApexDeliver + CapLiquify"
        description="Page description for SEO"
        keywords="keyword1, keyword2, keyword3"
        ogTitle="Open Graph Title"
        ogDescription="OG description"
        ogUrl="https://100daysandbeyond.com/new-page"
        canonical="https://100daysandbeyond.com/new-page"
      />
      
      {/* Page content */}
      <div className="min-h-screen">
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Page Heading
            </h1>
            {/* Content */}
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
};

export default NewPage;
```

### Adding Route

```typescript
// frontend/src/App.tsx
import { lazy } from 'react';

const NewPage = lazy(() => import('./pages/marketing/NewPage'));

// In Routes section
<Route path="new-page" element={<NewPage />} />
```

### Creating Reusable Components

```typescript
// frontend/src/components/common/Button.tsx
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-colors';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};
```

---

## API Integration

### Setting Up API Client

```typescript
// frontend/src/utils/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);
```

### Fetching Data with React Query

```typescript
// frontend/src/hooks/useBlogPosts.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  featured_image: string | null;
  author: string;
  read_time_minutes: number;
  published_at: string;
}

export const useBlogPosts = (category?: string, search?: string) => {
  return useQuery({
    queryKey: ['blog-posts', category, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await apiClient.get<BlogPost[]>(
        `/api/blog?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Usage in component
const { data: posts, isLoading, error } = useBlogPosts(selectedCategory, searchTerm);
```

---

## Database Operations

### Creating a New Model

```python
# backend/app/models/example.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Example(Base):
    __tablename__ = "examples"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Example(id={self.id}, title='{self.title}')>"
```

### Creating API Endpoints

```python
# backend/app/api/routes/example.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.models.example import Example

router = APIRouter(prefix="/examples", tags=["examples"])


class ExampleResponse(BaseModel):
    id: int
    title: str
    description: str | None
    is_active: bool
    created_at: str
    
    class Config:
        from_attributes = True


class ExampleCreate(BaseModel):
    title: str
    description: str | None = None


@router.get("", response_model=List[ExampleResponse])
def list_examples(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get list of examples."""
    query = select(Example).where(Example.is_active == True).offset(skip).limit(limit)
    result = db.execute(query)
    examples = result.scalars().all()
    return examples


@router.post("", response_model=ExampleResponse, status_code=201)
def create_example(
    example: ExampleCreate,
    db: Session = Depends(get_db),
):
    """Create a new example."""
    db_example = Example(**example.dict())
    db.add(db_example)
    db.commit()
    db.refresh(db_example)
    return db_example


@router.get("/{example_id}", response_model=ExampleResponse)
def get_example(
    example_id: int,
    db: Session = Depends(get_db),
):
    """Get example by ID."""
    query = select(Example).where(Example.id == example_id)
    result = db.execute(query)
    example = result.scalar_one_or_none()
    
    if not example:
        raise HTTPException(status_code=404, detail="Example not found")
    
    return example
```

### Registering Routes

```python
# backend/app/api/__init__.py
from fastapi import APIRouter
from app.api.routes import blog, example

api_router = APIRouter()

api_router.include_router(blog.router)
api_router.include_router(example.router)
```

### Database Migrations (Alembic)

```bash
# Create migration
alembic revision --autogenerate -m "Add examples table"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## Authentication Flow

### Clerk Integration

#### Frontend - Protected Route

```typescript
// frontend/src/components/auth/ProtectedRoute.tsx
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{children}</>;
};

// Usage in App.tsx
<Route 
  path="dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

#### Backend - Verify Clerk Token

```python
# backend/app/core/security.py
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from clerk_backend_api import Clerk
import os

security = HTTPBearer()
clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """Verify Clerk JWT token and return user info."""
    token = credentials.credentials
    
    try:
        # Verify token with Clerk
        user = clerk.verify_token(token)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )


# Usage in route
from app.core.security import get_current_user

@router.get("/protected")
def protected_route(current_user = Depends(get_current_user)):
    return {"message": f"Hello {current_user.email}"}
```

---

## Styling Conventions

### Tailwind CSS Patterns

#### Responsive Design
```tsx
<div className="
  px-4 sm:px-6 lg:px-8           // Responsive padding
  max-w-7xl mx-auto              // Centered container
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  // Responsive grid
  gap-4 sm:gap-6 lg:gap-8        // Responsive gaps
">
```

#### Common Color Palette
- **Primary:** `indigo-600`, `indigo-700`, `indigo-900`
- **Secondary:** `purple-600`, `purple-700`
- **Success:** `emerald-500`, `emerald-600`
- **Danger:** `red-500`, `red-600`
- **Neutral:** `gray-50` to `gray-900`

#### Button Styles
```tsx
// Primary CTA
className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"

// Secondary
className="bg-white hover:bg-gray-50 text-indigo-600 font-semibold px-6 py-3 rounded-lg border-2 border-indigo-600 transition-colors"

// Outline
className="border-2 border-gray-300 hover:border-indigo-600 text-gray-700 hover:text-indigo-600 font-semibold px-6 py-3 rounded-lg transition-colors"
```

---

## Common Tasks

### Adding a New Blog Post (Manual)

```python
# backend/scripts/add_blog_post.py
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.session import SessionLocal
from app.models.blog_post import BlogPost

def add_blog_post():
    db = SessionLocal()
    
    post = BlogPost(
        title="Your Blog Post Title",
        slug="your-blog-post-title",
        excerpt="A compelling summary of your post...",
        content="# Full Content\n\nYour markdown content here...",
        category="M&A Strategy",
        primary_keyword="M&A strategy",
        secondary_keywords="deal sourcing,acquisition strategy",
        meta_description="Learn about M&A strategy in this comprehensive guide...",
        featured_image_url="https://example.com/image.jpg",
        author="ApexDeliver Team",
        read_time_minutes=10,
        published=True,
        published_at=datetime.utcnow()
    )
    
    db.add(post)
    db.commit()
    db.refresh(post)
    
    print(f"Created blog post: {post.title} (ID: {post.id})")
    db.close()

if __name__ == "__main__":
    add_blog_post()
```

### Importing Blog Posts from JSON

```python
# backend/scripts/import_blog_posts.py
import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.blog_post import BlogPost

def import_blog_posts(json_file_path: str):
    db = SessionLocal()
    
    with open(json_file_path, 'r') as f:
        posts_data = json.load(f)
    
    for post_data in posts_data:
        # Check if post already exists
        existing = db.query(BlogPost).filter_by(slug=post_data['slug']).first()
        if existing:
            print(f"Skipping existing post: {post_data['title']}")
            continue
        
        post = BlogPost(
            title=post_data['title'],
            slug=post_data['slug'],
            excerpt=post_data['excerpt'],
            content=post_data['content'],
            category=post_data['category'],
            primary_keyword=post_data['primary_keyword'],
            secondary_keywords=post_data.get('secondary_keywords', ''),
            meta_description=post_data['meta_description'],
            featured_image_url=post_data.get('featured_image_url'),
            author=post_data.get('author', 'ApexDeliver Team'),
            read_time_minutes=post_data.get('read_time_minutes', 10),
            published=post_data.get('published', True),
            published_at=datetime.fromisoformat(post_data['published_at']) if 'published_at' in post_data else datetime.utcnow()
        )
        
        db.add(post)
        print(f"Imported: {post.title}")
    
    db.commit()
    db.close()
    print("Import complete!")

if __name__ == "__main__":
    import_blog_posts("/home/ubuntu/blog_posts_for_database.json")
```

### Adding Environment Variable on Render

```bash
# Using Render API
curl -X PUT \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.render.com/v1/services/SERVICE_ID/env-vars" \
  -d '[
    {
      "key": "NEW_ENV_VAR",
      "value": "value_here"
    }
  ]'

# Then trigger deployment
curl -X POST \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  "https://api.render.com/v1/services/SERVICE_ID/deploys" \
  -d '{"clearCache": "clear"}'
```

---

## Troubleshooting

### Frontend Build Fails

**Issue:** TypeScript errors preventing build

**Solution 1:** Temporarily disable TypeScript checking
```json
// package.json
"scripts": {
  "build": "vite build",
  "build:check": "tsc -b && vite build"
}
```

**Solution 2:** Fix TypeScript errors
```bash
# Check errors
npm run build:check

# Common fixes:
# - Add missing type annotations
# - Import missing types
# - Fix unused variables (remove or prefix with _)
```

### Backend API Returns 500 Error

**Issue:** Internal Server Error on API call

**Debugging Steps:**
1. Check backend logs on Render dashboard
2. Test API locally:
```bash
cd backend
uvicorn app.main:app --reload
curl http://localhost:8000/api/blog
```

3. Common causes:
   - Database connection failed
   - Missing environment variables
   - Model/schema mismatch
   - Unhandled exception in route

**Fix:** Add error logging
```python
import logging

logger = logging.getLogger(__name__)

@router.get("/endpoint")
def endpoint(db: Session = Depends(get_db)):
    try:
        # Your code
        pass
    except Exception as e:
        logger.error(f"Error in endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
```

### CORS Errors

**Issue:** Frontend can't call backend API

**Solution:** Configure CORS in backend
```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://100daysandbeyond.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database Migration Issues

**Issue:** Alembic migration fails

**Solution:**
```bash
# Reset migrations (CAUTION: Only in development)
alembic downgrade base
alembic upgrade head

# Or create manual migration
alembic revision -m "Manual migration"
# Edit the generated file in alembic/versions/
alembic upgrade head
```

---

## Code Examples

### Complete Feature Implementation Example

#### 1. Create Database Model

```python
# backend/app/models/testimonial.py
from sqlalchemy import Column, Integer, String, Text, Boolean
from app.db.base import Base

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    company = Column(String(100))
    role = Column(String(100))
    content = Column(Text, nullable=False)
    avatar_url = Column(String(500))
    rating = Column(Integer, default=5)
    featured = Column(Boolean, default=False)
```

#### 2. Create API Endpoint

```python
# backend/app/api/routes/testimonials.py
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.models.testimonial import Testimonial

router = APIRouter(prefix="/testimonials", tags=["testimonials"])


class TestimonialResponse(BaseModel):
    id: int
    name: str
    company: str | None
    role: str | None
    content: str
    avatar_url: str | None
    rating: int
    
    class Config:
        from_attributes = True


@router.get("", response_model=List[TestimonialResponse])
def list_testimonials(
    featured_only: bool = False,
    db: Session = Depends(get_db),
):
    query = select(Testimonial)
    if featured_only:
        query = query.where(Testimonial.featured == True)
    
    result = db.execute(query)
    return result.scalars().all()
```

#### 3. Register Route

```python
# backend/app/api/__init__.py
from app.api.routes import testimonials

api_router.include_router(testimonials.router)
```

#### 4. Create Frontend Hook

```typescript
// frontend/src/hooks/useTestimonials.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api';

interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  role: string | null;
  content: string;
  avatar_url: string | null;
  rating: number;
}

export const useTestimonials = (featuredOnly: boolean = false) => {
  return useQuery({
    queryKey: ['testimonials', featuredOnly],
    queryFn: async () => {
      const response = await apiClient.get<Testimonial[]>(
        `/api/testimonials?featured_only=${featuredOnly}`
      );
      return response.data;
    },
  });
};
```

#### 5. Create Component

```typescript
// frontend/src/components/marketing/Testimonials.tsx
import React from 'react';
import { useTestimonials } from '../../hooks/useTestimonials';

export const Testimonials: React.FC = () => {
  const { data: testimonials, isLoading } = useTestimonials(true);
  
  if (isLoading) {
    return <div>Loading testimonials...</div>;
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Clients Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                {testimonial.avatar_url && (
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                "{testimonial.content}"
              </p>
              
              <div className="flex">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

#### 6. Use in Page

```typescript
// frontend/src/pages/marketing/Home.tsx
import { Testimonials } from '../../components/marketing/Testimonials';

export const Home: React.FC = () => {
  return (
    <MarketingLayout>
      {/* Other sections */}
      <Testimonials />
      {/* More sections */}
    </MarketingLayout>
  );
};
```

---

## Performance Optimization

### Frontend

#### Code Splitting
```typescript
// Use lazy loading for routes
const Blog = lazy(() => import('./pages/marketing/Blog'));
const Features = lazy(() => import('./pages/marketing/FeaturesPage'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="blog" element={<Blog />} />
    <Route path="features" element={<Features />} />
  </Routes>
</Suspense>
```

#### Image Optimization
```tsx
// Use responsive images
<img
  src="/images/hero-lg.jpg"
  srcSet="
    /images/hero-sm.jpg 640w,
    /images/hero-md.jpg 1024w,
    /images/hero-lg.jpg 1920w
  "
  sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
  alt="Hero image"
  loading="lazy"
/>
```

### Backend

#### Database Query Optimization
```python
# Use select with specific columns
query = select(BlogPost.id, BlogPost.title, BlogPost.slug)

# Add indexes
class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    slug = Column(String(200), unique=True, index=True)
    category = Column(String(100), index=True)
    published_at = Column(DateTime, index=True)
```

#### Caching
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_categories():
    # Expensive operation
    return categories
```

---

## Testing

### Frontend Tests

```typescript
// frontend/src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Backend Tests

```python
# backend/tests/test_blog.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_blog_posts():
    response = client.get("/api/blog")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_blog_post_by_slug():
    response = client.get("/api/blog/test-slug")
    assert response.status_code in [200, 404]
    
def test_list_categories():
    response = client.get("/api/blog/categories/list")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] TypeScript compilation successful (if enabled)
- [ ] Environment variables configured on Render
- [ ] Database migrations applied
- [ ] API endpoints tested locally
- [ ] Frontend builds successfully
- [ ] No console errors in browser

### Post-Deployment
- [ ] Verify homepage loads
- [ ] Test navigation and dropdowns
- [ ] Check blog page displays posts
- [ ] Test sign-up flow
- [ ] Verify booking page works
- [ ] Test pricing page
- [ ] Check mobile responsiveness
- [ ] Verify analytics tracking

---

**Document Version:** 1.0  
**Last Updated:** October 29, 2025  
**For:** Codex CLI and development team
