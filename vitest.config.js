import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: 'server',
          include: ['server/**/*.test.ts', 'shared/**/*.test.ts'],
          environment: 'node',
          env: { DATABASE_URL: '' },
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'web',
          include: ['web/src/**/*.test.{js,jsx}'],
          environment: 'jsdom',
          setupFiles: ['web/src/test/setup.js'],
        },
      },
    ],
  },
});
