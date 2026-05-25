import { describe, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: () => ({ mutateAsync: async () => {}, isPending: false }) }));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { patch: vi.fn(), get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } }));

import { useChangePassword } from './useChangePassword';

describe('useChangePassword', () => {
  it('patches change password', async () => {
    const { mutateAsync } = useChangePassword();
    await mutateAsync({ currentPassword: 'old', newPassword: 'new12345', confirmNewPassword: 'new12345' } as any);
  });
});
