import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQSection } from './FAQSection';

describe('FAQSection', () => {
  it('renders without crashing', () => {
    render(<FAQSection />);
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  it('displays the section heading', () => {
    render(<FAQSection />);
    expect(screen.getByText(/Everything you need to know about ApexDeliver/i)).toBeInTheDocument();
  });

  it('renders all 10 FAQ items', () => {
    const { container } = render(<FAQSection />);
    const faqButtons = container.querySelectorAll('button');
    expect(faqButtons).toHaveLength(10);
  });

  it('displays first FAQ question', () => {
    render(<FAQSection />);
    expect(screen.getByText(/How is ApexDeliver different from traditional M&A platforms/i)).toBeInTheDocument();
  });

  it('first FAQ is open by default', () => {
    render(<FAQSection />);
    // First FAQ answer should be visible
    expect(screen.getByText(/ApexDeliver is purpose-built for accessibility/i)).toBeVisible();
  });

  it('expands FAQ when clicked', () => {
    render(<FAQSection />);
    
    const secondQuestion = screen.getByText(/What's included in the free 14-day trial/i);
    fireEvent.click(secondQuestion);
    
    expect(screen.getByText(/Your free trial includes full access/i)).toBeVisible();
  });

  it('collapses FAQ when clicked again', () => {
    render(<FAQSection />);
    
    const firstQuestion = screen.getByText(/How is ApexDeliver different/i);
    fireEvent.click(firstQuestion); // Close it
    
    const answer = screen.queryByText(/ApexDeliver is purpose-built/i);
    expect(answer).not.toBeVisible();
  });

  it('closes other FAQs when opening a new one', () => {
    render(<FAQSection />);
    
    // First is open by default
    expect(screen.getByText(/ApexDeliver is purpose-built/i)).toBeVisible();
    
    // Click second question
    const secondQuestion = screen.getByText(/What's included in the free 14-day trial/i);
    fireEvent.click(secondQuestion);
    
    // Second should be open, first should be closed
    expect(screen.getByText(/Your free trial includes/i)).toBeVisible();
    expect(screen.queryByText(/ApexDeliver is purpose-built/i)).not.toBeVisible();
  });

  it('displays chevron icon for each FAQ', () => {
    const { container } = render(<FAQSection />);
    const chevrons = container.querySelectorAll('svg');
    expect(chevrons.length).toBeGreaterThan(10);
  });

  it('rotates chevron when FAQ is expanded', () => {
    const { container } = render(<FAQSection />);
    
    // First FAQ is open by default, so its chevron should be rotated
    const firstButton = container.querySelectorAll('button')[0];
    const chevron = firstButton.querySelector('svg');
    
    expect(chevron).toHaveClass('rotate-180');
  });

  it('displays free trial FAQ', () => {
    render(<FAQSection />);
    expect(screen.getByText(/What's included in the free 14-day trial/i)).toBeInTheDocument();
  });

  it('displays security FAQ', () => {
    render(<FAQSection />);
    expect(screen.getByText(/How secure is my data/i)).toBeInTheDocument();
  });

  it('displays integrations FAQ', () => {
    render(<FAQSection />);
    expect(screen.getByText(/Can I integrate ApexDeliver with my existing tools/i)).toBeInTheDocument();
  });

  it('displays support FAQ', () => {
    render(<FAQSection />);
    expect(screen.getByText(/What if I need help or training/i)).toBeInTheDocument();
  });

  it('displays cancellation FAQ', () => {
    render(<FAQSection />);
    expect(screen.getByText(/Can I cancel anytime/i)).toBeInTheDocument();
  });

  it('displays AI functionality FAQ', () => {
    render(<FAQSection />);
    expect(screen.getByText(/How does the AI-powered financial analysis work/i)).toBeInTheDocument();
  });

  it('displays data handling FAQ', () => {
    render(<FAQSection />);
    expect(screen.getByText(/What happens to my data if I cancel/i)).toBeInTheDocument();
  });

  it('displays pricing FAQ', () => {
    render(<FAQSection />);
    expect(screen.getByText(/Do you offer discounts for annual subscriptions/i)).toBeInTheDocument();
  });

  it('displays plan change FAQ', () => {
    render(<FAQSection />);
    expect(screen.getByText(/Can I upgrade or downgrade my plan/i)).toBeInTheDocument();
  });

  it('includes "Still have questions?" CTA section', () => {
    render(<FAQSection />);
    expect(screen.getByText(/Still have questions/i)).toBeInTheDocument();
  });

  it('displays contact CTA button', () => {
    render(<FAQSection />);
    const contactButton = screen.getByText(/Contact Sales/i);
    expect(contactButton).toBeInTheDocument();
  });

  it('contact button links to contact page', () => {
    render(<FAQSection />);
    const contactButton = screen.getByText(/Contact Sales/i);
    expect(contactButton.closest('a')).toHaveAttribute('href', '/contact');
  });

  it('displays demo CTA button', () => {
    render(<FAQSection />);
    const demoButton = screen.getByText(/Schedule Demo/i);
    expect(demoButton).toBeInTheDocument();
  });

  it('demo button links to demo page', () => {
    render(<FAQSection />);
    const demoButton = screen.getByText(/Schedule Demo/i);
    expect(demoButton.closest('a')).toHaveAttribute('href', '/demo');
  });

  it('applies hover effects to FAQ items', () => {
    const { container } = render(<FAQSection />);
    const faqItems = container.querySelectorAll('.hover\\:border-blue-300');
    expect(faqItems.length).toBe(10);
  });

  it('has responsive max-width', () => {
    const { container } = render(<FAQSection />);
    const maxWidth = container.querySelector('.max-w-4xl');
    expect(maxWidth).toBeInTheDocument();
  });

  it('includes section background styling', () => {
    const { container } = render(<FAQSection />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-white');
  });

  it('displays comprehensive answers', () => {
    render(<FAQSection />);
    
    // First FAQ is open by default
    const answer = screen.getByText(/ApexDeliver is purpose-built/i);
    expect(answer.textContent?.length).toBeGreaterThan(100);
  });

  it('mentions specific features in answers', () => {
    render(<FAQSection />);
    
    const aiQuestion = screen.getByText(/How does the AI-powered financial analysis work/i);
    fireEvent.click(aiQuestion);
    
    expect(screen.getByText(/47\+ financial ratios/i)).toBeInTheDocument();
  });

  it('mentions specific integrations in answer', () => {
    render(<FAQSection />);
    
    const integrationsQuestion = screen.getByText(/Can I integrate ApexDeliver/i);
    fireEvent.click(integrationsQuestion);
    
    expect(screen.getByText(/Xero, QuickBooks, Sage, NetSuite/i)).toBeInTheDocument();
  });

  it('mentions GDPR compliance in security answer', () => {
    render(<FAQSection />);
    
    const securityQuestion = screen.getByText(/How secure is my data/i);
    fireEvent.click(securityQuestion);
    
    expect(screen.getByText(/GDPR compliant/i)).toBeInTheDocument();
  });

  it('applies smooth transition animations', () => {
    const { container } = render(<FAQSection />);
    const transitionElements = container.querySelectorAll('.transition-all');
    expect(transitionElements.length).toBeGreaterThan(0);
  });

  it('uses semantic HTML for accessibility', () => {
    const { container } = render(<FAQSection />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(10);
  });

  it('mentions pricing in discount FAQ', () => {
    render(<FAQSection />);
    
    const pricingQuestion = screen.getByText(/Do you offer discounts/i);
    fireEvent.click(pricingQuestion);
    
    expect(screen.getByText(/20% off/i)).toBeInTheDocument();
    expect(screen.getByText(/£279\/month/i)).toBeInTheDocument();
  });

  it('mentions data retention period', () => {
    render(<FAQSection />);
    
    const dataQuestion = screen.getByText(/What happens to my data if I cancel/i);
    fireEvent.click(dataQuestion);
    
    expect(screen.getByText(/30 days after cancellation/i)).toBeInTheDocument();
  });

  it('mentions support availability', () => {
    render(<FAQSection />);
    
    const supportQuestion = screen.getByText(/What if I need help/i);
    fireEvent.click(supportQuestion);
    
    expect(screen.getByText(/24\/7 chat and email support/i)).toBeInTheDocument();
  });

  it('mentions SOC 2 certification', () => {
    render(<FAQSection />);
    
    const securityQuestion = screen.getByText(/How secure is my data/i);
    fireEvent.click(securityQuestion);
    
    expect(screen.getByText(/SOC 2 Type II/i)).toBeInTheDocument();
  });

  it('mentions AES-256 encryption', () => {
    render(<FAQSection />);
    
    const securityQuestion = screen.getByText(/How secure is my data/i);
    fireEvent.click(securityQuestion);
    
    expect(screen.getByText(/AES-256/i)).toBeInTheDocument();
  });

  it('includes CTA section with gradient background', () => {
    const { container } = render(<FAQSection />);
    const ctaSection = container.querySelector('.bg-gradient-to-br');
    expect(ctaSection).toBeInTheDocument();
  });

  it('displays CTA section message', () => {
    render(<FAQSection />);
    expect(screen.getByText(/Our team is here to help/i)).toBeInTheDocument();
  });

  it('shows icons in CTA buttons', () => {
    const { container } = render(<FAQSection />);
    const ctaButtons = container.querySelectorAll('a[href="/contact"], a[href="/demo"]');
    ctaButtons.forEach(button => {
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});

