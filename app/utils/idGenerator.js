'use strict';

const {v4} = require('node-uuid');

const generateId = () => v4().substr(0, 8);

module.exports = generateId;