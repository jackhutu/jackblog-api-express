'use strict';

var app = require('../../server/app');
var request = require('supertest')(app);
var should = require("should"); 
var mongoose = require('mongoose');
var User = mongoose.model('User');
var TagCategory = mongoose.model('TagCategory');
var Tag = mongoose.model('Tag');
var Logs = mongoose.model('Logs');

describe('test/api/user.test.js',function () {
	var token,mockUserId,mockAdminId,mockUpdateNickName,mockAdminNickname = '测试' + new Date().getTime();
		before(function (done) {
			User.createAsync({
				nickname:mockAdminNickname,
				email:'test' + new Date().getTime() + '@tets.com',
				password:'test',
				role:'admin',
				status:1
			}).then(function (user) {
				mockAdminId = user._id;
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
			User.findByIdAndRemoveAsync(mockAdminId).then(function () {
				Logs.removeAsync();
				done();
			});
		});

	describe('post /users/addUser', function() {
		it('should when not nickname return error', function(done) {
			request.post('/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				email:'test@test.com' + new Date().getTime(),
				password:'test'
			})
			.expect(422,done);
		});

		it('should when not email return error', function(done) {
			request.post('/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: "呢称" + new Date().getTime(),
				password:'test'
			})
			.expect(422,done);
		});

		it('should when nickname error return error', function(done) {
			request.post('/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: 'jakc^^&&',
				email:'test@test.com' + new Date().getTime(),
				password:'test'
			})
			.expect(422,done);
		});

		it('should when email error return error', function(done) {
			request.post('/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: "呢称" + new Date().getTime(),
				email:'test.com' + new Date().getTime(),
				password:'test'
			})
			.expect(422,done);
		});
		var nickname = '呢称' + new Date().getTime();
		it('should return new user', function(done) {
			request.post('/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: nickname,
				email:'test@test.com' + new Date().getTime(),
				password:'test'
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				mockUserId = res.body.user_id;
				res.body.user_id.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});

		it('should same nickname return error', function(done) {
			request.post('/users/addUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: nickname,
				email:'test@test.com' + new Date().getTime(),
				password:'test'
			})
			.expect(500,done);
		});

	});

	describe('put /users/:id/updateUser', function() {
		mockUpdateNickName = '呢称' + new Date().getTime();

		it('should when not nickname return error', function(done) {
			request.put('/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				email:'test@test.com' + new Date().getTime(),
				status:1
			})
			.expect(422,done);
		});
		it('should when not email return error', function(done) {
			request.put('/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockUpdateNickName,
				status:1
			})
			.expect(422,done);
		});
		it('should when nickname error return error', function(done) {
			request.put('/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:'jack^^%%',
				email:'test@test.com' + new Date().getTime(),
				status:1
			})
			.expect(422,done);
		});
		it('should when email error return error', function(done) {
			request.put('/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockUpdateNickName,
				email:'test.com',
				status:1
			})
			.expect(422,done);
		});
		it('should return update user', function(done) {
			request.put('/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockUpdateNickName,
				email:'test@test.com' + new Date().getTime(),
				status:1
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.user_id.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});
		it('should update password return success', function(done) {
			request.put('/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockUpdateNickName,
				email:'test@test.com' + new Date().getTime(),
				status:1,
				newPassword:'testpwd'
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.user_id.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});

		it('should same nickname return error', function(done) {
			request.put('/users/' + mockUserId + '/updateUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:mockAdminNickname,
				email:'test@test.com' + new Date().getTime(),
				status:1
			})
			.expect(500,done);
		});


	});

	describe('put /users/mdUser', function() {

		it('should when not nickname return error', function(done) {
			request.put('/users/mdUser')
			.set('Authorization','Bearer ' + token)
			.expect(422,done);
		});

		it('should when nickname error return error', function(done) {
			request.put('/users/mdUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:'jack^^&&'
			})
			.expect(422,done);
		});
		it('should return my user', function(done) {
			request.put('/users/mdUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname:'呢称' + new Date().getTime()
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.nickname.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});

		it('should when same nickname return error', function(done) {
			request.put('/users/mdUser')
			.set('Authorization','Bearer ' + token)
			.send({
				nickname: mockUpdateNickName
			})
			.expect(500,done);
		});

	});

	describe('get /users/getUserList',function () {
			it('should return users list',function (done) {
				request.get('/users/getUserList')
				.set('Authorization','Bearer ' + token)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err,res) {
					if(err) return done(err);
					res.body.data.length.should.be.above(0);
					res.body.count.should.be.above(0);
					done();
				})
			});
			it('should sort false return users list',function (done) {
				request.get('/users/getUserList')
				.set('Authorization','Bearer ' + token)
				.query({
					itemsPerPage:1,
					sortName:'',
					sortOrder:'false'
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err,res) {
					if(err) return done(err);
					res.body.data.length.should.be.above(0);
					res.body.count.should.be.above(0);
					done();
				})
			});
	});

	describe('get /users/getUserProvider', function() {
		it('should return User Provider', function(done) {
			request.get('/users/getUserProvider')
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.should.be.Object();
				done();
			})
		});
	});

	describe('get /users/getCaptcha', function() {
		it('should return captcha image', function(done) {
			request.get('/users/getCaptcha')
			.expect(200,done);
		});
	});

	describe('get /users/snsLogins', function() {
		it('should return status 200', function(done) {
			request.get('/users/snsLogins')
			.expect(200,done);
		});
	});

	describe('get /users/me', function() {
		it('should return me info', function(done) {
			request.get('/users/me')
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.nickname.should.be.String();
				done();
			})
		});
	});

	describe('del /users/:id', function() {
		it('should if userid === req.user._id return error', function(done) {
			request.del('/users/' + mockAdminId)
			.set('Authorization','Bearer ' + token)
			.expect(403,done);
		});

		it('should if userId error return error', function(done) {
			request.del('/users/dddddd')
			.set('Authorization','Bearer ' + token)
			.expect(500,done);
		});

		it('should return me info', function(done) {
			request.del('/users/' + mockUserId)
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.success.should.be.true();
				done();
			})
		});
	});

});