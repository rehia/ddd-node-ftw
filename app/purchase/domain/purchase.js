'use strict';

const {handleActions} = require('redux-actions');

const DomainError = require('../../errors/DomainError');
const {PRODUCTS_PURCHASED} = require('./eventTypes');
const {Purchase, commands:{PurchaseProducts}} = require('./types');

const aggregateType = 'Purchase';

const purchaseProducts = (command) => ({
  events: [{
    type: PRODUCTS_PURCHASED,
    id: command.id,
    payload: PurchaseProducts(command)
  }]
});

const reduce = handleActions({
  [PRODUCTS_PURCHASED]: (state, event) =>
    Purchase.update(state, {
        '$merge': event.payload
      }
    )
}, {});

const reload = (id, events) => events.reduce(reduce, {id});

module.exports = {
  aggregateType,
  reload,
  purchaseProducts
};