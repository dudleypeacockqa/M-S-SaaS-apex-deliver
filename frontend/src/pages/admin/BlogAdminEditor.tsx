/**
 * BlogAdminEditor Component
 * 
 * Admin interface for creating and publishing blog posts with draft/publish workflow
 * Following BMAD methodology: RED → GREEN → REFACTOR
 * 
 * Story: F-010 Content Creation & Lead Gen (20% gap completion)
 * Created: 2025-11-17
 */

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { 
  createBlogPost, 
  updateBlogPost, 
  publishBlogPost,
  getBlogPost 
} from '@/services/blogService';

interface BlogPostForm {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string;
  slug: string;
  metaDescription: string;
  featuredImage?: File | null;
  status: 'draft' | 'published';
  publishedAt?: string;
}

const BlogAdminEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    tags: '',
    slug: '',
    metaDescription: '',
    featuredImage: null,
    status: 'draft',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !id) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, id]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!formData.title) return;

    const interval = setInterval(() => {
      saveDraftMutation.mutate(formData);
    }, 30000);

    return () => clearInterval(interval);
  }, [formData]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (data: BlogPostForm) => {
      if (id) {
        return updateBlogPost(id, { ...data, status: 'draft' });
      }
      return createBlogPost({ ...data, status: 'draft' });
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (data: BlogPostForm) => {
      const publishData = {
        ...data,
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
      };
      
      if (id) {
        return publishBlogPost(id, publishData);
      }
      return createBlogPost(publishData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      navigate('/admin/blog');
    },
  });

  // Handlers
  const handleChange = (field: keyof BlogPostForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    saveDraftMutation.mutate(formData);
  };

  const handlePublish = () => {
    if (!validateForm()) return;
    setShowPublishDialog(true);
  };

  const confirmPublish = () => {
    publishMutation.mutate(formData);
    setShowPublishDialog(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          {id ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter post title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* URL Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">
              URL Slug
            </label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="url-slug"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content *
            </label>
            <div className="mb-2 flex gap-2">
              <Button type="button" variant="outline" size="sm" aria-label="Bold">
                <strong>B</strong>
              </Button>
              <Button type="button" variant="outline" size="sm" aria-label="Italic">
                <em>I</em>
              </Button>
              <Button type="button" variant="outline" size="sm" aria-label="Link">
                🔗
              </Button>
            </div>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Write your blog post content..."
              rows={12}
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
              Excerpt
            </label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Brief summary for listings..."
              rows={3}
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-2">
              Author
            </label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="Author name"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags
            </label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="Comma-separated tags"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium mb-2">
              Featured Image
            </label>
            <input
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 max-w-md rounded-lg"
              />
            )}
          </div>

          {/* Meta Description */}
          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium mb-2">
              Meta Description (SEO)
            </label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              placeholder="SEO meta description..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-gray-500">
              {lastSaved && (
                <span>Saved at {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={saveDraftMutation.isPending}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={publishMutation.isPending}
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Publish Confirmation Dialog */}
      {showPublishDialog && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <Card className="p-6 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Publish</h2>
            <p className="mb-6">
              Are you sure you want to publish this blog post? It will be immediately visible to all visitors.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPublishDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmPublish}>
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BlogAdminEditor;
