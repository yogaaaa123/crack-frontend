'use client';

import { useState, useCallback, useRef } from 'react';
import { aiChatClient, type AiChatMessage } from '@/infrastructure/api/aiClient';

// ---
// useAiChat — Hook utama buat AI Chat
// Handle state chat, history, loading, error
// ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface UseAiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
}

let msgCounter = 0;
const uid = () => `msg-${++msgCounter}-${Date.now()}`;

export function useAiChat(): UseAiChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<AiChatMessage[]>([]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    setIsLoading(true);

    // Tambah pesan user ke UI
    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await aiChatClient({
        message: text,
        history: historyRef.current,
      });

      // Update history untuk next request
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', parts: [text] },
        { role: 'model', parts: [response.reply] },
      ];

      // Tambah reply AI ke UI
      const aiMsg: ChatMessage = {
        id: uid(),
        role: 'model',
        content: response.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal terhubung ke AI service';
      setError(errMsg);

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'model',
          content: `**Error:** ${errMsg}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    historyRef.current = [];
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
