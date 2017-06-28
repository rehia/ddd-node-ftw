'use strict';

const {wrapCommand} = require('./actionWrapper');
const {commands:{CreateOrder}} = require('../../store/domain/types');

const storeController = (commands) => {
  const createOrder =
    wrapCommand(
      async({params}) =>
        await commands.createOrder(CreateOrder(params))
    );

  return {
    createOrder
  };
};

module.exports = storeController;