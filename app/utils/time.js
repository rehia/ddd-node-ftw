'use strict';

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

module.exports = {
  wait
};
