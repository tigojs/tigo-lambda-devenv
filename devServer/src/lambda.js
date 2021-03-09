const NodeVM = require('vm2');
const LRUCache = require('lru-cache');
const createContextProxy = require('./utils/context');

const CACHE_KEY = 'tigo_lambda_dev';

class LambdaRunner {
  constructor(app) {
    this.cache = new LRUCache({
      max: 100,
    });
    app.watcher.on('event', ({ result }) => {
      if (result) {
        result.close();
      }
    });
  }
  async middlware(ctx, next) {
    const cached = this.cache.get(CACHE_KEY);
    if (cached) {
      await cached(createContextProxy(ctx));
    } else {
      const vm = new NodeVM({
        eval: false,
        wasm: false,
        require: {
          external: {
            modules: [...allowList, ...ctx.lambda.allowedRequire],
          },
        },
      });
      vm.freeze(env, ctx.lambda.env);
      handleRequestFunc = vm.run();
      await handleRequestFunc(createContextProxy(ctx));
      await next();
    }
  }
}

module.exports = LambdaRunner;
