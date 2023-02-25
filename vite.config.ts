import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      NODE_ENV: 'test',
    },
    coverage: { src: ['src/**/*.ts'], include: ['.ts'] },
  },
})
