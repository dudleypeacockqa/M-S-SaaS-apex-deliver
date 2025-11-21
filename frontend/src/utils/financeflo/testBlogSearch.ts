// Test utility to verify blog search functionality
import { loadBlogPosts } from './loadBlogPosts';
import { blogCategories } from '@/data/blogData';

export async function testBlogSearch() {
  console.log('=== TESTING BLOG SEARCH FUNCTIONALITY ===\n');
  
  try {
    const posts = await loadBlogPosts();
    console.log(`✅ Loaded ${posts.length} blog posts\n`);
    
    // Test category distribution
    console.log('CATEGORY DISTRIBUTION:');
    console.log('=====================');
    const categoryCounts: { [key: string]: number } = {};
    posts.forEach(post => {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    });
    
    blogCategories.forEach(category => {
      const count = categoryCounts[category.id] || 0;
      console.log(`${category.name}: ${count} posts`);
    });
    
    // Test search functionality
    console.log('\nSEARCH FUNCTIONALITY TESTS:');
    console.log('===========================');
    
    // Test tag search
    const allTags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => allTags.add(tag));
    });
    
    console.log(`✅ Found ${allTags.size} unique tags across all posts`);
    console.log('Sample tags:', Array.from(allTags).slice(0, 10).join(', '));
    
    // Test specific searches
    const testSearches = [
      'AI',
      'ERP',
      'Digital Transformation',
      'Implementation',
      'Sage Intacct',
      'Cloud',
      'Finance',
      'Manufacturing'
    ];
    
    testSearches.forEach(searchTerm => {
      const results = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      console.log(`"${searchTerm}": ${results.length} results`);
    });
    
    console.log('\n✅ All search tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing blog search:', error);
  }
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testBlogSearch = testBlogSearch;
}
