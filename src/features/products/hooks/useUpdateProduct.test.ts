import { describe, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: () => ({ mutateAsync: async () => {}, isPending: false }), useQueryClient: () => ({ invalidateQueries: vi.fn() }) }));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { patch: vi.fn(), get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } }));

import { useUpdateProduct } from './useUpdateProduct';

describe('useUpdateProduct', () => {
  it('calls patch', async () => {
    const { mutateAsync } = useUpdateProduct('prod-1');
    await mutateAsync({ name: 'Updated' });
  });
});
