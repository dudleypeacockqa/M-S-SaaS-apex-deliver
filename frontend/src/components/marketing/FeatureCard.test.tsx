import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FeatureCard } from './FeatureCard';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('FeatureCard', () => {
  const mockFeature = {
    title: 'Deal Pipeline Management',
    description: 'Manage your M&A deals from sourcing to closing with customizable Kanban boards.',
    icon: '📊',
  };

  it('renders feature title', () => {
    renderWithRouter(<FeatureCard {...mockFeature} />);
    expect(screen.getByText(mockFeature.title)).toBeInTheDocument();
  });

  it('renders feature description', () => {
    renderWithRouter(<FeatureCard {...mockFeature} />);
    expect(screen.getByText(mockFeature.description)).toBeInTheDocument();
  });

  it('renders feature icon', () => {
    renderWithRouter(<FeatureCard {...mockFeature} />);
    expect(screen.getByText(mockFeature.icon)).toBeInTheDocument();
  });

  it('renders article element for semantic HTML', () => {
    const { container } = renderWithRouter(<FeatureCard {...mockFeature} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });
});
