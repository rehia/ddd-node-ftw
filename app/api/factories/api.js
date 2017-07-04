'use strict';

const {buildInfra} = require('./infra');
const buildStoreContext = require('./contexts/store');
const buildInventoryContext = require('./contexts/inventory');
const buildSagas = require('./contexts/sagas');

const buildApi = async (config) => {
  const infra = await buildInfra(config);

  const store = buildStoreContext(infra);
  const inventory = buildInventoryContext(infra);
  const sagas = buildSagas(infra, {
    store: store.commands,
    inventory: inventory.commands
  });

  return {
    infra,
    actions: {
      store,
      inventory,
      sagas
    }
  };
};

module.exports = buildApi;