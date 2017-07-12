'use strict';

const {PRODUCTS_PURCHASED} = require('../purchase/domain/eventTypes');
const {wait} = require('../utils/time');

const enableEventHandler = (eventBus, {inventory: {fillProductInventory}}) =>
  eventBus.listenTo(PRODUCTS_PURCHASED)
    .subscribe(async ({payload: {products}}) => {
      await wait(5000);
      const {id, quantity} = products[0];
      await fillProductInventory({id, quantity});
    });

module.exports = enableEventHandler;