'use strict';

var should = require("should");
var qiniuHelper = require('../../server/util/qiniu');
var sinon = require('sinon');
var Promise = require('bluebird');
require('should-promised');

describe('test/util/qiniu.js',function () {
	var mockKey = 'PwzqKey';
	var mockUrl = 'http://www.test.com/test.png';
	var mockBucket = qiniuHelper.bucket;
	var mockPath = './test.png';

	describe('fetch',function () {
		var stubFetch;
		beforeEach(function () {
			stubFetch = sinon.stub(qiniuHelper,'fetchFile');
			stubFetch.withArgs(mockUrl,mockBucket,mockKey).returns(Promise.resolve([
					{key:'/blog/article/test.png'},{status:200}
				]));
			//stubFetch.withArgs('errUrl',mockBucket,'errKey').returns(Promise.reject());
		});

		afterEach(function () {
			stubFetch.restore();
		});

		it('should return success result',function () {
			qiniuHelper.fetch(mockUrl,mockKey).should.be.fulfilled().then(function (result) {
				result.key.should.be.equal('/blog/article/test.png');
				stubFetch.calledOnce.should.be.true();
			});
	
		});
	});


	describe('upload',function () {
		var uploadStub;
		beforeEach(function () {
			uploadStub = sinon.stub(qiniuHelper,'uploadFile');
			uploadStub.returns(Promise.resolve([
					{key:'/blog/article/test.png'},{status:200}
				]));
		});

		afterEach(function () {
			uploadStub.restore();
		});

		it('should return success result',function () {
			qiniuHelper.upload(mockPath,mockKey).should.be.fulfilled().then(function (result) {
				result.key.should.be.equal('/blog/article/test.png');
				uploadStub.calledOnce.should.be.true();
			});
	
		});
	});

	describe('move',function () {
		var moveStub;
		beforeEach(function () {
			moveStub = sinon.stub(qiniuHelper,'moveFile');
			moveStub.returns(Promise.resolve([
					{key:'/blog/article/test.png'},{status:200}
				]));
		});

		afterEach(function () {
			moveStub.restore();
		});

		it('should return success result',function () {
			qiniuHelper.move('keySrc','keyDest').should.be.fulfilled().then(function (result) {
				result.key.should.be.equal('/blog/article/test.png');
				moveStub.calledOnce.should.be.true();
			});
	
		});
	});

	describe('copy',function () {
		var copyStub;
		beforeEach(function () {
			copyStub = sinon.stub(qiniuHelper,'copyFile');
			copyStub.returns(Promise.resolve([
					{key:'/blog/article/test.png'},{status:200}
				]));
		});

		afterEach(function () {
			copyStub.restore();
		});

		it('should return success result',function () {
			qiniuHelper.copy('keySrc','keyDest').should.be.fulfilled().then(function (result) {
				result.key.should.be.equal('/blog/article/test.png');
				copyStub.calledOnce.should.be.true();
			});
	
		});
	});
	describe('remove',function () {
		var removeStub;
		beforeEach(function () {
			removeStub = sinon.stub(qiniuHelper,'removeFile');
			removeStub.returns(Promise.resolve([
					{key:'/blog/article/test.png'},{status:200}
				]));
		});

		afterEach(function () {
			removeStub.restore();
		});

		it('should return success result',function () {
			qiniuHelper.remove('key').should.be.fulfilled().then(function (result) {
				result.key.should.be.equal('/blog/article/test.png');
				removeStub.calledOnce.should.be.true();
			});
	
		});
	});

	describe('list',function () {
		var listStub;
		beforeEach(function () {
			listStub = sinon.stub(qiniuHelper,'allList');
			listStub.returns(Promise.resolve([
					{items:[{key:'/blog/article/test.png'}]},{status:200}
				]));
		});

		afterEach(function () {
			listStub.restore();
		});

		it('should return success result',function () {
			qiniuHelper.list('prefix', 'marker', 'limit').should.be.fulfilled().then(function (result) {
				result.items.length.should.be.equal(1);
				listStub.calledOnce.should.be.true();
			});
	
		});
	});

});