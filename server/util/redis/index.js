'use strict'

var _ = require('lodash');
var Redis = require("ioredis");
var config = require('../../config/env');
var logger = require('../logs');

var client = new Redis(config.redis)

client.on("error", function (err) {
   logger.error('redis error', err)
})

exports = module.exports = client