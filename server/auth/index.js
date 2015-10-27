'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/env');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = require('./auth.service');

// Passport Configuration
require('./local/passport').setup(User, config);
require('./github/passport').setup(User, config);
require('./weibo/passport').setup(User, config);
require('./qq/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/github',require('./github'));
router.use('/weibo',require('./weibo'));
router.use('/qq',require('./qq'));

module.exports = router;