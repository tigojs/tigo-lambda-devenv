const NodeVM = require('vm2');
const LRUCache = require('lru-cache');
const fs = require('fs');
const createContextProxy = require('./utils/context');

const CACHE_KEY = 'tigo_lambda_dev';

let bundled;

class LambdaRunner {
  constructor(app) {
    this.cache = new LRUCache({
      max: 100,
    });
    bundled = app.config?.rollup?.output || './dist/bundled.js';
    app.watcher.on('event', ({ result }) => {
      if (result) {
        result.close();
      }
      // remove cache after script changed
      this.cache.del(CACHE_KEY);
    });
  }
  async middlware(ctx, next) {
    const cached = this.cache.get(CACHE_KEY);
    if (cached) {
      await cached(createContextProxy(ctx));
    } else {
      if (!bundled || !fs.existsSync(bundled)) {
        throw new Error('Cannot find the bundled script file.');
      }
      const bundled = fs.readFileSync(bundled, { encoding: 'utf-8' });      const vm = new NodeVM({
        eval: false,
        wasm: false,
        require: {
          external: {
            modules: [...allowList, ...ctx.lambda.allowedRequire],
          },
        },
      });
      vm.freeze(env, ctx.lambda.env);
      handleRequestFunc = vm.run(bundled);
      if (!handleRequestFunc) {
        throw new Error('Cannot access handleRequestFunc method.');
      }
      await handleRequestFunc(createContextProxy(ctx));
      await next();
    }
  }
}

module.exports = LambdaRunner;
