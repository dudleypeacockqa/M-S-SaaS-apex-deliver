import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import MarketingNav from '@/components/MarketingNav'; // Assuming this component exists
import MarketingFooter from '@/components/MarketingFooter'; // Assuming this component exists
import { Button } from '@/components/ui/button'; // shadcn/ui Button
import { Input } from '@/components/ui/input'; // shadcn/ui Input
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // shadcn/ui Card

// --- Types ---

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  slug: string;
  imageUrl: string;
};

type BlogCategory = 'M&A Strategy' | 'FP&A' | 'PMI' | 'Working Capital' | 'Pricing' | 'All';

// --- Placeholder Data ---

const categories: BlogCategory[] = ['All', 'M&A Strategy', 'FP&A', 'PMI', 'Working Capital', 'Pricing'];

const placeholderPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Synergy Realization: The Post-Merger Integration Playbook',
    excerpt: 'A deep dive into the critical steps for maximizing value capture after a successful M&A transaction.',
    category: 'PMI',
    date: 'Oct 25, 2025',
    slug: 'synergy-realization-pmi-playbook',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lcmdlcnxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 2,
    title: 'Forecasting in a Volatile Market: Advanced FP&A Techniques',
    excerpt: 'Explore cutting-edge financial planning and analysis methods to navigate economic uncertainty.',
    category: 'FP&A',
    date: 'Oct 20, 2025',
    slug: 'forecasting-volatile-market-fpa',
    imageUrl: 'https://images.unsplash.com/photo-1543286386-2e659306ebc5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZpbmFuY2lhbCUyMGFuYWx5c2lzfGVufDB8fDB8fHww',
  },
  {
    id: 3,
    title: 'The Art of Deal Structuring: M&A Strategy for Mid-Market Firms',
    excerpt: 'Key strategic considerations and tactical approaches for successful mergers and acquisitions in the middle market.',
    category: 'M&A Strategy',
    date: 'Oct 15, 2025',
    slug: 'deal-structuring-ma-strategy',
    imageUrl: 'https://images.unsplash.com/photo-1551288258-c8cb5a306422?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bSZhJTIwc3RyYXRlZ3l8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 4,
    title: 'Optimizing Cash Conversion Cycle for Maximum Liquidity',
    excerpt: 'Strategies to tighten up the working capital cycle and free up trapped cash within the business.',
    category: 'Working Capital',
    date: 'Oct 10, 2025',
    slug: 'optimizing-cash-conversion-cycle',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6aa5d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FzaCUyMGZsb3d8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 5,
    title: 'Value-Based Pricing: Moving Beyond Cost-Plus Models',
    excerpt: 'How to implement a pricing strategy that aligns with customer perceived value and drives higher margins.',
    category: 'Pricing',
    date: 'Oct 5, 2025',
    slug: 'value-based-pricing-strategy',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef01d843825a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByaWNpbmd8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 6,
    title: 'Integrating Financial Systems During PMI: A Checklist',
    excerpt: 'A comprehensive checklist for seamlessly merging disparate financial systems post-acquisition.',
    category: 'PMI',
    date: 'Sep 28, 2025',
    slug: 'integrating-financial-systems-pmi',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZpbmFuY2lhbCUyMHN5c3RlbXxlbnwwfHwwfHx8MA%3D%3D',
  },
];

// --- Component: BlogPostCard ---

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  // Branding Colors for the card border/accent
  const categoryColor = {
    'M&A Strategy': 'border-emerald-500', // Emerald Green
    'FP&A': 'border-blue-500', // Bright Blue
    'PMI': 'border-indigo-500', // Navy Blue variant
    'Working Capital': 'border-yellow-500',
    'Pricing': 'border-red-500',
    'All': 'border-gray-300',
  };

  return (
    <Card className={`overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full flex flex-col border-t-4 ${categoryColor[post.category]}`}>
      <div className="h-48 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-gray-500">{post.date} &bull; <span className="text-primary">{post.category}</span></p>
        <CardTitle className="text-xl font-bold leading-snug hover:text-primary transition-colors duration-200">
          <a href={`/blog/${post.slug}`} aria-label={`Read post: ${post.title}`}>
            {post.title}
          </a>
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
  );
};

// --- Component: BlogListingPage ---

const BlogListingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and Search Logic
  const filteredPosts = useMemo(() => {
    return placeholderPosts
      .filter(post => selectedCategory === 'All' || post.category === selectedCategory)
      .filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [selectedCategory, searchTerm]);

  // Define the primary brand colors
  const primaryColor = 'bg-indigo-900'; // Navy Blue
  const accentColor = 'bg-emerald-500'; // Emerald Green

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <header className="text-center mb-12">
          <h1 className={`text-4xl md:text-6xl font-extrabold text-gray-900 mb-4`}>
            Our Insights on <span className="text-primary">M&A and Finance</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay ahead with expert analysis and actionable strategies from ApexDeliver and CapLiquify.
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
            {/* Filter Placeholder - Could be a Select/Dropdown for mobile or more space */}
            {/* For simplicity and demonstration, we'll stick to buttons for now */}
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
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-700">No Results Found</h2>
              <p className="text-gray-500 mt-2">
                Try adjusting your search term or selecting a different category.
              </p>
              <Button
                variant="link"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default BlogListingPage;