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
  getBlogPost,
  uploadBlogImage,
  type BlogPostEditorPayload,
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

interface BlogAdminEditorProps {
  autoSaveIntervalMs?: number;
  enableAutoSave?: boolean;
  navigateOnPublish?: boolean;
}

const BlogAdminEditor: React.FC<BlogAdminEditorProps> = ({
  autoSaveIntervalMs = 30000,
  enableAutoSave = true,
  navigateOnPublish = true,
}) => {
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
    publishedAt: undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const buildPayload = useCallback(
    (data: BlogPostForm, overrides?: Partial<BlogPostForm>): BlogPostEditorPayload => {
      const merged = { ...data, ...overrides }
      return {
        title: merged.title,
        content: merged.content,
        excerpt: merged.excerpt,
        author: merged.author,
        tags: merged.tags,
        slug: merged.slug,
        metaDescription: merged.metaDescription,
        status: merged.status,
        publishedAt: merged.publishedAt,
        featuredImageUrl: imagePreview || undefined,
      }
    },
    [imagePreview]
  );

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

  // Auto-save draft on interval
  useEffect(() => {
    if (!enableAutoSave || !formData.title || isLoadingPost) return;

    const interval = setInterval(() => {
      saveDraftMutation.mutate({ ...formData, status: 'draft', publishedAt: undefined });
    }, autoSaveIntervalMs);

    return () => clearInterval(interval);
  }, [formData, autoSaveIntervalMs, enableAutoSave, isLoadingPost]);

  const loadExistingPost = useCallback(async () => {
    if (!id) return;
    setIsLoadingPost(true);
    try {
      const post = await getBlogPost(id);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        author: post.author,
        tags: post.secondary_keywords.join(', '),
        slug: post.slug,
        metaDescription: post.meta_description,
        featuredImage: null,
        status: post.published ? 'published' : 'draft',
        publishedAt: post.published_at ?? undefined,
      });
      setImagePreview(post.featured_image_url ?? null);
      setLastSaved(post.updated_at ? new Date(post.updated_at) : null);
      setErrors({});
    } catch (error) {
      console.error('Failed to load blog post', error);
    } finally {
      setIsLoadingPost(false);
    }
  }, [id]);

  useEffect(() => {
    loadExistingPost();
  }, [loadExistingPost]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (data: BlogPostForm) => {
      const payload = buildPayload(data, { status: 'draft', publishedAt: undefined });
      if (id) {
        return updateBlogPost(id, payload);
      }
      return createBlogPost(payload);
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (data: BlogPostForm) => {
      const publishData = buildPayload(data, {
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
      });

      if (id) {
        return publishBlogPost(id, publishData);
      }
      return createBlogPost(publishData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      if (navigateOnPublish) {
        navigate('/admin/blog');
      }
    },
  });

  // Handlers
  const handleChange = (field: keyof BlogPostForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, featuredImage: 'Invalid image format. Please use PNG, JPG, or WebP.' }));
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, featuredImage: 'Image too large. Maximum size is 5MB.' }));
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image to server
    setIsUploadingImage(true);
    setErrors(prev => ({ ...prev, featuredImage: '' }));
    
    try {
      const response = await uploadBlogImage(file);
      setImagePreview(response.image_url);
      setFormData(prev => ({ ...prev, featuredImage: null })); // Clear file object, URL is now in imagePreview
    } catch (error) {
      console.error('Failed to upload image:', error);
      setErrors(prev => ({ 
        ...prev, 
        featuredImage: error instanceof Error ? error.message : 'Failed to upload image. Please try again.' 
      }));
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
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
    if (isLoadingPost) return;
    saveDraftMutation.mutate({ ...formData, status: 'draft', publishedAt: undefined });
  };

  const handlePublish = () => {
    if (isLoadingPost) return;
    if (!validateForm()) return;
    setShowPublishDialog(true);
  };

  const confirmPublish = () => {
    if (isLoadingPost) return;
    publishMutation.mutate(formData);
    setShowPublishDialog(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="p-6">
        {isLoadingPost && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            Loading blog post…
          </div>
        )}
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
              <Button type="button" variant="outline" btnSize="sm" aria-label="Bold">
                <strong>B</strong>
              </Button>
              <Button type="button" variant="outline" btnSize="sm" aria-label="Italic">
                <em>I</em>
              </Button>
              <Button type="button" variant="outline" btnSize="sm" aria-label="Link">
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
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageUpload}
              disabled={isUploadingImage}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isUploadingImage && (
              <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
            )}
            {errors.featuredImage && (
              <p className="text-red-500 text-sm mt-1">{errors.featuredImage}</p>
            )}
            {imagePreview && !isUploadingImage && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg border border-gray-300"
                />
              </div>
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
                disabled={isLoadingPost || saveDraftMutation.isPending}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={isLoadingPost || publishMutation.isPending}
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
