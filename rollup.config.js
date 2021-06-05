const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const fs = require('fs');

const PREFIX_WHITELIST = ['@tigojs/lambda-', '@tigojs/api-'];

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }));
const devrc = JSON.parse(fs.readFileSync('./.tigodev.json', { encoding: 'utf-8' }));

// only module in require allow list are external package
const external = [];
const configuredExternal = devrc?.rollup?.external;
if (configuredExternal && Array.isArray(configuredExternal)) {
  external = external.concat(configuredExternal);
}

if (pkg.dependencies) {
  Object.keys(pkg.dependencies).forEach((dependency) => {
    if (PREFIX_WHITELIST.includes(dependency)) {
      external.push(dependency);
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
