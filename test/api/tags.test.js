'use strict';

var app = require('../../server/app');
var request = require('supertest')(app);
var should = require("should"); 
var mongoose = require('mongoose');
var User = mongoose.model('User');
var TagCategory = mongoose.model('TagCategory');
var Tag = mongoose.model('Tag');
var Logs = mongoose.model('Logs');

describe('test/api/tags.test.js',function () {
	var token, mockUserId,mockTagCatId,mockTagId;
	before(function (done) {
		User.createAsync({
			nickname:'测试' + new Date().getTime(),
			email:'test' + new Date().getTime() + '@tets.com',
			password:'test',
			role:'admin',
			status:1
		}).then(function (user) {
			mockUserId = user._id;
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
		User.findByIdAndRemoveAsync(mockUserId).then(function () {
				Logs.removeAsync();
			done();
		});
	});

	describe('post /tags/addTagCat', function() {
		var catName = '标签分类名' + new Date().getTime();
		it('should when not name return error', function(done) {
			request.post('/tags/addTagCat')
			.set('Authorization','Bearer ' + token)
			.send({
				desc:'测试标签分类名'
			})
			.expect(422,done);
		});

		it('should return new tag category', function(done) {
			request.post('/tags/addTagCat')
			.set('Authorization','Bearer ' + token)
			.send({
				name: catName,
				desc:'测试标签分类名'
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				mockTagCatId = res.body.cat_id;
				res.body.cat_id.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});
		it('should when second add catName return error', function(done) {
			request.post('/tags/addTagCat')
			.set('Authorization','Bearer ' + token)
			.send({
				name: catName,
				desc:'测试标签分类名'
			})
			.expect(403,done);
		});
	});

	describe('post /tags/addTag', function() {
		var tagName = '标签名称' + new Date().getTime();
		it('should when not name return error', function(done) {
			request.post('/tags/addTag')
			.set('Authorization','Bearer ' + token)
			.send({
				cid:mockTagCatId,
				is_show:true
			})
			.expect(422,done);
		});

		it('should when not cid return error', function(done) {
			request.post('/tags/addTag')
			.set('Authorization','Bearer ' + token)
			.send({
				name:tagName,
				is_show:true
			})
			.expect(422,done);
		});

		it('should return new tag', function(done) {
			request.post('/tags/addTag')
			.set('Authorization','Bearer ' + token)
			.send({
				name:tagName,
				cid:mockTagCatId,
				is_show:true
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				mockTagId = res.body.tag_id;
				res.body.tag_id.should.be.String();
				res.body.success.should.be.true();
				done();
			})
		});
		it('should when second add tagName return error', function(done) {
			request.post('/tags/addTag')
			.set('Authorization','Bearer ' + token)
			.send({
				name:tagName,
				cid:mockTagCatId,
				is_show:true
			})
			.expect(403,done);
		});
	});

	describe('put /tags/:id/updateTagCat', function() {
		it('should return update tag category',function (done) {
			request.put('/tags/' + mockTagCatId + '/updateTagCat')
						.set('Authorization','Bearer ' + token)
						.send({
							_id:mockTagCatId,
							name:'新的标签分类名称' + new Date().getTime(),
							desc:'新的描述'
						})
						.expect(200)
						.expect('Content-Type', /json/)
						.end(function (err,res) {
							if(err) return done(err);
							res.body.cat_id.should.be.String();
							res.body.success.should.be.true();
							done();
						});
		})
	});

	describe('put /tags/:id/updateTag', function() {
		it('should return update tag',function (done) {
			request.put('/tags/' + mockTagId + '/updateTag')
						.set('Authorization','Bearer ' + token)
						.send({
							_id:mockTagId,
							name:'新的分类名称' + new Date().getTime()
						})
						.expect(200)
						.expect('Content-Type', /json/)
						.end(function (err,res) {
							if(err) return done(err);
							res.body.tag_id.should.be.String();
							res.body.success.should.be.true();
							done();
						});
		})
	});

	describe('get /tags/getTagCatList',function () {
		it('should return tag category list',function (done) {
			request.get('/tags/getTagCatList')
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.length.should.be.above(0);
				done();
			});

		});
	});

	describe('get /tags/:id/getTagList',function () {
		it('should return tag list in category',function (done) {
			request.get('/tags/' + mockTagCatId + '/getTagList')
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.length.should.be.above(0);
				done();
			});

		});

		it('should return all tag list',function (done) {
			request.get('/tags/0/getTagList')
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.length.should.be.above(0);
				done();
			});

		});
	});

	describe('get /tags/getFrontTagList',function () {
		it('should return tag list to frontend',function (done) {
			request.get('/tags/getFrontTagList')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.length.should.be.above(0);
				done();
			});
		});

	});

	describe('delete /tags/:id',function () {
		it('should return error',function (done) {
			request.del('/tags/' + mockTagCatId)
			.set('Authorization','Bearer ' + token)
			.expect(403,done);
		});
	});

	describe('delete /tags/:id/deleteTag',function () {
		it('should return error',function (done) {
			request.del('/tags/dddddd/deleteTag')
			.set('Authorization','Bearer ' + token)
			.expect(500,done);
		});

		it('should return success',function (done) {
			request.del('/tags/' + mockTagId + '/deleteTag')
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.success.should.be.true();
				done();
			});

		});

	});

	describe('delete /tags/:id',function () {
		it('should return error',function (done) {
			request.del('/tags/dddddd')
			.set('Authorization','Bearer ' + token)
			.expect(500,done);
		});
		it('should return success',function (done) {
			request.del('/tags/' + mockTagCatId)
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.success.should.be.true();
				done();
			});
		});
	});

});