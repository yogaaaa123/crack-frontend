import { describe, it, expect, vi } from 'vitest';

vi.mock('@/infrastructure/api/client', () => {
  const fn = Object.assign(() => Promise.resolve(undefined), {} as Record<string, unknown>);
  fn.post = vi.fn(); fn.get = vi.fn(); fn.put = vi.fn(); fn.patch = vi.fn(); fn.delete = vi.fn();
  return { apiClient: fn };
});
vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
  useMutation: (opts: { mutationFn?: (d: unknown) => Promise<unknown> }) => ({ mutateAsync: async (d: unknown) => opts?.mutationFn?.(d), isPending: false }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

import { useAdjustStock } from './useAdjustStock';
describe('useAdjustStock', () => { it('adjusts', async () => { const { mutateAsync } = useAdjustStock(); await mutateAsync({ productId: 'p1', quantityChange: -2, type: 'DAMAGED' }); }); });
import { useLowStockProducts } from './useLowStockProducts';
describe('useLowStockProducts', () => { it('key', () => { const r = useLowStockProducts() as unknown as { queryKey: unknown[] }; expect(r.queryKey).toEqual(['inventory', 'low-stock']); }); });
