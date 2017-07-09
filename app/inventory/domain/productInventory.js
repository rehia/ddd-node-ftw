'use strict';

const {handleActions} = require('redux-actions');
const {pick} = require('lodash');

const DomainError = require('../../errors/DomainError');
const {
  PRODUCT_INVENTORY_FILLED,
  PRODUCT_INVENTORY_WITHDRAWN,
  PRODUCT_INVENTORY_DEPLETED
} = require('./eventTypes');
const {ProductInventory, commands:{FillProductInventory, WithdrawProductInventory}} = require('./types');

const aggregateType = 'ProductInventory';

const fill = (state, command) => ({
  events: [{
    type: PRODUCT_INVENTORY_FILLED,
    id: command.id,
    payload: pick(FillProductInventory(command), 'quantity')
  }]
});

const withdraw = (state, command) => {
  const events = [{
    type: PRODUCT_INVENTORY_WITHDRAWN,
    id: command.id,
    payload: pick(WithdrawProductInventory(command), 'quantity')
  }];

  if (state.remainingQuantity <= command.quantity) {
    events.push({
      type: PRODUCT_INVENTORY_DEPLETED,
      id: command.id,
    });
  }
  return {events};
};

const reduce = handleActions({
  [PRODUCT_INVENTORY_FILLED]: (state, {payload:{quantity}}) =>
    ProductInventory.update(state, {
        remainingQuantity: {'$set': state.remainingQuantity + quantity}
      }
    ),
  [PRODUCT_INVENTORY_WITHDRAWN]: (state, {payload:{quantity}}) =>
    ProductInventory.update(state, {
        remainingQuantity: {'$set': state.remainingQuantity - quantity}
      }
    ),
}, {});

const reload = (id, events) => events.reduce(reduce, {product:{id}, remainingQuantity: 0});

module.exports = {
  aggregateType,
  reload,
  fill,
  withdraw
};