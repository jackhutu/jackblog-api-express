'use strict';

var path = require('path');
var bunyan = require('bunyan');


var logger = bunyan.createLogger({
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
			//path: 'logs/info.log',
			//path: path.join(__dirname,'../../logs/' + process.env.NODE_ENV + '-' +'info.log')
		},{
			level: 'trace',
			stream: process.stdout
		},
		{
			level: 'debug',
			stream: process.stderr
		},{
			level: 'error',
			path: 'logs/bunyan-' + process.env.NODE_ENV + '-' +'error.log'
			//path: path.join(__dirname,'../../logs/' + process.env.NODE_ENV + '-' +'error.log')
		},{
			level:'fatal',
			path: 'logs/bunyan-' + process.env.NODE_ENV + '-' +'fatal.log'
			//path: path.join(__dirname,'../../logs/' + process.env.NODE_ENV + '-' +'fatal.log')
		},{
			level: 'warn',
			path: 'logs/bunyan-' + process.env.NODE_ENV + '-' +'warn.log',
			//path: path.join(__dirname,'../../logs/' + process.env.NODE_ENV + '-' +'warn.log')
		}
	]
});

module.exports = logger;
