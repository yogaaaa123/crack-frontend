import { describe, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: () => ({ mutateAsync: async () => {}, isPending: false }) }));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { post: vi.fn(), get: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));

import { useLoginMutation } from './useLoginMutation';

describe('useLoginMutation', () => {
  it('posts credentials', async () => {
    const { mutateAsync } = useLoginMutation();
    await mutateAsync({ username: 'admin', password: 'pass123' });
  });
});
