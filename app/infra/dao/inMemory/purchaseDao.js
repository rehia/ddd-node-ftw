'use strict';

const purchases = {};

const initDao = () => ({
  save(purchase) {
    purchases[purchase.id] = purchase;
    return Promise.resolve();
  }
});

module.exports = initDao;