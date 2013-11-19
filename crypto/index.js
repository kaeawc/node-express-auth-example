var crypt = require('crypto');

var secret = {
  key: process.env.SECRET_KEY || require('../config').application.secret.key,
  iv: process.env.SECRET_IV || require('../config').application.secret.iv
};

var createSalt = function(callback) {
  crypt.randomBytes(256, function(error, salt) {

    if (error) console.log("Failed make random bytes.")
    else callback(salt.toString('hex'));
  });
}

var useSalt = function(password, salt, callback) {
  crypt.pbkdf2(new Buffer(password, 'hex'),new Buffer(salt, 'hex'),1000,256,callback);
}

var encrypt = function(plainText) {
  var cipher = crypt.createCipher('aes-256-cbc',secret.key,secret.iv)
  var encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

var decrypt = function(cipherText) {
  var cipher = crypt.createDecipher('aes-256-cbc',secret.key,secret.iv);
  var plainText  = cipher.update(cipherText, 'base64', 'utf8');
  plainText += cipher.final('utf8');
  return plainText;
}

exports.createSalt   = createSalt
exports.useSalt      = useSalt
exports.encrypt      = encrypt
exports.decrypt      = decrypt