'use strict';

var app = require('../../server/app');
var request = require('supertest')(app);
var should = require("should"); 

describe('test/api/mobile.test.js',function () {
	describe('get /mobile/getApps',function () {
		it('should return success and status 200',function (done) {
			request.get('/mobile/getApps')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err,res) {
				if(err) return done(err);
				res.body.success.should.be.true();
				done();
			});
		});
	})
})