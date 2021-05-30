const { getAgent } = require('@tigojs/api-request');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.resolve(__dirname, '../.tigodev.json');

// read dev config
if (!fs.existsSync(CONFIG_PATH)) {
  throw new Error('Cannot find development configuration.');
}
const devConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, { encoding: 'utf-8' }));
const deployConfig = devConfig?.deploy;
if (!deployConfig) {
  throw new Error('Cannot find deploy configuration in the .tigodev.');
}

// read bundled script
const outputPath = devConfig?.rollup?.output || './dist/bundled.js';
const BUNDLED_PATH = path.resolve(__dirname, '../', outputPath);
if (!fs.existsSync(BUNDLED_PATH)) {
  throw new Error('Cannot find bundled script.');
}
const bundledScript = fs.readFileSync(BUNDLED_PATH, { encoding: 'utf-8' });

// check upload config
const shouldNotBeEmpty = ['host', 'https', 'base', 'accessKey', 'secretKey'];
shouldNotBeEmpty.forEach((key) => {
  if (!deployConfig[key]) {
    throw new Error(`Option "${key}" in upload configuration is necessary, please set it first.`);
  }
});

async function sendSaveRequest() {
  // check name
  let name = deployConfig.name;
  let isNew = false;
  if (!name) {
    isNew = true;
    const answers = await inquirer.prompt([
      {
        type: 'input',
        message: 'This seems like a new script, you should give it a name.',
        default: '',
        validate: (input) => {
          if (!input.trim()) {
            return 'Name is empty.';
          }
          return true;
        },
      },
    ]);
    name = answers.name.trim();
    if (!name) {
      throw new Error('Cannot get the name of script.');
    }
  }
  const agent = getAgent(deployConfig);
  const action = isNew ? 'add' : 'edit';
  const params = {
    action,
    name,
    content: Buffer.from(bundledScript, 'utf-8').toString('base64'),
  };
  if (action === 'edit') {
    Object.assign(params, id);
  }
  const env = devConfig?.lambda?.env;
  if (env) {
    Object.assign(params, {
      env,
    });
  }
  const policy = devCOnfig?.lambda?.policy;
  if (policy) {
    Object.assign(params, {
      policy,
    });
  }
  const res = await agent.post('/faas/save').send(params);
  if (res.status !== 200) {
    throw new Error(`Upload failed.${` ${res.body.message}`}`);
  }
  devConfig.deploy.name = name;
  // write dev config
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(devConfig, null, '  '), { encoding: 'utf-8' });
}

sendSaveRequest();
