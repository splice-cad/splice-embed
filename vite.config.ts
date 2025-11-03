import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/embed/index.ts'),
      name: 'Splice',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'splice-embed.es.js';
        if (format === 'umd') return 'splice-embed.umd.js';
        return 'splice-embed.iife.js';
      },
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        exports: 'named',
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
  server: {
    port: 3001,
    open: '/examples/demo.html',
  },
});
