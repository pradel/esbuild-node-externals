import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    platform: 'node',
    format: ['cjs', 'esm'],
    exports: true,
    sourcemap: true,
    dts: true,
    clean: true,
    attw: true,
    publint: true,
  },
  test: {
    environment: 'node',
    include: ['test/unit/**/*.test.mjs'],
  },
});
