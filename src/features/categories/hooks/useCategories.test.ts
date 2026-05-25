import { describe, it, expect, vi } from 'vitest';

vi.mock('@/infrastructure/api/client', () => {
  const fn: any = () => Promise.resolve(undefined);
  fn.get = vi.fn(); fn.post = vi.fn(); fn.put = vi.fn(); fn.patch = vi.fn(); fn.delete = vi.fn();
  return { apiClient: fn };
});
vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: any) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
  useMutation: (opts: any) => ({ mutateAsync: async (d: any) => opts?.mutationFn?.(d), isPending: false }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

import { useCategories } from './useCategories';
describe('useCategories', () => { it('has correct query key', () => { const r = useCategories(); expect(r.queryKey).toEqual(['categories']); }); });
import { useCreateCategory } from './useCreateCategory';
describe('useCreateCategory', () => { it('creates', async () => { const { mutateAsync } = useCreateCategory(); await mutateAsync({ name: 'Electronics' }); }); });
import { useUpdateCategory } from './useCreateCategory';
describe('useUpdateCategory', () => { it('updates', async () => { const { mutateAsync } = useUpdateCategory(); await mutateAsync({ id: 'cat-1', name: 'U' }); }); });
import { useDeleteCategory } from './useCreateCategory';
describe('useDeleteCategory', () => { it('deletes', async () => { const { mutateAsync } = useDeleteCategory(); await mutateAsync('cat-1'); }); });
