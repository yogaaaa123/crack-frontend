'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { GoogleStore } from './useGoogleLogin';

interface StoresResponse {
  stores: GoogleStore[];
  needsStore: boolean;
}

/** Stores owned by the signed-in Google account (requires platform session). */
export function usePlatformStores() {
  return useQuery({
    queryKey: ['platform-stores'],
    queryFn: () => apiClient.get<StoresResponse>('/auth/platform/stores'),
  });
}
