'use strict';

const {ORDER_CREATED} = require('./eventTypes');
const {commands:{CreateOrder}} = require('./types');

const aggregateType = 'Order';

const create = (command) => ({
  events: [{
    type: ORDER_CREATED,
    payload: CreateOrder(command)
  }]
});

module.exports = {
  aggregateType,
  create
};