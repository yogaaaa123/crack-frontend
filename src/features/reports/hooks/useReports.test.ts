import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: any) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
}));
vi.mock('@/infrastructure/api/client', () => {
  const fn: any = () => Promise.resolve(undefined);
  fn.get = vi.fn(); fn.post = vi.fn(); fn.put = vi.fn(); fn.patch = vi.fn(); fn.delete = vi.fn();
  return { apiClient: fn };
});

import { useSalesTrend } from './useSalesTrend';
describe('useSalesTrend', () => { it('uses default 7 days', () => { const r = useSalesTrend(); expect(r.queryKey).toEqual(['reports', 'sales-trend', 7]); }); });
import { useTopProducts } from './useTopProducts';
describe('useTopProducts', () => { it('uses limit', () => { const r = useTopProducts(10); expect(r.queryKey).toEqual(['reports', 'top-products', 10]); }); });
