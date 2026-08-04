import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    exports: true,
    dts: true,
    attw: { profile: 'esm-only' },
    publint: true,
  },
  test: {
    environment: 'node',
    include: ['test/unit/**/*.test.mjs'],
  },
});
