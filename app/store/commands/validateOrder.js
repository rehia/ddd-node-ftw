'use strict';

const {aggregateType, validate, reload} = require('../domain/order');

const commandBuilder = ({loadHistory, saveEvents}) =>
  async (command) => {
    const history = await loadHistory(aggregateType, command.id);
    const state = reload(command.id, history);
    const result = validate(state, command);

    await saveEvents(
      aggregateType,
      command.id,
      result
    );
  };

module.exports = commandBuilder;
