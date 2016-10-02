'use strict';

var app = require('../../server/app');
var request = require('supertest')(app);
var should = require("should"); 
var mongoose = require('mongoose');
var	User = mongoose.model('User');
var	Article = mongoose.model('Article');
var	Logs = mongoose.model('Logs');
var Promise = require('bluebird');
var config = require('../../server/config/env');
config.qiniu.app_key = 'test';
config.qiniu.app_secret = 'test';
var qiniuHelper = require('../../server/util/qiniu');
var sinon = require('sinon');
var authHelper = require('../middlewares/authHelper');
var redis = require('../../server/util/redis');

describe('test/api/article.test.js',function () {
	//测试需要一篇文章
	var token, mockArticleId,mockAdminId;
	var mockTagId = '55e127401cfddd2c4be93f6b';
	var mockTagIds = ['55e127401cfddd2c4be93f6b'];
	before(function (done) {
		authHelper.createUser('admin').then(function (user) {
		  mockAdminId = user._id;
		  return user;
		}).then(function (user) {
		  authHelper.getToken(request, user.email).then(function (result) {
		    token = result;
		    done();
		  });
		}).catch(function (err) {
		  console.log(err);
		});
	});

	after(function (done) {
		User.findByIdAndRemoveAsync(mockAdminId).then(function () {
			Logs.removeAsync();
			redis.del('indexImages');
			done();
		}).catch(function (err) {
			done(err);
		});
	});

	describe('post /article/addArticle',function () {
		it('should not title return error',function (done) {
			request.post('/article/addArticle')
			.set('Authorization','Bearer ' + token)
			.send({
				content:'测试文章内容![enter image description here](http://upload.jackhu.top/test/111.png "enter image title here")',
				status:1
			})
			.expect(422,done);
		});

		it('should not content return error',function (done) {
			request.post('/article/addArticle')
			.set('Authorization','Bearer ' + token)
			.send({
				title:'测试文章标题' + new Date().getTime(),
				status:1
			})
			.expect(422,done);
		});

		// it('should throw error return 500',function (done) {
		// 	var stubArticle = sinon.stub(Article,'createAsync');
		// 	stubArticle.returns(new TypeError('error message'));

		// 	request.post('/article/addArticle')
		// 	.set('Authorization','Bearer ' + token)
		// 	.send({
		// 		title:'测试文章标题' + new Date().getTime(),
		// 		content:'测试文章内容![enter image description here](http://upload.jackhu.top/test/111.png "enter image title here")',
		// 		status:1,
		// 		tags:['55e127401c2dbb2c4be93f6b']
		// 	})
		// 	.expect(500)
		// 	.end(function (err,res) {
		// 		if(err) return done(err);
		// 		stubArticle.restore();
		// 		done();
		// 	});
		// });

		it('should create a new article',function (done) {
			request.post('/article/addArticle')
			.set('Authorization','Bearer ' + token)
			.send({
				title:'测试文章标题' + new Date().getTime(),
				content:'测试文章内容![enter image description here](http://upload.jackhu.top/test/111.png "enter image title here")',
				status:1,
				tags:mockTagIds
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				mockArticleId = res.body.article_id;
				res.body.success.should.be.true();
				res.body.article_id.should.be.String;
				done();
			});
		});
	});

	describe('put /article/:id/updateArticle',function () {
		it('should not title return error',function (done) {
			request.put('/article/' + mockArticleId + '/updateArticle')
			.set('Authorization','Bearer ' + token)
			.send({
				content:'新的文章内容![enter image description here](http://upload.jackhu.top/test/111.png "enter image title here")',
				status:1
			})
			.expect(422,done);

		});

		it('should not content return error',function (done) {
			request.put('/article/' + mockArticleId + '/updateArticle')
			.set('Authorization','Bearer ' + token)
			.send({
				title:'新的标题' + new Date().getTime(),
				status:1
			})
			.expect(422,done);

		});


		it('should return update a article',function (done) {
			request.put('/article/' + mockArticleId + '/updateArticle')
			.set('Authorization','Bearer ' + token)
			.send({
				_id:mockArticleId,
				title:'更新的标题' + new Date().getTime(),
				content:'更新的文章内容![enter image description here](http://upload.jackhu.top/test/111.png "enter image title here")',
				status:1,
				isRePub:true,
				tags:mockTagIds
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.success.should.be.true();
				res.body.article_id.should.be.String;
				done();
			});
		});
	});

	describe('get /article/getArticleList',function () {

		it('should return blog list',function (done) {
			request.get('/article/getArticleList')
			.set('Authorization','Bearer ' + token)
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.length.should.be.above(0);
				res.body.count.should.be.Number;
				res.body.count.should.be.above(0);
				done();
			});

		});

		it('should sort return blog list',function (done) {
			request.get('/article/getArticleList')
			.set('Authorization','Bearer ' + token)
			.query({
				sortOrder:'false',
				sortName:'visit_count',
				itemsPerPage:2
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.length.should.be.above(0);
				res.body.count.should.be.Number;
				res.body.count.should.be.above(0);
				done();
			});

		});
	});



	describe('upload image',function () {

		it('should not file parmas return error',function (done) {
			request.post('/article/uploadImage')
			.set('Authorization','Bearer ' + token)
			.expect(422,done)
		});

		it('should resturn success',function (done) {
			var stubQiniu = sinon.stub(qiniuHelper,'upload');
			stubQiniu.returns(Promise.resolve({
				url: "http://upload.jackhu.top/article/article/test.png"
			}));
			request.post('/article/uploadImage')
			.set('Authorization','Bearer ' + token)
			.attach('file', __dirname + '/upload.test.png')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.success.should.be.true();
				res.body.img_url.should.be.equal("http://upload.jackhu.top/article/article/test.png");
				stubQiniu.calledOnce.should.be.true();
				stubQiniu.restore();
				done();
			})
		});

	});

	describe('fetch image',function () {

		it('should resturn success',function (done) {
			var stubQiniu = sinon.stub(qiniuHelper,'fetch');
			stubQiniu.returns(Promise.resolve({
				url: "http://upload.jackhu.top/article/article/test.png"
			}));
			request.post('/article/fetchImage')
			.set('Authorization','Bearer ' + token)
			.send({
				url:'http://www.test.com/test.png'
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.success.should.be.true();
				res.body.img_url.should.be.equal("http://upload.jackhu.top/article/article/test.png");
				stubQiniu.calledOnce.should.be.true();
				stubQiniu.restore();
				done();
			})
		});

		it('should not url parmas return error',function (done) {
			request.post('/article/fetchImage')
			.set('Authorization','Bearer ' + token)
			.expect(422,done);
		});


	});

	describe('get /article/:id/getArticle',function () {
		it('should return a article',function (done) {
			request.get('/article/' + mockArticleId + '/getArticle')
			.set('Authorization', 'Bearer ' + token)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data._id.should.equal(mockArticleId.toString());
				done();
			})
		});
	});


	describe('get /article/getFrontArticleList',function () {

		it('should return blog list', function (done) {
		  request.get('/article/getFrontArticleList')
		  	.expect('Content-Type', /json/)
		  	.expect(200)
		    .end(function (err, res) {
		    	if(err) return done(err);
		      res.body.data.length.should.be.above(0);
		      done();
		    });
		});
		it('should when has tagId return list',function (done) {
			request.get('/article/getFrontArticleList')
				.query({
		      itemsPerPage: 1,
		      sortName:'visit_count',
		      tagId: mockTagId
				})
				.expect(200)
				.expect('Content-Type', /json/)
			  .end(function (err, res) {
			  	if(err) return done(err);
			  	//travis在这里始终是空数组,因为它只能支持mongodb 2.4
			    res.body.data.should.be.Array();
			    done();
			  });
		});

	});

	describe('get /article/getFrontArticleCount',function () {
		it('should return blog list count',function (done) {
			request.get('/article/getFrontArticleCount')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.success.should.be.true();
				res.body.count.should.be.Number();
				done();
			});
		});

		it('should when has tagId return count',function (done) {
			request.get('/article/getFrontArticleCount')
				.query({
		      itemsPerPage: 1,
		      sortName:'visit_count',
		      tagId:mockTagId
				})
				.expect('Content-Type', /json/)
				.expect(200)
			  .end(function (err, res) {
			  	if(err) return done(err);
			    res.body.success.should.be.true();
			    //travis
			    res.body.count.should.be.Number();
			    done();
			  });
		});
		
	});

	describe('get /article/:id/getFrontArticle',function () {
		it('should return article',function (done) {
			request.get('/article/' + mockArticleId + '/getFrontArticle')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data._id.should.equal(mockArticleId.toString());
				done();
			});
		});
	});

	describe('get /article/getIndexImage',function () {
		var stubQiniu;
		beforeEach(function () {
			stubQiniu = sinon.stub(qiniuHelper,'list');
		});
		afterEach(function () {
			qiniuHelper.list.restore();
		});

		it('should return index image',function (done) {
			stubQiniu.returns(Promise.resolve({items:[1, 2, 3, 4, 5].map(i=>({key:i}))}));
			request.get('/article/getIndexImage')
			.expect(200)
			.end(function (err,res) {
				if (err) return done(err);
				res.body.success.should.be.true();
				res.body.img.should.startWith('https://upload.jackhu.top');
				stubQiniu.calledOnce.should.be.true();
				done();
			});
		});
		
		it('should return redis image',function (done) {
			request.get('/article/getIndexImage')
			.expect(200)
			.end(function (err,res) {
				if (err) return done(err);
				res.body.success.should.be.true();
				res.body.img.should.be.String;
				done();
			});
		});

	});

	describe('get /article/:id/getPrenext', function() {
		var nextArticleId;
		before(function (done) {
			Article.createAsync({
				title:'测试文章标题' + new Date().getTime(),
				content:'测试文章内容![enter image description here](http://upload.jackhu.top/test/111.png "enter image title here")',
				status:1,
				tags:mockTagIds
			}).then(function (article) {
				nextArticleId = article._id;
				done();
			});
		});

		after(function (done) {
			Article.findByIdAndRemoveAsync(nextArticleId).then(function () {
				done();
			});
		});

		it('should return next and prev blog',function (done) {
			request.get('/article/' + mockArticleId + '/getPrenext')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err,res) {
				if (err) return done(err);
				res.body.data.next.should.be.Object;
				res.body.data.prev.should.be.Object;
				done();
			})
		});

		it('should when has tagId return nextpre blog',function (done) {
			request.get('/article/' + mockArticleId + '/getPrenext')
			.query({
				sortName:'visit_count',
				tagId:mockTagId
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err,res) {
				if (err) return done(err);
				res.body.data.next.should.be.Object;
				res.body.data.prev.should.be.Object;
				done();
			})
		});

	});

	describe('put /article/:id/toggleLike', function() {
		it('should add like return success',function (done) {
			request.put('/article/' + mockArticleId + '/toggleLike')
			.set('Authorization', 'Bearer ' + token)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err,res) {
				if (err) return done(err);
				res.body.success.should.be.true();
				res.body.count.should.be.equal(2);
				res.body.isLike.should.be.true();
				done();
			})
		});
		it('should when second toggle like return success',function (done) {
			request.put('/article/' + mockArticleId + '/toggleLike')
			.set('Authorization', 'Bearer ' + token)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err,res) {
				if (err) return done(err);
				res.body.success.should.be.true();
				res.body.count.should.be.equal(1);
				res.body.isLike.should.be.false();
				done();
			})
		});
	});

	describe('delete /article/:id', function() {
		it('should when id error return error',function (done) {
			request.del('/article/ddddddd')
			.set('Authorization', 'Bearer ' + token)
			.expect(500,done);
		});

		it('should return success',function (done) {
			request.del('/article/' + mockArticleId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.end(function (err,res) {
				if (err) return done(err);
				res.body.success.should.be.true();
				done();
			})
		})
	});
});