const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const fs = require('fs');

const PREFIX_WHITELIST = ['@tigojs/lambda-', '@tigojs/api-'];

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }));
const devrc = JSON.parse(fs.readFileSync('./.tigodev.json', { encoding: 'utf-8' }));

let external = [];

// only module in require allow list are external package
const configuredExternal = devrc?.rollup?.external;
if (configuredExternal && Array.isArray(configuredExternal)) {
  external = external.concat(configuredExternal);
}

if (pkg.dependencies) {
  Object.keys(pkg.dependencies).forEach((dependency) => {
    for (const prefix of PREFIX_WHITELIST) {
      if (dependency.includes(prefix)) {
        external.push(dependency);
        return;
      }
    }
  });
}

const extensions = ['.js'];

const options = {
  input: './src/main.js',
  output: {
    file: devrc?.rollup?.output || './dist/bundled.js',
    format: 'cjs',
    strict: false,
  },
  watch: {
    include: './src/**/*.js',
  },
  external,
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      exclude: ['node_modules/**'],
      babelHelpers: 'bundled',
      extensions,
    }),
  ],
};

module.exports = options;
