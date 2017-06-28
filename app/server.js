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

  server.post('/order', api.actions.store.createOrder);

  server.listen(3000);
  console.log('Listening on port 3000...');
};

const prepareServer = () =>
  createServer({name: 'E-Store'})
    .use(bodyParser())
    .use(queryParser());

runServer();
