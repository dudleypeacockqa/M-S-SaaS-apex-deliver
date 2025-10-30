import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { CTASection } from '../../components/marketing/CTASection';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  primary_keyword: string;
  meta_description: string;
  read_time_minutes: number;
  featured_image_url?: string;
}

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        // Fetch the main post
        const postResponse = await fetch(`${API_BASE_URL}/api/blog/${slug}`);
        if (!postResponse.ok) {
          throw new Error('Post not found');
        }
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch related posts from same category
        const relatedResponse = await fetch(`${API_BASE_URL}/api/blog?category=${encodeURIComponent(postData.category)}&limit=4`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          // Filter out current post and limit to 3
          const filtered = relatedData.filter((p: BlogPost) => p.slug !== slug).slice(0, 3);
          setRelatedPosts(filtered);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setPost(null);
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <MarketingLayout>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      </MarketingLayout>
    );
  }

  if (!post) {
    return (
      <MarketingLayout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-indigo-900 hover:underline font-semibold">
            ← Back to Blog
          </Link>
        </div>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <SEO
        title={`${post.title} | ApexDeliver + CapLiquify Blog`}
        description={post.meta_description}
        keywords={post.primary_keyword}
      />

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <Link to="/blog" className="text-indigo-900 hover:underline">Blog</Link>
          <span className="mx-2 text-gray-400">→</span>
          <span className="text-gray-600">{post.category}</span>
        </nav>

        {/* Title and Meta */}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full font-semibold">
              {post.category}
            </span>
            <span>{post.read_time_minutes} min read</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>By {post.author}</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mb-12 rounded-xl overflow-hidden">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg prose-indigo max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Author Bio */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-900">DP</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author}</h3>
              <p className="text-gray-600">
                Founder & CEO of ApexDeliver. M&A professional and entrepreneur with decades of experience in finance, technology, and business transformation. Passionate about democratizing access to enterprise-grade deal intelligence tools.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  {relatedPost.featured_image_url ? (
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <img
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                      <div className="text-6xl">📊</div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm text-indigo-900 font-semibold mb-2">{relatedPost.category}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-900 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection />
    </MarketingLayout>
  );
};
