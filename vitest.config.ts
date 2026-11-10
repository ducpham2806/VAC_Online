import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts', 'prototypes/**/*.test.ts'],
    exclude: ['**/node_modules/**', 'prototypes/**/supabase/functions/**'],
  },
});
