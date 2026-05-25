import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useQuery: () => ({ data: [], isLoading: false }) }));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));

import { useNotifications } from './useNotifications';

describe('useNotifications', () => {
  it('returns empty notifications by default', () => {
    const r = useNotifications();
    expect(r.total).toBe(0);
    expect(r.items).toEqual([]);
  });
});
