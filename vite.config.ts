import path from 'path'
import { defineConfig } from 'vitest/config'
import alias from '@rollup/plugin-alias'

export default defineConfig({
  plugins: [
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
    }),
  ],

  test: {
    testTimeout: 50000,
    exclude: ['.data', 'node_modules', 'dist'],
  },
})
