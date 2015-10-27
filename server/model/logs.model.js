'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var LogsSchema = new Schema({
	uid: {
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	content: {
    type:String,
    trim: true
  },
	type: String,
	created: {
		type: Date,
		default: Date.now
	}
});

var Logs = mongoose.model('Logs',LogsSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Logs);
Promise.promisifyAll(Logs.prototype);

module.exports = Logs;