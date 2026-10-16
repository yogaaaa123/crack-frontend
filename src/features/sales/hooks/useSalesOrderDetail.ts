'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { SalesOrder } from '../types';

export function useSalesOrderDetail(id: string) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: () => apiClient<SalesOrder>(`/sales/${id}`),
    enabled: !!id,
  });
}
