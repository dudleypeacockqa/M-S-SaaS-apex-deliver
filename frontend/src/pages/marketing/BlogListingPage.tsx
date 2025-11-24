import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { fetchBlogPosts, type BlogPostSummary } from '../../services/blogService';

export const BlogListingPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'All Posts',
    'M&A Strategy',
    'Financial Planning',
    'Post-Merger Integration',
    'Working Capital',
    'Pricing Strategy',
  ];

  useEffect(() => {
    let isActive = true;

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: { category?: string; search?: string; limit?: number } = {
          limit: 100, // Get all posts
        };
        
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        
        const data = await fetchBlogPosts(params);
        if (!isActive) return;
        setPosts(data);
      } catch (err) {
        if (!isActive) return;
        console.error('Failed to load blog posts', err);
        setPosts([]);
        setError('Unable to load blog posts. Please try again later.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      loadPosts();
    }, searchTerm ? 300 : 0);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [selectedCategory, searchTerm]);

  return (
    <MarketingLayout>
      <SEO
        title="Blog | 100 Days & Beyond"
        description="Expert insights on M&A strategy, financial planning, post-merger integration, working capital management, and pricing optimization. Learn from industry leaders."
        keywords="M&A blog, financial planning, merger integration, working capital, pricing strategy"
        ogTitle="100 Days & Beyond Blog"
        ogDescription="Explore strategies, frameworks, and playbooks for every stage of the M&A lifecycle."
        ogUrl="https://financeflo.ai/blog"
        ogImage="https://financeflo.ai/assets/financial-analysis-visual.png"
        twitterTitle="100 Days & Beyond Blog"
        twitterDescription="Stay ahead with insights on M&A, FP&A, and portfolio value creation."
        twitterImage="https://financeflo.ai/assets/financial-analysis-visual.png"
        canonical="https://financeflo.ai/blog"
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Insights & Strategies for M&A Success
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Expert guidance on mergers, acquisitions, financial planning, and business transformation from the ApexDeliver team.
          </p>
        </div>
      </section>

      {/* Search and Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search blog posts"
                className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category === 'All Posts' ? 'all' : category);
                  setSearchTerm(''); // Clear search when category changes
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  (category === 'All Posts' && selectedCategory === 'all') ||
                  category.toLowerCase() === selectedCategory.toLowerCase()
                    ? 'bg-indigo-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Loading posts...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 font-semibold" role="alert">
                {error}
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No posts found' 
                  : 'No posts yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Check back soon for expert insights on M&A and financial planning.'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-6 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-center text-gray-600">
                <p>Showing {posts.length} post{posts.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  {post.featured_image_url ? (
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                      <div className="text-6xl">📊</div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full font-semibold">
                        {post.category}
                      </span>
                      <span>{post.read_time_minutes} min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-900 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="text-sm text-gray-500">
                      <span>By {post.author}</span>
                    </div>
                  </div>
                </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </MarketingLayout>
  );
};
