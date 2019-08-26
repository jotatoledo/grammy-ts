import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import { name, dependencies, peerDependencies } from '../package.json';
const buildConfig = require("../build.config");

const globals = {
  monet: 'monet'
};

const external = [...Object.keys(dependencies || {}), ...Object.keys(peerDependencies || {})];

export default [
  {
    input: `src/index.ts`,
    output: [
      { file: `${buildConfig.distRoot}/bundles/${name}.umd.js`, name: name, format: 'umd', globals, sourcemap: true },
      {
        file: `${buildConfig.distRoot}/bundles/${name}.umd.min.js`,
        name: name,
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
    output: { file: `${buildConfig.distRoot}/es5/${name}.esm.js`, format: 'es', sourcemap: true },
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
    output: { file: `${buildConfig.distRoot}/es2015/${name}.esm.js`, format: 'es', sourcemap: true },
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
