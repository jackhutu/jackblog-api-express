"use strict";

var should = require("should");
var mongoose = require("mongoose");
var User = mongoose.model('User');
var Promise = require('bluebird');

exports.createUser = function (role,nickname,status) {
	return User.createAsync({
		nickname: nickname || '测试' + new Date().getTime(),
		email:'test' + new Date().getTime() + '@tets.com',
		password:'test',
		role: role || 'admin',
		status: status || 1
	});
}

exports.getToken = function (agent, email) {
	return new Promise(function (resolve, reject) {
		agent
		.post('/auth/local')
		.set("Content-Type", "application/json")
		.send({ email: email, password:'test' })
		.redirects(0)
		.expect(200)
		.end(function(err, res) {
		  if (err) { reject(err); }
		  should.exist(res.body);
		  should.exist(res.body.token);
		  resolve(res.body.token);
		});
	});
}