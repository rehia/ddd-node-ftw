'use strict';

const {aggregateType, fill, reload} = require('../domain/productInventory');

const commandBuilder = ({loadHistorySoftly: loadHistory, saveEvents}) =>
  async (command) => {
    const history = await loadHistory(aggregateType, command.id);
    const state = reload(command.id, history);
    const result = fill(state, command);

    await saveEvents(
      aggregateType,
      command.id,
      result
    );
  };

module.exports = commandBuilder;
