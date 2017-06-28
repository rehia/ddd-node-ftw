'use strict';

const DomainError = require('./DomainError');
const {RestError} = require('restify');

class AggregateNotFoundError extends DomainError {
  constructor(aggregateType, aggregateId, message = 'the aggregate has not been found') {
    super(aggregateType, aggregateId, message);

    RestError.call(this, {
      restCode: 'AggregateNotFoundError',
      statusCode: 404,
      message: this.message,
      constructorOpt: AggregateNotFoundError
    });

    this.name = 'AggregateNotFoundError';
  }
}

module.exports = AggregateNotFoundError;
