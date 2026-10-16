'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { ROLE_HOME } from '@/infrastructure/utils/constants';

/** Matches backend CreateStoreDto (storeName, username, password, displayName?). */
export interface CreateStoreRequest {
  storeName: string;
  username: string;
  password: string;
  displayName?: string;
}

interface CreateStoreResponse {
  message: string;
  user: {
    id: string;
    username: string;
    role: string;
    tenantId: string;
  };
}

export function useCreateStore() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateStoreRequest) => {
      return await apiClient.post<CreateStoreResponse>('/auth/create-store', data);
    },
    onSuccess: () => {
      router.push(ROLE_HOME.ADMIN);
      router.refresh();
    },
  });
}
