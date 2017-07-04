'use strict';

const {wrapCommand} = require('./actionWrapper');
const {commands:{FillProductInventory, WithdrawProductInventory}} = require('../../inventory/domain/types');

const inventoryController = (commands) => {
  const fillProductInventory =
    wrapCommand(
      async({params}) =>
        await commands.fillProductInventory(FillProductInventory(params))
    );

  const withdrawProductInventory =
    wrapCommand(
      async({params}) =>
        await commands.withdrawProductInventory(WithdrawProductInventory(params))
    );

  return {
    fillProductInventory,
    withdrawProductInventory
  };
};

module.exports = inventoryController;