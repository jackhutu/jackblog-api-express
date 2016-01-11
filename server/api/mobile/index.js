'use strict';

var express = require('express');
var controller = require('./mobile.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/getApps',controller.getApps);

module.exports = router;