'use strict';

const {buildInfra} = require('./infra');
const buildStoreContext = require('./contexts/store');

const buildApi = async (config) => {
  const infra = await buildInfra(config);

  return {
    infra,
    actions: {
      store: buildStoreContext(infra)
    }
  };
};

module.exports = buildApi;