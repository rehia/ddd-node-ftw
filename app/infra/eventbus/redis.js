'use strict';

const {Observable} = require('rx');

function redisFactory(eventstoreClient, redisClient, redisSubscribeClient, channel = 'eventbus') {
  eventstoreClient.useEventPublisher(publish);
  redisSubscribeClient.subscribe(channel);
  redisSubscribeClient.setMaxListeners(100);

  function publish(event) {
    redisClient.publish(channel, JSON.stringify(event));
  }

  function liveEvents() {
    return Observable.fromEvent(redisSubscribeClient, 'message',
      (channel, message) => JSON.parse(message));
  }

  function historicalEvents(eventName) {
    return Observable.fromNodeCallback(eventstoreClient.getEvents, eventstoreClient)(0)
      .flatMap(event => event)
      .map(event => event.payload)
      .filter(filterEvents(eventName));
  }

  function listenTo(eventName) {
    return liveEvents()
      .filter(filterEvents(eventName));
  }

  function filterEvents(eventName) {
    return event =>
      eventName === '*' ||
      (Array.isArray(eventName) ?
      eventName.indexOf(event.type) >= 0 :
      event.type === eventName);
  }

  function listenToAllLive() {
    return listenTo('*');
  }

  return {
    loadHistory: historicalEvents,
    listenTo,
    listenToAllLive,
    publish
  };
}

module.exports = redisFactory;