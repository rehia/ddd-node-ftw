'use strict';

const purchaseProductsEventHandler = require('../../../eventHandlers/purchaseProducts');
const fillInventoryEventHandler = require('../../../eventHandlers/fillInventory');
const supplierViews = require('../../../views/supplier');

const enableEventHandlers = ({eventBus}, commands) => {
  const views = supplierViews();
  purchaseProductsEventHandler(eventBus, commands, views);
  fillInventoryEventHandler(eventBus, commands);
};

module.exports = enableEventHandlers;
