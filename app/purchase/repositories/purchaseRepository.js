'use strict';

const {reload} = require('../domain/purchase');

const initRepository = ({save}, {publish}) => ({
  save: async (id, {events, error}) => {
    if (error) {
      throw error;
    }

    const state = reload(id, events);

    await save(state);
    events.forEach(publish);
  }
});

module.exports = initRepository;