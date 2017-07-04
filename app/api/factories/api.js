'use strict';

const {buildInfra} = require('./infra');
const buildStoreContext = require('./contexts/store');
const buildInventoryContext = require('./contexts/inventory');

const buildApi = async (config) => {
  const infra = await buildInfra(config);

  const store = buildStoreContext(infra);
  const inventory = buildInventoryContext(infra);

  return {
    infra,
    actions: {
      store,
      inventory,
    }
  };
};

module.exports = buildApi;