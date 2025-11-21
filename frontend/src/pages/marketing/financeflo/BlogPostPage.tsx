import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Clock, Calendar, User, ArrowLeft, Share2, BookOpen } from "lucide-react";
import { allBlogPosts, blogCategories } from "@/data/financeflo/blogData";
import { loadBlogPost, type BlogPost as LoadedBlogPost } from "@/utils/financeflo/loadBlogPosts";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { logger } from "@/utils/logger";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loadedPost, setLoadedPost] = useState<LoadedBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // First, find the post in the static data
  const staticPost = allBlogPosts.find(p => p.slug === slug);

  // Try to load the full content from MDX file
  useEffect(() => {
    if (slug) {
      loadBlogPost(slug)
        .then(mdxPost => {
          if (mdxPost) {
            setLoadedPost(mdxPost);
          }
          setIsLoading(false);
        })
        .catch(error => {
          logger.debug('Failed to load MDX post, falling back to static content', { error });
          setIsLoading(false);
        });
    }
  }, [slug]);

  // Use loaded post if available, otherwise fall back to static post
  const post = loadedPost || staticPost;

  if (!isLoading && !post) {
    return <Navigate to="/blog" replace />;
  }

  if (isLoading || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = blogCategories.find(cat => cat.id === post.category);
  const relatedPosts = allBlogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const getCategoryColor = (categoryId: string) => {
    const category = blogCategories.find(cat => cat.id === categoryId);
    return category?.color || 'blue';
  };

  const getCategoryName = (categoryId: string) => {
    const category = blogCategories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        logger.debug('Web Share API failed', { error });
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      {/* Article Header */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-blue-600 hover:text-blue-800"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>

          <div className="mb-6">
            <Badge
              variant="secondary"
              className={`mb-4 bg-${getCategoryColor(post.category)}-100 text-${getCategoryColor(post.category)}-800`}
            >
              {getCategoryName(post.category)}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg max-w-3xl mx-auto">
                <img
                  src={post.featuredImage}
                  alt={post.imageAlt || post.title}
                  className="w-full h-auto max-h-[600px] object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(post.publishDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{post.readTime} min read</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
                className="ml-auto"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-lg font-bold text-gray-900 mb-2 mt-4">{children}</h4>,
                    p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
                    ),
                    img: ({ src, alt }) => (
                      <div className="my-8 rounded-xl overflow-hidden shadow-lg max-w-3xl mx-auto">
                        <img
                          src={src}
                          alt={alt || ''}
                          className="w-full h-auto max-h-[600px] object-cover"
                        />
                      </div>
                    ),
                    table: ({ children }) => (
                      <div className="my-8 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-blue-50">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="bg-white divide-y divide-gray-200">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-gray-50 transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b-2 border-blue-200">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
                        {children}
                      </td>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-all"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8">
            Discover how AI-ERP integration can revolutionize your operations and drive unprecedented growth.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/contact'}
            >
              Schedule Free Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-600 transition-all duration-300"
              onClick={() => window.location.href = '/pricing'}
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <Badge 
                      variant="secondary" 
                      className={`mb-4 bg-${getCategoryColor(relatedPost.category)}-100 text-${getCategoryColor(relatedPost.category)}-800`}
                    >
                      {getCategoryName(relatedPost.category)}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {relatedPost.readTime} min read
                      </span>
                      <span>{new Date(relatedPost.publishDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = `/blog/${relatedPost.slug}`}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Ahead of the AI+ERP Revolution</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest insights, case studies, and implementation strategies delivered to your inbox.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email"
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 px-8">
              Subscribe Now
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Join 10,000+ business leaders transforming their operations with AI+ERP intelligence.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPostPage;

