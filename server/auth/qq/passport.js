var passport = require('passport');
var qqStrategy = require('passport-qq').Strategy;
var tools = require('../../util/tools');

exports.setup = function (User,config) {
  passport.use(new qqStrategy({
      clientID: config.qq.clientID,
      clientSecret: config.qq.clientSecret,
      callbackURL: config.qq.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      var userId = req.session.passport.userId || null;
      //profile._json.token = accessToken;
      //如果userId不存在.而新建用户,否而更新用户.
      if (!userId) {
        User.findOne({
          'qq.id': profile.id
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            //用户呢称需要唯一.
            var newUser = {
              nickname: profile._json.nickname || '',
              avatar:profile._json.figureurl_qq_2 || profile._json.figureurl_2 || '',
              provider: 'qq',
              qq: {
                  id: profile.id,
                  token: accessToken,
                  name: profile._json.nickname || '',
                  email: ''
              },
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