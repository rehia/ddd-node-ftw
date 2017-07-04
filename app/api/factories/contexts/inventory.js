'use strict';

const inventoryController = require('../../controllers/inventory');
const fillProductInventoryCommand = require('../../../inventory/commands/fillProductInventory');
const withdrawProductInventoryCommand = require('../../../inventory/commands/withdrawProductInventory');

const buildStoreContext = ({repository}) => {
  const commands = {
    fillProductInventory: fillProductInventoryCommand(repository),
    withdrawProductInventory: withdrawProductInventoryCommand(repository)
  };

  return {
    controller: inventoryController(commands),
    commands
  };
};

module.exports = buildStoreContext;