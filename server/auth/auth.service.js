'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/env');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = mongoose.model('User');

/** 
 * 验证token
 */
function authToken(credentialsRequired) {
  return compose()
        .use(function(req, res, next) {
          if(req.query && req.query.hasOwnProperty('access_token')) {
            req.headers.authorization = 'Bearer ' + req.query.access_token;
          }
          next();
        })
        .use(expressJwt({ 
          secret: config.session.secrets,
          credentialsRequired:credentialsRequired //是否抛出错误
         }))
}
/**
 * 验证用户是否登录
 */
function isAuthenticated() {
  return compose()
    .use(authToken(true))
    .use(function (err,req,res,next) {
      //expressJwt 错误处理中间件
      if (err.name === 'UnauthorizedError') {
        return res.status(401).send();
      }
      next();
    })
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return res.status(500).send();
        if (!user) return res.status(401).send();
        req.user = user;
        next();
      });
    });
}

/**
 * 验证用户权限
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        return res.status(403).send();
      }
    });
}

/**
 * 生成token
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.session.secrets, { expiresIn: '7d' });
}

/**
 * sns登录传递参数
 */
function snsPassport() {
  return compose()
    .use(authToken(false))
    .use(function( req, res, next) {
      req.session.passport = {
        redirectUrl: req.query.redirectUrl || '/'
      }
      if(req.user){
        req.session.passport.userId = req.user._id;
      }
      next();
    });
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.snsPassport = snsPassport;
