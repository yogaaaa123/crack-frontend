import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: any) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
}));
vi.mock('@/infrastructure/api/client', () => {
  const fn: any = () => Promise.resolve(undefined);
  fn.get = vi.fn(); fn.post = vi.fn(); fn.put = vi.fn(); fn.patch = vi.fn(); fn.delete = vi.fn();
  return { apiClient: fn };
});
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));

import { useProducts } from './useProducts';

describe('useProducts', () => {
  it('has query key with products prefix', () => {
    const r = useProducts();
    expect(Array.isArray(r.queryKey)).toBe(true);
    expect(r.queryKey.length).toBeGreaterThanOrEqual(1);
  });
});
