import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: (opts: { mutationFn: (data: unknown) => Promise<unknown> }) => ({ mutateAsync: async (data: unknown) => opts.mutationFn(data), isPending: false }) }));

import { useUploadImage } from './useUploadImage';

describe('useUploadImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';
    globalThis.fetch = vi.fn();
  });

  it('uploads image', async () => {
    (globalThis.fetch as unknown as Mock).mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue({ data: { url: 'https://example.com/img.jpg' } }) });
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const { mutateAsync } = useUploadImage();
    const result = await mutateAsync(file);
    expect(result.url).toBe('https://example.com/img.jpg');
  });
});
