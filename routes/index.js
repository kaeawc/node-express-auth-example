

exports.landing = function(request,response) {
  response.render('landing.html')
}

exports.login = function(request,response) {
  response.render('login.html')
}

exports.register = function(request,response) {
  response.render('register.html')
}

exports.dashboard = function(request,response) {
  response.render('dashboard.html')
}

exports.error = require('./error')