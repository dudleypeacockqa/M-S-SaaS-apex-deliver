import { apiClient } from '../../../services/api/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatRequest {
  message: string;
  conversation_history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: {
    current_page?: string;
    user_id?: string;
  };
}

interface ChatResponse {
  response: string;
  context_used?: string[];
}

/**
 * AI Chat Service for FP&A module
 */
export const aiChatService = {
  /**
   * Send a message to the AI chatbot
   */
  async sendMessage(
    message: string,
    conversationHistory: Message[] = []
  ): Promise<string> {
    const history = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const request: ChatRequest = {
      message,
      conversation_history: history,
      context: {
        current_page: window.location.pathname,
      },
    };

    const response = await apiClient.post<ChatResponse>('/api/fpa/ai-chat', request);
    return response.response || response.message || 'I apologize, but I encountered an error processing your request.';
  },
};

