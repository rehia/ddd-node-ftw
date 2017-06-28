'use strict';

const t = require('tcomb');

const PositiveInteger = t.refinement(t.Integer, (n) => n >= 0, 'positive integer');

const PositiveFloat = t.refinement(t.Number, (n) => n >= 0, 'positive floating number');

const Event = t.struct({
  type: t.String,
  payload: t.maybe(t.Any)
});

const Events = t.list(Event);

const CommandResult = t.struct({
  events: Events,
  error: Error
});

module.exports = {
  PositiveInteger,
  PositiveFloat,
  Event,
  Events,
  CommandResult
};