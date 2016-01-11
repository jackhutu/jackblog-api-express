'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Logs = mongoose.model('Logs');


exports.getLogsList = function(req,res,next){

	var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
	var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
	var startRow = (currentPage - 1) * itemsPerPage;

	var sortName = String(req.query.sortName) || "created";
	var sortOrder = req.query.sortOrder;
	if(sortOrder === 'false'){
		sortName = "-" + sortName;
	}
	Logs.find({})
		.skip(startRow)
		.limit(itemsPerPage)
		.sort(sortName)
		.exec().then(function(logsList){
			Logs.countAsync().then(function (count) {
				return res.status(200).send({ data: logsList,count:count });
			});
		}).then(null,function (err) {
			return next(err);
		});

};
