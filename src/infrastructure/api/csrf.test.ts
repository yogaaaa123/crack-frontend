import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('CSRF Token', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';
  });

  async function getCsrfModule() {
    return import('./csrf');
  }

  it('fetches CSRF token from /auth/csrf-token', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        statusCode: 200,
        message: 'Success',
        data: { csrf_token: 'token-abc-123' },
        timestamp: new Date().toISOString(),
      }),
    });

    const { fetchCsrfToken } = await getCsrfModule();
    const token = await fetchCsrfToken();
    expect(token).toBe('token-abc-123');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/auth/csrf-token',
      { credentials: 'include' },
    );
  });

  it('caches the token on subsequent calls', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: { csrf_token: 'cached-token' } }),
    });
    globalThis.fetch = fetchMock;

    const { fetchCsrfToken } = await getCsrfModule();
    const first = await fetchCsrfToken();
    const second = await fetchCsrfToken();
    expect(first).toBe('cached-token');
    expect(second).toBe('cached-token');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('handles nested token extraction (data.csrf_token)', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: { csrf_token: 'nested-token' } }),
    });
    globalThis.fetch = fetchMock;

    const { fetchCsrfToken } = await getCsrfModule();
    const token = await fetchCsrfToken();
    expect(token).toBe('nested-token');
  });

  it('handles flat token extraction (csrf_token)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ csrf_token: 'flat-token' }),
    });

    const { fetchCsrfToken } = await getCsrfModule();
    const token = await fetchCsrfToken();
    expect(token).toBe('flat-token');
  });

  it('resets cached token', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: { csrf_token: 'token' } }),
    });
    globalThis.fetch = fetchMock;

    const { fetchCsrfToken, resetCsrfToken } = await getCsrfModule();
    await fetchCsrfToken();
    resetCsrfToken();

    const refreshed = await fetchCsrfToken();
    expect(refreshed).toBe('token');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws on failed CSRF fetch', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    });

    const { fetchCsrfToken } = await getCsrfModule();
    await expect(fetchCsrfToken()).rejects.toThrow('CSRF fetch failed: 403');
  });
});
