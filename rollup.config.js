import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';

const bundleName = 'rbPhys2dThreaded';
const workerSourceBundleName = 'rbPhys2dWorkerSource';

const onwarn = (warning, warn) => {
  // skip circular dependency warnings
  if (warning.code === 'CIRCULAR_DEPENDENCY') {
    return;
  }

  warn(warning);
};

const stringifySourcePlugin = (options = {}) => {
  return {
    name: 'stringify-source',

    generateBundle(_, bundle) {
      if (options.es5) {
        for (const name in bundle) {
          bundle[name].code = `var ${options.name} = ${JSON.stringify(
            bundle[name].code
          )};`;
        }
      } else {
        for (const name in bundle) {
          bundle[name].code = `export default ${JSON.stringify(
            bundle[name].code
          )} as string;`;
        }
      }
    },
  };
};

const globals = global => {
  if (global === 'rb-phys2d') {
    return 'rbPhys2d';
  } else if (global.includes('worker-source')) {
    return workerSourceBundleName;
  } else {
    return global;
  }
};

export default process.env.BUILD === 'worker'
  ? {
      input: 'src/host/index.ts',
      context: 'self',
      onwarn,
      output: [
        {
          file: `dist/bundle/rb-phys2d-worker-source.js`,
          format: 'iife',
          plugins: [
            stringifySourcePlugin({ name: workerSourceBundleName, es5: true }),
          ],
        },
        {
          file: `src/proxy/worker-source.ts`,
          format: 'es',
          sourcemap: false,
          plugins: [stringifySourcePlugin(), terser()],
        },
        {
          file: `dist/bundle/worker.js`,
          format: 'es',
          sourcemap: true,
        },
        {
          file: `dist/bundle/worker.min.js`,
          format: 'es',
          sourcemap: true,
          plugins: [terser()],
        },
      ],
      plugins: [
        resolve(),
        commonjs(),
        typescript({ tsconfig: __dirname + '/tsconfig.worker.json' }),
      ],
    }
  : {
      input: 'src/index.ts',
      context: 'self',
      onwarn,
      output: [
        {
          file: `dist/bundle/${pkg.name}.js`,
          format: 'iife',
          name: bundleName,
          sourcemap: true,
          globals,
        },
        {
          file: `dist/bundle/${pkg.name}.min.js`,
          format: 'iife',
          name: bundleName,
          sourcemap: true,
          plugins: [terser()],
          globals,
        },
      ],
      external: ['rb-phys2d', './worker-source'],
      plugins: [
        resolve(),
        commonjs(),
        typescript({ tsconfig: __dirname + '/tsconfig.esm.json' }),
      ],
    };
