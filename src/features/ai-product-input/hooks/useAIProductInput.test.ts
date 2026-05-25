import { describe, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useMutation: () => ({ mutateAsync: async () => {}, isPending: false, isError: false, error: null }) }));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { post: vi.fn(), get: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));

import { useAIProductInput } from './useAIProductInput';

describe('useAIProductInput', () => {
  it('posts image to AI endpoint', async () => {
    const { mutateAsync } = useAIProductInput();
    await mutateAsync({ image: new File([''], 'test.jpg') });
  });
});
