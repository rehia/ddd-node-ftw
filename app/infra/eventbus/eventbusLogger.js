'use strict';

function enableLogger(eventBus) {
  const subscription =
    eventBus.listenToAllLive()
      .subscribe(event =>
        console.log(event.aggregateType ?
          `${event.aggregateType} of id ${event.aggregateId} just ${event.type} with` :
          `new event ${event.type} with`
          , event.payload || 'no data'));

  return () => subscription.dispose();
}

module.exports = enableLogger;