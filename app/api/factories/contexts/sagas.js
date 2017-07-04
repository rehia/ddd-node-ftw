'use strict';

const sagaController = require('../../controllers/sagas');
const validateOrderSaga = require('../../../sagas/validateOrder');
const orderView = require('../../../views/order');

const buildSagas = ({repository}, commands) => ({
  controller: sagaController({
    validateOrder: validateOrderSaga(commands.store, commands.inventory, orderView(repository))
  })
});

module.exports = buildSagas;