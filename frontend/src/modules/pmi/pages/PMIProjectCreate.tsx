import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreatePMIProject } from '../hooks/usePMIProject';
import { ArrowLeft, Calendar } from 'lucide-react';

export const PMIProjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dealId = searchParams.get('deal_id');
  const createMutation = useCreatePMIProject();

  const [formData, setFormData] = useState({
    name: '',
    deal_id: dealId || '',
    status: 'planning' as const,
    close_date: '',
    day_one_date: '',
    target_completion_date: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dealId) {
      setFormData((prev) => ({ ...prev, deal_id: dealId }));
    }
  }, [dealId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.deal_id) {
      newErrors.deal_id = 'Deal selection is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const project = await createMutation.mutateAsync({
        name: formData.name,
        deal_id: formData.deal_id,
        status: formData.status,
        close_date: formData.close_date || undefined,
        day_one_date: formData.day_one_date || undefined,
        target_completion_date: formData.target_completion_date || undefined,
        description: formData.description || undefined,
      });

      // Navigate to project detail page
      navigate(`/pmi/projects/${project.id}`);
    } catch (error) {
      console.error('Error creating PMI project:', error);
      setErrors({ submit: 'Failed to create PMI project. Please try again.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/pmi/projects')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create PMI Project</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Acme Corp Integration"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="deal_id" className="block text-sm font-medium text-gray-700 mb-2">
              Associated Deal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="deal_id"
              name="deal_id"
              value={formData.deal_id}
              onChange={handleChange}
              disabled={!!dealId}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.deal_id ? 'border-red-500' : 'border-gray-300'
              } ${dealId ? 'bg-gray-100' : ''}`}
              placeholder="Deal ID"
            />
            {errors.deal_id && <p className="mt-1 text-sm text-red-500">{errors.deal_id}</p>}
            {dealId && <p className="mt-1 text-sm text-gray-500">Deal ID from URL</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="close_date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Close Date
              </label>
              <input
                type="date"
                id="close_date"
                name="close_date"
                value={formData.close_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="day_one_date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Day 1 Date
              </label>
              <input
                type="date"
                id="day_one_date"
                name="day_one_date"
                value={formData.day_one_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="target_completion_date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Target Completion
              </label>
              <input
                type="date"
                id="target_completion_date"
                name="target_completion_date"
                value={formData.target_completion_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project description and objectives..."
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/pmi/projects')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Creating...' : 'Create PMI Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

