'use strict';

var express = require('express');
var controller = require('./logs.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/getLogsList',auth.hasRole('admin'),controller.getLogsList);

module.exports = router;