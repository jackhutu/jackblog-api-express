var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('../../util/logs');

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      User.findOne({
        email: email.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);
        if (!user) {
          logger.error('登录用户名错误',{'username':email});
          return done(null, false, { error_msg: '用户名或密码错误.' });
        }
        if (!user.authenticate(password)) {
          logger.error('登录密码错误',{'username':email});
          return done(null, false, { error_msg: '用户名或密码错误.' });
        }

				if(user.status === 2){
          logger.error('被阻止登录', {'username':email});
					return done(null, false, { error_msg: '用户被阻止登录.' });
				}
				if(user.status === 0){
          logger.error('未验证用户登录',{'username':email});
					return done(null, false, { error_msg: '用户未验证.' });
				}
        return done(null, user);
      });
    }
  ));
};