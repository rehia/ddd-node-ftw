'use strict';

const {PRODUCT_INVENTORY_DEPLETED} = require('../inventory/domain/eventTypes');

const enableEventHandler = (eventBus, {purchase: {purchaseProducts}}, {supplierByProduct, productFromSupplier}) =>
  eventBus.listenTo(PRODUCT_INVENTORY_DEPLETED)
    .subscribe(async ({aggregateId}) => {
      const supplier = await supplierByProduct(aggregateId);
      const product = await productFromSupplier(supplier, aggregateId);
      await purchaseProducts({
        supplier,
        products: [product]
      });
    });

module.exports = enableEventHandler;