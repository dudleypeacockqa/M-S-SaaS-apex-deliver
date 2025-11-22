/**
 * Blog Post / Article Schema (schema.org) Utilities
 * Creates structured data for blog posts and articles
 *
 * @see https://schema.org/Article
 * @see https://schema.org/BlogPosting
 */

interface BlogPost {
  title: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  excerpt?: string;
  featuredImage?: string;
  url?: string;
  tags?: string[];
  wordCount?: number;
}

/**
 * Creates an Article schema for a blog post
 *
 * @param post - Blog post information
 * @returns Article schema object
 */
export function createBlogPostSchema(post: BlogPost) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'FinanceFlo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://financeflo.ai/assets/brand/financeflo-wordmark.svg',
      },
    },
  };

  // Add optional fields if provided
  if (post.excerpt) {
    schema.description = post.excerpt;
  }

  if (post.featuredImage) {
    schema.image = post.featuredImage;
  }

  if (post.url) {
    schema.url = post.url;
    schema.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': post.url,
    };
  }

  if (post.updatedAt) {
    schema.dateModified = post.updatedAt;
  } else {
    // If no update date, use published date
    schema.dateModified = post.publishedAt;
  }

  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags;
  }

  if (post.wordCount) {
    schema.wordCount = post.wordCount;
  }

  return schema;
}

/**
 * Type exports for external use
 */
export type { BlogPost };
