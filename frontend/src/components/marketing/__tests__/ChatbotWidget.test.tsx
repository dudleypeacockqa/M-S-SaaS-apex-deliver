/**
 * Chatbot Widget Tests - TDD RED → GREEN → REFACTOR
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatbotWidget } from '../ChatbotWidget';

describe('ChatbotWidget', () => {
  beforeEach(() => {
    // Reset any localStorage/sessionStorage if needed
  });

  describe('Rendering', () => {
    it('renders closed chatbot button when enabled', () => {
      render(<ChatbotWidget enabled={true} />);
      expect(screen.getByLabelText(/open chatbot/i)).toBeInTheDocument();
    });

    it('does not render when disabled', () => {
      const { container } = render(<ChatbotWidget enabled={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('opens chatbot when button is clicked', async () => {
      render(<ChatbotWidget enabled={true} />);
      const button = screen.getByLabelText(/open chatbot/i);
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/chat with us/i)).toBeInTheDocument();
      });
    });
  });

  describe('Messaging', () => {
    it('displays welcome message when opened', async () => {
      render(<ChatbotWidget enabled={true} />);
      const button = screen.getByLabelText(/open chatbot/i);
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/how can we help you today/i)).toBeInTheDocument();
      });
    });

    it('sends user message when input is submitted', async () => {
      render(<ChatbotWidget enabled={true} />);
      const button = screen.getByLabelText(/open chatbot/i);
      fireEvent.click(button);

      await waitFor(() => {
        const input = screen.getByLabelText(/chat message input/i);
        expect(input).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/chat message input/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Hello, I need help' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

      await waitFor(() => {
        expect(screen.getByText(/Hello, I need help/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('sends message when send button is clicked', async () => {
      render(<ChatbotWidget enabled={true} />);
      const button = screen.getByLabelText(/open chatbot/i);
      fireEvent.click(button);

      await waitFor(() => {
        const input = screen.getByLabelText(/chat message input/i);
        expect(input).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/chat message input/i);
      fireEvent.change(input, { target: { value: 'Test message' } });

      const sendButton = screen.getByLabelText(/send message/i);
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/Test message/i)).toBeInTheDocument();
      });
    });

    it('displays bot response after user message', async () => {
      render(<ChatbotWidget enabled={true} />);
      const button = screen.getByLabelText(/open chatbot/i);
      fireEvent.click(button);

      await waitFor(() => {
        const input = screen.getByLabelText(/chat message input/i);
        expect(input).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/chat message input/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

      await waitFor(
        () => {
          expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', async () => {
      render(<ChatbotWidget enabled={true} />);
      expect(screen.getByLabelText(/open chatbot/i)).toBeInTheDocument();

      const button = screen.getByLabelText(/open chatbot/i);
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByLabelText(/chatbot widget/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/close chatbot/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/chat message input/i)).toBeInTheDocument();
      });
    });

    it('closes chatbot when close button is clicked', async () => {
      render(<ChatbotWidget enabled={true} />);
      const openButton = screen.getByLabelText(/open chatbot/i);
      fireEvent.click(openButton);

      await waitFor(() => {
        expect(screen.getByText(/chat with us/i)).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText(/close chatbot/i);
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(/chat with us/i)).not.toBeInTheDocument();
        expect(screen.getByLabelText(/open chatbot/i)).toBeInTheDocument();
      });
    });
  });

  describe('Provider Integration', () => {
    it('renders with custom provider by default', () => {
      render(<ChatbotWidget enabled={true} provider="custom" />);
      expect(screen.getByLabelText(/open chatbot/i)).toBeInTheDocument();
    });

    it('renders with intercom provider', () => {
      render(<ChatbotWidget enabled={true} provider="intercom" />);
      expect(screen.getByLabelText(/open chatbot/i)).toBeInTheDocument();
    });

    it('renders with drift provider', () => {
      render(<ChatbotWidget enabled={true} provider="drift" />);
      expect(screen.getByLabelText(/open chatbot/i)).toBeInTheDocument();
    });
  });
});

