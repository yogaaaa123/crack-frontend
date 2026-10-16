'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { ROLE_HOME } from '@/infrastructure/utils/constants';

/** Enters an existing store after Google login (platform JWT → tenant session). */
export function useSelectStore() {
  const router = useRouter();

  return useMutation({
    mutationFn: (tenantId: string) =>
      apiClient.post('/auth/platform/select-store', { tenantId }),
    onSuccess: () => {
      router.push(ROLE_HOME.ADMIN);
      router.refresh();
    },
  });
}
