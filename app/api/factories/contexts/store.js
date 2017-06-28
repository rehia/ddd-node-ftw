'use strict';

const generateId = require('../../../utils/idGenerator');

const storeController = require('../../controllers/store');
const createOrderCommand = require('../../../store/commands/createOrder');

const buildStoreContext = ({repository}) =>
  storeController({
    createOrder: createOrderCommand(repository, generateId)
  });

module.exports = buildStoreContext;