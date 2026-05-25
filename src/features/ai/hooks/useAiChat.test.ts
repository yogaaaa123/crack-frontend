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
    (aiChatClient as any).mockResolvedValue({ reply: 'Hello!', toolsUsed: [] });

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

  it('ignores empty messages', async () => {
    const { result } = renderHook(() => useAiChat());
    await act(async () => {
      await result.current.sendMessage('   ');
    });
    expect(result.current.messages).toHaveLength(0);
  });

  it('clears chat', async () => {
    (aiChatClient as any).mockResolvedValue({ reply: 'Hi' });
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
    (aiChatClient as any).mockRejectedValue(new Error('AI service down'));

    const { result } = renderHook(() => useAiChat());

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1].content).toContain('Error');
  });
});
