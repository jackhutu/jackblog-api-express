"use strict";
var _ = require('lodash');
//生成随机字符串
exports.randomString = function (len) {
	　　len = len || 12;
	　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	　　var maxPos = $chars.length;
	　　var pwd = '';
	　　for (var i = 0; i < len; i++) {
	　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	　　}
	　　return pwd;
};
//从markdown中提取图片
exports.extractImage = function (content) {
	var results = [];
	var images = content.match(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g);
	if(_.isArray(images) && images.length > 0){
		for(var i = 0,j = images.length;i<j;i++){
			var url = images[i].replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/,function ($1,m1,m2,m3,m4) {
				return m4 || '';
			});
			if(url !== ''){
				results.push({url:url});
			}
		}
	}
	return results;
}
