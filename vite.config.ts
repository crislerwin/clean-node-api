import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@/': '/src/',
      '@main/': '/src/main/',
      '@infra/': '/src/infra/',
      '@data/': '/src/data/',
      '@presentation/': '/src/presentation/',
      '@domain/': '/src/domain/',
    },
    coverage: {
      exclude: ['src/main/**', 'src/infra/db/mongodb/helpers'],
    },
    exclude: ['data', 'node_modules', 'dist'],
  },
})
