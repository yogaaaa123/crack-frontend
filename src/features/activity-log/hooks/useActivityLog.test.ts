import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: any) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
}));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));

import { useActivityLog } from './useActivityLog';

describe('useActivityLog', () => {
  it('has correct query key', () => {
    const r = useActivityLog();
    expect(r.queryKey[0]).toBe('activity-log');
  });
});
