// Blog data structure for FinanceFlo.ai
// Comprehensive articles focused on AI+ERP integration and business transformation

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  seoTitle: string;
  metaDescription: string;
  featuredImage?: string;
  imageAlt?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const blogCategories: BlogCategory[] = [
  {
    id: 'ai-erp-integration',
    name: 'AI + ERP Integration',
    description: 'Comprehensive guides on integrating AI with ERP systems',
    color: 'blue'
  },
  {
    id: 'industry-insights',
    name: 'Industry Insights',
    description: 'Industry-specific ERP and AI implementation strategies',
    color: 'green'
  },
  {
    id: 'automation-workflows',
    name: 'Automation & Workflows',
    description: 'Business process automation and workflow optimization',
    color: 'purple'
  },
  {
    id: 'finance-transformation',
    name: 'Financial Transformation',
    description: 'Finance function modernization and digital transformation',
    color: 'orange'
  },
  {
    id: 'implementation-guides',
    name: 'Implementation Guides',
    description: 'Step-by-step guides for successful ERP implementation',
    color: 'indigo'
  },
  {
    id: 'implementation',
    name: 'Implementation',
    description: 'ERP implementation strategies, timelines, and best practices',
    color: 'indigo'
  },
  {
    id: 'erp-platforms',
    name: 'ERP Platforms',
    description: 'Platform-specific guides and comparisons',
    color: 'cyan'
  },
  {
    id: 'best-practices',
    name: 'Best Practices',
    description: 'Industry best practices and proven methodologies',
    color: 'amber'
  },
  {
    id: 'roi-optimization',
    name: 'ROI & Optimization',
    description: 'Maximizing return on investment and operational efficiency',
    color: 'red'
  },
];

// Blog posts are now loaded dynamically from MDX files in src/content/blog/
// This array is kept empty for backward compatibility
// Use the blog loading utilities to fetch posts from MDX files at runtime
export const allBlogPosts: BlogPost[] = [];

// Helper function to get posts by category
// Note: Pass the posts array as a parameter since posts are loaded dynamically
export const getPostsByCategory = (categoryId: string, posts: BlogPost[]): BlogPost[] => {
  return posts.filter(post => post.category === categoryId);
};

// Helper function to get featured posts
// Note: Pass the posts array as a parameter since posts are loaded dynamically
export const getFeaturedPosts = (posts: BlogPost[]): BlogPost[] => {
  return posts.filter(post => post.featured);
};

// Helper function to get recent posts
// Note: Pass the posts array as a parameter since posts are loaded dynamically
export const getRecentPosts = (posts: BlogPost[], limit: number = 6): BlogPost[] => {
  return posts
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, limit);
};

// Helper function to search posts
// Note: Pass the posts array as a parameter since posts are loaded dynamically
export const searchPosts = (query: string, posts: BlogPost[]): BlogPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return posts.filter(post =>
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export default allBlogPosts;
