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
import { useGoogleLogin } from './useGoogleLogin';

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return createElement(QueryClientProvider, { client }, children);
};

describe('useGoogleLogin', () => {
  beforeEach(() => {
    post.mockReset();
    push.mockReset();
  });

  it('sends the Google id token to /auth/google', async () => {
    post.mockResolvedValue({ accessToken: 'jwt', needsStore: true, stores: [] });

    const { result } = renderHook(() => useGoogleLogin(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync('google-id-token');
    });

    expect(post).toHaveBeenCalledWith('/auth/google', { idToken: 'google-id-token' });
    await waitFor(() => expect(push).toHaveBeenCalledWith('/create-store'));
  });

  it('resumes the single store owned by the same Google account', async () => {
    post.mockResolvedValue({
      accessToken: 'jwt',
      needsStore: false,
      stores: [{ id: 'tenant-1', name: 'Toko Satu' }],
    });

    const { result } = renderHook(() => useGoogleLogin(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync('google-id-token');
    });

    expect(post).toHaveBeenCalledWith('/auth/platform/select-store', { tenantId: 'tenant-1' });
    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard/admin'));
  });

  it('routes to the store picker when several stores exist', async () => {
    post.mockResolvedValue({
      accessToken: 'jwt',
      needsStore: false,
      stores: [
        { id: 'tenant-1', name: 'Satu' },
        { id: 'tenant-2', name: 'Dua' },
      ],
    });

    const { result } = renderHook(() => useGoogleLogin(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync('google-id-token');
    });

    await waitFor(() => expect(push).toHaveBeenCalledWith('/select-store'));
  });
});
