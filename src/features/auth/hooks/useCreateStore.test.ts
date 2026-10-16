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
import { useCreateStore } from './useCreateStore';

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return createElement(QueryClientProvider, { client }, children);
};

describe('useCreateStore', () => {
  beforeEach(() => {
    post.mockReset();
    push.mockReset();
  });

  it('posts the backend CreateStoreDto payload', async () => {
    post.mockResolvedValue({ message: 'ok', user: { id: 'u1', username: 'admin', role: 'ADMIN', tenantId: 't1' } });

    const { result } = renderHook(() => useCreateStore(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({
        storeName: 'Toko Satu',
        username: 'admin_toko',
        password: 'rahasia123',
      });
    });

    expect(post).toHaveBeenCalledWith('/auth/create-store', {
      storeName: 'Toko Satu',
      username: 'admin_toko',
      password: 'rahasia123',
    });
    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard/admin'));
  });
});
