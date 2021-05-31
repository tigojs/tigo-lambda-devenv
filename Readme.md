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

You can set CFS mock data easily in the developement environment.

Firstly, you should enable the function in the `.tigodev` configuration.

The you can put all the mock files into `mock/cfs` folder.

For example, if you have a configuration named `test.json`, you should put it under the `mock/cfs` folder.

Be sure the files under `mock/cfs` are supported type (`json`, `yaml`, `xml`).

Then in your code, you can get its content like this:

```js
await CFS.get('test.json');
// or
await CFS.get('test', 'json');
```

You can also use online data directly, dev server will fetch the configuration from the server.

If you do this, be sure you have a good network connection between your device and server.

### OSS Mock

If you want to mock OSS, you should enable this function in the `.tigodev` configuration.

Mock files should be placed in `mock/oss`, name of first layer folders will be the names of buckets.

Under the first layer folders, you should create folders to simulate the common prefix of the keys.

For example, you want to mock a file in the `test` bucket, its key is `/abcd/test.txt`, then actually, its path is `mock/oss/abcd/test.txt` in file system.

### Lambda KV

The development environment can simulate the Lambda KV, you can use it as the same as the online environment.

Data will be saved to `kv` folder, you can use `levelviewer` or other LevelDB viewer to manage it.

### Lambda Log

You can enable lambda log in `.tigodev` configuration.

If it is enabled, you can use `Log` API in your lambda as the same as the online environment.

At local, all the logs will be saved to `logs` folder.

## License

MIT
