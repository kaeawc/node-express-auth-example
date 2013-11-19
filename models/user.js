var crypto = require('../crypto');

var port = process.env.REDIS_PORT || require('../config').redis.port;
var host = process.env.REDIS_HOST || require('../config').redis.host;
var redis = require('redis').createClient(port, host);

redis.on("error", function (msg) {
  console.log("Redis Error: " + msg);
});

var password = process.env.REDIS_PASSWORD || false;

if(password)
  redis.auth(password, function() {
    console.log("Connected, ready to query.");
  });

var del = function(email, callback) {
  var hash = "user:" + email;

  redis.del(hash, function(error, data) {
    if(error)
      callback(error,false);
    else
      callback(false,data);
  });
}

var getByEmail = function(email, callback) {

  var hash = "user:" + email

  redis.get(hash, function(error, data) {

    if(error)
      callback(error,false);
    else {
      if(data)
        callback(false,JSON.parse(data));
      else {
        callback("No such user found.",false);
      }
    }
  });
}

var create = function(email, password, callback) {

  var hash = "user:" + email

  crypto.createSalt(function(salt) {

    crypto.useSalt(password,salt,function(error, hashedPassword) {

      var user = {
        'email'    : email,
        'salt'     : salt,
        'password' : hashedPassword.toString('hex')
      };

      redis.set(hash, JSON.stringify(user), function(error, data) {
        if (error)
          callback(error, false);
        else
          getByEmail(email, callback);
      });

    });
  });
}

var authenticate = function(username, password, done) {

  getByEmail(email, function(error,user) {

    if (error) return done(error);

    if (user && user.password && user.salt) {
      crypto.useSalt(password,user.salt, function(error, hashedPassword) {

        if (error) return done(error);

        if (user.password == hashedPassword.toString('hex'))
          done(null,user);
        else
          done(null, false, { message: "The given password is not correct." } );
      });
    } else
      done(null, false, { message: "The user object was not properly formed." } );

  });
}

exports.getByEmail   = getByEmail
exports.create       = create
exports.authenticate = authenticate