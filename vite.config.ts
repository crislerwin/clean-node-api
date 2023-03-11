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
    exclude: ['.data', 'node_modules', 'dist'],
  },
})
