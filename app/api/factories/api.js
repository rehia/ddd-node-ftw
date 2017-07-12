'use strict';

const {buildInfra} = require('./infra');
const buildStoreContext = require('./contexts/store');
const buildInventoryContext = require('./contexts/inventory');
const buildPurchaseContext = require('./contexts/purchase');
const buildSagas = require('./contexts/sagas');
const enableEventHandlers = require('./contexts/eventHandlers');

const buildApi = async (config) => {
  const infra = await buildInfra(config);

  const store = buildStoreContext(infra);
  const inventory = buildInventoryContext(infra);
  const purchase = buildPurchaseContext(infra);
  const commands = {
    store: store.commands,
    inventory: inventory.commands,
    purchase: purchase.commands
  };
  const sagas = buildSagas(infra, commands);
  enableEventHandlers(infra, commands);

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