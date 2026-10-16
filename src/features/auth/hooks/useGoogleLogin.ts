'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { ROLE_HOME } from '@/infrastructure/utils/constants';

export interface GoogleStore {
  id: string;
  name: string;
}

interface GoogleLoginResponse {
  accessToken: string;
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
  needsStore: boolean;
  stores: GoogleStore[];
}

interface Destination {
  href: string;
}

/**
 * Google sign-in flow:
 *  - no store yet      → /create-store
 *  - exactly one store → resume that store directly (same Google account = same data)
 *  - several stores    → /select-store picker
 */
export function useGoogleLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (idToken: string): Promise<Destination> => {
      const auth = await apiClient.post<GoogleLoginResponse>('/auth/google', { idToken });

      if (!auth.stores || auth.stores.length === 0) {
        return { href: '/create-store' };
      }

      if (auth.stores.length === 1) {
        await apiClient.post('/auth/platform/select-store', { tenantId: auth.stores[0].id });
        return { href: ROLE_HOME.ADMIN };
      }

      return { href: '/select-store' };
    },
    onSuccess: ({ href }) => {
      router.push(href);
      router.refresh();
    },
  });
}
