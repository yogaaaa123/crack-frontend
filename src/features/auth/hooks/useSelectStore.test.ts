import { describe, it, expect, vi, beforeEach } from 'vitest';

const post = vi.fn();
vi.mock('@/infrastructure/api/client', () => ({
  apiClient: { post: (...args: unknown[]) => post(...args), get: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }));

import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';
import { useSelectStore } from './useSelectStore';

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return createElement(QueryClientProvider, { client }, children);
};

describe('useSelectStore', () => {
  beforeEach(() => {
    post.mockReset();
    push.mockReset();
  });

  it('exchanges the platform session for the chosen store then enters the dashboard', async () => {
    post.mockResolvedValue({ user: { id: 'u1', username: 'admin', role: 'ADMIN', tenantId: 'tenant-2' } });

    const { result } = renderHook(() => useSelectStore(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync('tenant-2');
    });

    expect(post).toHaveBeenCalledWith('/auth/platform/select-store', { tenantId: 'tenant-2' });
    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard/admin'));
  });
});
