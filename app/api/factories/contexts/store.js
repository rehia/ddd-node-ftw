'use strict';

const generateId = require('../../../utils/idGenerator');

const storeController = require('../../controllers/store');
const createOrderCommand = require('../../../store/commands/createOrder');
const validateOrderCommand = require('../../../store/commands/validateOrder');

const buildStoreContext = ({repository}) => {
  const commands = {
    createOrder: createOrderCommand(repository, generateId),
    validateOrder: validateOrderCommand(repository)
  };

  return {
    controller: storeController(commands),
    commands
  };
};

module.exports = buildStoreContext;