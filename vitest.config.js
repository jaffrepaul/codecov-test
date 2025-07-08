import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.js', '**/*.test.js'],
    exclude: ['node_modules', 'dist', 'frontend'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: ['src/server.js', 'node_modules', 'dist', 'frontend'],
    },
    globals: true,
  },
});