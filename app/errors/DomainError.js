'use strict';

class DomainError extends Error {
  constructor(aggregateType, aggregateId, message = 'error with domain aggregate') {
    super();
    this.name = 'DomainError';
    this.aggregateType = aggregateType;
    this.aggregateId = aggregateId;
    this.message = `[${aggregateType}-${aggregateId}] ${message}`;
  }
}

module.exports = DomainError;
