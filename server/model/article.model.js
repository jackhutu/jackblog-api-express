/** 
 * 文章表
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	author_id:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	title:{
		type:String,
		unique: true
	},
	content:String,
	//存储文章所用到的图片
	images:{
		type:Array
	},
	//一篇文章可以有多个标签
	tags:[{
	  type: Schema.Types.ObjectId,
	  ref: 'Tag'
	}],
	visit_count:{			//访问数
		type:Number,
		default:1
	},
	comment_count:{		//评论数
		type:Number,
		default:0
	},
	like_count:{
		type:Number,
		default:1
	},
	top:{
		type:Boolean,
		default:false
	},
	status:{				//0:草稿 1:发布
		type:Number,
		default:0
	},
	created: {
		type: Date,
		default: Date.now
	},
	publish_time: {
		type: Date,
		default: Date.now
	},
  updated: {
    type: Date,
    default: Date.now
  }
});

ArticleSchema
  .virtual('info')
  .get(function() {
    return {
    	'_id': this._id,
      'title': this.title,
      'content': this.content,
      'images': this.images,
      'visit_count': this.visit_count,
      'comment_count':this.comment_count,
      'like_count':this.like_count,
      'publish_time': this.publish_time
    };
  });

var Article = mongoose.model('Article',ArticleSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Article);
Promise.promisifyAll(Article.prototype);

module.exports = Article;