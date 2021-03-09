const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const devrc = require('./.tigodev');
const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('./package.json'));

// regard all packages as external by default
const external = Object.keys(pkg.dependencies || {});

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
    nodeResolve({
      extensions,
      modulesOnly: true,
    }),
    babel({
      exclude: ['node_modules/**'],
      babelHelpers: 'bundled',
      extensions,
    }),
  ],
};

module.exports = options;
