import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: (opts: any) => ({ mutateAsync: async (data: any) => opts.mutationFn(data), isPending: false }) }));

import { useUploadImage } from './useUploadImage';

describe('useUploadImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';
    globalThis.fetch = vi.fn();
  });

  it('uploads image', async () => {
    (globalThis.fetch as any).mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue({ data: { url: 'https://example.com/img.jpg' } }) });
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const { mutateAsync } = useUploadImage();
    const result = await mutateAsync(file);
    expect(result.url).toBe('https://example.com/img.jpg');
  });
});
