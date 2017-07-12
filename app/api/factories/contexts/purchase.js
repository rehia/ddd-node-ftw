'use strict';

const generateId = require('../../../utils/idGenerator');

const purchaseProductsCommand = require('../../../purchase/commands/purchaseProducts');
const purchaseRepository = require('../../../purchase/repositories/purchaseRepository');

const buildPurchaseContext = ({daos:{purchaseDao}, eventBus}) => ({
  commands: {
    purchaseProducts: purchaseProductsCommand(purchaseRepository(purchaseDao, eventBus), generateId)
  }
});

module.exports = buildPurchaseContext;