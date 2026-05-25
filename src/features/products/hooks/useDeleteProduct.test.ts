import { describe, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: () => ({ mutateAsync: async () => {}, isPending: false }), useQueryClient: () => ({ invalidateQueries: vi.fn() }) }));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { delete: vi.fn(), get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn() } }));

import { useDeleteProduct } from './useDeleteProduct';

describe('useDeleteProduct', () => {
  it('deletes a product', async () => {
    const { mutateAsync } = useDeleteProduct();
    await mutateAsync('prod-1');
  });
});
