var app = require('../../server/app');
var request = require('supertest')(app);
var should = require("should"); 
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Article = mongoose.model('Article'),
	Comment = mongoose.model('Comment'),
	Logs = mongoose.model('Logs');

describe('test/api/comment.test.js',function () {
	//测试需要一篇文章,和这篇文章的评论.
	var token, mockUserId,mockArticleId, mockCommentId,mockReplyId;
	before(function (done) {
		User.createAsync({
			nickname:'测试' + new Date().getTime(),
			email:'test' + new Date().getTime() + '@tets.com',
			password:'test',
			role:'admin',
			status:1
		}).then(function (user) {
			mockUserId = user._id;
			return Article.createAsync({
				author_id:user._id,
				title:'第' + new Date().getTime() + '篇文章',
				content:'<p>我第n次爱你.</p>',
				status:1
			}).then(function (article) {
				mockArticleId = article._id;
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
			});
		});
	});

	after(function (done) {
		User.findByIdAndRemoveAsync(mockUserId).then(function (user) {
			return Article.findByIdAndRemoveAsync(mockArticleId).then(function () {
				Logs.removeAsync();
				done();
			});
		}).catch(function (err) {
			done(err);
		});
	});

	describe('post /api/comment/addNewComment',function () {

		it('should when not aid return error',function (done) {
			request.post('/api/comment/addNewComment')
			.set('Authorization','Bearer ' + token)
			.send({
				content:'最亲爱的评论',
			})
			.expect(422,done);

		});

		it('should when not content return error',function (done) {
			request.post('/api/comment/addNewComment')
			.set('Authorization','Bearer ' + token)
			.send({
				aid:mockArticleId,
				content:'',
			})
			.expect(422,done);

		});

		it('should create a new comment',function (done) {
			request.post('/api/comment/addNewComment')
			.set('Authorization','Bearer ' + token)
			.send({
				aid:mockArticleId,
				content:'最亲爱的评论',
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				mockCommentId = res.body.data._id;
				res.body.success.should.be.true();
				res.body.data.content.should.equal('最亲爱的评论');
				res.body.data.aid.should.equal(mockArticleId.toString());
				done();
			});

		});
	});

	describe('post /api/comment/:id/addNewReply',function () {
		it('should when not content return error',function (done) {
			request.post('/api/comment/' + mockCommentId + '/addNewReply')
			.set('Authorization','Bearer ' + token)
			.send({
				content:''
			})
			.expect(422,done);

		});

		it('should create a new reply',function (done) {
			request.post('/api/comment/' + mockCommentId + '/addNewReply')
			.set('Authorization','Bearer ' + token)
			.send({
				content:'最好的回复'
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				mockReplyId = res.body.data[0]._id;
				res.body.success.should.be.true();
				res.body.data.should.be.Array();
				done();
			});

		});
	});

	//由于travis只支持mongodb 2.4,而2.4不支持populate,所以跳过
	describe.skip('get /api/comment/:id/getFrontCommentList',function () {
		it('should return comment list',function (done) {
			request.get('/api/comment/' + mockArticleId + '/getFrontCommentList')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.data.length.should.be.above(0);
				done();
			});

		});
	});

	describe('put /api/comment/:id/delReply',function () {
		it('should return comment reply',function (done) {
			request.put('/api/comment/' + mockCommentId + '/delReply')
			.set('Authorization','Bearer ' + token)
			.send({
				//rid:mockComment.reply[0]._id
			})
			.expect(422,done)

		});

		it('should when id error return error',function (done) {
			request.put('/api/comment/dddddddddd/delReply')
			.set('Authorization','Bearer ' + token)
			.send({
				rid:mockReplyId
			})
			.expect(500,done)

		});

		it('should return comment reply',function (done) {
			request.put('/api/comment/' + mockCommentId + '/delReply')
			.set('Authorization','Bearer ' + token)
			.send({
				rid:mockReplyId
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.success.should.be.true();
				done();
			});

		});
	});

	describe('delete /api/comment/:id',function () {
		it('should when id error return error',function (done) {
			request.del('/api/comment/dddddddddd')
			.set('Authorization','Bearer ' + token)
			.expect(500,done)
		});

		it('should return success',function (done) {
			request.del('/api/comment/' + mockCommentId)
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