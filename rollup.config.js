import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';
import getTerser from './rollup-plugins/getTerser.js';
import replace from '@rollup/plugin-replace';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { getSass } from './rollup-plugins/getSass.js';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const outputDir = isProduction ? 'build-output' : 'watch-output';
const terser = getTerser();

export default [
  {
    input: 'src/code/content/index.ts',
    output: {
      dir: outputDir,
      format: 'cjs',
      entryFileNames: 'code/content/[name].js',
      sourcemap: !isProduction,
    },
    watch: {
      clearScreen: false,
    },
    plugins: [
      /* copies all files from src to output, but only once on `npm run watch` */
      copy({
        targets: [{ src: ['src/**/*', '!**/*/code'], dest: outputDir }],
        flatten: false,
      }),
      typescript({ abortOnError: isProduction }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true,
      }),
      isProduction && terser,
      getSass({
        output: path.join(outputDir, 'code', 'content', 'styles.css'),
        isProduction,
      }),
    ],
  },
  {
    input: 'src/code/popup/index.ts',
    output: {
      dir: outputDir,
      format: 'iife',
      entryFileNames: 'code/popup/[name].js',
      sourcemap: !isProduction,
    },
    plugins: [
      /* replace `process` in raw React bundle */
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(
            isProduction ? 'production' : 'development',
          ),
          'typeof process': '"undefined"',
          process: 'undefined',
        },
      }),
      nodeResolve({
        browser: true /* Resolves import paths such as that of `react` or `lodash` to node_modules/react/index.js so rollup can locate imported package */,
      }),
      commonjs() /* Converts CommonJS modules in React to ES6 modules */,
      typescript({ abortOnError: isProduction }),
      isProduction && terser,
      getSass({
        output: path.join(outputDir, 'code', 'popup', 'styles.css'),
        isProduction,
      }),
    ],
  },
  {
    input: 'src/code/background/index.ts',
    output: {
      dir: outputDir,
      format: 'cjs',
      entryFileNames: 'code/background/[name].js',
      sourcemap: !isProduction,
    },
    plugins: [
      typescript({ abortOnError: isProduction }),
      isProduction && terser,
    ],
  },
];
