import { describe, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: () => ({ mutateAsync: async () => {}, isPending: false }), useQueryClient: () => ({ invalidateQueries: vi.fn() }) }));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { post: vi.fn(), get: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));

import { useCreateProduct } from './useCreateProduct';

describe('useCreateProduct', () => {
  it('creates a product', async () => {
    const { mutateAsync } = useCreateProduct();
    await mutateAsync({ sku: 'SKU', name: 'Test', price: 100, stockQuantity: 5, reorderLevel: 2, categoryId: '550e8400-e29b-41d4-a716-446655440000' });
  });
});
