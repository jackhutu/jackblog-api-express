'use strict';

var path = require('path');
var bunyan = require('bunyan');
var config = require('../../config/env');

var bunyanConfig = {
	name: 'hutublog',
	serializers: {
	 req: bunyan.stdSerializers.req,
	 res: bunyan.stdSerializers.res,
	 err: bunyan.stdSerializers.err
	},
	streams: [
		{
			level: 'info',
			stream: process.stdout
		},{
			level: 'trace',
			stream: process.stdout
		},
		{
			level: 'debug',
			stream: process.stderr
		},{
			type: 'rotating-file',
			level: 'error',
			path: path.join(config.root,'logs/' + config.env + '-' +'error.log'),
			period: '1d',   // daily rotation
			count: 7        // keep 7 back copies
		}
	]
}

module.exports = bunyan.createLogger(bunyanConfig);
