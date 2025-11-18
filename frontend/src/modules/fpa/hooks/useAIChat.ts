import { useState } from 'react';
import { aiChatService } from '../services/aiChatService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useAIChat() {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (
    message: string,
    conversationHistory: Message[]
  ): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await aiChatService.sendMessage(message, conversationHistory);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
  };
}

