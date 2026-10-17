'use client';

import { useState, useCallback, useRef } from 'react';
import { aiChatClient, type AiChatMessage } from '@/infrastructure/api/aiClient';
import type { ApiError } from '@/infrastructure/api/types';

// ---
// useAiChat — Hook utama buat AI Chat
// Handle state chat, history, loading, error
// ---

/** Konteks yang dikirim ke service AI: 40 pesan terakhir (20 pasang tanya-jawab). */
const MAX_HISTORY_MESSAGES = 40;

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

/**
 * Terjemahkan error API jadi pesan ramah yang menjelaskan PENYEBAB limit,
 * bukan cuma "gagal".
 */
function friendlyErrorMessage(err: unknown): string {
  const apiErr = err as ApiError;
  const status = apiErr?.errorCode?.replace('ERR_', '');

  switch (status) {
    case '402':
      return (
        '⚠️ Kuota AI toko kamu sudah habis.\n\n' +
        'Fitur AI dibatasi kuota token per toko oleh aplikasi ini. ' +
        'Hubungi admin toko untuk menambah kuota AI, lalu coba lagi.'
      );
    case '429':
      return (
        '⚠️ Terlalu banyak permintaan.\n\n' +
        'AI dibatasi maksimal 10 chat per menit (batasan aplikasi) dan provider model gratis juga punya limit harian. ' +
        'Tunggu sebentar lalu coba lagi.'
      );
    case '500':
    case '502':
    case '503':
      return (
        '⚠️ AI sedang tidak bisa diproses.\n\n' +
        'Kemungkinan penyebabnya:\n' +
        '• Model AI gratis (OpenRouter free tier) sedang limit atau down.\n' +
        '• Server AI free hosting sedang sleep, butuh beberapa detik untuk bangun.\n\n' +
        'Coba lagi dalam beberapa saat ya.'
      );
    default:
      return (
        err instanceof Error && err.message
          ? err.message
          : 'Gagal terhubung ke AI service. Coba lagi nanti.'
      );
  }
}

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

      // Update history untuk next request. Role harus 'assistant' (bukan 'model')
      // karena service AI hanya menerima role user/assistant. Simpan 40 pesan
      // terakhir supaya percakapan panjang tetap punya konteks tanpa kena limit.
      const nextHistory: AiChatMessage[] = [
        ...historyRef.current,
        { role: 'user', parts: [text] },
        { role: 'assistant', parts: [response.reply] },
      ];
      historyRef.current = nextHistory.slice(-MAX_HISTORY_MESSAGES);

      // Tambah reply AI ke UI
      const aiMsg: ChatMessage = {
        id: uid(),
        role: 'model',
        content: response.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = friendlyErrorMessage(err);
      setError(errMsg);

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'model',
          content: errMsg,
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
