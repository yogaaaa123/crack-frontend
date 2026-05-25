import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./types', () => ({}));

import { adminApiClient } from './adminClient';

describe('adminApiClient', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('makes GET request', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true, status: 200,
      json: vi.fn().mockResolvedValue({ statusCode: 200, message: 'Success', data: { id: '1' }, timestamp: '' }),
    });
    const r = await adminApiClient.get('/admin/tenants');
    expect(r).toEqual({ id: '1' });
  });

  it('makes POST request', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true, status: 200,
      json: vi.fn().mockResolvedValue({ statusCode: 200, message: 'Success', data: { id: '2' }, timestamp: '' }),
    });
    const r = await adminApiClient.post('/admin/tenants', { name: 'test' });
    expect(r).toEqual({ id: '2' });
  });

  it('handles 204', async () => {
    (globalThis.fetch as any).mockResolvedValue({ ok: true, status: 204, json: vi.fn().mockRejectedValue(new Error('no body')) });
    const r = await adminApiClient.delete('/admin/tenants/1');
    expect(r).toBeUndefined();
  });

  it('makes PATCH request', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true, status: 200,
      json: vi.fn().mockResolvedValue({ statusCode: 200, message: 'Success', data: { id: '1', name: 'Updated' }, timestamp: '' }),
    });
    const r = await adminApiClient.patch('/admin/tenants/1', { name: 'Updated' });
    expect(r.name).toBe('Updated');
  });
});
