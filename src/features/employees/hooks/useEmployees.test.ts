import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: any) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
  useMutation: (opts: any) => ({ mutateAsync: async (d: any) => opts?.mutationFn?.(d), isPending: false }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock('@/infrastructure/api/client', () => ({ apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));

import { useEmployees } from './useEmployees';
describe('useEmployees', () => { it('has correct query key', () => { const r = useEmployees(); expect(r.queryKey).toEqual(['employees']); }); });
import { useCreateEmployee } from './useCreateEmployee';
describe('useCreateEmployee', () => { it('creates employee', async () => { const { mutateAsync } = useCreateEmployee(); await mutateAsync({ username: 'staff1', password: 'pass123', role: 'STAFF' }); }); });
import { useDeleteEmployee } from './useDeleteEmployee';
describe('useDeleteEmployee', () => { it('deletes employee', async () => { const { mutateAsync } = useDeleteEmployee(); await mutateAsync('emp-1'); }); });
