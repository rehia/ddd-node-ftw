'use strict';

const {pick} = require('lodash');

const AggregateNotFoundError = require('../../errors/AggregateNotFoundError');
const OptimisticConcurrencyError = require('../../errors/OptimisticConcurrencyError');
const InvalidArgumentError = require('../../errors/InvalidArgumentError');

const {Events} = require('../../utils/types');

function repositoryFactory(client) {
  const actualVersion = (events) => events[events.length - 1].streamRevision;

  const saveEvents = async (stream, events) => {
    checkEvents(events);
    return await commitEventsToStream(stream, events);
  };

  const checkEvents = (events) => Events(events);

  const commitEventsToStream = (stream, events) =>
    new Promise((fulfill, reject) => {
      stream.addEvents(events.map(
        event => pick(event, 'payload', 'type')));

      stream.commit((error, stream) =>
        error ? reject(error) : fulfill(stream.lastRevision));
    });

  const loadEvents = (stream, expectedVersion, softly) =>
    new Promise((fulfill, reject) => {
      if (!stream.events.length) {
        return softly ?
          fulfill([]) :
          reject(new AggregateNotFoundError(stream.aggregate, stream.aggregateId));
      }
      if (expectedVersion && actualVersion(stream.events) > expectedVersion) {
        return reject(new OptimisticConcurrencyError(type, id, expectedVersion, actualVersion(stream.events)));
      }
      fulfill(mapEvents(stream.events));
    });

  const mapEvents = (events) => events.map(event => event.payload);

  const getStream = (type, id) =>
    new Promise((fulfill, reject) =>
      client.getEventStream({
        aggregate: type,
        aggregateId: id
      }, (error, stream) =>
        error ? reject(error) : fulfill(stream))
    );

  const snapshot = (type, id, state, version) =>
    new Promise((fulfill, reject) =>
      client.createSnapshot({
        aggregate: type,
        aggregateId: id,
        data: state,
        revision: version
      }, (error) =>
        error ? reject(error) : fulfill())
    );

  const loadFromSnapshot = (type, id) =>
    new Promise((fulfill, reject) =>
      client.getFromSnapshot({
          aggregate: type,
          aggregateId: id
        }, (error, snapshot, stream) =>
          error ?
            reject(error) :
            fulfill({
              state: snapshot ? Object.assign(snapshot.data, {version: snapshot.revision}) : null,
              events: mapEvents(stream.events)
            }))
    );

  const getStreamFromSnapshot = (type, id) =>
    new Promise((fulfill, reject) =>
      client.getFromSnapshot({
        aggregate: type,
        aggregateId: id
      }, (error, snapshot, stream) =>
        error ? reject(error) : fulfill(stream))
    );

  return {
    saveEvents: async (type, id, result) => {
      if (result.error) {
        throw result.error;
      }
      if (!result.events.length) {
        return;
      }

      const stream = await getStreamFromSnapshot(type, id);
      return await saveEvents(stream, result.events);
    },
    loadHistory: async (type, id, expectedVersion) => {
      const stream = await getStream(type, id);
      return await loadEvents(stream, expectedVersion, false);
    },
    loadHistorySoftly: async (type, id, expectedVersion) => {
      const stream = await getStream(type, id);
      return await loadEvents(stream, expectedVersion, true);
    },
    snapshot,
    loadFromSnapshot
  };
}

module.exports = repositoryFactory;