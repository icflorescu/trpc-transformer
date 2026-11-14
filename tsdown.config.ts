import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  target: 'es2020',
  platform: 'neutral',
  // Keep the existing CJS shape: require('trpc-transformer').default
  outputOptions: { exports: 'named' },
});
