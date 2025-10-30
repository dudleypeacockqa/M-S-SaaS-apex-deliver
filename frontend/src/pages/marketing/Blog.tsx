import React, { useState, useMemo, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';
import MarketingNav from '@/components/MarketingNav';
import MarketingFooter from '@/components/MarketingFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// --- Types ---

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  featured_image_url: string | null;
  read_time_minutes: number;
  published_at: string;
};

type BlogCategory = 'All Posts' | 'M&A Strategy' | 'FP&A' | 'PMI' | 'Working Capital' | 'Pricing Strategy';

// --- Component: BlogPostCard ---

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  // Branding Colors for the card border/accent
  const categoryColor: Record<string, string> = {
    'M&A Strategy': 'border-emerald-500',
    'FP&A': 'border-blue-500',
    'PMI': 'border-indigo-500',
    'Working Capital': 'border-yellow-500',
    'Pricing Strategy': 'border-red-500',
  };

  const borderClass = categoryColor[post.category] || 'border-gray-300';

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <a href={`/blog/${post.slug}`} className="block h-full">
      <Card className={`overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full flex flex-col border-t-4 ${borderClass}`}>
        {post.featured_image_url ? (
          <div className="h-48 overflow-hidden bg-gray-100">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-indigo-900 to-indigo-700 flex items-center justify-center">
            <FileText className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        <CardHeader className="pb-2">
          <p className="text-sm font-medium text-gray-500">
            {formatDate(post.published_at)} &bull; {post.read_time_minutes} min read &bull; <span className="text-primary">{post.category}</span>
          </p>
          <CardTitle className="text-xl font-bold leading-snug hover:text-primary transition-colors duration-200">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="p-0 h-auto text-primary font-semibold">
            Read More &rarr;
          </Button>
        </CardFooter>
      </Card>
    </a>
  );
};

// --- Component: BlogListingPage ---

const BlogListingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All Posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories: BlogCategory[] = [
    'All Posts',
    'M&A Strategy',
    'FP&A',
    'PMI',
    'Working Capital',
    'Pricing Strategy'
  ];

  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (selectedCategory !== 'All Posts') {
          params.append('category', selectedCategory);
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const url = `${API_BASE_URL}/api/blog?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, searchTerm]);

  // Define the primary brand colors
  const primaryColor = 'bg-indigo-900'; // Navy Blue

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Insights & Strategies for <span className="text-primary">M&A Success</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guidance on mergers, acquisitions, financial planning, and business transformation from the ApexDeliver team.
          </p>
        </header>

        {/* Search and Filter Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles by title or keyword..."
                className="w-full pl-10 pr-4 py-2 text-lg border-2 focus:border-primary transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search blog posts"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 max-w-6xl mx-auto" role="group" aria-label="Blog Categories">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`
                  font-semibold transition-all duration-200
                  ${selectedCategory === category
                    ? `${primaryColor} text-white hover:bg-indigo-800`
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }
                `}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Post Grid */}
        <section aria-live="polite" aria-atomic="true">
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16 border border-red-300 rounded-lg bg-red-50">
              <h2 className="text-2xl font-semibold text-red-700">Error Loading Posts</h2>
              <p className="text-red-600 mt-2">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700">No posts yet</h2>
              <p className="text-gray-500 mt-2">
                Check back soon for expert insights on M&A and financial planning.
              </p>
              {(selectedCategory !== 'All Posts' || searchTerm) && (
                <Button
                  variant="link"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All Posts');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default BlogListingPage;
