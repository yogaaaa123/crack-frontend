import { describe, it, expect, vi } from 'vitest';

vi.mock('./client', () => {
  const fn: any = () => Promise.resolve({ reply: 'Hello!' });
  fn.post = vi.fn(); fn.get = vi.fn(); fn.put = vi.fn(); fn.patch = vi.fn(); fn.delete = vi.fn();
  return { apiClient: fn };
});

import { aiChatClient } from './aiClient';

describe('aiChatClient', () => {
  it('posts to /ai/chat', async () => {
    const r = await aiChatClient({ message: 'Hi' });
    expect(r.reply).toBe('Hello!');
  });
});
