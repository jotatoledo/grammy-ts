import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import pkg from '../package.json';

const libName = 'grammy-ts';
const distFolder = 'dist';

const globals = {
  monet: 'monet'
};

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

export default [
  {
    input: `src/index.ts`,
    output: [
      { file: `${distFolder}/bundles/${libName}.umd.js`, name: libName, format: 'umd', globals, sourcemap: true },
      {
        file: `${distFolder}/bundles/${libName}.umd.min.js`,
        name: libName,
        format: 'umd',
        globals,
        sourcemap: true
      }
    ],
    external,
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5'
          }
        },
        tsconfig: 'src/tsconfig.json',
        cacheRoot: 'cache/.rts2_cache'
      }),
      commonjs(),
      resolve(),
      terser({
        include: ['*.min.js']
      }),
      sourceMaps()
    ]
  },
  {
    input: 'src/index.ts',
    output: { file: `${distFolder}/es5/${libName}.esm.js`, format: 'es', sourcemap: true },
    external,
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5'
          }
        },
        tsconfig: 'src/tsconfig.json',
        cacheRoot: 'cache/.rts2_cache'
      }),
      commonjs(),
      resolve(),
      sourceMaps()
    ]
  },
  {
    input: 'src/index.ts',
    output: { file: `${distFolder}/es2015/${libName}.esm.js`, format: 'es', sourcemap: true },
    external,
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'es2015'
          }
        },
        tsconfig: 'src/tsconfig.json',
        cacheRoot: 'cache/.rts2_cache'
      }),
      commonjs(),
      resolve(),
      sourceMaps()
    ]
  }
];
