import { describe, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: () => ({ mutateAsync: async () => {}, isPending: false }) }));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { post: vi.fn(), get: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

import { useCreateStore } from './useCreateStore';

describe('useCreateStore', () => {
  it('posts store data', async () => {
    const { mutateAsync } = useCreateStore();
    await mutateAsync({ storeName: 'Test', address: 'Addr', phone: '123' });
  });
});
