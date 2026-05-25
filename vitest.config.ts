import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/__tests__/**',
        'src/app/**',
        'src/middleware.ts',
        // UI Components (TSX) — rendered-only, not logic unit tests
        'src/components/**/*.tsx',
        'src/features/**/components/**',
        // Complex hooks that require full React Query/component context
        'src/features/**/hooks/*.ts',
        'src/infrastructure/api/client.ts',
        'src/features/transactions/**',
        'src/features/purchase-orders/hooks/*.ts',
        'src/infrastructure/events/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
