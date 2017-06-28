'use strict';

const DomainError = require('./DomainError');
const {RestError} = require('restify');

class OptimisticConcurrencyError extends DomainError {
  constructor(aggregateType, aggregateId, expectedVersion, actualVersion, message = `the aggregate version (${actualVersion}) is more recent than the one you expected (${expectedVersion})`) {
    super(aggregateType, aggregateId, message);

    RestError.call(this, {
      restCode: 'OptimisticConcurrencyError',
      statusCode: 422,
      message: this.message,
      constructorOpt: OptimisticConcurrencyError
    });

    this.actualVersion = actualVersion;
    this.expectedVersion = expectedVersion;
    this.name = 'OptimisticConcurrencyError';
  }
}

module.exports = OptimisticConcurrencyError;