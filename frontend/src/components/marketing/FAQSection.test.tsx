import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FAQSection } from './FAQSection';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FAQSection', () => {
  it('renders without crashing', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  it('displays the section heading', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/Everything You Need to Know/i)).toBeInTheDocument();
  });

  it('renders all 10 FAQ items', () => {
    const { container } = render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const faqButtons = container.querySelectorAll('button[aria-expanded]');
    expect(faqButtons).toHaveLength(10);
  });

  it('displays first FAQ question', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/What makes ApexDeliver different/i)).toBeInTheDocument();
  });

  it('all FAQs are collapsed by default', () => {
    const { container } = render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const expandedButtons = container.querySelectorAll('button[aria-expanded="true"]');
    expect(expandedButtons).toHaveLength(0);
  });

  it('expands FAQ when clicked', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const firstQuestion = screen.getByText(/What makes ApexDeliver different/i);
    fireEvent.click(firstQuestion);
    
    expect(screen.getByText(/We're the only platform/i)).toBeInTheDocument();
  });

  it('collapses FAQ when clicked again', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const firstQuestion = screen.getByText(/What makes ApexDeliver different/i);
    fireEvent.click(firstQuestion);
    fireEvent.click(firstQuestion);
    
    const answer = screen.queryByText(/We're the only platform/i);
    expect(answer).not.toBeVisible();
  });

  it('closes other FAQs when opening a new one', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const firstQuestion = screen.getByText(/What makes ApexDeliver different/i);
    const secondQuestion = screen.getByText(/Do you offer a free trial/i);
    
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/We're the only platform/i)).toBeVisible();
    
    fireEvent.click(secondQuestion);
    expect(screen.getByText(/Yes! We offer/i)).toBeVisible();
    expect(screen.queryByText(/We're the only platform/i)).not.toBeVisible();
  });

  it('displays chevron icon for each FAQ', () => {
    const { container } = render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const chevrons = container.querySelectorAll('svg');
    expect(chevrons.length).toBeGreaterThan(0);
  });

  it('rotates chevron when FAQ is expanded', () => {
    const { container } = render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const firstQuestion = screen.getByText(/What makes ApexDeliver different/i);
    const chevron = firstQuestion.parentElement?.querySelector('svg');
    
    fireEvent.click(firstQuestion);
    
    expect(chevron).toHaveClass('rotate-180');
  });

  it('displays free trial FAQ', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/Do you offer a free trial/i)).toBeInTheDocument();
  });

  it('displays security FAQ', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/Is my data secure/i)).toBeInTheDocument();
  });

  it('displays integrations FAQ', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/What integrations/i)).toBeInTheDocument();
  });

  it('displays support FAQ', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/What kind of support/i)).toBeInTheDocument();
  });

  it('displays cancellation FAQ', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/Can I cancel anytime/i)).toBeInTheDocument();
  });

  it('displays AI functionality FAQ', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/How does the AI work/i)).toBeInTheDocument();
  });

  it('displays data handling FAQ', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/What happens to my data/i)).toBeInTheDocument();
  });

  it('displays pricing FAQ', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/Do you offer discounts/i)).toBeInTheDocument();
  });

  it('displays plan change FAQ', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/Can I change my plan/i)).toBeInTheDocument();
  });

  it('includes "Still have questions?" CTA section', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    expect(screen.getByText(/Still have questions/i)).toBeInTheDocument();
  });

  it('displays contact CTA button', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    const contactButton = screen.getByText(/Contact Us/i);
    expect(contactButton).toBeInTheDocument();
  });

  it('contact button links to contact page', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    const contactButton = screen.getByText(/Contact Us/i);
    expect(contactButton.closest('a')).toHaveAttribute('href', '/contact');
  });

  it('displays demo CTA button', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    const demoButton = screen.getByText(/Watch Demo/i);
    expect(demoButton).toBeInTheDocument();
  });

  it('demo button links to demo page', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    const demoButton = screen.getByText(/Watch Demo/i);
    expect(demoButton.closest('a')).toHaveAttribute('href', '/demo');
  });

  it('applies hover effects to FAQ items', () => {
    const { container } = render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const faqItems = container.querySelectorAll('.hover\\:bg-gray-50');
    expect(faqItems.length).toBeGreaterThan(0);
  });

  it('has responsive layout', () => {
    const { container } = render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const maxWidth = container.querySelector('.max-w-3xl');
    expect(maxWidth).toBeInTheDocument();
  });

  it('includes section background styling', () => {
    const { container } = render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-white');
  });

  it('displays comprehensive answers', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const firstQuestion = screen.getByText(/What makes ApexDeliver different/i);
    fireEvent.click(firstQuestion);
    
    const answer = screen.getByText(/We're the only platform/i);
    expect(answer.textContent?.length).toBeGreaterThan(50);
  });

  it('includes specific feature mentions in answers', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const aiQuestion = screen.getByText(/How does the AI work/i);
    fireEvent.click(aiQuestion);
    
    expect(screen.getByText(/GPT-4/i)).toBeInTheDocument();
  });

  it('mentions specific integrations in answer', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const integrationsQuestion = screen.getByText(/What integrations/i);
    fireEvent.click(integrationsQuestion);
    
    expect(screen.getByText(/Xero/i)).toBeInTheDocument();
    expect(screen.getByText(/QuickBooks/i)).toBeInTheDocument();
  });

  it('mentions GDPR compliance in security answer', () => {
    render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const securityQuestion = screen.getByText(/Is my data secure/i);
    fireEvent.click(securityQuestion);
    
    expect(screen.getByText(/GDPR/i)).toBeInTheDocument();
  });

  it('applies smooth transition animations', () => {
    const { container } = render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const transitionElements = container.querySelectorAll('.transition-all');
    expect(transitionElements.length).toBeGreaterThan(0);
  });

  it('uses semantic HTML for accessibility', () => {
    const { container } = render(
      <RouterWrapper>
        <FAQSection />
      </RouterWrapper>
    );
    
    const buttons = container.querySelectorAll('button[aria-expanded]');
    expect(buttons.length).toBe(10);
  });
});

