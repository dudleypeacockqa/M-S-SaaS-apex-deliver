import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { fetchBlogPosts, type BlogPostSummary } from '../../services/blogService';

export const BlogListingPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
        const data = await fetchBlogPosts();
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

    loadPosts();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <MarketingLayout>
      <SEO
        title="Blog | 100 Days & Beyond"
        description="Expert insights on M&A strategy, financial planning, post-merger integration, working capital management, and pricing optimization. Learn from industry leaders."
        keywords="M&A blog, financial planning, merger integration, working capital, pricing strategy"
        ogTitle="100 Days & Beyond Blog"
        ogDescription="Explore strategies, frameworks, and playbooks for every stage of the M&A lifecycle."
        ogUrl="https://100daysandbeyond.com/blog"
        ogImage="https://100daysandbeyond.com/assets/financial-analysis-visual.png"
        twitterTitle="100 Days & Beyond Blog"
        twitterDescription="Stay ahead with insights on M&A, FP&A, and portfolio value creation."
        twitterImage="https://100daysandbeyond.com/assets/financial-analysis-visual.png"
        canonical="https://100daysandbeyond.com/blog"
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

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All Posts' ? 'all' : category)}
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
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Check back soon for expert insights on M&A and financial planning.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
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
          )}
        </div>
      </section>
    </MarketingLayout>
  );
};
