/**
 * 评论表
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	aid:{
		type: Schema.Types.ObjectId,
		ref: 'Article'
	},
	user_id:{
		type: Schema.Types.ObjectId,
		ref:'User'
	},
	content:String,
	//针对评论的回复
	replys:[{
		content:String, //回复内容
		user_info:Object,
		created:Date
	}],
	status:{		//0,删除,1,正常
		type:Number,
		default:1
	},		
	created: {
		type: Date,
		default: Date.now
	},
  updated: {
    type: Date,
    default: Date.now
  }
});

var Comment = mongoose.model('Comment',CommentSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Comment);
Promise.promisifyAll(Comment.prototype);

module.exports = Comment;