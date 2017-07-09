'use strict';

const {aggregateType, create} = require('../domain/order');

const commandBuilder = ({saveEvents}, generateId) =>
  async (command) => {
    const id = generateId();
    const result = create(Object.assign({id}, command));

    await saveEvents(
      aggregateType,
      id,
      result
    );
  };

module.exports = commandBuilder;
