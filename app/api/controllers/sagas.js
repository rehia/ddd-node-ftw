'use strict';

const {wrapCommand} = require('./actionWrapper');
const {commands:{ValidateOrder}} = require('../../store/domain/types');

const sagaController = (sagas) => ({
  validateOrder:
    wrapCommand(
      async({params}) =>
        await sagas.validateOrder(ValidateOrder(params))
    )
});

module.exports = sagaController;