/** 
 * 用户表
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


var UserSchema = new Schema({
	// username:{
	// 	type:String,
	// },
	nickname:String,
	email: {
		type: String,
		lowercase: true
	},
	provider: {
		type:String,
		default:'local'
	},
	facebook         : {
	    id           : String,
	    token        : String,
	    email        : String,
	    name         : String
	},
	twitter          : {
	    id           : String,
	    token        : String,
	    displayName  : String,
	    username     : String
	},
	google           : {
	    id           : String,
	    token        : String,
	    email        : String,
	    name         : String
	},
	github           : {
	    id           : String,
	    token        : String,
	    email        : String,
	    name         : String
	},
	weibo:{
		id           : String,
		token        : String,
		email        : String,
		name         : String
	},
	qq:{
		id           : String,
		token        : String,
		email        : String,
		name         : String
	},
	likeList:[{
		type:Schema.Types.ObjectId,
		ref:'Article'
	}],
	hashedPassword: String,
	salt: String,
	role: {
		type : String ,
		default : 'user'
	},
	avatar:String,
  status:{
  	type:Number,
  	default:0
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

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });


UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      'nickname': this.nickname,
      'role': this.role,
      'email': this.email,
      'avatar': this.avatar,
      'likes':this.likeList,
      'provider':this.provider
    };
  });

UserSchema
  .virtual('providerInfo')
  .get(function() {
    return {
      'qq': this.qq,
      'github': this.github,
      'weibo': this.weibo,
      'facebook': this.facebook,
      'google':this.google,
      'twitter':this.twitter
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

UserSchema
	.path('nickname')
	.validate(function(value, respond) {
		var self = this;
		this.constructor.findOne({nickname: value}, function(err, user) {
			if(err) throw err;
			if(user) {
				if(self.id === user.id) return respond(true);
				return respond(false);
			}
			respond(true);
		});
	}, '这个呢称已经被使用.');
/**
 * methods
 */
UserSchema.methods = {
	//检查用户权限
	hasRole: function(role) {
		var selfRoles = this.role;
		return (selfRoles.indexOf('admin') !== -1 || selfRoles.indexOf(role) !== -1);
	},
	//验证用户密码
	authenticate: function(plainText) {
	  return this.encryptPassword(plainText) === this.hashedPassword;
	},
	//生成盐
	makeSalt: function() {
	  return crypto.randomBytes(16).toString('base64');
	},
	//生成密码
	encryptPassword: function(password) {
	  if (!password || !this.salt) return '';
	  var salt = new Buffer(this.salt, 'base64');
	  return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	}
}

UserSchema.set('toObject', { virtuals: true });

var User = mongoose.model('User', UserSchema);
var Promise = require('bluebird');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;
