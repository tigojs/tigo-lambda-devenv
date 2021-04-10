const mockData = Symbol('mockData');
const wrapper = require('../utils/classWrapper');

class OSS {
  constructor(config, mockData) {
    if (!config.enable) {
      throw new Error('CFS is not enabled in the configuration.');
    }
    this[mockData] = mockData;
  }
  async getObject() {
    
  }
  async putObject() {

  }
}

module.exports = wrapper(OSS);
