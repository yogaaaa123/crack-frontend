import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: any) => ({ data: undefined, isLoading: false, error: null, queryKey: opts?.queryKey ?? [] }),
}));
vi.mock('@/infrastructure/api/adminClient', () => ({ adminApiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));

import { useTenants } from './useTenants';
describe('useTenants', () => { it('has correct query key', () => { const r = useTenants(); expect(r.queryKey).toEqual(['tenants']); }); });
import { useTenantDetail } from './useTenantDetail';
describe('useTenantDetail', () => { it('has correct query key', () => { const r = useTenantDetail('tenant-1'); expect(r.queryKey).toEqual(['tenant', 'tenant-1']); }); });
import { usePlatformStats } from './usePlatformStats';
describe('usePlatformStats', () => { it('has correct query key', () => { const r = usePlatformStats(); expect(r.queryKey).toEqual(['platform-stats']); }); });
