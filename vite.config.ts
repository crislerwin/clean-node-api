import path from 'path'
import { defineConfig } from 'vitest/config'
import alias from '@rollup/plugin-alias'

export default defineConfig({
  plugins: [
    alias({
      entries: [
        { find: '@/tests', replacement: path.resolve(__dirname, './tests') },
        { find: /@(?!\/tests)/, replacement: path.resolve(__dirname, './src') },
      ],
    }),
  ],
  envPrefix: 'VITE_',
  test: {
    coverage: {
      exclude: ['src/main/**', 'tests/**'],
    },
    testTimeout: 50000,
    exclude: ['.data', 'node_modules', 'dist'],
  },
})
