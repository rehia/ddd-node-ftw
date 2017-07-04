'use strict';

const t = require('tcomb');

const PositiveInteger = t.refinement(t.Integer, (n) => n >= 0, 'positive integer');

const PositiveFloat = t.refinement(t.Number, (n) => n >= 0, 'positive floating number');

const Event = t.struct({
  type: t.String,
  payload: t.maybe(t.Any)
});

const Events = t.list(Event);

const CommandResult = t.interface({
  events: Events,
  error: Error
});

const CommandWithId = t.interface({
  id: t.String
});

module.exports = {
  PositiveInteger,
  PositiveFloat,
  Event,
  Events,
  CommandResult,
  CommandWithId
};