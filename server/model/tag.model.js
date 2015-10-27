/**
 * 标签表
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	name:{						//标签名称
		type:String,
		unique: true
	},	
	cid:{
		type:Schema.Types.ObjectId,
		ref:'TagCategory'
	},
	is_index:{
		type:Boolean,
		default:false
	},
	is_show: {
		type:Boolean,
		default:false
	},
	sort:{
		type:Number,
		default:1
	}
});

var Tag = mongoose.model('Tag',TagSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Tag);
Promise.promisifyAll(Tag.prototype);

module.exports = Tag;