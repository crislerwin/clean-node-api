import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@/': '/src/',
    },
    coverage: {
      exclude: ['src/main/**', 'src/infra/db/mongodb/helpers'],
    },
    exclude: ['data', 'node_modules'],
  },
})
