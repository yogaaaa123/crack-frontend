'use client';

import Link from 'next/link';
import { useSelectStore } from '@/features/auth/hooks/useSelectStore';
import { usePlatformStores } from '@/features/auth/hooks/usePlatformStores';
import { Button } from '@/components/ui/Button';

export default function SelectStorePage() {
  const { data, isLoading, isError } = usePlatformStores();
  const selectStore = useSelectStore();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-2xl font-bold text-slate-800">Pilih Toko</h1>

        {isLoading && <p className="text-center text-sm text-slate-600">Memuat toko…</p>}

        {(isError || (data && data.stores.length === 0)) && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl">
            <p className="text-sm text-slate-600">
              Tidak ada toko di akun Google ini.
            </p>
            <Link
              href="/create-store"
              className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Buat toko baru
            </Link>
          </div>
        )}

        <ul className="space-y-3">
          {data?.stores.map((store) => (
            <li key={store.id}>
              <Button
                variant="secondary"
                size="lg"
                className="w-full justify-between"
                disabled={selectStore.isPending}
                onClick={() => selectStore.mutate(store.id)}
                type="button"
              >
                <span>{store.name}</span>
                <span className="text-xs text-slate-400">Masuk</span>
              </Button>
            </li>
          ))}
        </ul>

        {selectStore.isError && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            Gagal masuk ke toko. Coba lagi.
          </p>
        )}
      </div>
    </div>
  );
}
