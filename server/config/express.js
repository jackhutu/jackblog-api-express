'use strict';

var compression = require('compression');
var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var config = require('./env');

module.exports = function(app) {
  app.enable('trust proxy');
  var options = {
    origin: true,
    credentials: true
  };
  app.use(cors(options));
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(session({
    secret: config.session.secrets,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      host:config.redis.host,
      port:config.redis.port,
      pass:config.redis.password || ''
    }),
    cookie: config.session.cookie
  }));
  app.use(passport.initialize());
};
