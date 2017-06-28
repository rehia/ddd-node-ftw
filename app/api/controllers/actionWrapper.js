'use strict';

const wrapCommand = (action) =>
  async(request, response, next) => {
    try {
      await action(request);
      response.send();
      next();
    } catch (error) {
      console.error('Error while creating order', error.stack);
      next(error);
    }
  };

module.exports = {
  wrapCommand
};