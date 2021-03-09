const NodeVM = require('vm2');
const LRUCache = require('lru-cache');
const fs = require('fs');
const createContextProxy = require('./utils/context');

const CACHE_KEY = 'tigo_lambda_dev';

class LambdaRunner {
  constructor(app) {
    this.cache = new LRUCache({
      max: 100,
    });
    app.watcher.on('event', async ({ result }) => {
      if (result) {
        await result.close();
        // remove cache after script changed
        if (result.closed && this.cache.has(CACHE_KEY)) {
          this.cache.del(CACHE_KEY);
          app.logger.info('Function cache refreshed.');
        }
        app.logger.info('Bundled script has been already rebuilt.');
      }
    });
  }
  async middlware(ctx, next) {
    const bundled = ctx.rollup.output || './dist/bundled.js';
    const cached = this.cache.get(CACHE_KEY);
    if (cached) {
      await cached(createContextProxy(ctx));
    } else {
      if (!bundled || !fs.existsSync(bundled)) {
        throw new Error('Cannot find the bundled script file.');
      }
      const script = fs.readFileSync(bundled, { encoding: 'utf-8' });      const vm = new NodeVM({
        eval: false,
        wasm: false,
        require: {
          external: {
            modules: [...allowList, ...ctx.lambda.allowedRequire],
          },
        },
      });
      vm.freeze(env, ctx.lambda.env);
      handleRequestFunc = vm.run(script);
      if (!handleRequestFunc) {
        throw new Error('Cannot access handleRequestFunc method.');
      }
      await handleRequestFunc(createContextProxy(ctx));
      await next();
    }
  }
}

module.exports = LambdaRunner;
