'use strict';

const {createClient, retryStrategy} = require('lightstream-node-utils/db/redis');
const eventstore = require('eventstore');

const repositoryFactory = require('../../infra/repository/redis');
const eventBusFactory = require('../../infra/eventbus/redis');
const enableEventBusLogger = require('../../infra/eventbus/eventbusLogger');
const purchaseDao = require('../../infra/dao/inMemory/purchaseDao');

function connectToRedis(config) {
  return new Promise((fulfill, reject) => {
    const redisClient = createClient(config);
    redisClient.on('ready', () => {
      if (config.db) {
        redisClient.select(config.db);
      }
      fulfill(redisClient);
    });
    redisClient.on('error', error => {
      console.log('Error with redis');
      console.log(error.stack);
      reject(error);
    });
  });
}

function initEventstore(eventstoreClient) {
  return new Promise((fulfill, reject) => {
    eventstoreClient.init(error => {
      error ? reject(error) : fulfill();
    });
  });
}

async function buildInfra(config) {
  const eventstoreClient = eventstore(Object.assign(config.eventstore, config.redis.db, {
    retry_strategy: retryStrategy
  }));
  eventstoreClient.defineEventMappings({
    aggregate: 'aggregateType',
    aggregateId: 'aggregateId',
    streamRevision: 'version',
    commitStamp: 'createdAt'
  });

  const repository = repositoryFactory(eventstoreClient);
  const redisDbClient = await connectToRedis(config.redis.db);
  const redisEventSubscriberClient = await connectToRedis(config.redis.db);

  const eventBus = eventBusFactory(eventstoreClient, redisDbClient, redisEventSubscriberClient);
  enableEventBusLogger(eventBus);

  // eventstore must be initialized once event bus has been created
  await initEventstore(eventstoreClient);

  const daos = {
    purchaseDao: purchaseDao()
  };

  return {
    repository,
    eventstoreClient,
    eventBus,
    redisDbClient,
    redisEventSubscriberClient,
    daos
  };
}

module.exports = {
  connectToRedis,
  initEventstore,
  buildInfra
};
