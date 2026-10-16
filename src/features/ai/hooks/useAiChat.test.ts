import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('@/infrastructure/api/aiClient', () => ({
  aiChatClient: vi.fn(),
  AiChatMessage: class {},
}));

import { useAiChat } from './useAiChat';
import { aiChatClient } from '@/infrastructure/api/aiClient';

describe('useAiChat', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('starts with empty messages', () => {
    const { result } = renderHook(() => useAiChat());
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sends a message and receives reply', async () => {
    (vi.mocked(aiChatClient)).mockResolvedValue({ reply: 'Hello!', toolsUsed: [] });

    const { result } = renderHook(() => useAiChat());

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[0].content).toBe('Hi');
    expect(result.current.messages[1].role).toBe('model');
    expect(result.current.messages[1].content).toBe('Hello!');
  });

  it('keeps context across turns with assistant role in history', async () => {
    vi.mocked(aiChatClient)
      .mockResolvedValueOnce({ reply: 'Jawaban pertama', toolsUsed: [] })
      .mockResolvedValueOnce({ reply: 'Jawaban kedua', toolsUsed: [] });

    const { result } = renderHook(() => useAiChat());

    await act(async () => {
      await result.current.sendMessage('Pertanyaan satu');
    });
    await act(async () => {
      await result.current.sendMessage('Pertanyaan dua');
    });

    const secondCall = vi.mocked(aiChatClient).mock.calls[1][0];
    expect(secondCall.history).toEqual([
      { role: 'user', parts: ['Pertanyaan satu'] },
      { role: 'assistant', parts: ['Jawaban pertama'] },
    ]);
    expect(result.current.messages).toHaveLength(4);
  });

  it('sends only the last 40 history messages', async () => {
    vi.mocked(aiChatClient).mockResolvedValue({ reply: 'ok', toolsUsed: [] });

    const { result } = renderHook(() => useAiChat());
    for (let i = 0; i < 25; i += 1) {
      await act(async () => {
        await result.current.sendMessage(`pesan ${i}`);
      });
    }

    const lastCall = vi.mocked(aiChatClient).mock.calls.at(-1)?.[0];
    expect(lastCall?.history).toHaveLength(40);
  });

  it('ignores empty messages', async () => {
    const { result } = renderHook(() => useAiChat());
    await act(async () => {
      await result.current.sendMessage('   ');
    });
    expect(result.current.messages).toHaveLength(0);
  });

  it('clears chat', async () => {
    (vi.mocked(aiChatClient)).mockResolvedValue({ reply: 'Hi' });
    const { result } = renderHook(() => useAiChat());

    await act(async () => {
      await result.current.sendMessage('Hi');
    });
    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.clearChat();
    });
    expect(result.current.messages).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it('handles errors gracefully', async () => {
    (vi.mocked(aiChatClient)).mockRejectedValue(new Error('AI service down'));

    const { result } = renderHook(() => useAiChat());

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1].content).toContain('Error');
  });
});
