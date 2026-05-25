import { describe, it, expect, vi } from 'vitest';

vi.mock('@/infrastructure/api/client', () => {
  const fn: any = () => Promise.resolve(undefined);
  fn.post = vi.fn(); fn.get = vi.fn(); fn.put = vi.fn(); fn.patch = vi.fn(); fn.delete = vi.fn();
  return { apiClient: fn };
});
vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: any) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
  useMutation: (opts: any) => ({ mutateAsync: async (d: any) => opts?.mutationFn?.(d), isPending: false }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

import { useAdjustStock } from './useAdjustStock';
describe('useAdjustStock', () => { it('adjusts', async () => { const { mutateAsync } = useAdjustStock(); await mutateAsync({ productId: 'p1', quantityChange: -2, type: 'DAMAGED' }); }); });
import { useLowStockProducts } from './useLowStockProducts';
describe('useLowStockProducts', () => { it('key', () => { const r = useLowStockProducts(); expect(r.queryKey).toEqual(['inventory', 'low-stock']); }); });
