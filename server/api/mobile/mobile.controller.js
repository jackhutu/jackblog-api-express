'use strict';
var config = require('../../config/env');

exports.getApps = function(req,res,next){
	if(config.apps){
		return res.status(200).json({success:true,data:config.apps})
	}else{
		return res.status(404).send()
	}
};
