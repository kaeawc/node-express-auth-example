console.log("Starting up web server...");

var express = require('express');

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var users = require('./models/user');

var sessions = require('./models/userSession');

var path = require('path');

var app = express();

var port = process.env.PORT || require('./config').server.port;

passport.use(new LocalStrategy(users.authenticate));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.configure(function() {

  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: '4A9#b2/)=,sbF?{.L+L7N24(Ab&s,N}u44*iv:U]br2%@p,4[Z' }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);

  // html
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
  
  // css, images and js
  app.use(express.static(path.join(__dirname, 'public')));
});

var routes = require('./routes');

app.get(  '/',          routes.landing);
app.get(  '/login',     routes.login);
app.get(  '/register',  routes.register);
app.get(  '/dashboard', routes.dashboard);
app.get(  '/logout', function(request,response) {
  request.logout();
  response.redirect('/');
});

app.post( '/login',     passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login' }));

app.post( '/register', function(request,response) {

  users.authenticate(body.email,body.password, function(error,user) {

    if (!error && user)
      setUserCookie(response, user, function(error,response) {

        if(error) deny(response);
        else redirectTo(response,routes.dashboard,"/dashboard");
      });
    else
      deny(response);

  });
});

app.listen(port);

console.log("Server listening on port " + port);
