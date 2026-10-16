import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
}));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));

import { usePlatformStores } from './usePlatformStores';

describe('usePlatformStores', () => {
  it('queries owned stores with a stable key', () => {
    const r = usePlatformStores() as unknown as { queryKey: unknown[] };
    expect(r.queryKey).toEqual(['platform-stores']);
  });
});
