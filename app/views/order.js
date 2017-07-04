'use strict';

const {aggregateType, reload} = require('../store/domain/order');

const orderView = ({loadHistory}) => ({
  getOrder: async (id) =>
    reload(id, await loadHistory(aggregateType, id))
});

module.exports = orderView;