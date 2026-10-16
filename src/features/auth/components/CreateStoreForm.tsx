'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateStore } from '../hooks/useCreateStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ApiError } from '@/infrastructure/api/types';

// Mirrors backend CreateStoreDto so the store + admin account are created together.
const createStoreSchema = z.object({
  storeName: z.string().min(3, 'Store name must be at least 3 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscore only'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().optional(),
});

type CreateStoreInput = z.infer<typeof createStoreSchema>;

export function CreateStoreForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStoreInput>({
    resolver: zodResolver(createStoreSchema),
  });

  const createStore = useCreateStore();

  const onSubmit = (data: CreateStoreInput) => {
    createStore.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        id="storeName"
        label="Store Name"
        placeholder="My Store"
        error={errors.storeName}
        {...register('storeName')}
      />

      <Input
        id="username"
        label="Admin Username"
        placeholder="admin_toko"
        error={errors.username}
        {...register('username')}
      />

      <Input
        id="password"
        type="password"
        label="Admin Password"
        placeholder="At least 8 characters"
        error={errors.password}
        {...register('password')}
      />

      {createStore.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {(createStore.error as unknown as ApiError)?.message ?? 'Failed to create store'}
        </p>
      )}

      <Button type="submit" isLoading={createStore.isPending} size="lg">
        Create Store
      </Button>
    </form>
  );
}
