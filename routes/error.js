
exports.unauthorized = function(request,response) {
  response.render('error/unauthorized.html');
}

exports.internal = function(request,response) {
  response.render('error/internal.html');
}

exports.notfound = function(request,response) {
  response.render('error/notfound.html');
}
