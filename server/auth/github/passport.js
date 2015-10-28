var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var tools = require('../../util/tools');

exports.setup = function (User,config) {
  passport.use(new GithubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callback,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      var userId = req.session.passport.userId || null;

      profile._json.token = accessToken;
      //如果userId不存在.而新建用户,否而更新用户.
      if (!userId) {
        User.findOne({
          'github.id': profile.id
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            //用户呢称需要唯一.
            var newUser = {
              nickname: profile.displayName || profile.username,
              avatar:profile._json.avatar_url || '',
              provider: 'github',
              github: profile._json,
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
        //用户已经登录
        return done(new Error('您已经是登录状态了'));
        // var user = req.user;
        // //判断用户是否已经使用了这个provier则提示错误
        // if(!user.github.id){
        //   if(!user.avatar){
        //     user.avatar = profile._json.avatar_url || '';
        //   }
        //   user.github = profile._json;
        //   user.save(function(err) {
        //     if (err) return done(err);
        //     done(err, user);
        //   });
        // }else{
        //   return done(new Error('User is already connected using this provider'), user);
        // }

      }



    }
  ));
};