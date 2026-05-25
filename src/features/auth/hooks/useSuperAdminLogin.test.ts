import { describe, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: () => ({ mutateAsync: async () => {}, isPending: false }) }));
vi.mock('@/infrastructure/api/adminClient', () => ({ adminApiClient: { post: vi.fn(), get: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

import { useSuperAdminLogin } from './useSuperAdminLogin';

describe('useSuperAdminLogin', () => {
  it('posts to admin auth', async () => {
    const { mutateAsync } = useSuperAdminLogin();
    await mutateAsync({ username: 'super', password: 'pass123' });
  });
});
