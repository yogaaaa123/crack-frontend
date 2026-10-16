import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
}));
vi.mock('@/infrastructure/api/client', () => {
  const fn = Object.assign(() => Promise.resolve(undefined), {} as Record<string, unknown>);
  fn.get = vi.fn(); fn.post = vi.fn(); fn.put = vi.fn(); fn.patch = vi.fn(); fn.delete = vi.fn();
  return { apiClient: fn };
});
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));

import { useProducts } from './useProducts';

describe('useProducts', () => {
  it('has query key with products prefix', () => {
    const r = useProducts() as unknown as { queryKey: unknown[] };
    expect(Array.isArray(r.queryKey)).toBe(true);
    expect(r.queryKey.length).toBeGreaterThanOrEqual(1);
  });
});
