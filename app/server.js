'use strict';

const {createServer, plugins:{bodyParser, queryParser}} = require('restify');
const buildApi = require('./api/factories/api');
const config = require('../config');

// make the server exit on unhandled promises rejections
process.on('unhandledRejection', function(reason) {
  throw reason;
});

const runServer = async () => {
  const server = prepareServer();
  const api = await buildApi(config);

  server.get('/status', (request, response, next) => {
    response.send({status: 'ok'});
    return next();
  });

  server.post('/order', api.actions.store.controller.createOrder);
  server.put('/order/:id/validate', api.actions.sagas.controller.validateOrder);
  // server.put('/order/:id/validate', api.actions.store.controller.validateOrder);

  server.put('/inventory/:id/fill', api.actions.inventory.controller.fillProductInventory);
  server.put('/inventory/:id/withdraw', api.actions.inventory.controller.withdrawProductInventory);

  server.listen(3000);
  console.log('Listening on port 3000...');
};

const prepareServer = () =>
  createServer({name: 'E-Store'})
    .use(bodyParser())
    .use(queryParser());

runServer();
