// Removed gray-matter import to avoid Buffer dependency in browser

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

export interface BlogPostMetadata {
  title: string;
  slug: string;
  publishDate: string;
  author: string;
  category: string;
  featured: boolean;
  excerpt: string;
  featuredImage?: string;
  imageAlt?: string;
  tags: string[];
  readTime: number;
  seoTitle: string;
  metaDescription: string;
}

/**
 * Loads all blog posts from MD/MDX files using Vite's glob import
 * This function uses dynamic imports at build time
 */
export async function loadBlogPosts(): Promise<BlogPost[]> {
  console.log('Loading blog posts at:', new Date().toISOString());
  
  // Use a static glob pattern that Vite can handle at build time
  const mdxFiles = import.meta.glob('../content/blog/*.{md,mdx}', {
    query: '?raw',
    eager: false,
  });

  console.log('Found MDX files:', Object.keys(mdxFiles));

  if (Object.keys(mdxFiles).length === 0) {
    console.error('No MDX files found, using fallback');
    return getFallbackPosts();
  }

  const posts: BlogPost[] = [];

  for (const [path, loader] of Object.entries(mdxFiles)) {
    try {
      console.log(`Loading blog post from: ${path}`);
      
      // Load the file content
      const content = await (loader as () => Promise<any>)();
      console.log(`Content type for ${path}:`, typeof content, content);
      console.log(`Content keys for ${path}:`, Object.keys(content));
      console.log(`Content values for ${path}:`, Object.values(content));
      
      // Handle different possible return types
      let fileContent: string;
      if (typeof content === 'string') {
        fileContent = content;
      } else if (content && typeof content === 'object') {
        // Handle Module object - try different properties
        if (content.default && typeof content.default === 'string') {
          fileContent = content.default;
        } else if (content.default && typeof content.default === 'function') {
          // If default is a function, call it to get the content
          const result = content.default();
          if (typeof result === 'string') {
            fileContent = result;
          } else if (result && typeof result === 'object') {
            // Check if it's a React element with content in the 'type' property
            if (result.$$typeof && result.type && typeof result.type === 'string') {
              fileContent = result.type;
            } else if (result.default) {
              fileContent = result.default;
            } else {
              console.error(`Function result is not a string for ${path}:`, typeof result, result);
              continue;
            }
          } else {
            console.error(`Function result is not a string for ${path}:`, typeof result, result);
            continue;
          }
        } else if (content.__vite_ssr_import__) {
          // Handle Vite SSR import
          fileContent = content.__vite_ssr_import__();
        } else {
          // Try to find any string property
          const stringProps = Object.values(content).filter(val => typeof val === 'string');
          if (stringProps.length > 0) {
            fileContent = stringProps[0] as string;
          } else {
            console.error(`No string content found in module for ${path}:`, Object.keys(content));
            continue;
          }
        }
      } else {
        console.error(`Invalid content structure for ${path}:`, content);
        continue;
      }
      
      if (!fileContent || typeof fileContent !== 'string') {
        console.error(`Invalid file content for ${path}:`, typeof fileContent);
        continue;
      }

      // Parse frontmatter manually to avoid Buffer dependency
      const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      const metadata: BlogPostMetadata = {};
      let mdxContent = fileContent;
      
      if (frontmatterMatch) {
        const frontmatterText = frontmatterMatch[1];
        mdxContent = frontmatterMatch[2];
        
        // Parse YAML frontmatter manually
        const lines = frontmatterText.split('\n');
        for (const line of lines) {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            
            // Handle arrays (tags)
            if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
              const arrayContent = value.slice(1, -1);
              metadata[key] = arrayContent.split(',').map(tag => tag.trim().replace(/['"]/g, ''));
            } else {
              metadata[key] = value;
            }
          }
        }
      }

      // Extract slug from filename if not in frontmatter
      const slug = metadata.slug || path.split('/').pop()?.replace(/\.(md|mdx)$/, '') || '';

      // Create blog post object
      const post: BlogPost = {
        id: slug,
        slug,
        title: metadata.title,
        excerpt: metadata.excerpt,
        content: mdxContent,
        author: metadata.author || 'FinanceFlo.ai Team',
        publishDate: metadata.publishDate,
        category: metadata.category,
        tags: metadata.tags || [],
        readTime: metadata.readTime || calculateReadTime(mdxContent),
        featured: metadata.featured || false,
        seoTitle: metadata.seoTitle || metadata.title,
        metaDescription: metadata.metaDescription || metadata.excerpt,
        featuredImage: metadata.featuredImage,
        imageAlt: metadata.imageAlt,
      };

      posts.push(post);
      console.log(`Successfully loaded blog post: ${post.title}`);
    } catch (error) {
      console.error(`Error loading blog post from ${path}:`, error);
    }
  }

  console.log(`Total posts loaded: ${posts.length}`);
  // Sort by publish date (newest first)
  return posts.sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

// Fallback function with all your actual blog posts
function getFallbackPosts(): BlogPost[] {
  return [
    {
      id: 'ai-finance-automation-transforming-financial-operations',
      slug: 'ai-finance-automation-transforming-financial-operations',
      title: 'Can Finance Be Automated by AI? How Intelligent Automation is Transforming the Future of Financial Operations',
      excerpt: 'Discover how AI automation is revolutionising finance—streamlining operations, improving compliance, and empowering finance teams to focus on strategy over spreadsheets.',
      content: 'Full content would be loaded from MDX file...',
      author: 'FinanceFlo.ai Team',
      publishDate: '2025-02-01',
      category: 'automation-workflows',
      tags: ['AI finance automation', 'intelligent automation', 'ERP integration', 'finance transformation', 'RPA', 'machine learning'],
      readTime: 10,
      featured: true,
      seoTitle: 'AI Finance Automation: Transforming Financial Operations in 2025',
      metaDescription: 'Learn how AI automation is revolutionising finance. Explore the technologies, benefits, and real-world examples shaping the future of financial operations.',
      featuredImage: '/assets/blog/ai-finance-automation-transforming-financial-operations.jpg',
      imageAlt: 'Abstract digital dashboard showing AI automating financial operations with data visualisations and robotic process automation.'
    },
    {
      id: 'ai-powered-finance-transformation-guide-2025',
      slug: 'ai-powered-finance-transformation-guide-2025',
      title: 'AI-Powered Finance: Complete Transformation Guide for UK Businesses',
      excerpt: 'Comprehensive guide to transforming finance operations with AI. Discover automation strategies, implementation roadmaps, and ROI optimization for UK mid-market businesses.',
      content: 'Full content would be loaded from MDX file...',
      author: 'Manus AI',
      publishDate: '2025-01-14',
      category: 'ai-erp-integration',
      tags: ['AI Finance','Finance Automation','Predictive Analytics','Digital Transformation','Machine Learning'],
      readTime: 15,
      featured: false,
      seoTitle: 'AI-Powered Finance: Complete Transformation Guide for UK Businesses',
      metaDescription: 'Comprehensive guide to transforming finance operations with AI. Discover automation strategies, implementation roadmaps, and ROI optimization for UK mid-market businesses.',
      featuredImage: '/assets/blog/finance-transformation.png',
      imageAlt: 'AI-powered finance transformation framework showing four pillars of digital finance evolution'
    },
    {
      id: 'ai-powered-financial-forecasting-implementation-guide-2025',
      slug: 'ai-powered-financial-forecasting-implementation-guide-2025',
      title: 'AI-Powered Financial Forecasting: Implementation Guide 2025',
      excerpt: 'Learn how to implement AI-powered financial forecasting in your business with this comprehensive guide.',
      content: 'Full content would be loaded from MDX file...',
      author: 'FinanceFlo.ai Team',
      publishDate: '2025-01-10',
      category: 'ai-erp-integration',
      tags: ['AI forecasting', 'financial planning', 'predictive analytics'],
      readTime: 12,
      featured: false,
      seoTitle: 'AI-Powered Financial Forecasting: Implementation Guide 2025',
      metaDescription: 'Learn how to implement AI-powered financial forecasting in your business with this comprehensive guide.',
      featuredImage: '/assets/blog/finance-transformation.png',
      imageAlt: 'AI-powered financial forecasting dashboard'
    },
    {
      id: 'cloud-erp-migration-complete-checklist-2025',
      slug: 'cloud-erp-migration-complete-checklist-2025',
      title: 'Cloud ERP Migration: Complete Checklist 2025',
      excerpt: 'Everything you need to know about migrating to cloud ERP systems with our comprehensive checklist.',
      content: 'Full content would be loaded from MDX file...',
      author: 'FinanceFlo.ai Team',
      publishDate: '2025-01-08',
      category: 'implementation-guides',
      tags: ['cloud migration', 'ERP implementation', 'checklist'],
      readTime: 8,
      featured: false,
      seoTitle: 'Cloud ERP Migration: Complete Checklist 2025',
      metaDescription: 'Everything you need to know about migrating to cloud ERP systems with our comprehensive checklist.',
      featuredImage: '/assets/blog/finance-transformation.png',
      imageAlt: 'Cloud ERP migration checklist'
    },
    {
      id: 'complete-guide-erp-implementation-2025',
      slug: 'complete-guide-erp-implementation-2025',
      title: 'Complete Guide to ERP Implementation 2025',
      excerpt: 'The definitive guide to successful ERP implementation for UK businesses.',
      content: 'Full content would be loaded from MDX file...',
      author: 'FinanceFlo.ai Team',
      publishDate: '2025-01-05',
      category: 'implementation-guides',
      tags: ['ERP implementation', 'project management', 'best practices'],
      readTime: 20,
      featured: true,
      seoTitle: 'Complete Guide to ERP Implementation 2025',
      metaDescription: 'The definitive guide to successful ERP implementation for UK businesses.',
      featuredImage: '/assets/blog/finance-transformation.png',
      imageAlt: 'ERP implementation roadmap'
    }
  ];
}

/**
 * Calculate estimated read time based on word count
 * Average reading speed: 200 words per minute
 */
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime;
}

/**
 * Load a single blog post by slug
 * Uses glob import to dynamically load MD/MDX files
 */
export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // Try to load all posts first to find the specific one
    const allPosts = await loadBlogPosts();
    const post = allPosts.find(p => p.slug === slug);
    
    if (post) {
      console.log(`Found blog post: ${post.title}`);
      return post;
    }

    console.warn(`Blog post not found: ${slug}`);
    return null;
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}
