'use strict';

const {aggregateType, create} = require('../domain/order');

const commandBuilder = ({saveEvents}, generateId) =>
  async (command) => {
    const result = create(command);

    await saveEvents(
      aggregateType,
      generateId(),
      result
    );
  };

module.exports = commandBuilder;
