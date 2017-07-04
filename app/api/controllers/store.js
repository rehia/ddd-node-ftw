'use strict';

const {wrapCommand} = require('./actionWrapper');
const {commands:{CreateOrder, ValidateOrder}} = require('../../store/domain/types');

const storeController = (commands) => {
  const createOrder =
    wrapCommand(
      async({params}) =>
        await commands.createOrder(CreateOrder(params))
    );

  const validateOrder =
    wrapCommand(
      async({params}) =>
        await commands.validateOrder(ValidateOrder(params))
    );

  return {
    createOrder,
    validateOrder
  };
};

module.exports = storeController;