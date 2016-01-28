'use strict';

var app = require('../../server/app');
var request = require('supertest')(app);
var should = require("should"); 
var mongoose = require('mongoose');
var	User = mongoose.model('User');
var	Logs = mongoose.model('Logs');

describe('test/api/logs.test.js',function () {
	//测试需要一篇文章,和这篇文章的评论.
	var token, mockLogId,mockUserId;
	before(function (done) {
		User.createAsync({
			nickname:'测试' + new Date().getTime(),
			email:'test' + new Date().getTime() + '@tets.com',
			password:'test',
			role:'admin',
			status:1
		}).then(function (user) {
			mockUserId = user._id;
			return Logs.createAsync({
				content:'删除用户.',
				uid:user._id,
				type:'user'
			},{
				content:'删除文章.',
				uid:user._id,
				type:'article'
			}).then(function (log) {
				mockLogId = log._id;
				return user;
			});
		}).then(function (user) {
			request.post('/auth/local')        
			.send({
          email: user.email,
          password: 'test'
       })
			.end(function (err,res) {
				token = res.body.token;
				done();
			})
		});

	});

	after(function (done) {
		//删除测试用户和log
		User.findByIdAndRemoveAsync(mockUserId).then(function (user) {
			Logs.removeAsync();
			done();
		});
	});

	describe('get /logs/getLogsList',function () {
		it('should return logs list',function (done) {
			request.get('/logs/getLogsList')
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.length.should.be.above(0);
				res.body.count.should.be.above(0);
				done();
			});

		});
		it('should when sort desc return logs list',function (done) {
			request.get('/logs/getLogsList')
			.query({
				itemsPerPage:1,
				currentPage:2,
				sortOrder:'false',
				sortName:''
			})
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.length.should.be.above(0);
				res.body.count.should.be.above(0);
				done();
			});
		});


	});


});