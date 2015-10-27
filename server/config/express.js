/**
 * Express configuration
 */

'use strict';

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./env');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

module.exports = function(app) {
  var env = app.get('env');

  app.use(cors());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(session({
    secret: config.secrets.session,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 60000 }
  }));
  app.use(passport.initialize());
  if ('development' === env) {
    app.use(errorHandler());
  }
};
