'use strict';

const {aggregateType, withdraw, reload} = require('../domain/productInventory');

const commandBuilder = ({loadHistory, saveEvents}) =>
  async (command) => {
    const history = await loadHistory(aggregateType, command.id);
    const state = reload(command.id, history);
    const result = withdraw(state, command);

    await saveEvents(
      aggregateType,
      command.id,
      result
    );
  };

module.exports = commandBuilder;
