# tigo Lambda Dev Environment

This is a template project for tigo lambda, including a local dev server for developer to debug your project.

## How to use

We recommend to use `@tigojs/cli` to initialize the environment, you can also clone this repository and create the configuration manually.

If you're using `@tigojs/cli`, please use this commend to init:

```bash
tigo init lambda
```

After the project initialized, you can simply use `npm run dev` to start the dev server, and write your own codes under the `src` directory.

## Mock

For the lastest version, we've added support for official CFS(`@tigojs/cfs`) and official OSS(`@tigojs/oss`).

The local dev server will use mock data from `{projectRoot}/mock`, the CFS mock data should under `mock/cfs`, same for OSS.

### CFS Mock

For CFS mock data, all the data should be the supported configuration file type.

For example, if you have a configuration named `test.json`, you should put it under the `mock/cfs` folder.

Then in your code, you can get its content like this:

```js
await CFS.get('test.json');
// or
await CFS.get('test', 'json');
```

You can also use online data directly, dev server will fetch the configuration from the server.

If you do this, be sure you have a good network connection between your device and server.

### OSS Mock



## License

MIT
