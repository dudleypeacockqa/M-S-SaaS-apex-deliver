/**
 * Chatbot Widget - Placeholder for future chatbot integration
 * 
 * This component provides a chatbot UI placeholder that can be integrated
 * with services like Intercom, Drift, or custom chatbot solutions.
 */

import { useState, useEffect } from 'react';

interface ChatbotWidgetProps {
  /** Chatbot service provider (e.g., 'intercom', 'drift', 'custom') */
  provider?: string;
  /** Whether to show the widget */
  enabled?: boolean;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  provider = 'custom',
  enabled = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Initialize chatbot service based on provider
    if (enabled && provider === 'intercom') {
      // Intercom integration would go here
      // window.Intercom('boot', { ... });
    } else if (enabled && provider === 'drift') {
      // Drift integration would go here
      // window.drift.load('...');
    }
    // Custom chatbot uses the component state
  }, [enabled, provider]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, text: inputValue };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response (placeholder)
    setTimeout(() => {
      const botMessage = {
        role: 'bot' as const,
        text: 'Thank you for your message! Our team will get back to you shortly. For immediate assistance, please email us at helpdesk@financeflo.ai or call +44 7360 539147',
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50" role="complementary" aria-label="Chatbot widget">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Chat with us</h3>
              <p className="text-xs text-indigo-100">We're here to help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-white rounded"
              aria-label="Close chatbot"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                <p>Hello! How can we help you today?</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Chat message input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Open chatbot"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

