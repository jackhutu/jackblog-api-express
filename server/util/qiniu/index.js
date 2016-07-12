'use strict';

var _ = require('lodash');
var config = require('../../config/env');
var mongoose = require('mongoose');
var Promise = require("bluebird");
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = config.qiniu.app_key;
qiniu.conf.SECRET_KEY = config.qiniu.app_secret;
var client = new qiniu.rs.Client();

//对一般操作进行promise封装
var uploadFile = Promise.promisify(qiniu.io.putFile);
var moveFile = Promise.promisify(client.move, client);
var copyFile = Promise.promisify(client.copy, client);
var removeFile = Promise.promisify(client.remove, client);
var statFile = Promise.promisify(client.stat, client);
var fetchFile = Promise.promisify(client.fetch, client);
var allList = Promise.promisify(qiniu.rsf.listPrefix);

exports.uploadFile = uploadFile;
exports.moveFile = moveFile;
exports.copyFile = copyFile;
exports.removeFile = removeFile;
exports.statFile = statFile;
exports.fetchFile = fetchFile;
exports.allList = allList;

//获取上传凭证
function getUptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  return putPolicy.token();
}
//不同空间可以相互操作,在这里只在一个空间下操作
var bucket = config.qiniu.bucket;
exports.bucket = bucket;
//将网络图片上传到七牛服务器
exports.fetch = function (url,key) {
	return this.fetchFile(url,bucket,key).then(function (result) {
		result.url = config.qiniu.domain + result.key;
		return result;
	});
}

//上传文件
exports.upload = function (path,key) {
	var extra = new qiniu.io.PutExtra();
	var uptoken = getUptoken(config.qiniu.bucket);
	return this.uploadFile(uptoken, key, path, extra).then(function(result){
		result.url = config.qiniu.domain + result.key;
    return result;
  });
}

//将源空间的指定资源移动到目标空间，或在同一空间内对资源重命名。
exports.move = function(keySrc,keyDest){
	var bucketSrc,bucketDest;
	bucketSrc = bucketDest = bucket;
  return this.moveFile(bucketSrc, keySrc, bucketDest, keyDest).then(function (result) {
  	return result;
  });
};
//复制文件
exports.copy = function(keySrc,keyDest){
	var bucketSrc,bucketDest;
	bucketSrc = bucketDest = bucket;
  return this.copyFile(bucketSrc, keySrc, bucketDest, keyDest).then(function (result) {
  	return result;
  });
};

exports.remove = function(key){
	return this.removeFile(bucket,key).then(function (result) {
		return result;
	})
};
/*
列出所有资源,
prefix 想要查询的资源前缀缺省值为空字符串,limit 限制条数缺省值为1000	
marker 上一次列举返回的位置标记，作为本次列举的起点信息。缺省值为空字符串
delimiter 指定目录分隔符，列出所有公共前缀（模拟列出目录效果）。默认值为空字符串。
 */
exports.list = function(prefix, marker, limit, delimiter){
  var delimiter = delimiter || '';
  return this.allList(bucket, prefix, marker, limit, delimiter).then(function(result){
    return result;
  })
};