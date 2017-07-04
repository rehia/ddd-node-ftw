'use strict';

const {buildInfra} = require('./infra');
const buildStoreContext = require('./contexts/store');

const buildApi = async (config) => {
  const infra = await buildInfra(config);

  const store = buildStoreContext(infra);

  return {
    infra,
    actions: {
      store,
    }
  };
};

module.exports = buildApi;