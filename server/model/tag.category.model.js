/**
 * 标签分类表,管理标签
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagCategorySchema = new Schema({
	name:{
		type:String,
		unique: true
	},	//分类名称
	desc:String		//分类描述
});

var TagCategory = mongoose.model('TagCategory',TagCategorySchema);

var Promise = require('bluebird');
Promise.promisifyAll(TagCategory);
Promise.promisifyAll(TagCategory.prototype);

module.exports = TagCategory;