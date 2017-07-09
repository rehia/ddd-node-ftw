'use strict';

const {handleActions} = require('redux-actions');

const DomainError = require('../../errors/DomainError');
const {ORDER_CREATED, ORDER_VALIDATED} = require('./eventTypes');
const {Order, commands:{CreateOrder}} = require('./types');

const aggregateType = 'Order';

const create = (command) => ({
  events: [{
    type: ORDER_CREATED,
    id: command.id,
    payload: CreateOrder(command)
  }]
});

const validate = (state, command) => {
  if (state.status !== 'created') {
    return {
      events: [],
      error: new DomainError(aggregateType, state.id, `order already ${state.status}`)
    }
  }
  return {
    events: [{
      type: ORDER_VALIDATED,
      id: command.id,
    }]
  };
};

const reduce = handleActions({
  [ORDER_CREATED]: (state, event) =>
    Order.update(state, {
        '$merge': event.payload,
        status: {'$set': 'created'}
      }
    ),
  [ORDER_VALIDATED]: (state, event) =>
    Order.update(state, {
        status: {'$set': 'validated'}
      }
    )
}, {});

const reload = (id, events) => events.reduce(reduce, {id});

module.exports = {
  aggregateType,
  reload,
  create,
  validate
};