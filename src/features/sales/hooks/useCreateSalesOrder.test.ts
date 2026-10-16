import { describe, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: (opts: { mutationFn?: (d: unknown) => Promise<unknown> }) => ({ mutateAsync: async (d: unknown) => opts?.mutationFn?.(d), isPending: false }), useQueryClient: () => ({ invalidateQueries: vi.fn() }) }));
vi.mock('@/infrastructure/api/client', () => {
  const fn = Object.assign(() => Promise.resolve(undefined), {} as Record<string, unknown>);
  fn.post = vi.fn(); fn.get = vi.fn(); fn.put = vi.fn(); fn.patch = vi.fn(); fn.delete = vi.fn();
  return { apiClient: fn };
});
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock('../store/useCartStore', () => ({
  useCartStore: Object.assign(
    (selector?: (state: { items: unknown[] }) => unknown) => selector ? (() => {})() : undefined,
    { getState: () => ({ items: [] }) }
  ),
}));

import { useCreateSalesOrder } from './useCreateSalesOrder';

describe('useCreateSalesOrder', () => {
  it('creates sales order', async () => {
    const { mutateAsync } = useCreateSalesOrder();
    await mutateAsync();
  });
});
