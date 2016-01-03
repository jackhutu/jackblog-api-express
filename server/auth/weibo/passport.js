var passport = require('passport');
var WeiboStrategy = require('passport-weibo').Strategy;
var tools = require('../../util/tools');

exports.setup = function (User,config) {
  passport.use(new WeiboStrategy({
      clientID: config.weibo.clientID,
      clientSecret: config.weibo.clientSecret,
      callbackURL: config.weibo.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      var userId = req.session.passport.userId || null;

      profile._json.token = accessToken;
      //如果userId不存在.而新建用户,否而更新用户.
      if (!userId) {
        User.findOne({
          'weibo.id': profile.id
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            //用户呢称需要唯一.
            var newUser = {
              nickname: profile.displayName || profile.username,
              avatar:profile._json.avatar_large || '',
              provider: 'weibo',
              weibo: profile._json,
              status:1
            }
            User.findOne({nickname:newUser.nickname},function (err, user) {
              if (err) return done(err);
              if(user){
                newUser.nickname = tools.randomString();
              }
              user = new User(newUser);
              user.save(function(err) {
                if (err) return done(err);
                done(err, user);
              });
            })

          } else {
            return done(err, user);
          }
        })
      }else {
        return done(new Error('您已经是登录状态了'));
      }



    }
  ));
};