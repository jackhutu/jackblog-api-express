'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Logs = mongoose.model('Logs');
var ccap = require('ccap')();
var config = require('../../config/env')
/**
 * 获取验证码
 */
exports.getCaptcha = function(req, res) {
	var ary = ccap.get();
	var txt = ary[0];
	var buf = ary[1];
	req.session.captcha = txt;
	return res.status(200).send(buf);
};

exports.getMe = function (req,res) {
	var userId = req.user._id;
	User.findByIdAsync(userId).then(function (user) {
		return res.status(200).json(user.userInfo);
	}).catch(function (err) {
		return res.status(401).send();
	});
}
//后台获取用户列表
exports.getUserList = function (req,res,next) {
	var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
	var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
	var startRow = (currentPage - 1) * itemsPerPage;

	var sortName = String(req.query.sortName) || "created";
	var sortOrder = req.query.sortOrder;
	if(sortOrder === 'false'){
		sortName = "-" + sortName;
	}


	User.countAsync().then(function (count) {
		return User.find({})
			.skip(startRow)
			.limit(itemsPerPage)
			.sort(sortName)
			.exec().then(function (userList) {
				return res.status(200).json({ data: userList, count:count });
			})
	}).catch(function (err) {
		return next(err);
	})

}

//添加用户
exports.addUser = function (req,res) {
	var nickname = req.body.nickname?req.body.nickname.replace(/(^\s+)|(\s+$)/g, ""):'';
	var email = req.body.email?req.body.email.replace(/(^\s+)|(\s+$)/g, ""):'';
	var NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/;
  var EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	var error_msg;
	if(nickname === ''){
		error_msg = "呢称不能为空";
	}else if(email === ''){
		error_msg = "邮箱地址不能为空";
	}else if(nickname.length <= 2 || nickname.length >15 || !NICKNAME_REGEXP.test(nickname)){
		//不符合呢称规定.
		error_msg = "呢称不合法";
	}else if(email.length <=4 || email.length > 30 || !EMAIL_REGEXP.test(email)){
		error_msg = "邮箱地址不合法";
	}
	if(error_msg){
		return res.status(422).send({error_msg:error_msg});
	}

  var newUser = new User(req.body);
  newUser.role = 'user';
  newUser.saveAsync().spread(function(user,number) {
		Logs.create({
			uid:req.user._id,
			content:"创建新用户 "+ (user.email || user.nickname),
			type:"user"
		});
		return res.status(200).json({success:true,user_id:user._id});
	}).catch(function (err) {
		if(err.errors.nickname){
			err = {error_msg:err.errors.nickname.message}
		}
		return res.status(500).send(err);
	});
}

//删除用户
exports.destroy = function (req,res,next) {
	var userId = req.user._id;

	if(String(userId) === String(req.params.id)){
		return res.status(403).send({message:"不能删除自己已经登录的账号"});
	}else{
		User.findByIdAndRemoveAsync(req.params.id).then(function(user) {
			Logs.create({
				uid:userId,
				content:"删除用户"+ (user.email || user.nickname),
				type:"user"
			});
			return res.status(200).send({success:true});
		}).catch(function (err) {
			return next(err);
		});
	}
}

//更新用户
exports.updateUser = function (req,res) {
	//被编辑人
	var editUserId = req.params.id;
	var nickname = req.body.nickname?req.body.nickname.replace(/(^\s+)|(\s+$)/g, ""):'';
	var email = req.body.email?req.body.email.replace(/(^\s+)|(\s+$)/g, ""):'';
	var NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/;
  var EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	var error_msg;
	if(nickname === ''){
		error_msg = "呢称不能为空";
	}else if(email === ''){
		error_msg = "邮箱地址不能为空";
	}else if(nickname.length <= 2 || nickname.length >15 || !NICKNAME_REGEXP.test(nickname)){
		//不符合呢称规定.
		error_msg = "呢称不合法";
	}else if(email.length <=4 || email.length > 30 || !EMAIL_REGEXP.test(email)){
		error_msg = "邮箱地址不合法";
	}
	if(error_msg){
		return res.status(422).send({error_msg:error_msg});
	}

  User.findByIdAsync(editUserId).then(function (user) {
  		user.nickname = req.body.nickname;
  		user.email = req.body.email.toLowerCase();
  		if(req.body.status){
  			user.status = req.body.status;
  		}
  		if(req.body.newPassword){
  			user.password = req.body.newPassword;
  		}
  		return user.saveAsync().spread(function (user,number) {
  				Logs.create({
  					email:req.user._id,
  					content:"编辑用户"+ (user.email || user.nickname),
  					type:"user"
  				});
  				return res.status(200).json({success:true,user_id:user._id});
  		});

  }).catch(function (err) {
		if(err.errors.nickname){
			err = {error_msg:err.errors.nickname.message}
		}
		return res.status(500).send(err);
	});

}

//前台用户更新自己信息
exports.mdUser = function (req,res,next) {
	var nickname = req.body.nickname?req.body.nickname.replace(/(^\s+)|(\s+$)/g, ""):'';
	var NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/;
  //var EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	//检测一下
	var error_msg;
	if(nickname === ''){
		error_msg = '呢称不能为空';
	}else if(nickname.length <= 2 || nickname.length >15 || !NICKNAME_REGEXP.test(nickname)){
		//不符合呢称规定.
		error_msg = '呢称不合法';
	}
	if(error_msg){
		return res.status(422).send({error_msg:error_msg});
	}

	var user = req.user;
	user.nickname = nickname;
	user.saveAsync().spread(function (result,number) {
		return res.status(200).json({success:true,data:result.userInfo});
	}).catch(function (err) {
		if(err.errors.nickname){
			err = {error_msg:err.errors.nickname.message}
		}
		return res.status(500).send(err);
	});

}
//前台获取用户社交账号绑定情况.
exports.getUserProvider = function (req,res,next) {
	User.findByIdAsync(req.user._id).then(function (user) {
		return res.status(200).json({data:user.providerInfo});
	}).catch(function (err) {
		return next(err);
	})
}
//获取第三方登录列表.
exports.getSnsLogins = function (req,res,next) {
	if(config.snsLogins){
		return res.status(200).json({success:true,data:config.snsLogins});
	}else{
		return res.status(404).send();
	}
}