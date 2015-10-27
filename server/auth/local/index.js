'use strict';

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var router = express.Router();
var User = mongoose.model('User');

router.post('/', function (req,res,next) {
  //测试环境不用验证码
  if(process.env.NODE_ENV !== 'test'){
    var error_msg;
    if(!req.body.captcha){
      error_msg = "验证码不能为空.";
    }else if(req.session.captcha !== req.body.captcha.toUpperCase()){
      error_msg = "验证码错误.";
    }else if(req.body.email === '' || req.body.password === ''){
      error_msg = "用户名和密码不能为空.";
    }
    if(error_msg){
      return res.status(400).send({error_msg:error_msg});
    }else{
      next();
    }
  }else{
    next();
  }

},function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err){
			return res.status(401).send();
		}
    if(info){
      return res.status(403).send(info);
    }
    var token = auth.signToken(user._id);
    return res.json({token: token});
  })(req, res, next)
});

module.exports = router;
