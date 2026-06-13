import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    sortImports: true,
    printWidth: 80,
    singleQuote: true,
    semi: false,
    ignorePatterns: ['**/dist/**', 'esbuild-node-externals/CHANGELOG.md'],
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    plugins: ['node', 'typescript', 'vitest'],
  },
  run: {
    cache: true,
  },
})
