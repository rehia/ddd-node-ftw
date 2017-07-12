'use strict';

const {purchaseProducts} = require('../domain/purchase');

const commandBuilder = ({save}, generateId) =>
  async (command) => {
    const id = generateId();
    const result = purchaseProducts(Object.assign({id}, command));

    await save(
      id,
      result
    );
  };

module.exports = commandBuilder;
