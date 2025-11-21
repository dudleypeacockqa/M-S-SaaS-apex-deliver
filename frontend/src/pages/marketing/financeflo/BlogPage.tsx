import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { NewsletterSignupGDPR } from "@/components/marketing/financeflo/NewsletterSignupGDPR";
import { blogCategories, getFeaturedPosts } from "@/data/financeflo/blogData";
import { loadBlogPosts, type BlogPost } from "@/utils/financeflo/loadBlogPosts";

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(9);

  // Load blog posts from MDX files on mount
  useEffect(() => {
    loadBlogPosts().then(posts => {
      setAllBlogPosts(posts);
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to load blog posts:', error);
      setIsLoading(false);
    });
  }, []);

  const categories = ["All", ...blogCategories.map(cat => cat.name)];

  const featuredPosts = getFeaturedPosts(allBlogPosts);
  const featuredPost = featuredPosts.length > 0 ? featuredPosts[0] : allBlogPosts[0];

  const getCategoryColor = (categoryId: string) => {
    const category = blogCategories.find(cat => cat.id === categoryId);
    return category?.color || 'blue';
  };

  const getCategoryName = (categoryId: string) => {
    const category = blogCategories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const filteredPosts = allBlogPosts.filter(post => {
    const matchesSearch = searchTerm === "" ||
                         post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || getCategoryName(post.category) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Reset visible posts when filters change
  useEffect(() => {
    setVisiblePosts(9);
  }, [searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              FinanceFlo.ai Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Insights, best practices, and industry trends in AI-powered business automation
            </p>
            
            {/* Newsletter Signup */}
            <div className="max-w-md mx-auto">
              <NewsletterSignupGDPR variant="inline" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-brand-green text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-brand-green hover:text-brand-green"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full relative overflow-hidden">
                    {featuredPost.featuredImage ? (
                      <img 
                        src={featuredPost.featuredImage} 
                        alt={featuredPost.imageAlt || featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-brand-navy to-brand-green flex items-center justify-center">
                        <div className="text-white text-center p-8">
                          <h3 className="text-xl font-bold mb-2">FinanceFlo.AI</h3>
                          <p className="text-sm opacity-90">AI-Powered ERP Solutions</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`bg-${getCategoryColor(featuredPost.category)}-100 text-${getCategoryColor(featuredPost.category)}-800 text-xs font-semibold px-2.5 py-0.5 rounded`}>
                      {getCategoryName(featuredPost.category)}
                    </span>
                    <span className="text-sm text-gray-500">{featuredPost.readTime} min read</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(featuredPost.publishDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center text-brand-green hover:text-brand-green-dark font-medium"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(0, visiblePosts).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 relative overflow-hidden">
                  {post.featuredImage ? (
                    <img 
                      src={post.featuredImage} 
                      alt={post.imageAlt || post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-brand-navy to-brand-green flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <h4 className="text-lg font-bold">FinanceFlo.AI</h4>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`bg-${getCategoryColor(post.category)}-100 text-${getCategoryColor(post.category)}-800 text-xs font-semibold px-2.5 py-0.5 rounded`}>
                      {getCategoryName(post.category)}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime} min read</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.publishDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Load More */}
        {filteredPosts.length > visiblePosts && (
          <div className="text-center">
            <button 
              onClick={() => setVisiblePosts(prev => Math.min(prev + 9, filteredPosts.length))}
              className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors"
            >
              Load More Articles ({filteredPosts.length - visiblePosts} remaining)
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or category filter.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-brand-navy to-brand-green text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated with Industry Insights
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Get the latest articles, case studies, and industry trends delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-brand-green hover:bg-brand-green-dark px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;

