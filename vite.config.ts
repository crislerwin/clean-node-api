import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: { src: ['src/**/*.ts'], include: ['.ts'] },
  },
})
