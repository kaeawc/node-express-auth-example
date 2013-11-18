var assert = require('assert');
var http = require('http');

describe('routes', function() {

  it('should answer with \'hello world\'', function(done) {
    http.get(
      'http://localhost:8080',
      function(response) {
        assert.equal(response.statusCode, 200);
        done();
      });
  });

  it('should return unauthorized when requesting secure content without credentials', function(done) {
    http.get(
      'http://localhost:8080/dashboard',
      function(response) {
        assert.equal(response.statusCode, 401);
        done();
      });
  });

  it('should render the login page on request', function(done) {
    http.get(
      'http://localhost:8080/login',
      function(response) {
        assert.equal(response.statusCode, 200);
        done();
      });
  });

  it('should render the register page on request', function(done) {
    http.get(
      'http://localhost:8080/register',
      function(response) {
        assert.equal(response.statusCode, 200);
        done();
      });
  });

});
